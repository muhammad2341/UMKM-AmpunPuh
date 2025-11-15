import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, MapPin, Shield, Zap, Users, Star } from "lucide-react";

export const LandingPage: React.FC = () => {
  const screenshotUrls = useMemo(
    () => [
      "/screenshots/home.png",
      "/screenshots/products.png",
      "/screenshots/store.png",
      "/screenshots/maps.png",
      "/screenshots/detail.png",
      "/screenshots/review.png",
      "/screenshots/promo.png",
      "/screenshots/favorites.png",
      "/screenshots/seller-dashboard.png",
    ],
    []
  );

  const [loaded, setLoaded] = useState<boolean[]>(Array(9).fill(true));

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[700px] bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 overflow-hidden pt-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white space-y-6 z-10">
              <div className="inline-block">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-2 drop-shadow-lg" style={{ letterSpacing: "-0.02em" }}>
                  Selamat Datang
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg" style={{ letterSpacing: "-0.02em" }}>
                  Di <span className="text-yellow-300">Laris Manis</span>
                </h2>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg drop-shadow">
                Platform marketplace UMKM lokal. Temukan makanan, fashion, kecantikan, dan kerajinan dari pelaku UMKM di sekitar Anda—lebih dekat, cepat, dan terpercaya.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/home"
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-yellow-300 hover:text-purple-700 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Mulai Belanja
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-purple-600/30 backdrop-blur-sm text-white font-bold rounded-full hover:bg-purple-600/50 transition-all border-2 border-white/50"
                >
                  Masuk / Daftar
                </Link>
              </div>

              <div className="flex gap-8 pt-6">
                <div>
                  <p className="text-3xl font-bold text-yellow-300">500+</p>
                  <p className="text-sm text-white/80">Produk UMKM</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-300">100+</p>
                  <p className="text-sm text-white/80">Toko Terdaftar</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-300">4.9/5</p>
                  <p className="text-sm text-white/80">Rata-rata Rating</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="grid grid-cols-3 gap-1 p-2 h-full overflow-hidden">
                    {screenshotUrls.map((src, idx) => (
                      <div
                        key={src}
                        className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center"
                      >
                        <img
                          src={src}
                          alt={`Screenshot ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => {
                            const next = [...loaded];
                            next[idx] = false;
                            setLoaded(next);
                          }}
                          style={{ display: loaded[idx] ? "block" : "none" }}
                        />
                        {!loaded[idx] && (
                          <span className="text-[10px] font-bold text-white drop-shadow">Preview</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
              </div>

              <div className="absolute -top-4 -right-4 bg-yellow-400 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce">
                🔥 Trending
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                ⭐ 4.9 Rating
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Kenapa Pilih <span className="text-purple-600">Laris Manis</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Platform marketplace yang dirancang khusus untuk mendukung UMKM lokal dengan fitur lengkap dan mudah digunakan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Produk Beragam</h3>
            <p className="text-gray-600">
              500+ produk UMKM dari berbagai kategori: makanan, fashion, kecantikan, kerajinan, dan toserba
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
              <MapPin className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Peta Lokasi</h3>
            <p className="text-gray-600">
              Temukan toko UMKM terdekat dengan fitur peta interaktif dan navigasi langsung ke lokasi
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Aman & Terpercaya</h3>
            <p className="text-gray-600">
              Setiap penjual terverifikasi dan pembeli dapat memberikan review untuk menjaga kualitas layanan
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Transaksi Cepat</h3>
            <p className="text-gray-600">
              Langsung hubungi penjual via WhatsApp untuk negosiasi harga dan pemesanan yang lebih personal
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cara Belanja di <span className="text-purple-600">Laris Manis</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hanya 4 langkah mudah untuk mendapatkan produk UMKM berkualitas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cari Produk</h3>
              <p className="text-gray-600">
                Gunakan fitur pencarian atau filter kategori untuk menemukan produk yang Anda inginkan
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lihat Detail</h3>
              <p className="text-gray-600">
                Baca deskripsi produk, informasi nutrisi (untuk makanan), dan review dari pembeli lain
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hubungi Penjual</h3>
              <p className="text-gray-600">
                Klik tombol WhatsApp untuk langsung chat dengan penjual dan tanyakan ketersediaan stok
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Selesai!</h3>
              <p className="text-gray-600">
                Lakukan pembayaran dan pengambilan sesuai kesepakatan dengan penjual. Jangan lupa kasih review!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="flex items-center justify-center mb-4">
                <Users size={48} />
              </div>
              <p className="text-5xl font-bold mb-2">1000+</p>
              <p className="text-xl text-white/90">Pembeli Aktif</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <ShoppingBag size={48} />
              </div>
              <p className="text-5xl font-bold mb-2">500+</p>
              <p className="text-xl text-white/90">Produk Tersedia</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <MapPin size={48} />
              </div>
              <p className="text-5xl font-bold mb-2">100+</p>
              <p className="text-xl text-white/90">Toko UMKM</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-4">
                <Star size={48} />
              </div>
              <p className="text-5xl font-bold mb-2">4.9/5</p>
              <p className="text-xl text-white/90">Rating Kepuasan</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Siap Dukung UMKM Lokal?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pembeli yang sudah mendukung produk UMKM berkualitas di sekitar mereka
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="px-10 py-5 bg-white text-orange-600 font-bold text-lg rounded-full hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Daftar Sekarang Gratis!
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-purple-600 text-white font-bold text-lg rounded-full hover:bg-purple-700 transition-all shadow-xl border-2 border-white"
            >
              Sudah Punya Akun? Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="text-3xl">🏪</div>
            <span className="text-2xl font-bold">Laris Manis</span>
          </div>
          <p className="text-gray-400 mb-4">
            Platform Marketplace UMKM Lokal Indonesia
          </p>
          <p className="text-gray-500 text-sm">
            © 2025 Laris Manis. Mendukung UMKM untuk Indonesia Lebih Maju.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
