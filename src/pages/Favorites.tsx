import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ProductCard } from "../components/ProductCard";

export const Favorites: React.FC = () => {
  const { favorites, removeFromFavorites } = useCart();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Belum Ada Favorit
          </h2>
          <p className="text-gray-600 mb-6">
            Tambahkan produk favorit Anda dengan klik ikon hati ❤️
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Jelajahi Produk
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={32} />
            Produk Favorit Saya
          </h1>
          <p className="text-gray-600 mt-2">
            {favorites.length} produk yang Anda sukai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
};
