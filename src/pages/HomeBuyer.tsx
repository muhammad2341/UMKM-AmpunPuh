import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Store as StoreIcon, Star, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Carousel } from "../components/Carousel";
import { ProductCard } from "../components/ProductCard";
import { categories, products as dummyProducts, advertisementBanners, stores } from "../data/dummy";
import type { Product, Store } from "../types";

export const HomeBuyer: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>(dummyProducts);
  const [allStores, setAllStores] = useState<Store[]>(stores);
  const [showAllStores, setShowAllStores] = useState(false);

  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
    const sellerProducts: Product[] = [];
    Object.keys(savedProducts).forEach((storeId) => {
      sellerProducts.push(...savedProducts[storeId]);
    });

    const mergedProducts = [...dummyProducts];
    sellerProducts.forEach((sellerProduct) => {
      const existingIndex = mergedProducts.findIndex((p) => p.id === sellerProduct.id);
      if (existingIndex >= 0) {
        mergedProducts[existingIndex] = sellerProduct;
      } else {
        mergedProducts.push(sellerProduct);
      }
    });

    setAllProducts(mergedProducts);

    const savedStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
    if (savedStores && typeof savedStores === "object") {
      const mergedStores = [...stores];
      Object.keys(savedStores).forEach((storeId) => {
        const idx = mergedStores.findIndex((s) => s.id === storeId);
        if (idx !== -1) {
          mergedStores[idx] = { ...mergedStores[idx], ...savedStores[storeId] };
        }
      });
      setAllStores(mergedStores);
    }
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

  return (
    <main className="min-h-screen pt-24">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Carousel Section */}
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
              <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black gradient-text flex items-center gap-3">
              <StoreIcon className="w-8 h-8 text-purple-500" />
              Toko Pilihan
            </h2>
          </div>

          {filteredStores.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(showAllStores ? filteredStores : filteredStores.slice(0, 8)).map((store, idx) => (
                  <Link
                    key={store.id}
                    to={`/store/${store.id}`}
                    className="card-futuristic overflow-hidden animate-scale-in"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="relative overflow-hidden h-48 bg-gradient-to-br from-slate-100 to-slate-50">
                      <div className="absolute inset-0 grid-background opacity-20"></div>
                      <img
                        src={store.image}
                        alt={store.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {store.category && (
                        <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full">
                          <span className="text-xs font-bold text-blue-600">{store.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-bold text-slate-800 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {store.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2">{store.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(store.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200"
                                }`}
                            />
                          ))}
                          <span className="text-sm font-bold text-slate-700 ml-1">{store.rating}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">
                          {store.products?.length || 0} Produk
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {!showAllStores && filteredStores.length > 8 && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setShowAllStores(true)}
                    className="inline-flex items-center gap-3 px-8 py-4 glass rounded-2xl font-bold text-slate-700 hover-lift hover-glow transition-all group"
                  >
                    <span>Lihat Semua Toko</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 glass rounded-3xl">
              <div className="text-6xl mb-4">🏪</div>
              <p className="text-slate-500 text-lg font-semibold">Toko tidak ditemukan</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};