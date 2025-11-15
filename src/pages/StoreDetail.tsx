"use client";

import type React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Phone, Star, ChevronLeft, Globe, Map, Navigation, MessageSquare, Send } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { stores as dummyStores, products as dummyProducts } from "../data/dummy";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import type { Product, Store } from "../types";

export const StoreDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [store, setStore] = useState<Store | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
    response?: string;
  }>>([
    {
      id: "1",
      userName: "Budi Santoso",
      rating: 5,
      comment: "Pelayanan sangat baik dan produknya berkualitas!",
      date: "2024-11-10",
    },
    {
      id: "2",
      userName: "Siti Aminah",
      rating: 4,
      comment: "Harga terjangkau, cuma pengiriman agak lama.",
      date: "2024-11-08",
      response: "Terima kasih atas reviewnya! Kami akan tingkatkan layanan pengiriman.",
    },
  ]);

  // Load store and products from localStorage or dummy data
  useEffect(() => {
    // Load store
    const savedStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
    const foundStore = savedStores[id || ""] || dummyStores.find((s) => s.id === id);
    setStore(foundStore || null);

    // Load products
    const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
    const sellerProducts: Product[] = [];
    Object.keys(savedProducts).forEach((storeId) => {
      sellerProducts.push(...savedProducts[storeId]);
    });

    // Merge with dummy products
    const allProducts = [...dummyProducts];
    sellerProducts.forEach((sellerProduct) => {
      const existingIndex = allProducts.findIndex((p) => p.id === sellerProduct.id);
      if (existingIndex >= 0) {
        allProducts[existingIndex] = sellerProduct;
      } else {
        allProducts.push(sellerProduct);
      }
    });

    const products = allProducts.filter((p) => p.storeId === id);
    setStoreProducts(products);
  }, [id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Silakan login terlebih dahulu untuk memberikan review");
      navigate("/login");
      return;
    }
    
    const newReview = {
      id: Date.now().toString(),
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };
    
    setReviews([newReview, ...reviews]);
    setRating(5);
    setComment("");
    alert("Review berhasil ditambahkan!");
  };

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

  // Extract lat/lng from mapUrl if present
  let lat: string | null = null;
  let lng: string | null = null;
  if (typeof store.lat === "number" && typeof store.lng === "number") {
    lat = String(store.lat);
    lng = String(store.lng);
  } else if (store.mapUrl) {
    const qIndex = store.mapUrl.indexOf("q=");
    if (qIndex !== -1) {
      const q = store.mapUrl.substring(qIndex + 2);
      const [latStr, lngStr] = q.split(",");
      if (latStr && lngStr) {
        lat = latStr;
        lng = lngStr;
      }
    }
  }

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
                <div className="flex gap-3 flex-wrap">
                  <Link
                    to={lat && lng
                      ? `/maps?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&storeId=${encodeURIComponent(store.id)}&label=${encodeURIComponent(store.name)}`
                      : `/maps?storeId=${encodeURIComponent(store.id)}&q=${encodeURIComponent(store.name)}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    <Map size={18} />
                    <span>Lihat di Halaman Maps</span>
                  </Link>
                  
                  {lat && lng && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
                    >
                      <Navigation size={18} />
                      <span>Temukan Rute Lokasi</span>
                    </a>
                  )}
                </div>
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

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <MessageSquare className="text-green-600" size={32} />
            User Review
          </h2>

          {/* Review Form */}
          <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Berikan Review Anda
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-semibold text-gray-700">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Komentar
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tulis pengalaman Anda dengan toko ini..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
              >
                <Send size={20} />
                <span>Kirim Review</span>
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Review Pelanggan ({reviews.length})
            </h3>
            
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">
                        {review.userName}
                      </h4>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-1 font-semibold text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* Seller Response */}
                  {review.response && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">
                        Respon Penjual:
                      </p>
                      <p className="text-gray-700">{review.response}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Belum ada review untuk toko ini.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};
