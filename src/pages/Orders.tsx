import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Clock, CheckCircle, XCircle, ChevronLeft, MapPin } from "lucide-react";
import { useCart } from "../contexts/CartContext";

export const Orders: React.FC = () => {
  const { orders, updateOrderStatus } = useCart();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Menunggu Konfirmasi", icon: Clock },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800", label: "Sedang Diproses", icon: Package },
      ready: { bg: "bg-green-100", text: "text-green-800", label: "Siap Diambil - Bisa Dibayar", icon: CheckCircle },
      completed: { bg: "bg-gray-100", text: "text-gray-800", label: "Selesai", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan", icon: XCircle },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        <Icon size={16} />
        {badge.label}
      </span>
    );
  };

  const isPickupTimeReached = (pickupTime?: string) => {
    if (!pickupTime) return false;
    const pickupDate = new Date(pickupTime);
    const now = new Date();
    return now >= pickupDate;
  };

  const getTimeUntilPickup = (pickupTime?: string) => {
    if (!pickupTime) return "";
    const pickupDate = new Date(pickupTime);
    const now = new Date();
    const diffMs = pickupDate.getTime() - now.getTime();
    
    if (diffMs <= 0) return "Waktu pengambilan telah tiba!";
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} hari ${diffHours} jam lagi`;
    if (diffHours > 0) return `${diffHours} jam ${diffMins} menit lagi`;
    return `${diffMins} menit lagi`;
  };

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Belum Ada Pesanan
          </h2>
          <p className="text-gray-600 mb-6">
            Anda belum pernah melakukan pemesanan
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Mulai Belanja
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package size={32} className="text-green-600" />
            Pesanan Saya (COD)
          </h1>
          <p className="text-gray-600 mt-2">
            📍 Lacak pesanan Anda. Pembayaran dilakukan saat pengambilan di toko sesuai waktu yang dipilih.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-yellow-400 to-green-500 p-4">
                <div className="flex justify-between items-start text-white">
                  <div>
                    <p className="text-sm opacity-90">Order ID</p>
                    <p className="font-bold text-lg">{order.id}</p>
                    <p className="text-sm mt-1">
                      {new Date(order.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Toko</p>
                  <p className="font-bold text-lg text-gray-900">{order.storeName}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x Rp {item.product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">
                        Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Total & Pickup Time */}
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-semibold">Total Pembayaran</span>
                    <span className="text-2xl font-bold text-green-600">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  {/* Pickup Time Info */}
                  {order.pickupTime && (
                    <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                      <p className="text-sm text-purple-900 font-semibold flex items-center gap-2 mb-2">
                        <Clock size={16} />
                        Waktu Pengambilan: {new Date(order.pickupTime).toLocaleString("id-ID", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {!isPickupTimeReached(order.pickupTime) && order.status !== 'cancelled' && order.status !== 'completed' && (
                        <p className="text-xs text-orange-700 font-semibold flex items-center gap-1">
                          <Clock size={14} />
                          ⚠️ Belum bisa dibayar & diambil! Waktu tersisa: {getTimeUntilPickup(order.pickupTime)}
                        </p>
                      )}
                      {isPickupTimeReached(order.pickupTime) && order.status === 'ready' && (
                        <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                          <CheckCircle size={14} />
                          ✓ Waktu pengambilan telah tiba! Anda bisa datang ke toko untuk bayar & ambil barang
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-3">
                  {order.status === "ready" && isPickupTimeReached(order.pickupTime) && (
                    <button
                      onClick={() => navigate(`/maps?storeId=${order.storeId}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition"
                    >
                      <MapPin size={20} />
                      Lihat Lokasi Toko
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button
                      onClick={() => {
                        if (confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
                          updateOrderStatus(order.id, 'cancelled');
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition"
                    >
                      <XCircle size={20} />
                      Batalkan Pesanan
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <div className="flex-1 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900 font-semibold">
                        ✓ Pesanan sedang disiapkan. Mohon tunggu hingga status berubah menjadi "Siap Diambil".
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/store/${order.storeId}`)}
                    className="px-4 py-3 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition"
                  >
                    Lihat Toko
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
