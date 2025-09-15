"use client";

import { useState } from 'react';
import { useUser } from "@/context/user-context";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const { setUser } = useUser();
    const { t } = useTranslation();
    const router = useRouter();
    const [roomNumber, setRoomNumber] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!roomNumber) {
            setError(t('services.form.room_number_placeholder'));
            return;
        }
        setUser({ roomNumber, name, phone });
        router.push('/dashboard');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cream">
            <Card className="w-full max-w-md mx-4">
                <CardHeader className="text-center">
                    <Image src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0019.jpg" alt="Kaoud Hotel Logo" width={80} height={80} className="rounded-full mx-auto mb-4" />
                    <CardTitle className="font-headline text-primary">{t('data_gate.title')}</CardTitle>
                    <CardDescription>{t('data_gate.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="roomNumber">
                               {t('services.form.room_number')}*
                            </Label>
                            <Input
                                id="roomNumber"
                                type="number"
                                value={roomNumber}
                                onChange={(e) => {
                                    setRoomNumber(e.target.value);
                                    if(e.target.value) setError("");
                                }}
                                placeholder={t('services.form.room_number_placeholder')}
                                required
                            />
                            {error && <p className="text-sm text-destructive">{error}</p>}
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="name">
                               {t('services.form.name')}
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('services.form.name_placeholder')}
                            />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="phone">
                               {t('services.form.phone')}
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder={t('services.form.phone_placeholder')}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full mt-6" disabled={!roomNumber}>{t('data_gate.submit')}</Button>
                </CardContent>
            </Card>
        </div>
    );
}
