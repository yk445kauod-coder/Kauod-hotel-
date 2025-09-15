"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { menuData, type MenuCategory, type MenuItem } from "@/lib/data";
import { useTranslation } from "@/hooks/use-translation";
import { Printer } from "lucide-react";

const MenuItemCard = ({ item }: { item: MenuItem }) => (
  <Card className="overflow-hidden print-card">
    <CardContent className="p-0">
      {item.image && (
        <div className="aspect-[3/2] w-full overflow-hidden">
          <Image
            src={item.image.imageUrl}
            alt={item.name}
            width={600}
            height={400}
            className="object-cover w-full h-full"
            data-ai-hint={item.image.imageHint}
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold font-headline">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="mt-2 font-semibold">{item.price}</p>
      </div>
    </CardContent>
  </Card>
);

const AllMenuItems = ({ categories }: { categories: MenuCategory[] }) => (
  <div className="space-y-8">
    {categories.map(category => (
      <div key={`print-${category.id}`}>
        <h2 className="text-2xl font-bold font-headline mb-4">{category.name}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {category.items.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default function MenuPage() {
  const { t } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4">
       <div className="flex items-center justify-between py-4 print-header">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{t('menu.title')}</h1>
          <p className="text-muted-foreground">{t('menu.description')}</p>
        </div>
        <Button onClick={handlePrint} className="no-print">
          <Printer className="me-2 h-4 w-4" />
          {t('menu.print')}
        </Button>
      </div>
      
      <div className="hidden print:block">
        <AllMenuItems categories={menuData} />
      </div>

      <div className="no-print">
        <Tabs defaultValue={menuData[0]?.id || 'all'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            {menuData.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {menuData.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
