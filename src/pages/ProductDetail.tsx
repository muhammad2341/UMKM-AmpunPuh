"use client";

import type React from "react";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  Star,
  ChevronLeft,
} from "lucide-react";
import { products } from "../data/dummy";

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Produk tidak ditemukan</p>
          <Link
            to="/"
            className="text-green-600 font-semibold hover:text-green-700"
          >
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-96 md:h-full flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Info */}
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-100 rounded-lg cursor-pointer hover:border-2 hover:border-green-500 transition"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">{product.storeName}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} ulasan)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-green-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rp {product.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg font-bold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Bahan-bahan</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold text-gray-700">Jumlah:</span>
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 rounded-lg hover:border-red-500 transition font-semibold text-gray-700 hover:text-red-500"
              >
                <Heart
                  size={20}
                  className={isFavorite ? "fill-current text-red-500" : ""}
                />
                <span>{isFavorite ? "Hapus Favorit" : "Tambah Favorit"}</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-yellow-400 to-green-500 text-white rounded-lg hover:shadow-lg transition font-semibold">
                <ShoppingCart size={20} />
                <span>Keranjang</span>
              </button>
            </div>

            {/* Store Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-xl border-2 border-yellow-200">
              <h3 className="font-bold text-gray-900 mb-4">Informasi Toko</h3>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  {product.storeName}
                </p>
                <div className="flex items-start space-x-2">
                  <MapPin
                    size={20}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-600 text-sm">
                    Jl. Merdeka No. 123, Jakarta Pusat
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone
                    size={20}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-600 text-sm">+62 812 345 678</p>
                </div>
                <Link
                  to={`/store/${product.storeId}`}
                  className="block text-center mt-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Lihat Toko
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
