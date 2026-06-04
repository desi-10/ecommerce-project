"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, User, Send, Sparkles, X, Mic, ShoppingBag, AlertCircle } from "lucide-react";
import { chatWithAssistant } from "@/server/ai/ai.actions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useCartStore } from "@/stores/cart.store";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  products?: any[];
  checkoutUrl?: string;
  checkoutAmount?: number;
  isError?: boolean;
}

function renderMarkdown(text: string) {
  if (!text) return "";
  
  // Replace bold syntax **text** with <strong>text</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Replace bullet points starting with * or - with list items
  const lines = html.split("\n");
  let inList = false;
  const result: React.ReactNode[] = [];
  
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!inList) {
        inList = true;
      }
      const content = trimmed.substring(2);
      result.push(
        <li key={idx} className="ml-4 list-disc list-inside">
          <span dangerouslySetInnerHTML={{ __html: content }} />
        </li>
      );
    } else {
      if (inList) {
        inList = false;
      }
      if (trimmed === "") {
        result.push(<div key={idx} className="h-2" />);
      } else {
        result.push(
          <p key={idx} className="mb-1 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: trimmed }} />
          </p>
        );
      }
    }
  });
  
  return result;
}

const QUICK_PROMPTS = [
  { label: "Latest products", value: "Show me the latest products" },
  { label: "Gift ideas", value: "Help me buy clothes for my mom" },
];

export function AssistantChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";
    rec.onstart = () => setIsListening(true);
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setInput((prev) => (prev ? prev + " " + t : t));
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported. Try Chrome or Safari.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const cartItems = useCartStore.getState().items;
      const result = await chatWithAssistant(messages, input, isAdmin, cartItems);

      if (result.error) {
        setMessages((prev) => [
          ...prev,
          { 
            role: "model", 
            parts: [{ text: result.error }],
            isError: true 
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            parts: [{ text: result.text || "" }],
            products: result.products,
            checkoutUrl: result.checkoutUrl,
            checkoutAmount: result.checkoutAmount,
          },
        ]);

        if (result.checkoutUrl) {
          useCartStore.getState().clearCart();
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { 
          role: "model", 
          parts: [{ text: "Sorry, I'm having trouble connecting right now. Please check your internet connection and try again." }],
          isError: true
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[480px] h-[640px] flex flex-col p-0 overflow-hidden border border-border/60 shadow-xl rounded-3xl bg-background">
        {/* Header */}
        <DialogHeader className="px-5 py-4 border-b border-border/40 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-background rounded-full" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold leading-none">AI Assistant</DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 scrollbar-hide" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center py-8 space-y-5"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">How can I help you?</h3>
                  <p className="text-sm text-muted-foreground max-w-[260px] leading-relaxed">
                    Find products, manage inventory, or get checkout-ready in seconds.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[280px] mt-2">
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setInput(p.value)}
                      className="text-left text-sm px-4 py-2.5 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-150"
                    >
                      {p.label} →
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-end gap-2.5",
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground border border-border/40"
                    )}
                  >
                    {m.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="max-w-[78%] flex flex-col gap-2.5">
                    {/* Bubble */}
                    <div
                      className={cn(
                        "text-sm px-4 py-2.5 leading-relaxed",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                          : m.isError
                          ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300 rounded-2xl rounded-bl-sm"
                          : "bg-secondary/60 border border-border/30 rounded-2xl rounded-bl-sm"
                      )}
                    >
                      {m.isError && (
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-red-700 dark:text-red-400 mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Assistant Error
                        </div>
                      )}
                      <div className="space-y-1">{renderMarkdown(m.parts[0].text)}</div>
                    </div>

                    {/* Checkout card */}
                    {m.checkoutUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                              Order Ready
                            </span>
                          </div>
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                            ${m.checkoutAmount?.toFixed(2) ?? "0.00"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Your cart is set. Proceed to complete your purchase securely.
                        </p>
                        <a
                          href={m.checkoutUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center w-full h-9 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                        >
                          Pay Now
                        </a>
                      </motion.div>
                    )}

                    {/* Product cards */}
                    {m.products && m.products.length > 0 && (
                      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
                        {m.products.map((product: any) => (
                          <Link
                            key={product.id}
                            href={`/shop/${product.id}`}
                            className="flex-shrink-0 w-[160px] bg-background border border-border/50 rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
                          >
                            <div className="relative h-[100px] bg-secondary/30">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                                  <ShoppingBag className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="p-2.5 space-y-0.5">
                              <h4 className="text-[11px] font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                              <span className="block text-xs font-bold text-primary pt-0.5">
                                ${product.variants?.[0]?.price ?? "0.00"}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-secondary border border-border/40 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-secondary/60 border border-border/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7, delay, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input bar */}
        <div className="px-4 pb-4 pt-3 border-t border-border/40 shrink-0 bg-background">
          <div
            className={cn(
              "flex items-center gap-1 bg-secondary/40 rounded-2xl border transition-all duration-150",
              isListening ? "border-red-400/60" : "border-border/40 focus-within:border-primary/50"
            )}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={isListening ? "Listening…" : "Ask anything…"}
              disabled={isListening}
              className="flex-1 bg-transparent text-sm px-4 py-3 outline-none placeholder:text-muted-foreground/50 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={toggleListening}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center mr-1 transition-all",
                isListening
                  ? "text-red-500 bg-red-50 dark:bg-red-950/30 animate-pulse"
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary"
              )}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim() || isListening}
              className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mr-1 hover:opacity-90 transition-all disabled:opacity-30 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-muted-foreground/40 tracking-widest uppercase font-medium">
            Powered by Gemini AI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}