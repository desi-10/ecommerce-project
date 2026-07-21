"use client";

import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { AssistantChatDialog } from "./assistant-chat-dialog";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingAssistant() {
  const [open, setOpen] = useState(false);

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
              initial={{ scale: 0.6, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />

              <button
                onClick={() => setOpen(true)}
                aria-label="Open AI Assistant"
                className="relative w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-sm border-[2px] border-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Bot className="w-6 h-6" />

                {/* Sparkle dot */}
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-background shadow-sm" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AssistantChatDialog open={open} onOpenChange={setOpen} />
    </>
  );
}