"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Send, Sparkles, Loader2, X } from "lucide-react";
import { chatWithAssistant } from "@/server/ai/ai.actions";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
  products?: any[];
}

export function AssistantChatDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatWithAssistant(messages, input, isAdmin);
      console.log("AI Chat Result:", result);

      if (result.error) {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: `Error: ${result.error}` }] }]);
      } else {
        setMessages((prev) => [
          ...prev, 
          { 
            role: "model", 
            parts: [{ text: result.text || "" }], 
            products: result.products 
          }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", parts: [{ text: "Sorry, I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-gradient-to-br from-background to-secondary/20">
        <DialogHeader className="p-6 bg-primary text-primary-foreground flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">AI Assistant</DialogTitle>
              <p className="text-xs text-primary-foreground/70 font-medium">Always here to help you shop or manage</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground hover:bg-white/10"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto scrollbar-hide" ref={scrollRef}>
            <div className="space-y-6">
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold">How can I help you today?</h3>
                  <p className="text-sm text-muted-foreground max-w-[300px] mx-auto">
                    I can help you find products, create new items, or manage your store's inventory.
                  </p>
                  <div className="grid grid-cols-1 gap-2 mt-6">
                    <Button variant="outline" size="sm" onClick={() => setInput("Show me the latest products")} className="justify-start h-auto py-2 px-4">
                      "Show me the latest products"
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setInput("Help me buy clothes for my mom")} className="justify-start h-auto py-2 px-4">
                      "Help me buy clothes for my mom"
                    </Button>
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "flex items-start gap-3",
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className={cn(
                    "w-8 h-8 border-2",
                    m.role === "user" ? "border-primary/20" : "border-primary/50"
                  )}>
                    {m.role === "user" ? <User className="p-1.5" /> : <Bot className="p-1.5" />}
                  </Avatar>
                  <div className={cn(
                    "max-w-[80%] flex flex-col gap-3"
                  )}>
                    <div className={cn(
                      "rounded-2xl px-4 py-3 text-sm shadow-sm",
                      m.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-card border rounded-tl-none"
                    )}>
                      {m.parts[0].text}
                    </div>

                    {m.products && m.products.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                        {m.products.map((product: any) => (
                          <Link 
                            key={product.id} 
                            href={`/products/${product.id}`}
                            className="flex-shrink-0 w-[180px] bg-card border rounded-xl overflow-hidden hover:border-primary/50 transition-colors shadow-sm group"
                          >
                            <div className="relative h-[120px] w-full bg-secondary/20">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  No Image
                                </div>
                              )}
                            </div>
                            <div className="p-3 space-y-1">
                              <h4 className="text-xs font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-sm font-bold text-primary">
                                  ${product.variants?.[0]?.price || "0.00"}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <Bot className="p-1.5" />
                  </Avatar>
                  <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-background border-t">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2 bg-secondary/30 p-1 rounded-full border focus-within:border-primary/50 transition-colors"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-4"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()}
              className="rounded-full h-9 w-9 shrink-0 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase tracking-widest font-medium opacity-50">
            Powered by Gemini AI
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
