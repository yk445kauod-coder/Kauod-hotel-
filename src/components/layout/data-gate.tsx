"use client";

import { useUser } from "@/context/user-context";
import { useTranslation } from "@/hooks/use-translation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function DataGate({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    const { user, setUser } = useUser();
    const { t } = useTranslation();
    const [roomNumber, setRoomNumber] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    
    useEffect(() => {
        if(isOpen) {
            setRoomNumber(user.roomNumber || "");
            setName(user.name || "");
            setPhone(user.phone || "");
        }
    }, [isOpen, user]);

    const handleSubmit = () => {
        if (roomNumber) {
            setUser({ roomNumber, name, phone });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('data_gate.edit_data')}</DialogTitle>
                    <DialogDescription>{t('data_gate.description')}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roomNumber" className="text-right">
                           {t('services.form.room_number')}*
                        </Label>
                        <Input
                            id="roomNumber"
                            type="number"
                            value={roomNumber}
                            onChange={(e) => setRoomNumber(e.target.value)}
                            className="col-span-3"
                            required
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                           {t('services.form.name')}
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                           {t('services.form.phone')}
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={!roomNumber}>{t('data_gate.submit')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
