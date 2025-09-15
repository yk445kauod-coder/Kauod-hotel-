"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { submitServiceRequestAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ServiceRequestPage() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const formSchema = z.object({
    roomNumber: z.string().min(1, t('services.form.room_number_placeholder')),
    name: z.string().min(2, t('services.form.name_placeholder')),
    phone: z.string().optional(),
    message: z.string().min(10, t('services.form.message_placeholder')),
    language: z.enum(['en', 'ar']),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomNumber: '',
      name: '',
      phone: '',
      message: '',
      language: language,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setRecommendations([]);
    setShowSuccess(false);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const result = await submitServiceRequestAction(formData);

    if (result.success) {
      toast({
        title: t('services.success_title'),
        description: t('services.success_desc'),
      });
      setShowSuccess(true);
      if (result.recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      }
      form.reset();
    } else {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">{t('services.title')}</CardTitle>
          <CardDescription>{t('services.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.form.room_number')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('services.form.room_number_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.form.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('services.form.name_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.form.phone')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('services.form.phone_placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.form.message')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('services.form.message_placeholder')} {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('services.form.language')}</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      setLanguage(value as 'en' | 'ar');
                    }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en">{t('language.english')}</SelectItem>
                        <SelectItem value="ar">{t('language.arabic')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                {t('services.form.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {showSuccess && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>{t('services.success_title')}</AlertTitle>
            <AlertDescription>
            {t('services.success_desc')}
            </AlertDescription>
          </Alert>
        )}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Lightbulb className="text-accent" />
                {t('services.recommendations_title')}
              </CardTitle>
              <CardDescription>{t('services.recommendations_desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-sm">
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
