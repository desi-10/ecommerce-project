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



/* ------------------------------------------------------- */
/* 3. Main Chat Function                                   */
/* ------------------------------------------------------- */

export async function chatWithAssistant(history: any[], message: string, isAdmin: boolean = false) {
  try {
    const adminToolNames = ["createProduct", "updateProduct", "deleteProduct"];
    const tools = [
      {
        functionDeclarations: [
          {
            name: "getProducts",
            description: "Retrieve detailed product information by product IDs",
            parameters: {
              type: "OBJECT",
              properties: {
                ids: { type: "ARRAY", items: { type: "STRING" } },
              },
              required: ["ids"],
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

    const model = (genAI as any).getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: tools as any,
      systemInstruction: `
You are a professional AI assistant for MartFury.
${!isAdmin ? "IMPORTANT: You are interacting with a regular user. You CANNOT create, update, or delete products. Only help them find and search for products." : "You are interacting with an ADMIN. You have full privileges to create, update, and manage products."}

RULES:
1. All products exist in the database.
2. Never hallucinate products.
3. For search:
   - First call "vectorSearch"
   - Then call "getProducts"
4. Always use tools when structured data is needed.
5. Be conversational but concise.
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
    let products: any[] = [];
    let toolCallRound = 0;

    /* --------------------------------------------- */
    /* If AI calls tools                             */
    /* --------------------------------------------- */

    while (functionCalls && functionCalls.length > 0 && toolCallRound < 5) {
      toolCallRound++;
      const toolResponses = [];

      console.log(`\n--- Tool Call Round ${toolCallRound} ---`);
      console.log("AI is calling:", functionCalls.map(c => c.name));

      for (const call of functionCalls) {
        const args = call.args || {};
        let output: any = null;

        switch (call.name) {
          case "getProducts":
            output = await getProductsService({
              ids: args.ids,
              page: 1,
              limit: args.ids?.length || 5,
              sort: "newest",
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
                   products: tr.functionResponse.response?.data?.products?.map((p: any) => ({
                     name: p.name,
                     price: p.defaultPrice,
                     status: p.status,
                     description: p.description ? p.description.substring(0, 100) + "..." : ""
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

    let resultText = response.text();
    if (!resultText || resultText.trim() === "") {
      if (products.length > 0) {
        resultText = "Here are the products I found for you:";
      } else {
        resultText = "I processed your request.";
      }
    }
    
    console.log("AI Assistant Response:", resultText);

    return {
      text: resultText,
      products,
      history: await chat.getHistory(),
    };


  } catch (error: any) {
    console.error("AI Assistant Error:", error);

    return {
      error: "AI assistant failed. " + (error?.message || "Unknown error"),
    };
  }
}
