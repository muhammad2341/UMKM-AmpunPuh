"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/index";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"buyer" | "seller" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!role) newErrors.role = "Pilih peran terlebih dahulu";
    if (!email) newErrors.email = "Email tidak boleh kosong";
    if (!password) newErrors.password = "Password tidak boleh kosong";
    if (!name) newErrors.name = "Nama tidak boleh kosong";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const user: User = {
        id: Math.random().toString(),
        role: role!,
        name,
      };
      onLogin(user);
      navigate(role === "buyer" ? "/home" : "/dashboard");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="text-5xl mb-2">🏪</div>
            <h1 className="text-3xl font-bold text-gray-900">UMKM Hub</h1>
            <p className="text-gray-500">Platform UMKM Terpercaya</p>
          </div>

          {/* Role Selection */}
          {!role ? (
            <div className="space-y-4">
              <p className="text-center font-semibold text-gray-700">
                Pilih Peran Anda
              </p>
              <button
                onClick={() => setRole("buyer")}
                className="w-full p-4 border-2 border-green-300 rounded-xl hover:bg-green-50 transition hover:border-green-500 flex items-center space-x-3"
              >
                <span className="text-3xl">🛍️</span>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Pembeli</h3>
                  <p className="text-sm text-gray-600">Belanja produk UMKM</p>
                </div>
              </button>
              <button
                onClick={() => setRole("seller")}
                className="w-full p-4 border-2 border-blue-300 rounded-xl hover:bg-blue-50 transition hover:border-blue-500 flex items-center space-x-3"
              >
                <span className="text-3xl">🏬</span>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">Penjual</h3>
                  <p className="text-sm text-gray-600">Jual produk Anda</p>
                </div>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center space-x-2 bg-gray-100 p-3 rounded-lg">
                <span className="text-2xl">
                  {role === "buyer" ? "🛍️" : "🏬"}
                </span>
                <span className="font-semibold text-gray-700 capitalize">
                  {role}
                </span>
                <button
                  onClick={() => setRole(null)}
                  className="ml-auto text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  Ubah
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-red from-yellow-400 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-gray-600 text-sm">
                Login demo - tidak perlu email valid
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};
