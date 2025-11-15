import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Store as StoreIcon, Star, ArrowRight, Sparkles, Zap, Loader2 } from "lucide-react";
import { Carousel } from "../components/Carousel";
import { ProductCard } from "../components/ProductCard";
import { StoreCard } from "../components/StoreCard";
import { categories, advertisementBanners } from "../data/dummy";
import type { Product, Store } from "../types";
import { supabase } from "../supabaseClient";

export const HomeBuyer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [showAllStores, setShowAllStores] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          stores ( name )
        `);

      if (productsError) {
        console.error('Error fetching products:', productsError.message);
      } else if (productsData) {
        const mappedProducts = productsData.map((p: any) => {
          const { stores, ...rest } = p;
          return {
            ...rest,
            storeName: stores ? stores.name : 'Toko Tidak Ditemukan',
          };
        });
        setAllProducts(mappedProducts as Product[]);
      }

      // 2. Ambil semua toko
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*');

      if (storesError) {
        console.error('Error fetching stores:', storesError.message);
      } else if (storesData) {
        setAllStores(storesData as Store[]);
      }

      setIsLoading(false);
    }

    fetchData();
  }, []);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredStores = allStores.filter((store) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      store.name.toLowerCase().includes(q) ||
      (store.description || "").toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === "" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setShowAllStores(false);
  }, [selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 flex flex-col justify-center items-center">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          Memuat data UMKM...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        {/* eslint-disable-next-line webhint/no-inline-styles */}
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>        {/* Carousel Section */}
        <section className="relative py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <Carousel items={advertisementBanners} />
        </section>

        {/* Search & Maps Section */}
        <section className="relative py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar with Futuristic Design */}
            <div className="relative flex-1 w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative glass rounded-2xl overflow-hidden">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari produk atau toko..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none font-semibold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Maps Button */}
            <Link
              to="/maps"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover-lift hover-glow transition-all duration-300 group whitespace-nowrap"
            >
              <MapPin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Peta Toko</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="relative py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-black gradient-text flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-500" />
              Kategori Produk
            </h2>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory("")}
              className={`group relative p-6 rounded-2xl transition-all duration-300 ${selectedCategory === ""
                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-105 hover-glow"
                : "glass hover:scale-105"
                }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`text-4xl transform group-hover:scale-110 transition-transform ${selectedCategory === "" ? "animate-pulse" : ""
                  }`}>
                  🏠
                </div>
                <span className={`text-xs md:text-sm font-bold ${selectedCategory === "" ? "text-white" : "text-slate-700"
                  }`}>
                  Semua
                </span>
              </div>
            </button>

            {/* Category Buttons */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 ${selectedCategory === cat.name
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-105 hover-glow"
                  : "glass hover:scale-105"
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all ${selectedCategory === cat.name ? "animate-pulse" : ""
                    }`}>
                    {cat.icon}
                  </div>
                  <span className={`text-xs md:text-sm font-bold ${selectedCategory === cat.name ? "text-white" : "text-slate-700"
                    }`}>
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Products Section */}
        <section className="relative py-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black gradient-text">Produk untuk Anda</h2>
            {filteredProducts.length > 0 && (
              <span className="glass px-4 py-2 rounded-full text-sm font-bold text-slate-600">
                {filteredProducts.length} produk
              </span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <div key={product.id} className="animate-scale-in"
                  // eslint-disable-next-line webhint/no-inline-styles
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-500 text-lg font-semibold">Produk tidak ditemukan</p>
            </div>
          )}
        </section>

        {/* Featured Stores Section */}
        <section className="relative py-12 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
            {/* Section Header dengan Dekorasi */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                    <StoreIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black gradient-text">Toko Pilihan</h2>
                  <p className="text-slate-600">Jelajahi UMKM terbaik di sekitar Anda</p>
                </div>
              </div>

              {filteredStores.length > 8 && !showAllStores && (
                <button
                  onClick={() => setShowAllStores(true)}
                  className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold hover-lift hover-glow transition-all duration-300 group"
                >
                  <span>Lihat Semua</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              )}
            </div>

            {filteredStores.length > 0 ? (
              <>
                {/* Store Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(showAllStores ? filteredStores : filteredStores.slice(0, 8)).map((store, idx) => (
                    <StoreCard key={store.id} store={store} index={idx} />
                  ))}
                </div>

                {/* Show All Button - Mobile */}
                {!showAllStores && filteredStores.length > 8 && (
                  <div className="mt-10 flex justify-center md:hidden">
                    <button
                      onClick={() => setShowAllStores(true)}
                      className="inline-flex items-center gap-3 px-8 py-4 glass rounded-2xl font-bold text-slate-700 hover-lift hover-glow transition-all group"
                    >
                      <span>Lihat Semua Toko</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                )}

                {/* Stats Bar */}
                <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-blue-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {filteredStores.length}+
                      </p>
                      <p className="text-sm font-semibold text-slate-600 mt-1">Toko Terdaftar</p>
                    </div>
                    <div>
                      <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {allProducts.length}+
                      </p>
                      <p className="text-sm font-semibold text-slate-600 mt-1">Produk Tersedia</p>
                    </div>
                    <div>
                      <p className="text-4xl font-black bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                        4.8⭐
                      </p>
                      <p className="text-sm font-semibold text-slate-600 mt-1">Rating Rata-rata</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 glass rounded-3xl">
                <div className="text-6xl mb-4">🏪</div>
                <p className="text-slate-500 text-lg font-semibold">Toko tidak ditemukan</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};