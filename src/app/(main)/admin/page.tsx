"use client";

import { useEffect, useState, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, serverTimestamp, set } from "firebase/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Star } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const firebaseConfig = {
    apiKey: "AIzaSyApgrwfyrVJYsihy9tUwPfazdNYZPqWbow",
    authDomain: "kaoud-hotel.firebaseapp.com",
    databaseURL: "https://kaoud-hotel-default-rtdb.firebaseio.com",
    projectId: "kaoud-hotel",
    storageBucket: "kaoud-hotel.appspot.com",
    messagingSenderId: "77309702077",
    appId: "1:77309702077:web:1eee14c06204def2eb6cd4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

type Comment = {
  id: string;
  text: string;
  timestamp: number;
  rating?: number;
  replies?: Record<string, {text: string; timestamp: number}>;
};

type Room = {
  roomId: string;
  comments: Comment[];
};

export default function AdminPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const roomsRef = ref(db, 'rooms');

  useEffect(() => {
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allRooms: Room[] = Object.entries(data).map(([roomId, roomData]: [string, any]) => {
            const commentsArray = roomData.comments ? Object.entries(roomData.comments).map(([id, comment]: [string, any]) => ({
                id,
                ...comment,
                replies: comment.replies || {}
            })).sort((a,b) => b.timestamp - a.timestamp) : [];

            return {
                roomId: roomId.replace('room_', ''),
                comments: commentsArray
            };
        }).sort((a,b) => parseInt(b.roomId) - parseInt(a.roomId));
        setRooms(allRooms);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleReplySubmit = async () => {
    if (!selectedRoomId || !selectedCommentId || !replyText) return;
    setIsReplying(true);

    const replyRef = ref(db, `rooms/room_${selectedRoomId}/replies`);
    try {
        await push(replyRef, {
            text: replyText,
            timestamp: serverTimestamp()
        });
        
        toast({ title: t('admin.reply_success_title'), description: t('admin.reply_success_desc') });
        setIsDialogOpen(false);
        setReplyText('');
    } catch(e) {
        toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally {
        setIsReplying(false);
    }
  };
  
  const getSelectedCommentText = () => {
      const room = rooms.find(r => r.roomId === selectedRoomId);
      if (!room) return "";
      const comment = room.comments.find(c => c.id === selectedCommentId);
      return comment?.text || "";
  }
  
  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  }

  return (
    <Card className="m-4 md:m-8">
      <CardHeader>
        <CardTitle className="font-headline text-primary">{t('admin.title')}</CardTitle>
        <CardDescription>{t('admin.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
            {rooms.length > 0 ? (
                rooms.map((room) => (
                    <AccordionItem value={room.roomId} key={room.roomId}>
                        <AccordionTrigger className="font-bold text-lg">
                           {t('admin.table.room')} {room.roomId}
                           <Badge className="ms-4">{room.comments.length}</Badge>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>{t('admin.table.request')}</TableHead>
                                    <TableHead>{t('admin.table.rating')}</TableHead>
                                    <TableHead>{t('admin.table.date')}</TableHead>
                                    <TableHead className="text-right">{t('admin.table.action')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {room.comments.map(comment => (
                                        <TableRow key={comment.id}>
                                            <TableCell className="max-w-sm whitespace-pre-wrap">{comment.text}</TableCell>
                                            <TableCell>
                                                {comment.rating && (
                                                    <div className="flex items-center">
                                                        {comment.rating} <Star className="w-4 h-4 text-gold fill-gold ms-1" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>{formatTimestamp(comment.timestamp)}</TableCell>
                                            <TableCell className="text-right">
                                                 <Dialog open={isDialogOpen && selectedCommentId === comment.id} onOpenChange={(open) => {
                                                    if (open) {
                                                        setSelectedRoomId(room.roomId);
                                                        setSelectedCommentId(comment.id);
                                                    }
                                                    setIsDialogOpen(open);
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm">
                                                            <MessageSquare className="me-2 h-4 w-4" />
                                                            {t('admin.reply_button')}
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                        <DialogTitle>{t('admin.reply_dialog_title')} {t('admin.table.room')} #{room.roomId}</DialogTitle>
                                                        <DialogDescription>
                                                            {t('admin.reply_dialog_desc')}
                                                        </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <p className="font-semibold text-sm">Guest Request:</p>
                                                            <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{getSelectedCommentText()}</p>
                                                        </div>
                                                        <Textarea
                                                        placeholder={t('admin.reply_placeholder')}
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        rows={4}
                                                        />
                                                        <DialogFooter>
                                                        <Button onClick={handleReplySubmit} disabled={isReplying}>
                                                            {isReplying && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                                                            {t('admin.send_reply')}
                                                        </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                ))
            ) : (
                <div className="h-24 text-center text-muted-foreground flex items-center justify-center">
                    {t('admin.no_requests')}
                </div>
            )}
        </Accordion>
      </CardContent>
    </Card>
  );
}
