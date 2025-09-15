"use client";

import { useEffect, useState } from 'react';
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
import { getServiceRequestsAction, submitReplyAction } from '@/lib/actions';
import { useTranslation } from '@/hooks/use-translation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type ServiceRequest = {
  id: number;
  room: string;
  name: string;
  phone: string;
  message: string;
  status: 'Pending' | 'Replied';
  reply?: string;
};

export default function AdminPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchRequests() {
      const data = await getServiceRequestsAction();
      setRequests(data);
    }
    fetchRequests();
  }, [isReplying]);

  const handleReplySubmit = async () => {
    if (!selectedRequest || !replyText) return;
    setIsReplying(true);
    const result = await submitReplyAction(selectedRequest.id, replyText);
    if (result.success) {
      toast({ title: "Success", description: result.message });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setIsReplying(false);
    setReplyText('');
    setIsDialogOpen(false);
    setSelectedRequest(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{t('admin.title')}</CardTitle>
        <CardDescription>{t('admin.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">{t('admin.table.room')}</TableHead>
              <TableHead>{t('admin.table.name')}</TableHead>
              <TableHead>{t('admin.table.request')}</TableHead>
              <TableHead className="w-[100px]">{t('admin.table.status')}</TableHead>
              <TableHead className="w-[100px] text-right">{t('admin.table.action')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.room}</TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.message}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'Replied' ? 'default' : 'secondary'}>
                      {req.status === 'Replied' ? t('admin.status_replied') : t('admin.status_pending')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isDialogOpen && selectedRequest?.id === req.id} onOpenChange={(open) => {
                        if (open) {
                            setSelectedRequest(req);
                            setReplyText(req.reply || '');
                        } else {
                            setSelectedRequest(null);
                        }
                        setIsDialogOpen(open);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t('admin.reply_button')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t('admin.reply_dialog_title')} #{req.room}</DialogTitle>
                          <DialogDescription>
                            {t('admin.reply_dialog_desc')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="font-semibold text-sm">Guest Request:</p>
                            <p className="text-sm text-muted-foreground p-2 bg-muted rounded-md">{req.message}</p>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('admin.no_requests')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
