"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, ChevronLeft, MapPin, Phone, Tag, Package } from "lucide-react";
import type { Product, Store } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { stores as dummyStores, products as dummyProducts } from "../data/dummy";

export const DashboardSeller: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "store">(
    "overview"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [storeData, setStoreData] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

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

  // Load store and products based on logged-in seller
  useEffect(() => {
    if (!user) return;

    // Get user's store data from dummyAccounts
    const userAccount = JSON.parse(localStorage.getItem("umkm_users") || "[]").find(
      (u: any) => u.email === user.email
    );

    if (userAccount && userAccount.storeId) {
      // Load store from localStorage or dummy data
      const savedStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
      const store = savedStores[userAccount.storeId] || dummyStores.find((s) => s.id === userAccount.storeId);
      
      if (store) {
        setStoreData(store);
        setEditStoreForm({
          name: store.name,
          description: store.description,
          address: store.address,
          whatsapp: store.whatsapp,
          category: store.category || "",
          openingTime: store.openingTime || "",
          closingTime: store.closingTime || "",
        });

        // Load products from localStorage first, fallback to dummy data
        const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
        const storeProducts = savedProducts[userAccount.storeId] || 
          dummyProducts.filter((p) => p.storeId === userAccount.storeId);
        setProducts(storeProducts);
      }
    }
  }, [user]);

  // Add or update product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeData) {
      alert("Data toko tidak ditemukan");
      return;
    }

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice
          ? Number.parseFloat(newProduct.originalPrice)
          : undefined,
        image: newProduct.image,
        description: newProduct.description,
        stock: newProduct.stock ? Number.parseInt(newProduct.stock) : undefined,
      };

      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      
      // Save to localStorage
      saveProductsToLocalStorage(updatedProducts);
      setEditingProduct(null);
    } else {
      // Add new product
      const newId = `product-${Date.now()}`;
      const product: Product = {
        id: newId,
        name: newProduct.name,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice
          ? Number.parseFloat(newProduct.originalPrice)
          : undefined,
        image: newProduct.image,
        rating: 0,
        reviews: 0,
        storeId: storeData.id,
        storeName: storeData.name,
        description: newProduct.description,
        stock: newProduct.stock ? Number.parseInt(newProduct.stock) : undefined,
      };

      const updatedProducts = [...products, product];
      setProducts(updatedProducts);
      
      // Save to localStorage
      saveProductsToLocalStorage(updatedProducts);
    }

    setNewProduct({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      image: "",
      description: "",
      stock: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
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

  const handleUpdateStore = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeData) return;

    const updatedStore: Store = {
      ...storeData,
      name: editStoreForm.name,
      description: editStoreForm.description,
      address: editStoreForm.address,
      whatsapp: editStoreForm.whatsapp,
      category: editStoreForm.category,
      openingTime: editStoreForm.openingTime,
      closingTime: editStoreForm.closingTime,
    };

    setStoreData(updatedStore);
    saveStoreToLocalStorage(updatedStore);
    setShowEditStoreModal(false);
  };

  // Save products to localStorage
  const saveProductsToLocalStorage = (productList: Product[]) => {
    if (!storeData) return;
    
    // Get existing seller products from localStorage
    const existingProducts = JSON.parse(
      localStorage.getItem("seller_products") || "{}"
    );
    
    // Update products for this store
    existingProducts[storeData.id] = productList;
    
    // Save back to localStorage
    localStorage.setItem("seller_products", JSON.stringify(existingProducts));
  };

  // Save store info to localStorage
  const saveStoreToLocalStorage = (store: Store) => {
    const existingStores = JSON.parse(
      localStorage.getItem("seller_stores") || "{}"
    );
    
    existingStores[store.id] = store;
    localStorage.setItem("seller_stores", JSON.stringify(existingStores));
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Toko
                </label>
                <select
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={editStoreForm.openingTime}
                    onChange={(e) =>
                      setEditStoreForm({ ...editStoreForm, openingTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Tutup
                  </label>
                  <input
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
