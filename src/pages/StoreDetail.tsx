"use client";

import type React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, Star, ChevronLeft, Globe } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { stores, products } from "../data/dummy";

export const StoreDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const store = stores.find((s) => s.id === id);

  if (!store) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Toko tidak ditemukan</p>
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

  const storeProducts = products.filter((p) => p.storeId === store.id);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>
      </div>

      {/* Store Header */}
      <section className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store Image */}
            <div className="md:col-span-1">
              <img
                src={store.image || "/placeholder.svg"}
                alt={store.name}
                className="w-full h-64 object-cover rounded-xl shadow-lg"
              />
            </div>

            {/* Store Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {store.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(store.rating)
                            ? "fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 font-semibold">
                    {store.rating} Rating
                  </span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {store.description}
              </p>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <div className="flex items-center space-x-3">
                  <MapPin className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="text-gray-900 font-semibold">
                      {store.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="text-green-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <a
                      href={`https://wa.me/${store.whatsapp.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 font-semibold hover:text-green-700"
                    >
                      {store.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="text-blue-600 flex-shrink-0" size={24} />
                  <div>
                    <p className="text-sm text-gray-500">Lokasi Map</p>
                    <a
                      href={store.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Buka di Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Produk dari {store.name}
        </h2>

        {storeProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 text-lg">
              Belum ada produk dari toko ini
            </p>
          </div>
        )}
      </section>
    </main>
  );
};
