import type { Product, Store, Category } from "../types/index";

export const categories: Category[] = [
  { id: "1", name: "Makanan", icon: "🍲", color: "from-orange-400 to-red-500" },
  { id: "2", name: "Minuman", icon: "🥤", color: "from-blue-400 to-cyan-500" },
  { id: "3", name: "Fashion", icon: "👔", color: "from-pink-400 to-rose-500" },
  {
    id: "4",
    name: "Kerajinan",
    icon: "🎨",
    color: "from-purple-400 to-indigo-500",
  },
  {
    id: "5",
    name: "Aksesoris",
    icon: "💎",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "6",
    name: "Kecantikan",
    icon: "💄",
    color: "from-rose-400 to-pink-500",
  },
];

export const stores: Store[] = [
  {
    id: "1",
    name: "Warung Soto Ayam Pak Hendra",
    image: "/warung-makanan-tradisional.jpg",
    description:
      "Soto ayam tradisional dengan resep turun temurun sejak 1990. Menggunakan bahan-bahan pilihan terbaik.",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    whatsapp: "+62812345678",
    mapUrl: "https://maps.google.com/maps?q=-6.2088,106.8456",
    rating: 4.8,
    products: [],
  },
  {
    id: "2",
    name: "Kedai Kopi Artisan",
    image: "/kedai-kopi-modern.jpg",
    description:
      "Kopi specialty dengan biji pilihan dari berbagai daerah di Indonesia.",
    address: "Jl. Sudirman No. 456, Jakarta Selatan",
    whatsapp: "+62812345679",
    mapUrl: "https://maps.google.com/maps?q=-6.2235,106.8008",
    rating: 4.7,
    products: [],
  },
  {
    id: "3",
    name: "Batik Nusantara",
    image: "/batik-tradisional.jpg",
    description: "Kain batik tulis asli dengan motif tradisional yang indah.",
    address: "Jl. Gatot Subroto No. 789, Jakarta Pusat",
    whatsapp: "+62812345680",
    mapUrl: "https://maps.google.com/maps?q=-6.2267,106.8255",
    rating: 4.9,
    products: [],
  },
  {
    id: "4",
    name: "Kerajinan Kulit Suparta",
    image: "/kerajinan-kulit.jpg",
    description:
      "Tas dan dompet kulit asli buatan tangan dengan kualitas premium.",
    address: "Jl. Ahmad Yani No. 234, Bandung",
    whatsapp: "+62812345681",
    mapUrl: "https://maps.google.com/maps?q=-6.9271,107.6411",
    rating: 4.6,
    products: [],
  },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Soto Ayam Tradisional",
    category: "Makanan",
    price: 25000,
    originalPrice: 30000,
    image: "/soto-ayam-masakan-tradisional.jpg",
    rating: 4.8,
    reviews: 245,
    storeId: "1",
    storeName: "Warung Soto Ayam Pak Hendra",
    description:
      "Soto ayam dengan kuah kunyit gurih, daging ayam lembut, dan potongan telur. Dibuat dengan resep rahasia keluarga.",
    ingredients: ["Ayam", "Kunyit", "Kemiri", "Rempah", "Telur", "Nasi Putih"],
  },
  {
    id: "2",
    name: "Kopi Specialty Single Origin",
    category: "Minuman",
    price: 45000,
    image: "/kopi-specialty-premium.jpg",
    rating: 4.9,
    reviews: 312,
    storeId: "2",
    storeName: "Kedai Kopi Artisan",
    description:
      "Kopi specialty dari daerah Toraja dengan rasa notes cokelat dan karamel. Dipanggang fresh setiap hari.",
    ingredients: ["Biji Kopi Toraja", "Air Mineral"],
  },
  {
    id: "3",
    name: "Batik Tulis Mega Mendung",
    category: "Fashion",
    price: 150000,
    originalPrice: 200000,
    image: "/batik-tulis-mega-mendung.jpg",
    rating: 4.7,
    reviews: 89,
    storeId: "3",
    storeName: "Batik Nusantara",
    description:
      "Kain batik tulis dengan motif mega mendung klasik. 100% katun murni dengan pewarna alami.",
  },
  {
    id: "4",
    name: "Tas Tangan Kulit Asli",
    category: "Aksesoris",
    price: 250000,
    image: "/tas-kulit-asli-premium.jpg",
    rating: 4.6,
    reviews: 156,
    storeId: "4",
    storeName: "Kerajinan Kulit Suparta",
    description:
      "Tas tangan dari kulit asli pilihan, dijahit tangan dengan detail sempurna. Tahan lama dan elegan.",
  },
  {
    id: "5",
    name: "Gado-Gado Lezat",
    category: "Makanan",
    price: 20000,
    image: "/gado-gado-makanan-tradisional.jpg",
    rating: 4.8,
    reviews: 187,
    storeId: "1",
    storeName: "Warung Soto Ayam Pak Hendra",
    description:
      "Gado-gado dengan sambal kacang kental dan lezat, tahu goreng, telur rebus, dan sayuran segar.",
    ingredients: ["Sayuran", "Tahu", "Telur", "Kacang", "Bumbu Gado-gado"],
  },
  {
    id: "6",
    name: "Teh Herbal Organik",
    category: "Minuman",
    price: 35000,
    image: "/teh-herbal-organik.jpg",
    rating: 4.5,
    reviews: 134,
    storeId: "2",
    storeName: "Kedai Kopi Artisan",
    description:
      "Teh herbal tanpa kafein dari tanaman organik pilihan. Cocok untuk detoks dan kesehatan.",
  },
  {
    id: "7",
    name: "Kemeja Batik Modern",
    category: "Fashion",
    price: 120000,
    originalPrice: 150000,
    image: "/kemeja-batik-modern.jpg",
    rating: 4.6,
    reviews: 203,
    storeId: "3",
    storeName: "Batik Nusantara",
    description:
      "Kemeja batik dengan desain modern yang cocok untuk acara kasual maupun formal.",
  },
  {
    id: "8",
    name: "Dompet Lipat Kulit",
    category: "Aksesoris",
    price: 85000,
    image: "/dompet-kulit-lipat.jpg",
    rating: 4.7,
    reviews: 98,
    storeId: "4",
    storeName: "Kerajinan Kulit Suparta",
    description:
      "Dompet lipat dari kulit premium dengan banyak kompartemen untuk kartu dan uang.",
  },
];

// Assign products to stores
stores[0].products = products.filter((p) => p.storeId === "1");
stores[1].products = products.filter((p) => p.storeId === "2");
stores[2].products = products.filter((p) => p.storeId === "3");
stores[3].products = products.filter((p) => p.storeId === "4");

export const advertisementBanners = [
  {
    id: "1",
    title: "Diskon Hingga 50%",
    subtitle: "Untuk Produk Pilihan UMKM",
    image: "/banner-promosi-diskon.jpg",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "2",
    title: "Produk Terbaru",
    subtitle: "Jelajahi koleksi eksklusif dari pengrajin lokal",
    image: "/banner-produk-baru-koleksi.jpg",
    color: "from-green-400 to-emerald-600",
  },
  {
    id: "3",
    title: "Gratis Ongkir",
    subtitle: "Untuk pembelian di atas Rp 100.000",
    image: "/banner-gratis-ongkos-kirim.jpg",
    color: "from-blue-400 to-cyan-500",
  },
];
