export interface MenuItem {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  name_en: string;
  image: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
    {
      id: "soups",
      name: "الشوربات",
      name_en: "Soups",
      image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070",
      items: [
        {id: "soup1", name_ar: "شوربة لسان عصفور", name_en: "Vermicelli Soup", price: 35.00},
        {id: "soup2", name_ar: "شوربة خضار", name_en: "Vegetable Soup", price: 50.00},
        {id: "soup3", name_ar: "شوربة طماطم", name_en: "Tomato Soup", price: 55.00},
        {id: "soup4", name_ar: "شوربة كريمة بالمشروم", name_en: "Cream of Mushroom Soup", price: 105.00},
        {id: "soup5", name_ar: "شوربة كريمة بالفراخ", name_en: "Cream of Chicken Soup", price: 130.00},
        {id: "soup6", name_ar: "شوربة سى فوود", name_en: "Sea Food Soup", price: 195.00}
      ]
    },
    {
      id: "appetizers",
      name: "المقبلات",
      name_en: "Appetizers",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071",
      items: [
        {id: "appetizer1", name_ar: "سلطة خضراء", name_en: "Green Salad", price: 30.00},
        {id: "appetizer2", name_ar: "سلطة بطاطس", name_en: "Potato Salad", price: 30.00},
        {id: "appetizer3", name_ar: "سلطة بنجر", name_en: "Beetroot Salad", price: 30.00},
        {id: "appetizer4", name_ar: "سلطة طحينة", name_en: "Tahini Salad", price: 35.00},
        {id: "appetizer5", name_ar: "سلطة بابا غنوج", name_en: "Baba Ghanoush", price: 35.00},
        {id: "appetizer6", name_ar: "سلطة بطاطس مايونيز", name_en: "Potato Mayonnaise Salad", price: 40.00},
        {id: "appetizer7", name_ar: "سلطة زبادى", name_en: "Yogurt Salad", price: 40.00},
        {id: "appetizer8", name_ar: "بوم فريت", name_en: "French Fries", price: 40.00}
      ]
    },
    {
      id: "pastas",
      name: "العجائن والنشويات",
      name_en: "Pasta & Carbohydrates",
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=1926",
      items: [
        {id: "pasta1", name_ar: "مكرونة إسباجتى", name_en: "Spaghetti", price: 55.00},
        {id: "pasta2", name_ar: "مكرونة إسباجتى بولونيز", name_en: "Spaghetti Bolognese", price: 85.00},
        {id: "pasta3", name_ar: "مكرونة بالسجق", name_en: "Pasta With Sausage", price: 95.00},
        {id: "pasta4", name_ar: "مكرونة فرن باللحمة المفرومة", name_en: "Macaroni Bachamil", price: 95.00},
        {id: "pasta5", name_ar: "مكرونة تشيكن الفريدو", name_en: "Chicken Alfredo Pasta", price: 150.00},
        {id: "pasta6", name_ar: "مكرونة تشيكن نجرسكو", name_en: "Spaghetti Negresco Chicken", price: 165.00},
        {id: "pasta7", name_ar: "مكرونة بشاميل شيش طاووق", name_en: "Pasta Bechamel Shish Tawook", price: 165.00},
        {id: "pasta8", name_ar: "مكرونة جمبرى", name_en: "Shrimps Pasta", price: 220.00},
        {id: "pasta9", name_ar: "مكرونة ميكس سى فوود", name_en: "Seafood Pasta", price: 250.00}
      ]
    },
    {
      id: "main-courses",
      name: "الأطباق الرئيسية",
      name_en: "Main Dishes",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070",
      items: [
        {id: "main1", name_ar: "سجق مشوي", name_en: "Grilled Sausage", price: 170.00},
        {id: "main2", name_ar: "كبدة مشوية", name_en: "Grilled liver", price: 170.00},
        {id: "main3", name_ar: "ورقة سجق شرقى", name_en: "Oriental Sausage Sheet", price: 190.00},
        {id: "main4", name_ar: "كفتة مشوية", name_en: "Grilled Kofta", price: 200.00},
        {id: "main5", name_ar: "فراخ مشوى", name_en: "Grilled Chicken", price: 215.00},
        {id: "main6", name_ar: "صدور فراخ مشوى", name_en: "Grilled chicken breasts", price: 230.00},
        {id: "main7", name_ar: "فراخ بانيه", name_en: "Chicken pane", price: 250.00},
        {id: "main8", name_ar: "شيش طاووق", name_en: "Shish Tawook", price: 250.00},
        {id: "main9", name_ar: "تشيكن كرسبى", name_en: "Chicken Crispy", price: 250.00},
        {id: "main10", name_ar: "فراخ ليمون صوص", name_en: "Chicken Lemon Sauce", price: 260.00},
        {id: "main11", name_ar: "إستيك مشوى", name_en: "Grilled Steak", price: 280.00},
        {id: "main12", name_ar: "فراخ صوص مشروم", name_en: "Chicken Mushroom Sauce", price: 260.00},
        {id: "main13", name_ar: "تشيكن مشروم موكا", name_en: "Chicken Mushroom Mocha", price: 270.00},
        {id: "main14", name_ar: "فراخ روول", name_en: "Chicken Roll", price: 270.00},
        {id: "main15", name_ar: "إستيك مشروم", name_en: "Mushroom Steak", price: 290.00},
        {id: "main16", name_ar: "إستيك بوافر", name_en: "Stick Poivre", price: 290.00},
        {id: "main17", name_ar: "ورقة لحمة", name_en: "Steick Papper", price: 315.00},
        {id: "main18", name_ar: "ميكس جريل", name_en: "Mix Grill", price: 400.00}
      ]
    },
    {
      id: "family-meals",
      name: "الوجبات العائلية",
      name_en: "Family Meals",
      image: "https://images.unsplash.com/photo-1556911220-ef412ae179a9?q=80&w=1968",
      items: [
        {id: "family1", name_ar: "وجبة 4 أفراد (مشويات)", name_en: "Meal for 4 Persons (Grilled)", price: 1190.00},
        {id: "family2", name_ar: "وجبة 4 أفراد (ممتازة)", name_en: "Premium Meal for 4 Persons", price: 1450.00},
        {id: "family3", name_ar: "وجبة 6 أفراد (لوكس)", name_en: "Deluxe Meal for 6 Persons", price: 1900.00},
        {id: "family4", name_ar: "وجبة سى فوود 4 أفراد", name_en: "Seafood Meal for 4 Persons", price: 1280.00},
        {id: "family5", name_ar: "وجبة سى فوود 6 أفراد", name_en: "Seafood Meal for 6 Persons", price: 1650.00},
        {id: "family6", name_ar: "وجبة سمك 4 أفراد", name_en: "Fish Meal for 4 Persons", price: 980.00}
      ]
    },
    {
      id: "fish-casseroles",
      name: "الأسماك والطواجن",
      name_en: "Fish & Casseroles",
      image: "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?q=80&w=1974",
      items: [
        {id: "fish1", name_ar: "طبق بساريا", name_en: "Basaria Platter", price: 50.00},
        {id: "fish2", name_ar: "طبق ملوخية بالجمبرى", name_en: "Molokhia With Shrimp Platter", price: 120.00},
        {id: "fish3", name_ar: "سمك بلطى مشوى", name_en: "Bolty Fish Grilled", price: 170.00},
        {id: "fish4", name_ar: "سمك بلطى مقلى", name_en: "Bolty Fish Fried", price: 180.00},
        {id: "fish5", name_ar: "فيليه مشوى", name_en: "Fish Fillet Grilled", price: 190.00},
        {id: "fish6", name_ar: "فيليه مقلى", name_en: "Fish Fillet Fried", price: 200.00},
        {id: "fish7", name_ar: "سمك بورى مشوى", name_en: "Bouri Fish Grilled", price: 195.00},
        {id: "fish8", name_ar: "سمك بورى سنجارى", name_en: "Bouri Fish Sangari", price: 200.00},
        {id: "fish9", name_ar: "كليمارى مقلى", name_en: "Fried Calemari", price: 295.00},
        {id: "fish10", name_ar: "جمبرى (مشوى - مقلى)", name_en: "Shrimps (Grilled-Fried)", price: 400.00},
        {id: "fish11", name_ar: "جمبرى كبير (مشوى - مقلى)", name_en: "Shrimps Jambo (Grilled-Fried)", price: 450.00},
        {id: "fish12", name_ar: "ميكس سى فوود", name_en: "Mixed Sea Food", price: 490.00},
        {id: "fish13", name_ar: "طبق ملوخية", name_en: "Molokhia Platter", price: 55.00},
        {id: "fish14", name_ar: "طاجن مسقعة باللحمة", name_en: "Miussaka Casserole With Meat", price: 140.00},
        {id: "fish15", name_ar: "طاجن تورللى باللحمة", name_en: "Meat Turlly Casserole With Meat", price: 180.00},
        {id: "fish16", name_ar: "طاجن بسلة باللحمة", name_en: "Pea Casserole With Meat", price: 180.00},
        {id: "fish17", name_ar: "طاجن بامية باللحمة", name_en: "Okra Casserole With Meat", price: 190.00},
        {id: "fish18", name_ar: "طاجن كاليمارى", name_en: "Calamari Tajine", price: 300.00},
        {id: "fish19", name_ar: "طاجن جمبرى", name_en: "Shrimp Tajine", price: 360.00},
        {id: "fish20", name_ar: "طاجن ميكس سى فوود", name_en: "Mix Seafood Tajine", price: 380.00}
      ]
    },
    {
      id: "sandwiches-pizza",
      name: "الساندويتشات والبيتزا",
      name_en: "Sandwiches & Pizza",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998",
      items: [
        {id: "sandwich1", name_ar: "كبده اسكندرانى", name_en: "Alexandrian liver", price: 60.00},
        {id: "sandwich2", name_ar: "سجق", name_en: "Sausage", price: 60.00},
        {id: "sandwich3", name_ar: "هامبورجر", name_en: "Hamburger", price: 80.00},
        {id: "sandwich4", name_ar: "شيش طاووق", name_en: "Shish Tawook", price: 95.00},
        {id: "sandwich5", name_ar: "تشيكن فاهيتا", name_en: "Chicken fahita", price: 100.00},
        {id: "sandwich6", name_ar: "كفتة مشوية", name_en: "Grilled kofta", price: 95.00},
        {id: "sandwich7", name_ar: "تشيكن شاورما", name_en: "Chicken Shawarma", price: 100.00},
        {id: "sandwich8", name_ar: "فراخ بانيه", name_en: "Chicken pane", price: 100.00},
        {id: "sandwich9", name_ar: "تشيكن كرسبى", name_en: "Chicken crispy", price: 120.00},
        {id: "sandwich10", name_ar: "كليمارى", name_en: "Calamari", price: 155.00},
        {id: "sandwich11", name_ar: "جمبرى", name_en: "Shrimp", price: 170.00},
        {id: "pizza1", name_ar: "بيتزا مارجريتا", name_en: "Margarita", price: 140.00},
        {id: "pizza2", name_ar: "بيتزا خضروات", name_en: "Vegetables", price: 150.00},
        {id: "pizza3", name_ar: "بيتزا ميكس جبن", name_en: "Mix Cheese", price: 170.00},
        {id: "pizza4", name_ar: "بيتزا سجق", name_en: "Sausage", price: 200.00},
        {id: "pizza5", name_ar: "بيتزا ميكس لحوم", name_en: "Mix Meat", price: 220.00},
        {id: "pizza6", name_ar: "بيتزا فراخ باربيكيو", name_en: "BBQ Chicken", price: 230.00},
        {id: "pizza7", name_ar: "بيتزا بسطرمة", name_en: "Pastirma", price: 240.00},
        {id: "pizza8", name_ar: "بيتزا جمبرى", name_en: "Shrimp", price: 250.00},
        {id: "pizza9", name_ar: "بيتزا سى فوود", name_en: "Seafood", price: 300.00}
      ]
    },
    {
      id: "desserts",
      name: "الحلويات",
      name_en: "Desserts",
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1974",
      items: [
        {id: "dessert1", name_ar: "ارز باللبن سادة", name_en: "Plain Rice Milk", price: 35.00},
        {id: "dessert2", name_ar: "ارز باللبن ايس كريم", name_en: "Rice pudding ice cream", price: 50.00},
        {id: "dessert3", name_ar: "ارز باللبن بالمكسرات", name_en: "Rice with milk and nuts", price: 60.00},
        {id: "dessert4", name_ar: "ارز باللبن عسل ومكسرات", name_en: "Rice with milk, honey, and nuts", price: 65.00},
        {id: "dessert5", name_ar: "ارز باللبن ايس كريم ومكسرات", name_en: "Rice pudding ice cream with nuts", price: 65.00},
        {id: "dessert6", name_ar: "أم على", name_en: "Um Ali", price: 55.00},
        {id: "dessert7", name_ar: "أم على مكسرات", name_en: "Um Ali, nuts", price: 70.00},
        {id: "dessert8", name_ar: "أم على نوتيلا", name_en: "Um Ali Nutella", price: 75.00},
        {id: "dessert9", name_ar: "فروت سلاط", name_en: "Fruit Salad", price: 85.00},
        {id: "dessert10", name_ar: "فروت سلاط آيس كريم", name_en: "Fruit Salad Ice Cream", price: 95.00},
        {id: "dessert11", name_ar: "طبق فاكهة", name_en: "Fruit plate", price: 120.00},
        {id: "dessert12", name_ar: "وافل نوتيلا", name_en: "Waffle Nutella", price: 63.00},
        {id: "dessert13", name_ar: "وافل وايت شيكولاتة", name_en: "Waffle white chocolate", price: 68.00},
        {id: "dessert14", name_ar: "وافل كاراميل", name_en: "Waffle Caramel", price: 80.00},
        {id: "dessert15", name_ar: "وافل لوتس", name_en: "Waffle Lotus", price: 85.00},
        {id: "dessert16", name_ar: "وافل فورسيزون", name_en: "Waffle for season", price: 115.00}
      ]
    },
    {
      id: "hot-drinks",
      name: "المشروبات الساخنة",
      name_en: "Hot Drinks",
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=2066",
      items: [
        {id: "hotdrink1", name_ar: "أعشاب (بابونج - ينسون - كركديه)", name_en: "Herbs (Chamoomile - Anise - Hibiscus)", price: 35.00},
        {id: "hotdrink2", name_ar: "نعناع - جنزبيل - قرفة", name_en: "Mint - Ginger - Cinnamon", price: 35.00},
        {id: "hotdrink3", name_ar: "فيتامين سى (عسل - نعناع فريش)", name_en: "Vitamin C (Honey - Fresh Mint)", price: 45.00},
        {id: "hotdrink4", name_ar: "ليمون فريش - باكت ينسون - باكت نعناع", name_en: "Fresh Lemon - Anise Packet - Mint Packet", price: 45.00},
        {id: "hotdrink5", name_ar: "شاى ليبتون", name_en: "Lipton Tea", price: 40.00},
        {id: "hotdrink6", name_ar: "شاى ليبتون نعناع", name_en: "Lipton Tea With Mint", price: 45.00},
        {id: "hotdrink7", name_ar: "شاى زردة", name_en: "Zarda Tea", price: 45.00},
        {id: "hotdrink8", name_ar: "شاى ليبتون بالحليب", name_en: "Tea With Milk", price: 47.00},
        {id: "hotdrink9", name_ar: "قهوة تركى سنجل", name_en: "Turkish Coffee single", price: 45.00},
        {id: "hotdrink10", name_ar: "قهوة تركى دبل", name_en: "Turkish Coffee Double", price: 65.00},
        {id: "hotdrink11", name_ar: "قهوة تركى محوج", name_en: "Mixed Turkish Coffee Single", price: 50.00},
        {id: "hotdrink12", name_ar: "قهوة تركى محوج دبل", name_en: "Mixed Turkish Coffee Double", price: 70.00}
      ]
    }
  ]

      