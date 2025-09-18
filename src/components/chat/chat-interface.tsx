"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatbotAction } from "@/lib/actions";
import { Bot, User, Send, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface Message {
  role: "user" | "bot";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }));
    const result = await chatbotAction(history, input);

    setIsLoading(false);
    if (result.success && result.response) {
      const botMessage: Message = { role: "bot", content: result.response };
      setMessages((prev) => [...prev, botMessage]);
    } else {
      const errorMessage: Message = { role: "bot", content: result.error || "An unexpected error occurred." };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-muted/20">
      <ScrollArea className="flex-1 overflow-y-auto" viewportRef={scrollViewportRef}>
        <div className="space-y-4 p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
               {message.role === "bot" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md rounded-lg p-3 text-sm shadow-md ${
                  message.role === "user"
                    ? "rounded-br-none bg-primary text-primary-foreground"
                    : "rounded-bl-none bg-card text-card-foreground"
                }`}
              >
                <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="max-w-xs rounded-lg p-3 text-sm md:max-w-md bg-card flex items-center shadow-md">
                    <Loader2 className="h-5 w-5 animate-spin"/>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t bg-background p-4">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder={t('chat.placeholder')}
            className="pr-12"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/90"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4 text-primary-foreground" />
            <span className="sr-only">{t('chat.send')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
