"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Phone } from "lucide-react";
import type { Product } from "../types/index";
import { stores } from "../data/dummy";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useCart();
  const favorite = isFavorite(product.id);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    const store = stores.find((s) => s.id === product.storeId);
    const rawNumber = store?.whatsapp || "";
    const phone = rawNumber.replace(/[^0-9]/g, "");
    const msg = `Halo, saya ingin pesan ${product.name} (1 pcs) dari toko ${store?.name}. Apakah tersedia?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setTimeout(() => setIsProcessing(false), 400);
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
        >
          <Heart
            size={20}
            className={
              favorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 h-14">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{product.storeName}</p>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-green-600">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rp {product.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.floor(product.rating)
                    ? "fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Stock Info */}
        {product.category === "Makanan" || product.category === "Minuman" ? (
          <div className="flex items-center gap-2">
            {product.isAvailable ? (
              <span className="text-sm font-bold text-green-600">✓ Tersedia</span>
            ) : (
              <span className="text-sm font-bold text-red-600">✗ Tidak Tersedia</span>
            )}
          </div>
        ) : (
          product.stock !== undefined && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Stock:</span>{" "}
              <span className={product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {product.stock > 0 ? `${product.stock} tersisa` : "Habis"}
              </span>
            </div>
          )
        )}

        {/* Link Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/product/${product.id}`}
            className="col-span-2 block w-full text-center py-2 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
          >
            Lihat Detail
          </Link>

          {/* Order via WhatsApp */}
          <button
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm"
            disabled={isProcessing}
          >
            <Phone size={16} />
            <span>WhatsApp</span>
          </button>

          <Link
            to={`/maps?storeId=${encodeURIComponent(product.storeId)}`}
            className="flex items-center justify-center py-2 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition text-sm"
          >
            Lokasi
          </Link>
        </div>
      </div>

      {/* No cart modal for WhatsApp flow */}
    </div>
  );
};
