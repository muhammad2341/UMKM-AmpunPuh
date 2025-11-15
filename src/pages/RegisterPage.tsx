import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState<"role" | "form">("role");
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller">("buyer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      alert("Semua field harus diisi!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan konfirmasi password tidak sama!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password minimal 6 karakter!");
      return;
    }

    // Register
    const success = register(formData.name, formData.email, formData.phone, formData.password, selectedRole);
    
    if (success) {
      alert("Registrasi berhasil! Anda akan diarahkan ke halaman Anda.");
      // Wait for state to update before navigating
      setTimeout(() => {
        // Redirect based on role
        if (selectedRole === "seller") {
          navigate("/dashboard-seller");
        } else {
          navigate("/home");
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {step === "role" ? (
          // Role Selection Screen
          <>
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Pilih Role Anda</h1>
              <p className="text-gray-600">Daftar sebagai pembeli atau penjual?</p>
            </div>

            {/* Role Selection Cards */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
              <button
                onClick={() => setSelectedRole("buyer")}
                className={`w-full p-6 border-2 rounded-xl transition-all transform hover:scale-105 ${
                  selectedRole === "buyer"
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-gray-300 hover:border-blue-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">🛒</div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Pembeli</div>
                  <div className="text-sm text-gray-600">
                    Belanja produk UMKM lokal berkualitas
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    ✓ Akses katalog produk<br/>
                    ✓ Lihat peta toko<br/>
                    ✓ Simpan favorit
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("seller")}
                className={`w-full p-6 border-2 rounded-xl transition-all transform hover:scale-105 ${
                  selectedRole === "seller"
                    ? "border-green-600 bg-green-50 shadow-lg"
                    : "border-gray-300 hover:border-green-300"
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">🏪</div>
                  <div className="text-xl font-bold text-gray-900 mb-2">Penjual</div>
                  <div className="text-sm text-gray-600">
                    Jual produk UMKM Anda secara online
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    ✓ Dashboard penjual<br/>
                    ✓ Kelola produk<br/>
                    ✓ Kelola toko
                  </div>
                </div>
              </button>

              <button
                onClick={() => setStep("form")}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Lanjutkan sebagai {selectedRole === "buyer" ? "Pembeli" : "Penjual"}
              </button>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Login di sini
                </Link>
              </p>
              <Link to="/" className="block text-sm text-gray-600 hover:text-gray-900">
                ← Kembali ke Beranda
              </Link>
            </div>
          </>
        ) : (
          // Registration Form
          <>
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <button
                onClick={() => setStep("role")}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                ← Ganti Role
              </button>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
                {selectedRole === "buyer" ? (
                  <span className="text-3xl">🛒</span>
                ) : (
                  <span className="text-3xl">🏪</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Daftar sebagai {selectedRole === "buyer" ? "Pembeli" : "Penjual"}
              </h1>
              <p className="text-gray-600">Lengkapi data Anda</p>
            </div>

            {/* Register Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="nama@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor WhatsApp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+62812345678"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimal 6 karakter"
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ulangi password"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Daftar Sekarang
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Login di sini
                  </Link>
                </p>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← Kembali ke Beranda
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
