"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, ChevronLeft, MapPin, Phone } from "lucide-react";
import type { Product } from "../types";

interface SellerStore {
  id: string;
  name: string;
  description: string;
  address: string;
  whatsapp: string;
  image: string;
}

export const DashboardSeller: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "store">(
    "overview"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [storeData, setStoreData] = useState<SellerStore>({
    id: "store-1",
    name: "Toko Saya",
    description: "Deskripsi toko saya",
    address: "Jl. Contoh No. 123, Jakarta",
    whatsapp: "+62812345678",
    image: "/placeholder.svg?height=400&width=600",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Produk Contoh 1",
      category: "Makanan",
      price: 25000,
      originalPrice: 30000,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 10,
      storeId: "store-1",
      storeName: "Toko Saya",
      description: "Deskripsi produk contoh",
    },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    image: "/placeholder.svg?height=300&width=300",
    description: "",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category || !newProduct.price) return;

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number.parseInt(newProduct.price),
      originalPrice: newProduct.originalPrice
        ? Number.parseInt(newProduct.originalPrice)
        : undefined,
      image: newProduct.image,
      rating: 0,
      reviews: 0,
      storeId: storeData.id,
      storeName: storeData.name,
      description: newProduct.description,
    };

    if (editingProduct) {
      setProducts(
        products.map((p) => (p.id === editingProduct.id ? product : p))
      );
      setEditingProduct(null);
    } else {
      setProducts([...products, product]);
    }

    setNewProduct({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      image: "/placeholder.svg?height=300&width=300",
      description: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
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
    });
    setShowAddModal(true);
  };

  const handleUpdateStore = (e: React.FormEvent) => {
    e.preventDefault();
    // Store updated data
    setShowEditStoreModal(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-green-500 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 mb-4 hover:text-yellow-100 transition"
          >
            <ChevronLeft size={20} />
            <span>Kembali</span>
          </button>
          <h1 className="text-4xl font-bold">Dashboard Penjual</h1>
          <p className="text-yellow-100">Kelola toko dan produk Anda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "overview"
                ? "border-b-4 border-green-600 text-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "products"
                ? "border-b-4 border-green-600 text-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "store"
                ? "border-b-4 border-green-600 text-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Info Toko
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-gray-500 text-sm font-semibold mb-2">
                Total Produk
              </div>
              <div className="text-4xl font-bold text-green-600">
                {products.length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-gray-500 text-sm font-semibold mb-2">
                Penjualan
              </div>
              <div className="text-4xl font-bold text-blue-600">Rp 1.2jt</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-gray-500 text-sm font-semibold mb-2">
                Rating Toko
              </div>
              <div className="text-4xl font-bold text-yellow-500">4.8 ⭐</div>
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
                    image: "/placeholder.svg?height=300&width=300",
                    description: "",
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

        {/* Store Info Tab */}
        {activeTab === "store" && (
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
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
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
                  Harga Asli (Opsional)
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
                  placeholder="Harga asli untuk diskon"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
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
    </main>
  );
};
