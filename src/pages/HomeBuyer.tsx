"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Store as StoreIcon, Star, ArrowRight } from "lucide-react";
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

  // Load products from localStorage (seller additions) and merge with dummy data
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
    
    // Collect all seller products
    const sellerProducts: Product[] = [];
    Object.keys(savedProducts).forEach((storeId) => {
      sellerProducts.push(...savedProducts[storeId]);
    });

    // Merge with dummy products, prioritize seller products
    const mergedProducts = [...dummyProducts];
    sellerProducts.forEach((sellerProduct) => {
      const existingIndex = mergedProducts.findIndex((p) => p.id === sellerProduct.id);
      if (existingIndex >= 0) {
        // Update existing product
        mergedProducts[existingIndex] = sellerProduct;
      } else {
        // Add new product
        mergedProducts.push(sellerProduct);
      }
    });

    setAllProducts(mergedProducts);

    // Merge store edits from localStorage for up-to-date store info
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
    } else {
      setAllStores(stores);
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

  // Filter stores by selectedCategory and searchQuery as well
  const filteredStores = allStores.filter((store) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      store.name.toLowerCase().includes(q) ||
      (store.description || "").toLowerCase().includes(q) ||
      (store.address || "").toLowerCase().includes(q);
    const matchesCategory =
      selectedCategory === "" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset expansion when filters change
  useEffect(() => {
    setShowAllStores(false);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Carousel (same as LandingPage) */}
      <section className="py-6 px-4 md:px-8 lg:px-12">
        <Carousel items={advertisementBanners} />
      </section>

          

      {/* Search Bar + Maps Button */}
      <section className="py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari produk atau toko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 text-gray-700"
            />
          </div>
          <Link
            to="/maps"
            className="inline-flex items-center justify-center gap-3 px-7 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-2xl hover:shadow-xl transition whitespace-nowrap text-lg"
          >
            <MapPin size={22} />
            <span>Lihat Semua Toko di Peta</span>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Kategori Produk
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory("")}
            className={`p-4 rounded-lg font-semibold transition text-center whitespace-nowrap ${
              selectedCategory === ""
                ? "bg-gradient-to-r from-yellow-400 to-green-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
            }`}
          >
            <div className="text-3xl mb-1">🏠</div>
            <span className="text-xs md:text-sm">Semua</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-4 rounded-lg font-semibold transition text-center whitespace-nowrap ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-yellow-400 to-green-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200"
              }`}
            >
              <div className="text-3xl mb-1">{cat.icon}</div>
              <span className="text-xs md:text-sm">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Produk untuk Anda
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Produk tidak ditemukan</p>
          </div>
        )}
      </section>

      {/* Featured Stores Section (di bawah list produk) */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <StoreIcon className="text-green-600" size={28} />
              Toko Pilihan
            </h2>
          </div>

          {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(showAllStores ? filteredStores : filteredStores.slice(0, 8)).map((store) => (
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <div className="relative overflow-hidden bg-gray-100 h-40">
                  <img
                    src={store.image || "/placeholder-store.svg"}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {store.category && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {store.category}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    {store.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {store.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < Math.floor(store.rating)
                                ? "fill-current"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-semibold">
                        {store.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {store.products?.length || 0} Produk
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Toko tidak ditemukan</div>
          )}

          {/* Lihat lainnya button at bottom */}
          {!showAllStores && filteredStores.length > 8 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAllStores(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition"
              >
                Lihat lainnya
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
