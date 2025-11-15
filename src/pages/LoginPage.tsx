import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, ShoppingBag, Store } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller">("buyer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Email dan password harus diisi!");
      return;
    }

    const success = login(formData.email, formData.password);
    
    if (success) {
      // Wait for state to update before navigating
      setTimeout(() => {
        // Get user data from localStorage to check role
        const userData = localStorage.getItem("umkm_user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          
          // Check if role matches selection and give warning
          if (parsedUser.role !== selectedRole) {
            const actualRole = parsedUser.role === "buyer" ? "Pembeli" : "Penjual";
            const selectedRoleText = selectedRole === "buyer" ? "Pembeli" : "Penjual";
            alert(`Perhatian: Akun ini terdaftar sebagai ${actualRole}, bukan ${selectedRoleText}. Anda akan diarahkan ke halaman yang sesuai.`);
          }
          
          // Redirect based on actual user role (not selected role)
          if (parsedUser.role === "seller") {
            navigate("/dashboard-seller");
          } else {
            navigate("/home");
          }
        }
      }, 100); // Small delay to ensure state is updated
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
          <p className="text-gray-600">Login ke akun UMKM Marketplace</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Login Sebagai
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("buyer")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === "buyer"
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingBag
                    className={`w-8 h-8 mb-2 ${
                      selectedRole === "buyer" ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      selectedRole === "buyer" ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    Pembeli
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("seller")}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    selectedRole === "seller"
                      ? "border-green-500 bg-green-50 shadow-md"
                      : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  }`}
                >
                  <Store
                    className={`w-8 h-8 mb-2 ${
                      selectedRole === "seller" ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      selectedRole === "seller" ? "text-green-600" : "text-gray-600"
                    }`}
                  >
                    Penjual
                  </span>
                </button>
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
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Belum punya akun?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Daftar di sini
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
      </div>
    </div>
  );
};

export default LoginPage;