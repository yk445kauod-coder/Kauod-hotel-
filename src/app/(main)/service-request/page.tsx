"use client";

import { useEffect, useState, useRef, FormEvent } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/context/user-context';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onChildAdded, serverTimestamp, push, off, get, child } from "firebase/database";
import { Star, Send, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { submitServiceRequestAction } from '@/lib/actions';
import { ScrollArea } from '@/components/ui/scroll-area';

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

type Message = {
    id: string;
    role: 'user' | 'admin' | 'system';
    text: string;
    timestamp: number;
    rating?: number;
    type?: 'Food Order' | 'Service Request';
    total?: number;
};

export default function ServiceRequestPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { user } = useUser();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  useEffect(() => {
    if (!user.roomNumber) {
        return;
    }
    
    setIsInitialLoad(true);
    const roomRef = ref(db, `rooms/room_${user.roomNumber}`);
    const commentsRef = child(roomRef, 'comments');
    const repliesRef = child(roomRef, 'replies');

    let initialMessages: Message[] = [];

    // 1. Fetch initial data
    get(roomRef).then(snapshot => {
      if (snapshot.exists()) {
        const roomData = snapshot.val();
        const comments = roomData.comments || {};
        const replies = roomData.replies || {};

        const allComments = Object.entries(comments).map(([id, msg]: [string, any]) => ({ id, role: 'user' as const, ...msg }));
        const allReplies = Object.entries(replies).map(([id, msg]: [string, any]) => ({ id, role: 'admin' as const, ...msg }));

        initialMessages = [...allComments, ...allReplies].sort((a, b) => a.timestamp - b.timestamp);
        setMessages(initialMessages);
      }
      setIsInitialLoad(false);
    });

    // 2. Set up listeners for new messages
    const handleNewMessage = (snapshot: any, role: 'user' | 'admin') => {
        const data = snapshot.val();
        setMessages(prev => {
            if (prev.some(m => m.id === snapshot.key)) return prev;
            return [...prev, { id: snapshot.key!, role, ...data }].sort((a, b) => a.timestamp - b.timestamp);
        });
    };

    const commentsListener = onChildAdded(commentsRef, (snapshot) => handleNewMessage(snapshot, 'user'));
    const repliesListener = onChildAdded(repliesRef, (snapshot) => handleNewMessage(snapshot, 'admin'));

    // 3. Cleanup listeners on unmount
    return () => {
      off(commentsRef, 'child_added', commentsListener);
      off(repliesRef, 'child_added', repliesListener);
    };

  }, [user.roomNumber]);
  
   useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user.roomNumber) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('roomNumber', user.roomNumber);
    formData.append('guestName', user.name || 'Guest');
    formData.append('guestPhone', user.phone || 'N/A');
    formData.append('guestMessage', input);
    if(rating > 0) formData.append('rating', rating.toString());
    formData.append('type', 'Service Request');


    const result = await submitServiceRequestAction(formData);
    
    if (result.success) {
        setInput('');
        setRating(0);
    } else {
        toast({ title: t('services.error_title'), description: result.error, variant: 'destructive'});
    }
    setIsLoading(false);
  };
  
  const formatTimestamp = (ts: number) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  }

  return (
    <div className="font-body bg-cream" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto p-0 md:p-4 h-[calc(100vh-100px)] flex flex-col">
           <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg border border-gray-200">
               <header className="p-4 border-b">
                  <h2 className="text-xl font-bold text-primary">{t('services.title_chat')} - {t('admin.table.room')} {user.roomNumber}</h2>
               </header>
               
               <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                 {isInitialLoad ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                        {messages.map((message) => (
                             <div key={message.id} className={`flex items-end gap-3 ${ message.role === 'user' ? 'justify-end' : '' }`}>
                                {message.role === 'admin' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={`max-w-md rounded-lg p-3 text-sm ${ message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted' }`}>
                                     <p style={{ whiteSpace: "pre-wrap" }}>{message.text}</p>
                                     {message.rating && (
                                         <div className="flex items-center mt-2">
                                            {[...Array(5)].map((_, i) => (
                                                 <Star key={i} className={`w-4 h-4 ${i < message.rating! ? 'text-gold fill-gold' : 'text-gray-300' }`} />
                                            ))}
                                        </div>
                                     )}
                                     <p className="text-xs text-right mt-1 opacity-70">{formatTimestamp(message.timestamp)}</p>
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><UserIcon /></AvatarFallback>
                                    </Avatar>
                                )}
                             </div>
                        ))}
                    </div>
                 )}
               </ScrollArea>
               
               <footer className="p-4 border-t bg-gray-50">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                         <div className="flex items-center">
                            <label className="text-sm font-bold text-rich-brown me-4">{t('services.form.rating')}</label>
                            <div className="flex flex-row-reverse justify-end items-center">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <label key={star} className="cursor-pointer">
                                        <input type="radio" name="star" value={star} className="hidden" onClick={() => setRating(star)} />
                                        <Star
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className={`w-6 h-6 transition-colors ${(hoverRating || rating) >= star ? 'text-gold' : 'text-gray-300'}`}
                                            fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <Input 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t('services.form.message_placeholder')}
                                className="pr-12"
                                disabled={isLoading}
                            />
                             <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading || !input.trim()}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">{t('services.form.submit')}</span>
                            </Button>
                        </div>
                    </form>
               </footer>
           </div>
        </div>
    </div>
  );
}
