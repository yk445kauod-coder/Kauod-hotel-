"use client";

import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function LanguageModal({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
    const { setLanguage } = useLanguage();
    const { t } = useTranslation();

    const selectLang = (lang: 'ar' | 'en') => {
        setLanguage(lang);
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Choose Language / اختر اللغة</DialogTitle>
                    <DialogDescription>
                        Please select your preferred language.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-4">
                    <Button onClick={() => selectLang('ar')} variant="outline" size="lg">
                        <span className="text-2xl me-2">🇪🇬</span>
                        {t('language.arabic')}
                    </Button>
                    <Button onClick={() => selectLang('en')} variant="outline" size="lg">
                        <span className="text-2xl me-2">🇬🇧</span>
                        {t('language.english')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
