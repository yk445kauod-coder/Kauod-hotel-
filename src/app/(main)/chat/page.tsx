"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useTranslation } from "@/hooks/use-translation";

export default function ChatPage() {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">{t('chat.title')}</CardTitle>
        <CardDescription>{t('chat.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChatInterface />
      </CardContent>
    </Card>
  );
}
