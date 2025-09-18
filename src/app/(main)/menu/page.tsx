
"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { menuData, type MenuItem } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Download, Printer, ShoppingCart, Send, Plus, Minus, ArrowUp } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { submitServiceRequestAction } from "@/lib/actions";
import { useUser } from "@/context/user-context";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MenuItemRow = ({ item, onAddToCart }: { item: MenuItem, onAddToCart: (item: MenuItem) => void }) => {
  const { language } = useLanguage();
  return (
     <TableRow>
      <TableCell className="font-medium">{language === 'ar' ? item.name : item.en_name}</TableCell>
      <TableCell className="text-right font-semibold text-accent">{item.price} {useTranslation().t('currency')}</TableCell>
      <TableCell className="text-center">
          <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10" onClick={() => onAddToCart(item)}>
              <Plus className="h-5 w-5" />
          </Button>
      </TableCell>
    </TableRow>
  )
};

export default function MenuPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const [cart, setCart] = useState<Map<string, {item: MenuItem, quantity: number}>>(new Map());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const categoryRefs = useRef<{[key: string]: HTMLElement | null}>({});

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400){
      setShowScroll(true)
    } else if (showScroll && window.pageYOffset <= 400){
      setShowScroll(false)
    }
  };
  
  const scrollTop = () =>{
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop)
    return () => window.removeEventListener('scroll', checkScrollTop)
  }, [showScroll]);


  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      if (newCart.has(item.id)) {
        newCart.get(item.id)!.quantity++;
      } else {
        newCart.set(item.id, { item, quantity: 1 });
      }
      return newCart;
    });
    toast({ title: t('menu.cart.added'), description: `${language === 'ar' ? item.name : item.en_name}` });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = new Map(prevCart);
      if (newCart.has(itemId)) {
        if (newCart.get(itemId)!.quantity > 1) {
          newCart.get(itemId)!.quantity--;
        } else {
          newCart.delete(itemId);
        }
      }
      return newCart;
    });
  };
  
  const handleCheckout = async () => {
    if (!user.roomNumber) {
        toast({ title: t('services.error_title'), description: t('services.enter_room_number_first'), variant: 'destructive' });
        return;
    }
    
    setIsLoading(true);
    const cartItems = Array.from(cart.values());
    const orderSummary = cartItems.map(cartItem => 
        `${cartItem.quantity} x ${language === 'ar' ? cartItem.item.name : cartItem.item.en_name}`
    ).join(', ');
    
    const total = cartItems.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);

    const formData = new FormData();
    formData.append('roomNumber', user.roomNumber);
    formData.append('guestName', user.name || 'Guest');
    formData.append('guestPhone', user.phone || 'N/A');
    formData.append('guestMessage', `طلب قائمة طعام: ${orderSummary}`);
    formData.append('total', total.toString());
    formData.append('type', 'Food Order');

    const result = await submitServiceRequestAction(formData);

    setIsLoading(false);
    if (result.success) {
      toast({ title: t('services.success_title'), description: t('services.success_desc') });
      setCart(new Map());
      setIsCartOpen(false);
    } else {
      toast({ title: t('services.error_title'), description: result.error, variant: 'destructive' });
    }
  };

  const totalItems = Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Array.from(cart.values()).reduce((sum, item) => sum + (item.item.price * item.quantity), 0);

  const handlePrint = () => {
    window.print();
  };

  const downloadAsImage = async () => {
    const element = menuContainerRef.current;
    if (element) {
      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#f5f1e6'
      });
      const data = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = data;
      link.download = 'kaoud-hotel-menu.jpeg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleTabClick = (categoryId: string) => {
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gradient-to-br from-cream to-[#f5f1e6] py-10 px-4 print-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
       {totalItems > 0 && (
         <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-24 md:bottom-8 right-4 md:right-8 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-lg z-50 flex items-center justify-center">
              <ShoppingCart className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-6 w-6 flex items-center justify-center">{totalItems}</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('menu.cart.title')}</DialogTitle>
              <DialogDescription>{t('menu.cart.description')}</DialogDescription>
            </DialogHeader>
            <div className="max-h-64 overflow-y-auto my-4 pr-2">
                {cart.size > 0 ? Array.from(cart.entries()).map(([key, {item, quantity}]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b">
                        <div>
                            <p className="font-semibold">{language === 'ar' ? item.name : item.en_name}</p>
                            <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} {t('currency')}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button size="icon" variant="ghost" onClick={() => handleAddToCart(item)}><Plus className="h-4 w-4"/></Button>
                             <span className="w-6 text-center">{quantity}</span>
                             <Button size="icon" variant="ghost" onClick={() => handleRemoveFromCart(key)}><Minus className="h-4 w-4"/></Button>
                        </div>
                    </div>
                )) : <p className="text-muted-foreground text-center">{t('menu.cart.empty')}</p>}
            </div>
            <div className="flex justify-between font-bold text-lg">
                <span>{t('menu.cart.total')}</span>
                <span>{totalPrice.toFixed(2)} {t('currency')}</span>
            </div>
            <DialogFooter>
                <Button onClick={handleCheckout} className="w-full" disabled={isLoading}>
                    {isLoading ? t('loading') : t('menu.cart.checkout')} <Send className="ms-2 h-4 w-4"/>
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Button onClick={scrollTop} className={`fixed bottom-24 md:bottom-8 left-4 md:left-8 h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg z-50 transition-opacity duration-300 ${showScroll ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <ArrowUp className="h-7 w-7" />
      </Button>

      <div ref={menuContainerRef} className="container mx-auto bg-white/95 rounded-2xl shadow-2xl border border-gold overflow-hidden">
        <header className="relative text-center p-10 border-b-4 border-gold">
           <div className="absolute inset-0 bg-cover bg-center opacity-15" style={{backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070')"}}></div>
           <div className="relative z-10">
              <div className="absolute top-4 left-6 font-bold text-2xl text-gold text-shadow-sm">{t('hotel.name')}</div>
              <h1 className="text-5xl font-bold text-gold text-shadow">{t('menu.title')}</h1>
           </div>
        </header>

        <div className="flex justify-center gap-4 my-8 flex-wrap px-4 no-print">
            <Button onClick={downloadAsImage} className="bg-gradient-to-b from-primary to-dark-brown text-white border-2 border-gold rounded-full px-8 py-6 text-lg shadow-lg hover:from-accent hover:to-primary hover:-translate-y-1 transition-all duration-300">
              <Download className="me-2"/> {t('menu.download')}
            </Button>
            <Button onClick={handlePrint} className="bg-gradient-to-b from-primary to-dark-brown text-white border-2 border-gold rounded-full px-8 py-6 text-lg shadow-lg hover:from-accent hover:to-primary hover:-translate-y-1 transition-all duration-300">
              <Printer className="me-2"/> {t('menu.print')}
            </Button>
        </div>

        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm p-2 no-print">
           <Tabs defaultValue={menuData[0].id} className="w-full">
              <TabsList className="w-full" scrollable>
                {menuData.map(category => (
                   <TabsTrigger key={category.id} value={category.id} onClick={() => handleTabClick(category.id)}>
                      {language === 'ar' ? category.name : category.en_name}
                   </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
        </div>

        <main className="p-4 md:p-8">
            {menuData.map((category) => (
            <section 
              key={category.id} 
              id={category.id} 
              ref={(el) => (categoryRefs.current[category.id] = el)} 
              className="mb-12 pt-4 -mt-4 scroll-mt-24"
            >
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6 shadow-lg border border-gold">
                    <Image src={category.image} alt={language === 'ar' ? category.name : category.en_name} fill style={{objectFit: "cover"}} className="transform transition-transform duration-500 hover:scale-105" />
                </div>
                <h2 className="bg-gradient-to-r from-primary to-accent text-white text-3xl font-headline p-4 rounded-lg text-center mb-6 border-2 border-gold shadow-md">{language === 'ar' ? category.name : category.en_name}</h2>

                 <div className="rounded-lg overflow-hidden shadow-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-dark-brown to-primary hover:bg-dark-brown">
                                <TableHead className="text-gold text-lg">{t('menu.table.item')}</TableHead>
                                <TableHead className="text-gold text-lg text-right">{t('menu.table.price')}</TableHead>
                                <TableHead className="text-gold text-lg text-center">{t('menu.cart.add')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {category.items.map((item) => (
                                <MenuItemRow key={item.id} item={item} onAddToCart={handleAddToCart} />
                            ))}
                        </TableBody>
                    </Table>
                 </div>
            </section>
            ))}
        </main>
        
        <footer className="bg-gradient-to-r from-[#f9f3e9] to-[#f5e9d3] p-6 rounded-lg m-4 md:m-8 text-center border-2 border-gold shadow-inner">
            <h3 className="text-accent text-2xl font-bold mb-3">{t('menu.notes_title')}</h3>
            <p className="text-base">{t('menu.notes_content')}</p>
        </footer>
      </div>
    </div>
  );
}

    

    