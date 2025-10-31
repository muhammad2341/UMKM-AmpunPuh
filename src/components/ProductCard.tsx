"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import type { Product } from "../types/index";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
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
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition"
        >
          <Heart
            size={20}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
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

        {/* Link Button */}
        <Link
          to={`/product/${product.id}`}
          className="block w-full text-center mt-2 py-2 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
};
