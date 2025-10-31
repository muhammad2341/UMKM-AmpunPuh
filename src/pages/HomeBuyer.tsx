"use client";

import React from "react";
import { Search } from "lucide-react";
import { Carousel } from "../components/Carousel.tsx";
import { ProductCard } from "../components/ProductCard";
import { categories, products, advertisementBanners } from "../data/dummy";

export const HomeBuyer: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Carousel */}
      <section className="py-6 px-4 md:px-8 lg:px-12">
        <Carousel items={advertisementBanners} />
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="relative">
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
            <div className="text-2xl mb-1">🏠</div>
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
              <div className="text-2xl mb-1">{cat.icon}</div>
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
    </main>
  );
};
