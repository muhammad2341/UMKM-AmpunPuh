import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isBuyer, isSeller } = useAuth();
  const { favorites } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-yellow-400 via-lime-400 to-green-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-bold text-white drop-shadow-lg">
              🏪
            </div>
            <span className="text-white font-bold text-xl drop-shadow-lg group-hover:scale-105 transition-transform">
              Laris Manis
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-white font-medium hover:text-yellow-100 transition"
            >
              Beranda
            </Link>
            {isAuthenticated && isBuyer && (
              <>
                <Link
                  to="/home"
                  className="text-white font-medium hover:text-yellow-100 transition"
                >
                  Produk
                </Link>
                <Link
                  to="/maps"
                  className="text-white font-medium hover:text-yellow-100 transition"
                >
                  Peta Toko
                </Link>
              </>
            )}
            {isAuthenticated && isSeller && (
              <>
                <Link
                  to="/dashboard-seller"
                  className="text-white font-medium hover:text-yellow-100 transition"
                >
                  Dashboard
                </Link>
              </>
            )}

            {/* Right side */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-white text-sm font-semibold flex items-center gap-2">
                    <User size={16} />
                    {user.name}
                  </p>
                  <p className="text-yellow-100 text-xs">
                    {user.role === "buyer" ? "🛒 Pembeli" : "🏪 Penjual"} • {user.email}
                  </p>
                </div>
                {isBuyer && (
                  <Link to="/favorites" className="relative p-2 text-white hover:bg-white/20 rounded-lg transition">
                    <Heart size={24} />
                    {favorites.length > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}
                {/* Orders removed */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-6 py-2 bg-white/90 text-green-600 font-semibold rounded-lg hover:bg-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && isBuyer && (
              <>
                <Link to="/favorites" className="relative p-2 text-white">
                  <Heart size={20} />
                  {favorites.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:bg-white/20 rounded-lg transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
            >
              Beranda
            </Link>
            {isAuthenticated && isBuyer && (
              <>
                <Link
                  to="/home"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
                >
                  Produk
                </Link>
                <Link
                  to="/maps"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
                >
                  Peta Toko
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
                >
                  Favorit ({favorites.length})
                </Link>
                {/* Orders removed */}
              </>
            )}
            {isAuthenticated && isSeller && (
              <>
                <Link
                  to="/dashboard-seller"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
                >
                  Dashboard
                </Link>
              </>
            )}
            {isAuthenticated && user ? (
              <>
                <div className="px-4 py-2 bg-white/20 rounded text-white">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-yellow-100">
                    {user.role === "buyer" ? "🛒 Pembeli" : "🏪 Penjual"} • {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded transition flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-white/90 text-green-600 font-semibold rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 bg-blue-600 text-white font-semibold rounded transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
