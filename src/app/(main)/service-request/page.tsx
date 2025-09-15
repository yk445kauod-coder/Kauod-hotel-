"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/hooks/use-language';
import { useTranslation } from '@/hooks/use-translation';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "firebase/database";
import Swal from 'sweetalert2';
import { Star } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

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

export default function ServiceRequestPage() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [replies, setReplies] = useState<{key: string, text: string, timestamp: number}[]>([]);
  const [room, setRoom] = useState<string | null>(null);
  
  useEffect(() => {
    async function askLanguage() {
      const { value: chosenLang } = await Swal.fire({
        title: "Choose Language / اختر اللغة",
        input: "radio",
        inputOptions: { ar: "🇪🇬 العربية", en: "🇬🇧 English" },
        inputValue: language,
        inputValidator: (value) => !value && "You need to choose!",
        confirmButtonText: "Continue",
        customClass: {
            popup: 'font-body',
            title: 'font-headline',
        }
      });
      if (chosenLang) {
        setLanguage(chosenLang as 'ar' | 'en');
      }
    }
    askLanguage();
  }, [setLanguage, language]);


  useEffect(() => {
    if (!room) return;

    const repliesRef = ref(db, `rooms/room_${room}/replies`);
    const unsubscribe = onChildAdded(repliesRef, (snapshot) => {
        const data = snapshot.val();
        setReplies(prev => [...prev, {key: snapshot.key!, ...data}]);
    });

    return () => unsubscribe();
  }, [room]);


  const onSubmit = async (data: any) => {
    const { roomNumber, guestName, guestPhone, guestMessage } = data;
    if (!roomNumber || !guestMessage) return;

    const commentsRef = ref(db, `rooms/room_${roomNumber}/comments`);
    let fullMessage = `${guestName} (${guestPhone}): ${guestMessage}`;
    if (rating > 0) {
      fullMessage += ` ⭐ تقييم: ${rating} نجوم`;
    }

    try {
        await push(commentsRef, { text: fullMessage, timestamp: serverTimestamp(), rating });
        Swal.fire({
            icon: 'success',
            title: t('services.success_title'),
            text: t('services.success_desc'),
            confirmButtonText: 'OK',
            customClass: {
                popup: 'font-body',
                title: 'font-headline text-primary',
                confirmButton: 'bg-primary'
            }
        });
        reset();
        setRating(0);
        setRoom(roomNumber); // Start listening for replies for this room
    } catch (error) {
         Swal.fire({
            icon: 'error',
            title: t('services.error_title'),
            text: t('services.error_desc'),
            confirmButtonText: 'OK'
        });
    }
  };
  
  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true
    });
  }

  return (
    <div className="font-body bg-gradient-to-b from-rich-brown to-dark-brown" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto p-4 md:p-8">
            <h2 className="text-center text-gold text-3xl md:text-4xl font-headline mb-6">{t('services.title')}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-dark-brown">
                <div className="mb-4">
                    <label htmlFor="roomNumber" className="block mb-1 font-bold text-rich-brown">{t('services.form.room_number')}</label>
                    <input type="number" id="roomNumber" {...register("roomNumber", { required: true, min: 100 })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"/>
                    {errors.roomNumber && <span className="text-red-500 text-sm">{t('services.form.room_number_placeholder')}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="guestName" className="block mb-1 font-bold text-rich-brown">{t('services.form.name')}</label>
                    <input type="text" id="guestName" {...register("guestName", { required: true })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"/>
                    {errors.guestName && <span className="text-red-500 text-sm">{t('services.form.name_placeholder')}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="guestPhone" className="block mb-1 font-bold text-rich-brown">{t('services.form.phone')}</label>
                    <input type="tel" id="guestPhone" {...register("guestPhone", { required: true })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"/>
                    {errors.guestPhone && <span className="text-red-500 text-sm">{t('services.form.phone_placeholder')}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="guestMessage" className="block mb-1 font-bold text-rich-brown">{t('services.form.message')}</label>
                    <textarea id="guestMessage" rows={4} {...register("guestMessage", { required: true })} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gold focus:border-transparent"></textarea>
                    {errors.guestMessage && <span className="text-red-500 text-sm">{t('services.form.message_placeholder')}</span>}
                </div>
                
                 <div className="mb-6">
                    <label className="block mb-2 font-bold text-rich-brown">{t('services.form.rating')}</label>
                    <div className="flex flex-row-reverse justify-end items-center">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <label key={star} className="cursor-pointer">
                                <input type="radio" name="star" value={star} className="hidden" onClick={() => setRating(star)} />
                                <Star
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className={`w-8 h-8 transition-colors ${
                                        (hoverRating || rating) >= star ? 'text-gold' : 'text-gray-300'
                                    }`}
                                    fill={(hoverRating || rating) >= star ? 'currentColor' : 'none'}
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <button type="submit" className="w-full p-4 bg-rich-brown text-white font-bold text-lg rounded-lg shadow-md hover:bg-dark-brown transition-colors">
                   {t('services.form.submit')}
                </button>
            </form>
            
            {replies.length > 0 && (
                 <div className="max-w-xl mx-auto mt-8 bg-cream p-6 rounded-xl shadow-lg text-dark-brown">
                    <h3 className="mb-4 text-xl font-bold text-accent">{t('services.admin_reply_title')}</h3>
                    <div className="space-y-4">
                        {replies.map((reply) => (
                             <div key={reply.key} className="bg-[#efebe9] p-4 rounded-lg border-r-4 border-light-brown">
                                 <p className="font-bold text-sm text-gray-600">{formatTimestamp(reply.timestamp)}</p>
                                 <p className="mt-1">{reply.text}</p>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        <Analytics />
    </div>
  );
}
