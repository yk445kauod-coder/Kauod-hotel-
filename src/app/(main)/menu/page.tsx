"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { menuData, type MenuCategory, type MenuItem } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";

const MenuItemRow = ({ item }: { item: MenuItem }) => {
  const { language } = useLanguage();
  return (
     <TableRow>
      <TableCell className="font-medium">{language === 'ar' ? item.name : item.en_name}</TableCell>
      <TableCell className="text-right font-semibold text-accent">{item.price} {useTranslation().t('currency')}</TableCell>
    </TableRow>
  )
};

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const menuContainerRef = useRef<HTMLDivElement>(null);

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


  return (
    <div className="bg-gradient-to-br from-cream to-[#f5f1e6] py-10 px-4 print-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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

        <main className="p-4 md:p-8">
            {menuData.map((category) => (
            <section key={category.id} className="mb-12">
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6 shadow-lg border border-gold">
                    <Image src={category.image} alt={language === 'ar' ? category.name : category.en_name} layout="fill" objectFit="cover" className="transform transition-transform duration-500 hover:scale-105" />
                </div>
                <h2 className="bg-gradient-to-r from-primary to-accent text-white text-3xl font-headline p-4 rounded-lg text-center mb-6 border-2 border-gold shadow-md">{language === 'ar' ? category.name : category.en_name}</h2>

                 <div className="rounded-lg overflow-hidden shadow-md">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-dark-brown to-primary hover:bg-dark-brown">
                                <TableHead className="text-gold text-lg text-center">{t('menu.table.item')}</TableHead>
                                <TableHead className="text-gold text-lg text-right">{t('menu.table.price')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {category.items.map((item) => (
                                <MenuItemRow key={item.id} item={item} />
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
