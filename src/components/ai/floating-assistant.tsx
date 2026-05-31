"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles } from "lucide-react";
import { AssistantChatDialog } from "./assistant-chat-dialog";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

  // Listen for global open event
  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-ai-assistant", handleOpen);
    return () => window.removeEventListener("open-ai-assistant", handleOpen);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground border-4 border-background"
              >
                <div className="relative">
                  <Bot className="h-7 w-7" />
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AssistantChatDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
