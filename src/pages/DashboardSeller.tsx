"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// BARU: Tambahkan Loader2
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  MapPin,
  Phone,
  Tag,
  Package,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Star,
  Send,
  Loader2,
} from "lucide-react";
import type { Product, Store } from "../types";
import { useAuth } from "../contexts/AuthContext"; // Ini adalah AuthContext baru
import { supabase } from "../supabaseClient"; // BARU: Impor Supabase
// DIHAPUS: dummyStores dan dummyProducts tidak lagi digunakan

export const DashboardSeller: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "store" | "reviews">(
    "overview"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [storeData, setStoreData] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // BARU

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
    stock: "",
  });

  const [editStoreForm, setEditStoreForm] = useState({
    name: "",
    description: "",
    address: "",
    whatsapp: "",
    category: "",
    openingTime: "",
    closingTime: "",
  });

  // Dummy reviews data (in real app, fetch from backend)
  const [reviews, setReviews] = useState([
    { id: "1", customerName: "Budi Santoso", rating: 5, comment: "Produk sangat bagus, pengiriman cepat!", date: "2024-11-10", response: "" },
    { id: "2", customerName: "Siti Aminah", rating: 4, comment: "Kualitas oke, harga terjangkau.", date: "2024-11-12", response: "Terima kasih atas reviewnya!" },
    { id: "3", customerName: "Ahmad Rizki", rating: 5, comment: "Pelayanan ramah, barang sesuai ekspektasi.", date: "2024-11-14", response: "" },
  ]);
  const [responseText, setResponseText] = useState<{ [key: string]: string }>({});

  // Dummy sales data for chart
  const salesData = [
    { month: "Jan", sales: 1200000 },
    { month: "Feb", sales: 1500000 },
    { month: "Mar", sales: 1100000 },
    { month: "Apr", sales: 1800000 },
    { month: "Mei", sales: 2200000 },
    { month: "Jun", sales: 1900000 },
  ];
  const maxSales = Math.max(...salesData.map(d => d.sales));

  // DIGANTI: Load store and products based on logged-in seller from Supabase
  useEffect(() => {
    async function loadSellerData() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      // 1. Ambil data toko (store) milik user yang sedang login
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('owner_id', user.id) // Cocokkan dengan ID user
        .single(); // Asumsi penjual hanya punya 1 toko

      if (storeError && storeError.code !== 'PGRST116') { // PGRST116 = baris tidak ditemukan
        console.error('Error fetching store:', storeError.message);
      } else if (storeData) {
        setStoreData(storeData as Store);

        // Isi form edit dengan data dari DB
        setEditStoreForm({
          name: storeData.name,
          description: storeData.description,
          address: storeData.address,
          whatsapp: storeData.whatsapp,
          category: storeData.category || "",
          openingTime: storeData.openingTime || "",
          closingTime: storeData.closingTime || "",
        });

        // 2. Ambil produk HANYA untuk toko ini
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id); // Cocokkan dengan ID toko

        if (productsError) {
          console.error('Error fetching products:', productsError.message);
        } else if (productsData) {
          setProducts(productsData as Product[]);
        }
      }

      setIsLoading(false);
    }

    loadSellerData();
  }, [user]); // Tetap bergantung pada 'user'

  // DIGANTI: Add or update product ke Supabase
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeData) {
      alert("Data toko tidak ditemukan");
      return;
    }

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }

    // Ubah string kosong menjadi null untuk Supabase
    const parseNumeric = (val: string) => val ? parseFloat(val) : null;
    const parseIntNumeric = (val: string) => val ? parseInt(val) : null;

    if (editingProduct) {
      // Update produk yang ada di Supabase
      const { data: updatedProduct, error } = await supabase
        .from('products')
        .update({
          name: newProduct.name,
          category: newProduct.category,
          price: parseNumeric(newProduct.price),
          original_price: parseNumeric(newProduct.originalPrice),
          image: newProduct.image || null,
          description: newProduct.description || null,
          stock: parseIntNumeric(newProduct.stock),
        })
        .eq('id', editingProduct.id) // Tentukan produk mana yang di-update
        .select()
        .single();

      if (error) {
        alert(`Gagal memperbarui produk: ${error.message}`);
      } else if (updatedProduct) {
        // Update state React secara lokal
        setProducts(products.map((p) => (p.id === editingProduct.id ? (updatedProduct as Product) : p)));
        setEditingProduct(null);
        setShowAddModal(false);
      }
    } else {
      // Tambah produk baru ke Supabase
      const { data: newProductData, error } = await supabase
        .from('products')
        .insert({
          name: newProduct.name,
          category: newProduct.category,
          price: parseNumeric(newProduct.price),
          original_price: parseNumeric(newProduct.originalPrice),
          image: newProduct.image || null,
          description: newProduct.description || null,
          stock: parseIntNumeric(newProduct.stock),
          store_id: storeData.id, // WAJIB: Tautkan ke ID toko
          storeName: storeData.name, // Denormalisasi nama toko
          rating: 0, // Default
          reviews: 0, // Default
        })
        .select()
        .single();

      if (error) {
        alert(`Gagal menambah produk: ${error.message}`);
      } else if (newProductData) {
        // Tambahkan produk baru ke state React secara lokal
        setProducts([...products, newProductData as Product]);
        setShowAddModal(false);
      }
    }

    // Reset form
    setNewProduct({
      name: "", category: "", price: "", originalPrice: "", image: "", description: "", stock: "",
    });
  };

  // DIGANTI: Hapus produk dari Supabase
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    // Hapus dari Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      alert(`Gagal menghapus produk: ${error.message}`);
    } else {
      // Hapus dari state React secara lokal
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      image: product.image,
      description: product.description,
      stock: product.stock?.toString() || "",
    });
    setShowAddModal(true);
  };

  // DIGANTI: Update info toko di Supabase
  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData) return;

    // Update data toko di Supabase
    const { data: updatedStore, error } = await supabase
      .from('stores')
      .update({
        name: editStoreForm.name,
        description: editStoreForm.description,
        address: editStoreForm.address,
        whatsapp: editStoreForm.whatsapp,
        category: editStoreForm.category || null,
        openingTime: editStoreForm.openingTime || null,
        closingTime: editStoreForm.closingTime || null,
      })
      .eq('id', storeData.id) // Tentukan toko mana yang di-update
      .select()
      .single();

    if (error) {
      alert(`Gagal memperbarui toko: ${error.message}`);
    } else if (updatedStore) {
      // Update state React secara lokal
      setStoreData(updatedStore as Store);
      setShowEditStoreModal(false);
    }
  };

  // DIHAPUS: Fungsi helper localStorage sudah tidak diperlukan lagi
  // const saveProductsToLocalStorage = ... (HAPUS)
  // const saveStoreToLocalStorage = ... (HAPUS)


  // BARU: Tambahkan UI untuk loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col justify-center items-center">
        <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
        <p className="text-xl font-semibold text-gray-700 mt-4">
          Memuat Dashboard...
        </p>
      </main>
    );
  }

  // BARU: Handle jika penjual belum punya toko
  if (!storeData && !isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col justify-center items-center text-center p-4">
        <Package className="w-20 h-20 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Toko Tidak Ditemukan</h1>
        <p className="text-lg text-gray-600 mt-2">
          Akun penjual Anda belum terhubung dengan toko manapun.
        </p>
        <p className="text-gray-500 mt-1">
          (Jika Anda baru mendaftar, toko default Anda mungkin sedang dibuat. Coba muat ulang.)
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold shadow transition"
            >
              <ChevronLeft size={20} />
              <span>Kembali</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg">Dashboard Penjual</h1>
          </div>
          <div className="text-lg md:text-xl font-semibold text-white/90 drop-shadow">Kelola toko & produk Anda</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${activeTab === "overview"
              ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${activeTab === "products"
              ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${activeTab === "reviews"
              ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            <MessageSquare size={16} className="inline mr-1" />
            Review
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${activeTab === "store"
              ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
              : "text-gray-600 hover:text-green-600"
              }`}
          >
            Info Toko
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-500">
                <div className="text-gray-500 text-sm font-semibold mb-2">Total Produk</div>
                <div className="text-5xl font-extrabold text-green-600 mb-1">{products.length}</div>
                <div className="text-xs text-gray-400">Produk aktif di toko Anda</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-500">
                <div className="text-gray-500 text-sm font-semibold mb-2">Penjualan (dummy)</div>
                <div className="text-5xl font-extrabold text-blue-600 mb-1">Rp 1.2jt</div>
                <div className="text-xs text-gray-400">Estimasi bulan ini</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-yellow-400">
                <div className="text-gray-500 text-sm font-semibold mb-2">Rating Toko</div>
                <div className="text-5xl font-extrabold text-yellow-500 mb-1">4.8 <span className="text-3xl">⭐</span></div>
                <div className="text-xs text-gray-400">Dari pembeli</div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Grafik Penjualan 6 Bulan Terakhir</h3>
              </div>
              <div className="space-y-4">
                {salesData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-semibold text-gray-600">{data.month}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-500"
                        style={{ width: `${(data.sales / maxSales) * 100}%` }}
                      >
                        <span className="text-white text-sm font-bold">
                          Rp {(data.sales / 1000000).toFixed(1)}jt
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} className="text-green-600" />
                <span>Trend penjualan meningkat 15% dari bulan lalu</span>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Kelola Produk
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    category: "",
                    price: "",
                    originalPrice: "",
                    image: "",
                    description: "",
                    stock: "",
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                <Plus size={20} />
                <span>Tambah Produk</span>
              </button>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                        >
                          <Trash2 size={16} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 text-lg mb-4">Belum ada produk</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  <Plus size={20} />
                  <span>Tambah Produk Pertama</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-green-600" size={28} />
                Review Pelanggan
              </h2>
              <div className="text-sm text-gray-500">
                Total {reviews.length} review
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{review.rating}/5</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{review.comment}</p>

                  {/* Seller Response */}
                  {review.response ? (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Respon Anda:</div>
                      <p className="text-gray-700">{review.response}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Balas Review:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tulis respon Anda..."
                          value={responseText[review.id] || ""}
                          onChange={(e) => setResponseText({ ...responseText, [review.id]: e.target.value })}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <button
                          onClick={() => {
                            if (responseText[review.id]?.trim()) {
                              setReviews(reviews.map(r =>
                                r.id === review.id ? { ...r, response: responseText[review.id] } : r
                              ));
                              setResponseText({ ...responseText, [review.id]: "" });
                              alert("Respon berhasil dikirim!");
                            }
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          <Send size={16} />
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Info Tab */}
        {activeTab === "store" && storeData && ( // Pastikan storeData ada
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Informasi Toko
              </h2>
              <button
                onClick={() => setShowEditStoreModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Edit2 size={20} />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={storeData.image || "/placeholder.svg"}
                  alt={storeData.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Nama Toko
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {storeData.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Deskripsi
                  </label>
                  <p className="text-gray-700 mt-1">{storeData.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <MapPin
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Alamat
                      </label>
                      <p className="text-gray-900">{storeData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        WhatsApp
                      </label>
                      <a
                        href={`https://wa.me/${storeData.whatsapp.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-semibold hover:text-green-700"
                      >
                        {storeData.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-green-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl font-bold hover:text-yellow-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Masukkan nama produk"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="productCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    id="productCategory"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Aksesoris">Aksesoris</option>
                    <option value="Kecantikan">Kecantikan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="Harga produk"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga Asli (Opsional - untuk diskon)
                </label>
                <input
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      originalPrice: e.target.value,
                    })
                  }
                  placeholder="Harga asli untuk menampilkan diskon"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
                {newProduct.originalPrice && newProduct.price && (
                  <p className="text-sm text-green-600 mt-1">
                    Diskon:{" "}
                    {Math.round(
                      ((Number.parseFloat(newProduct.originalPrice) -
                        Number.parseFloat(newProduct.price)) /
                        Number.parseFloat(newProduct.originalPrice)) *
                      100
                    )}
                    %
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="inline mr-1" />
                    Stock (Opsional)
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="Jumlah stok"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Deskripsi produk"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  {editingProduct ? "Perbarui Produk" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {showEditStoreModal && storeData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Edit Informasi Toko</h3>
              <button
                onClick={() => setShowEditStoreModal(false)}
                className="text-2xl font-bold hover:text-blue-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStore} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Toko
                </label>
                <input
                  type="text"
                  value={editStoreForm.name}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, name: e.target.value })
                  }
                  placeholder="Nama toko Anda"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="storeCategory" className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Toko
                </label>
                <select
                  id="storeCategory" 
                  value={editStoreForm.category}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Kecantikan">Kecantikan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Toko
                </label>
                <textarea
                  value={editStoreForm.description}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, description: e.target.value })
                  }
                  placeholder="Deskripsikan toko Anda"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Alamat
                </label>
                <input
                  type="text"
                  value={editStoreForm.address}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, address: e.target.value })
                  }
                  placeholder="Alamat lengkap toko"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={editStoreForm.whatsapp}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, whatsapp: e.target.value })
                  }
                  placeholder="+628xxxxxxxxxx"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openingTime" className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Buka
                  </label>
                  <input
                    id="openingTime" 
                    type="time"
                    value={editStoreForm.openingTime}
                    onChange={(e) =>
                      setEditStoreForm({ ...editStoreForm, openingTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="closingTime" className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Tutup
                  </label>
                  <input
                    id="closingTime" 
                    type="time"
                    value={editStoreForm.closingTime}
                    onChange={(e) =>
                      setEditStoreForm({ ...editStoreForm, closingTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditStoreModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};