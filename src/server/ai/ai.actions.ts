"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  createProductService,
  updateProductService,
  deleteProductService,
  getProductsService,
} from "@/server/products/products.service";
import { getCategoryService } from "@/server/categories/categories.service";
import prisma from "@/lib/db";
import { generateEmbedding } from "./embedding";
import { getPineconeIndex } from "@/lib/pinecone";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { initiateOrderService } from "@/server/payments/payments.service";
import { REFUND_POLICY, PRIVACY_POLICY, TERMS_OF_SERVICE, RETURN_POLICY } from "@/lib/policies";

/* ------------------------------------------------------- */
/* 1. Validate API Key                                    */
/* ------------------------------------------------------- */

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ------------------------------------------------------- */
/* 2. Tool Definitions                                     */
/* ------------------------------------------------------- */
/* 2. Order Total Helper                                   */
/* ------------------------------------------------------- */

async function calculateOrderTotal(items: { variantId: string; quantity: number }[], couponCode?: string) {
  const variantIds = items.map(it => it.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: true },
  });

  let subtotal = 0;
  for (const item of items) {
    const variant = variants.find(v => v.id === item.variantId);
    if (!variant) throw new Error(`Product variant not found: ${item.variantId}`);
    if (!variant.product || variant.product.status === "INACTIVE") {
      throw new Error(`Product "${variant.product?.name || "Unknown"}" is inactive and cannot be purchased.`);
    }
    const price = variant.salePrice ? Number(variant.salePrice) : Number(variant.price);
    subtotal += price * item.quantity;
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.trim().toUpperCase() }
    });
    if (coupon && coupon.status === "ACTIVE") {
      const now = new Date();
      const isStarted = !coupon.startsAt || now >= coupon.startsAt;
      const isNotEnded = !coupon.endsAt || now <= coupon.endsAt;
      const isNotExceeded = coupon.maxUses == null || coupon.usedCount < coupon.maxUses;
      const isAboveMinVal = coupon.minOrderValue == null || subtotal >= Number(coupon.minOrderValue);

      if (isStarted && isNotEnded && isNotExceeded && isAboveMinVal) {
        if (coupon.type === "PERCENT") {
          discount = (subtotal * Number(coupon.value)) / 100;
        } else {
          discount = Number(coupon.value);
        }
      }
    }
  }

  return Math.max(0, subtotal - discount);
}

/* ------------------------------------------------------- */
/* 3. Main Chat Function                                   */
/* ------------------------------------------------------- */

export async function chatWithAssistant(
  history: Array<{ role: string; parts: Array<{ text?: string }> }>,
  message: string,
  isAdmin: boolean = false,
  cartItems?: Array<{ id: string; qty: number }>
) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;

    const adminToolNames = ["createProduct", "updateProduct", "deleteProduct"];
    const tools = [
      {
        functionDeclarations: [
          {
            name: "getProducts",
            description: "Retrieve, search, and list products from the catalog. Can retrieve by specific product IDs, filter by category slug, filter by discount/sale status, or sort by newest/oldest/price.",
            parameters: {
              type: "OBJECT",
              properties: {
                ids: { type: "ARRAY", items: { type: "STRING" }, description: "Optional list of specific product IDs to retrieve" },
                category: { type: "STRING", description: "Optional category slug to filter products (e.g. 'fashion', 'groceries')" },
                onDiscount: { type: "BOOLEAN", description: "Optional filter to only get products on sale/discount" },
                sort: { type: "STRING", enum: ["newest", "oldest", "price_asc", "price_desc"], description: "Optional sort order. Use 'newest' to get the latest products." },
                limit: { type: "NUMBER", description: "Optional number of products to return (default 5, max 20)" },
              },
            },
          },
          {
            name: "vectorSearch",
            description: "Search the vector database using a natural language query and return matching product IDs",
            parameters: {
              type: "OBJECT",
              properties: { query: { type: "STRING" } },
              required: ["query"],
            },
          },
          {
            name: "listCategories",
            description: "List all product categories",
            parameters: {
              type: "OBJECT",
              properties: { q: { type: "STRING" } },
            },
          },
          {
            name: "getStorePolicy",
            description: "Retrieve MartFury store policy details (refund policy, privacy policy, terms of service, or return policy) to answer customer questions.",
            parameters: {
              type: "OBJECT",
              properties: {
                policyType: { 
                  type: "STRING", 
                  enum: ["refund", "privacy", "terms", "return"], 
                  description: "The specific policy to retrieve (refund policy, privacy policy, terms of service, or return policy)" 
                },
              },
              required: ["policyType"],
            },
          },
          {
            name: "initiateCheckout",
            description: "Initiate order checkout and payment. Returns a checkout/payment link. If shipping details (address, phone, first name, last name, country, state) are missing, ask the user to provide them before calling this tool. You can pre-fill email if they confirm their profile email.",
            parameters: {
              type: "OBJECT",
              properties: {
                email: { type: "STRING", description: "User's contact/payment email address" },
                firstName: { type: "STRING", description: "First name for shipping" },
                lastName: { type: "STRING", description: "Last name for shipping" },
                address: { type: "STRING", description: "Full street address for shipping" },
                phone: { type: "STRING", description: "Phone number" },
                country: { type: "STRING", description: "Country (e.g. Ghana, United States, Canada, etc.)" },
                state: { type: "STRING", description: "State or region (e.g. Greater Accra, California)" },
                gateway: { type: "STRING", enum: ["stripe", "paystack"], description: "The payment gateway to use (default: stripe)" },
                couponCode: { type: "STRING", description: "Optional discount or coupon code" },
                items: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      variantId: { type: "STRING", description: "The product variant ID to buy" },
                      quantity: { type: "NUMBER", description: "Quantity of the variant" },
                    },
                    required: ["variantId", "quantity"],
                  },
                  description: "List of items to buy. If not provided, checkout the active cart.",
                },
              },
              required: ["email", "firstName", "lastName", "address", "phone", "country", "state"],
            },
          },
          // Add admin tools conditionally
          ...(isAdmin ? [
            {
              name: "createProduct",
              description: "Create a new product",
              parameters: {
                type: "OBJECT",
                properties: {
                  name: { type: "STRING" },
                  description: { type: "STRING" },
                  price: { type: "NUMBER" },
                  categoryId: { type: "STRING" },
                  stock: { type: "NUMBER" },
                },
                required: ["name", "price"],
              },
            },
            {
              name: "updateProduct",
              description: "Update an existing product",
              parameters: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  name: { type: "STRING" },
                  description: { type: "STRING" },
                  price: { type: "NUMBER" },
                  status: { type: "STRING", enum: ["ACTIVE", "INACTIVE"] },
                  categoryId: { type: "STRING" },
                },
                required: ["id"],
              },
            },
            {
              name: "deleteProduct",
              description: "Delete or archive a product",
              parameters: {
                type: "OBJECT",
                properties: {
                  id: { type: "STRING" },
                  soft: { type: "BOOLEAN" },
                },
                required: ["id"],
              },
            }
          ] : [])
        ],
      },
    ];

    const model = (genAI as unknown as { getGenerativeModel: Function }).getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: tools as unknown[],
      systemInstruction: `
You are a professional AI assistant for MartFury.
${!isAdmin ? "IMPORTANT: You are interacting with a regular user. You CANNOT create, update, or delete products. Only help them find and search for products, or complete a purchase/checkout." : "You are interacting with an ADMIN. You have full privileges to create, update, and manage products."}

RULES:
1. All products exist in the database.
2. Never hallucinate products.
3. For search:
   - First call "vectorSearch"
   - Then call "getProducts"
4. To allow the user to make a purchase (either of specific products or their current cart), call the "initiateCheckout" tool.
   - If the user says "Buy this" or "Checkout my cart", or similar purchase requests:
     - Check if you have all required shipping details: email, firstName, lastName, address, phone, country, and state.
     - If any required details are missing, ask the user to provide them. Do not call "initiateCheckout" until you have gathered all these required details.
     - Once you have all the required details, call "initiateCheckout".
     - Note: User's email is: ${userEmail || "not logged in"}. User's name is: ${userName || "not logged in"}. You can use these to prefill the email and name if the user confirms them.
5. If the user asks about store policies (refunds, returns, privacy, security, terms of service, etc.), call the "getStorePolicy" tool to fetch the actual policy text, then summarize it accurately for the user. Do not make up policy rules.
6. Always use tools when structured data is needed.
7. Be conversational but concise.
8. Always provide a friendly, helpful conversational response in your final output, explaining the actions you took or the results you found (e.g. "I found these products for you:" or "Here is the checkout link:"). Never output an empty text response.
`,
    });

    const chat = model.startChat({
      history: history.map((m) => ({
        role: m.role,
        parts: m.parts,
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    let result = await chat.sendMessage(message);
    let response = result.response;

    let functionCalls = response.functionCalls();
    let products: Record<string, unknown>[] = [];
    let toolCallRound = 0;
    let checkoutUrl: string | undefined;
    let checkoutAmount: number | undefined;

    /* --------------------------------------------- */
    /* If AI calls tools                             */
    /* --------------------------------------------- */

    while (functionCalls && functionCalls.length > 0 && toolCallRound < 5) {
      toolCallRound++;
      const toolResponses = [];

      console.log(`\n--- Tool Call Round ${toolCallRound} ---`);
      console.log("AI is calling:", functionCalls.map((c: { name: string }) => c.name));

      for (const call of functionCalls) {
        const args = call.args || {};
        let output: unknown = null;

        switch (call.name) {
          case "getStorePolicy":
            const type = args.policyType;
            if (type === "refund") {
              output = { policyContent: REFUND_POLICY };
            } else if (type === "privacy") {
              output = { policyContent: PRIVACY_POLICY };
            } else if (type === "terms") {
              output = { policyContent: TERMS_OF_SERVICE };
            } else if (type === "return") {
              output = { policyContent: RETURN_POLICY };
            } else {
              output = { error: "Unknown policy type requested." };
            }
            break;

          case "getProducts":
            output = await getProductsService({
              ids: args.ids,
              category: args.category,
              onDiscount: args.onDiscount,
              sort: args.sort || "newest",
              page: 1,
              limit: args.limit || args.ids?.length || 5,
              ...(isAdmin ? {} : { status: "ACTIVE" }),
            });
            break;

          case "vectorSearch":
            const queryEmbedding = await generateEmbedding(args.query);

            if (queryEmbedding.length === 0) {
              output = { ids: [] };
              break;
            }

            const index = getPineconeIndex();
            const queryResponse = await index.query({
              vector: queryEmbedding,
              topK: 5,
              includeMetadata: false,
            });

            output = {
              ids: queryResponse.matches.map((m) => m.id) || [],
            };
            break;

          case "initiateCheckout":
            let checkoutItems = args.items;
            if (!checkoutItems || checkoutItems.length === 0) {
              if (cartItems && cartItems.length > 0) {
                checkoutItems = cartItems.map((item: { id: string; qty: number }) => ({
                  variantId: item.id,
                  quantity: item.qty,
                }));
              } else {
                output = { error: "Cart is empty. Please specify a product or variant to buy." };
                break;
              }
            }

            try {
              const amount = await calculateOrderTotal(checkoutItems, args.couponCode);
              if (amount <= 0) {
                output = { error: "Order amount must be greater than zero." };
                break;
              }

              const checkoutResult = await initiateOrderService({
                email: args.email,
                amount: amount,
                gateway: args.gateway || "stripe",
                couponCode: args.couponCode,
                items: checkoutItems,
                metadata: JSON.stringify({
                  email: args.email,
                  firstName: args.firstName,
                  lastName: args.lastName,
                  address: args.address,
                  phone: args.phone,
                  country: args.country,
                  state: args.state,
                }),
              }, userId || "");

              output = {
                success: true,
                message: "Checkout initialized successfully.",
                checkoutUrl: checkoutResult.data.authorizationUrl,
                amount: amount,
              };
              checkoutUrl = checkoutResult.data.authorizationUrl;
              checkoutAmount = amount;
            } catch (err: unknown) {
              console.error("Checkout error:", err);
              output = { error: (err as Error)?.message || "Failed to initiate checkout" };
            }
            break;

          case "createProduct":
            if (!isAdmin) {
              output = { error: "Unauthorized: Only admins can create products" };
              break;
            }
            output = await createProductService({
              name: args.name,
              description: args.description,
              status: "ACTIVE",
              categoryId: args.categoryId,
              defaultPrice: args.price,
              defaultStock: args.stock || 0,
              variants: [],
            });
            break;

          case "updateProduct":
            if (!isAdmin) {
              output = { error: "Unauthorized: Only admins can update products" };
              break;
            }
            output = await updateProductService(args.id, args);
            break;

          case "deleteProduct":
            if (!isAdmin) {
              output = { error: "Unauthorized: Only admins can delete products" };
              break;
            }
            output = await deleteProductService(args.id, {
              soft: args.soft ?? true,
            });
            break;

          case "listCategories":
            output = await getCategoryService({
              page: 1,
              limit: 50,
              q: args.q,
            });
            break;
        }

        toolResponses.push({
          functionResponse: {
            name: call.name,
            response: output,
          },
        });
      }

      /* --------------------------------------------- */
      /* Send tool results back to Gemini              */
      /* --------------------------------------------- */

      /* --------------------------------------------- */
      /* Capture products if they were fetched          */
      /* --------------------------------------------- */
      const getProductsCall = toolResponses.find(r => r.functionResponse.name === "getProducts");
      if (getProductsCall) {
        const fetchedProducts = getProductsCall.functionResponse.response?.data?.products;
        if (fetchedProducts && fetchedProducts.length > 0) {
          products = fetchedProducts;
        }
      }

      const simplifiedResponses = toolResponses.map(tr => {
        if (tr.functionResponse.name === "getProducts") {
           return {
             functionResponse: {
               name: "getProducts",
               response: {
                 data: {
                   products: tr.functionResponse.response?.data?.products?.map((p: { id: string; name: string; status: string; description: string; variants: Array<{ id: string; name: string; salePrice?: string | number; price: string | number }> }) => ({
                     id: p.id,
                     name: p.name,
                     status: p.status,
                     description: p.description ? p.description.substring(0, 100) + "..." : "",
                     variants: p.variants?.map((v) => ({
                       id: v.id,
                       name: v.name,
                       price: v.salePrice ? Number(v.salePrice) : Number(v.price),
                     })) || []
                   }))
                 }
               }
             }
           };
        }
        return tr;
      });

      console.log("Sending simplified responses back to Gemini:", JSON.stringify(simplifiedResponses).substring(0, 200) + "...");

      result = await chat.sendMessage(simplifiedResponses);
      response = result.response;
      functionCalls = response.functionCalls();
    }

    let resultText = "";
    try {
      resultText = response.text();
    } catch (e: unknown) {
      console.warn("Failed to retrieve text from Gemini response:", (e as Error).message || e);
    }

    if (!resultText || resultText.trim() === "") {
      if (products.length > 0) {
        resultText = "Here are the products I found for you:";
      } else {
        resultText = "I processed your request. Let me know if you need help finding products, checking store policies, or completing checkout!";
      }
    }
    
    console.log("AI Assistant Response:", resultText);

    return {
      text: resultText,
      products: JSON.parse(JSON.stringify(products)),
      history: await chat.getHistory(),
      checkoutUrl,
      checkoutAmount,
    };


  } catch (error: unknown) {
    console.error("AI Assistant Error:", error);

    const errorMessage = (error as Error)?.message || "";
    let friendlyError = "Sorry, I encountered an unexpected error. Please try again.";

    if (
      errorMessage.includes("429") || 
      errorMessage.toLowerCase().includes("quota exceeded") || 
      errorMessage.toLowerCase().includes("too many requests")
    ) {
      friendlyError = "The AI assistant is currently experiencing high traffic and has temporarily hit its request limit. Please wait a moment and try again.";
    }

    return {
      error: friendlyError,
    };
  }
}
