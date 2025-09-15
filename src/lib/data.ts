export interface MenuItem {
  id: string;
  name: string;
  en_name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  en_name: string;
  image: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
    {
      id: "soups",
      name: "الشوربات",
      en_name: "Soups",
      image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=2070",
      items: [
        {id: "soup1", name: "شوربة لسان عصفور", en_name: "Vermicelli Soup", description: "", price: "35.00"},
        {id: "soup2", name: "شوربة خضار", en_name: "Vegetable Soup", description: "", price: "50.00"},
        {id: "soup3", name: "شوربة طماطم", en_name: "Tomato Soup", description: "", price: "55.00"},
        {id: "soup4", name: "شوربة كريمة بالمشروم", en_name: "Cream of Mushroom Soup", description: "", price: "105.00"},
        {id: "soup5", name: "شوربة كريمة بالفراخ", en_name: "Cream of Chicken Soup", description: "", price: "130.00"},
        {id: "soup6", name: "شوربة سى فوود", en_name: "Sea Food Soup", description: "", price: "195.00"}
      ]
    },
    {
      id: "appetizers",
      name: "المقبلات",
      en_name: "Appetizers",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071",
      items: [
        {id: "appetizer1", name: "سلطة خضراء", en_name: "Green Salad", description: "", price: "30.00"},
        {id: "appetizer2", name: "سلطة بطاطس", en_name: "Potato Salad", description: "", price: "30.00"},
        {id: "appetizer3", name: "سلطة بنجر", en_name: "Beetroot Salad", description: "", price: "30.00"},
        {id: "appetizer4", name: "سلطة طحينة", en_name: "Tahini Salad", description: "", price: "35.00"},
        {id: "appetizer5", name: "سلطة بابا غنوج", en_name: "Baba Ghanoush", description: "", price: "35.00"},
        {id: "appetizer6", name: "سلطة بطاطس مايونيز", en_name: "Potato Mayonnaise Salad", description: "", price: "40.00"},
        {id: "appetizer7", name: "سلطة زبادى", en_name: "Yogurt Salad", description: "", price: "40.00"},
        {id: "appetizer8", name: "بوم فريت", en_name: "French Fries", description: "", price: "40.00"}
      ]
    },
    {
      id: "pastas",
      name: "العجائن والنشويات",
      en_name: "Pasta & Carbohydrates",
      image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=1926",
      items: [
        {id: "pasta1", name: "مكرونة إسباجتى", en_name: "Spaghetti", description: "", price: "55.00"},
        {id: "pasta2", name: "مكرونة إسباجتى بولونيز", en_name: "Spaghetti Bolognese", description: "", price: "85.00"},
        {id: "pasta3", name: "مكرونة بالسجق", en_name: "Pasta With Sausage", description: "", price: "95.00"},
        {id: "pasta4", name: "مكرونة فرن باللحمة المفرومة", en_name: "Macaroni Bachamil", description: "", price: "95.00"},
        {id: "pasta5", name: "مكرونة تشيكن الفريدو", en_name: "Chicken Alfredo Pasta", description: "", price: "150.00"},
        {id: "pasta6", name: "مكرونة تشيكن نجرسكو", en_name: "Spaghetti Negresco Chicken", description: "", price: "165.00"},
        {id: "pasta7", name: "مكرونة بشاميل شيش طاووق", en_name: "Pasta Bechamel Shish Tawook", description: "", price: "165.00"},
        {id: "pasta8", name: "مكرونة جمبرى", en_name: "Shrimps Pasta", description: "", price: "220.00"},
        {id: "pasta9", name: "مكرونة ميكس سى فوود", en_name: "Seafood Pasta", description: "", price: "250.00"}
      ]
    },
    {
      id: "main-courses",
      name: "الأطباق الرئيسية",
      en_name: "Main Dishes",
      image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070",
      items: [
        {id: "main1", name: "سجق مشوي", en_name: "Grilled Sausage", description: "", price: "170.00"},
        {id: "main2", name: "كبدة مشوية", en_name: "Grilled liver", description: "", price: "170.00"},
        {id: "main3", name: "ورقة سجق شرقى", en_name: "Oriental Sausage Sheet", description: "", price: "190.00"},
        {id: "main4", name: "كفتة مشوية", en_name: "Grilled Kofta", description: "", price: "200.00"},
        {id: "main5", name: "فراخ مشوى", en_name: "Grilled Chicken", description: "", price: "215.00"},
        {id: "main6", name: "صدور فراخ مشوى", en_name: "Grilled chicken breasts", description: "", price: "230.00"},
        {id: "main7", name: "فراخ بانيه", en_name: "Chicken pane", description: "", price: "250.00"},
        {id: "main8", name: "شيش طاووق", en_name: "Shish Tawook", description: "", price: "250.00"},
        {id: "main9", name: "تشيكن كرسبى", en_name: "Chicken Crispy", description: "", price: "250.00"},
        {id: "main10", name: "فراخ ليمون صوص", en_name: "Chicken Lemon Sauce", description: "", price: "260.00"},
        {id: "main11", name: "إستيك مشوى", en_name: "Grilled Steak", description: "", price: "280.00"},
        {id: "main12", name: "فراخ صوص مشروم", en_name: "Chicken Mushroom Sauce", description: "", price: "260.00"},
        {id: "main13", name: "تشيكن مشروم موكا", en_name: "Chicken Mushroom Mocha", description: "", price: "270.00"},
        {id: "main14", name: "فراخ روول", en_name: "Chicken Roll", description: "", price: "270.00"},
        {id: "main15", name: "إستيك مشروم", en_name: "Mushroom Steak", description: "", price: "290.00"},
        {id: "main16", name: "إستيك بوافر", en_name: "Stick Poivre", description: "", price: "290.00"},
        {id: "main17", name: "ورقة لحمة", en_name: "Steick Papper", description: "", price: "315.00"},
        {id: "main18", name: "ميكس جريل", en_name: "Mix Grill", description: "", price: "400.00"}
      ]
    },
    {
      id: "family-meals",
      name: "الوجبات العائلية",
      en_name: "Family Meals",
      image: "https://images.unsplash.com/photo-1556911220-ef412ae179a9?q=80&w=1968",
      items: [
        {id: "family1", name: "وجبة 4 أفراد (مشويات)", en_name: "Meal for 4 Persons (Grilled)", description: "", price: "1190.00"},
        {id: "family2", name: "وجبة 4 أفراد (ممتازة)", en_name: "Premium Meal for 4 Persons", description: "", price: "1450.00"},
        {id: "family3", name: "وجبة 6 أفراد (لوكس)", en_name: "Deluxe Meal for 6 Persons", description: "", price: "1900.00"},
        {id: "family4", name: "وجبة سى فوود 4 أفراد", en_name: "Seafood Meal for 4 Persons", description: "", price: "1280.00"},
        {id: "family5", name: "وجبة سى فوود 6 أفراد", en_name: "Seafood Meal for 6 Persons", description: "", price: "1650.00"},
        {id: "family6", name: "وجبة سمك 4 أفراد", en_name: "Fish Meal for 4 Persons", description: "", price: "980.00"}
      ]
    },
    {
      id: "fish-casseroles",
      name: "الأسماك والطواجن",
      en_name: "Fish & Casseroles",
      image: "https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?q=80&w=1974",
      items: [
        {id: "fish1", name: "طبق بساريا", en_name: "Basaria Platter", description: "", price: "50.00"},
        {id: "fish2", name: "طبق ملوخية بالجمبرى", en_name: "Molokhia With Shrimp Platter", description: "", price: "120.00"},
        {id: "fish3", name: "سمك بلطى مشوى", en_name: "Bolty Fish Grilled", description: "", price: "170.00"},
        {id: "fish4", name: "سمك بلطى مقلى", en_name: "Bolty Fish Fried", description: "", price: "180.00"},
        {id: "fish5", name: "فيليه مشوى", en_name: "Fish Fillet Grilled", description: "", price: "190.00"},
        {id: "fish6", name: "فيليه مقلى", en_name: "Fish Fillet Fried", description: "", price: "200.00"},
        {id: "fish7", name: "سمك بورى مشوى", en_name: "Bouri Fish Grilled", description: "", price: "195.00"},
        {id: "fish8", name: "سمك بورى سنجارى", en_name: "Bouri Fish Sangari", description: "", price: "200.00"},
        {id: "fish9", name: "كليمارى مقلى", en_name: "Fried Calemari", description: "", price: "295.00"},
        {id: "fish10", name: "جمبرى (مشوى - مقلى)", en_name: "Shrimps (Grilled-Fried)", description: "", price: "400.00"},
        {id: "fish11", name: "جمبرى كبير (مشوى - مقلى)", en_name: "Shrimps Jambo (Grilled-Fried)", description: "", price: "450.00"},
        {id: "fish12", name: "ميكس سى فوود", en_name: "Mixed Sea Food", description: "", price: "490.00"},
        {id: "fish13", name: "طبق ملوخية", en_name: "Molokhia Platter", description: "", price: "55.00"},
        {id: "fish14", name: "طاجن مسقعة باللحمة", en_name: "Miussaka Casserole With Meat", description: "", price: "140.00"},
        {id: "fish15", name: "طاجن تورللى باللحمة", en_name: "Meat Turlly Casserole With Meat", description: "", price: "180.00"},
        {id: "fish16", name: "طاجن بسلة باللحمة", en_name: "Pea Casserole With Meat", description: "", price: "180.00"},
        {id: "fish17", name: "طاجن بامية باللحمة", en_name: "Okra Casserole With Meat", description: "", price: "190.00"},
        {id: "fish18", name: "طاجن كاليمارى", en_name: "Calamari Tajine", description: "", price: "300.00"},
        {id: "fish19", name: "طاجن جمبرى", en_name: "Shrimp Tajine", description: "", price: "360.00"},
        {id: "fish20", name: "طاجن ميكس سى فوود", en_name: "Mix Seafood Tajine", description: "", price: "380.00"}
      ]
    },
    {
      id: "sandwiches-pizza",
      name: "الساندويتشات والبيتزا",
      en_name: "Sandwiches & Pizza",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1998",
      items: [
        {id: "sandwich1", name: "كبده اسكندرانى", en_name: "Alexandrian liver", description: "", price: "60.00"},
        {id: "sandwich2", name: "سجق", en_name: "Sausage", description: "", price: "60.00"},
        {id: "sandwich3", name: "هامبورجر", en_name: "Hamburger", description: "", price: "80.00"},
        {id: "sandwich4", name: "شيش طاووق", en_name: "Shish Tawook", description: "", price: "95.00"},
        {id: "sandwich5", name: "تشيكن فاهيتا", en_name: "Chicken fahita", description: "", price: "100.00"},
        {id: "sandwich6", name: "كفتة مشوية", en_name: "Grilled kofta", description: "", price: "95.00"},
        {id: "sandwich7", name: "تشيكن شاورما", en_name: "Chicken Shawarma", description: "", price: "100.00"},
        {id: "sandwich8", name: "فراخ بانيه", en_name: "Chicken pane", description: "", price: "100.00"},
        {id: "sandwich9", name: "تشيكن كرسبى", en_name: "Chicken crispy", description: "", price: "120.00"},
        {id: "sandwich10", name: "كليمارى", en_name: "Calamari", description: "", price: "155.00"},
        {id: "sandwich11", name: "جمبرى", en_name: "Shrimp", description: "", price: "170.00"},
        {id: "pizza1", name: "بيتزا مارجريتا", en_name: "Margarita", description: "", price: "140.00"},
        {id: "pizza2", name: "بيتزا خضروات", en_name: "Vegetables", description: "", price: "150.00"},
        {id: "pizza3", name: "بيتزا ميكس جبن", en_name: "Mix Cheese", description: "", price: "170.00"},
        {id: "pizza4", name: "بيتزا سجق", en_name: "Sausage", description: "", price: "200.00"},
        {id: "pizza5", name: "بيتزا ميكس لحوم", en_name: "Mix Meat", description: "", price: "220.00"},
        {id: "pizza6", name: "بيتزا فراخ باربيكيو", en_name: "BBQ Chicken", description: "", price: "230.00"},
        {id: "pizza7", name: "بيتزا بسطرمة", en_name: "Pastirma", description: "", price: "240.00"},
        {id: "pizza8", name: "بيتزا جمبرى", en_name: "Shrimp", description: "", price: "250.00"},
        {id: "pizza9", name: "بيتزا سى فوود", en_name: "Seafood", description: "", price: "300.00"}
      ]
    },
    {
      id: "desserts",
      name: "الحلويات",
      en_name: "Desserts",
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1974",
      items: [
        {id: "dessert1", name: "ارز باللبن سادة", en_name: "Plain Rice Milk", description: "", price: "35.00"},
        {id: "dessert2", name: "ارز باللبن ايس كريم", en_name: "Rice pudding ice cream", description: "", price: "50.00"},
        {id: "dessert3", name: "ارز باللبن بالمكسرات", en_name: "Rice with milk and nuts", description: "", price: "60.00"},
        {id: "dessert4", name: "ارز باللبن عسل ومكسرات", en_name: "Rice with milk, honey, and nuts", description: "", price: "65.00"},
        {id: "dessert5", name: "ارز باللبن ايس كريم ومكسرات", en_name: "Rice pudding ice cream with nuts", description: "", price: "65.00"},
        {id: "dessert6", name: "أم على", en_name: "Um Ali", description: "", price: "55.00"},
        {id: "dessert7", name: "أم على مكسرات", en_name: "Um Ali, nuts", description: "", price: "70.00"},
        {id: "dessert8", name: "أم على نوتيلا", en_name: "Um Ali Nutella", description: "", price: "75.00"},
        {id: "dessert9", name: "فروت سلاط", en_name: "Fruit Salad", description: "", price: "85.00"},
        {id: "dessert10", name: "فروت سلاط آيس كريم", en_name: "Fruit Salad Ice Cream", description: "", price: "95.00"},
        {id: "dessert11", name: "طبق فاكهة", en_name: "Fruit plate", description: "", price: "120.00"},
        {id: "dessert12", name: "وافل نوتيلا", en_name: "Waffle Nutella", description: "", price: "63.00"},
        {id: "dessert13", name: "وافل وايت شيكولاتة", en_name: "Waffle white chocolate", description: "", price: "68.00"},
        {id: "dessert14", name: "وافل كاراميل", en_name: "Waffle Caramel", description: "", price: "80.00"},
        {id: "dessert15", name: "وافل لوتس", en_name: "Waffle Lotus", description: "", price: "85.00"},
        {id: "dessert16", name: "وافل فورسيزون", en_name: "Waffle for season", description: "", price: "115.00"}
      ]
    },
    {
      id: "hot-drinks",
      name: "المشروبات الساخنة",
      en_name: "Hot Drinks",
      image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=2066",
      items: [
        {id: "hotdrink1", name: "أعشاب (بابونج - ينسون - كركديه)", en_name: "Herbs (Chamoomile - Anise - Hibiscus)", description: "", price: "35.00"},
        {id: "hotdrink2", name: "نعناع - جنزبيل - قرفة", en_name: "Mint - Ginger - Cinnamon", description: "", price: "35.00"},
        {id: "hotdrink3", name: "فيتامين سى (عسل - نعناع فريش)", en_name: "Vitamin C (Honey - Fresh Mint)", description: "", price: "45.00"},
        {id: "hotdrink4", name: "ليمون فريش - باكت ينسون - باكت نعناع", en_name: "Fresh Lemon - Anise Packet - Mint Packet", description: "", price: "45.00"},
        {id: "hotdrink5", name: "شاى ليبتون", en_name: "Lipton Tea", description: "", price: "40.00"},
        {id: "hotdrink6", name: "شاى ليبتون نعناع", en_name: "Lipton Tea With Mint", description: "", price: "45.00"},
        {id: "hotdrink7", name: "شاى زردة", en_name: "Zarda Tea", description: "", price: "45.00"},
        {id: "hotdrink8", name: "شاى ليبتون بالحليب", en_name: "Tea With Milk", description: "", price: "47.00"},
        {id: "hotdrink9", name: "قهوة تركى سنجل", en_name: "Turkish Coffee single", description: "", price: "45.00"},
        {id: "hotdrink10", name: "قهوة تركى دبل", en_name: "Turkish Coffee Double", description: "", price: "65.00"},
        {id: "hotdrink11", name: "قهوة تركى محوج", en_name: "Mixed Turkish Coffee Single", description: "", price: "50.00"},
        {id: "hotdrink12", name: "قهوة تركى محوج دبل", en_name: "Mixed Turkish Coffee Double", description: "", price: "70.00"}
      ]
    }
  ];
