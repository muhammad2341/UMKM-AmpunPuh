"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { Carousel } from "../components/Carousel.tsx";
import { ProductCard } from "../components/ProductCard";
import { categories, products, advertisementBanners } from "../data/dummy";

export const LandingPage: React.FC = () => {
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
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <button
            onClick={() => setSelectedCategory("")}
            className={`p-4 rounded-lg font-semibold transition text-center ${
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
              className={`p-4 rounded-lg font-semibold transition text-center ${
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
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Produk Terpopuler
          </h2>
          <Link
            to="/"
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-semibold transition"
          >
            <span>Lihat Semua</span>
            <ArrowRight size={20} />
          </Link>
        </div>

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

      {/* Footer CTA */}
      <section className="py-12 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-yellow-400 to-green-500 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ingin Berjualan?</h2>
          <p className="text-lg">
            Bergabunglah dengan ribuan UMKM yang sukses di platform kami
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-yellow-100 transition"
          >
            Daftar Sebagai Penjual
          </Link>
        </div>
      </section>
    </main>
  );
};
