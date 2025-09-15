import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

const imageMap = new Map<string, ImagePlaceholder>(
  PlaceHolderImages.map(img => [img.id, img])
);

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ImagePlaceholder | undefined;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    id: 'main-courses',
    name: 'Main Courses',
    items: [
      { id: 'steak', name: 'Grilled Steak', description: 'Grilled steak served with roasted vegetables.', price: '$25.50', image: imageMap.get('menu-steak') },
      { id: 'pasta', name: 'Spaghetti Bolognese', description: 'Classic spaghetti bolognese with rich tomato sauce.', price: '$18.00', image: imageMap.get('menu-pasta') },
      { id: 'burger', name: 'Kaoud Burger', description: 'A juicy beef burger with lettuce, tomato, and cheese.', price: '$15.00', image: imageMap.get('menu-burger') },
      { id: 'sushi', name: 'Sushi Platter', description: 'Assorted sushi rolls with wasabi and soy sauce.', price: '$28.00', image: imageMap.get('menu-sushi') },
    ],
  },
  {
    id: 'appetizers',
    name: 'Appetizers',
    items: [
      { id: 'salad', name: 'Caesar Salad', description: 'A fresh and healthy Caesar salad.', price: '$12.00', image: imageMap.get('menu-salad') },
      { id: 'pizza-slice', name: 'Pizza Slice', description: 'A delicious cheese pizza with fresh toppings.', price: '$8.50', image: imageMap.get('menu-pizza') },
    ],
  },
  {
    id: 'desserts',
    name: 'Desserts',
    items: [
      { id: 'tiramisu', name: 'Tiramisu', description: 'Classic Italian tiramisu dessert.', price: '$9.00', image: imageMap.get('menu-tiramisu') },
      { id: 'cheesecake', name: 'New York Cheesecake', description: 'Creamy New York style cheesecake with a berry topping.', price: '$9.50', image: imageMap.get('menu-cheesecake') },
    ],
  },
  {
    id: 'beverages',
    name: 'Beverages',
    items: [
      { id: 'orange-juice', name: 'Fresh Orange Juice', description: 'Freshly squeezed orange juice.', price: '$6.00', image: imageMap.get('menu-juice') },
      { id: 'coffee', name: 'Artisan Coffee', description: 'A hot cup of freshly brewed coffee.', price: '$5.00', image: imageMap.get('menu-coffee') },
    ],
  },
];
