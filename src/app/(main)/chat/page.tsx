"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useTranslation } from "@/hooks/use-translation";

export default function ChatPage() {
  const { t } = useTranslation();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">{t('chat.title')}</CardTitle>
        <CardDescription>{t('chat.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <ChatInterface />
      </CardContent>
    </Card>
  );
}
