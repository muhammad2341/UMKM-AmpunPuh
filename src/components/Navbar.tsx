import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Heart, ShoppingBag, Store as StoreIcon, Sparkles } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isBuyer, isSeller } = useAuth();
  const { favorites } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl py-3"
      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg py-4"
      }`}>
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center">
          {/* Logo with Animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
              {/* Icon Container */}
              <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <span className="text-3xl">🏪</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tight group-hover:tracking-wide transition-all">
                UMKM Hub
              </span>
              <span className="text-white/70 text-xs font-semibold">
                Marketplace Lokal
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Navigation Links */}
            <Link
              to="/"
              className="relative px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all group overflow-hidden"
            >
              <span className="relative z-10">Beranda</span>
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>

            {isAuthenticated && isBuyer && (
              <>
                <Link
                  to="/home"
                  className="relative px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all group overflow-hidden"
                >
                  <span className="relative z-10">Produk</span>
                  <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
                <Link
                  to="/maps"
                  className="relative px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all group overflow-hidden"
                >
                  <span className="relative z-10">Peta Toko</span>
                  <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </Link>
              </>
            )}

            {isAuthenticated && isSeller && (
              <Link
                to="/dashboard-seller"
                className="relative px-4 py-2 text-white font-semibold rounded-xl hover:bg-white/20 transition-all group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <StoreIcon size={18} />
                  Dashboard
                </span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </Link>
            )}

            {/* Right Side */}
            <div className="h-8 w-px bg-white/30 mx-2"></div>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {/* Favorites Button (Buyer Only) */}
                {isBuyer && (
                  <Link
                    to="/favorites"
                    className="relative p-3 glass rounded-xl hover:bg-white/30 transition-all group"
                  >
                    <Heart size={20} className="text-white" />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {favorites.length}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </Link>
                )}

                {/* User Info Card */}
                <div className="glass px-4 py-2 rounded-xl backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-tight">{user.name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        {user.role === "buyer" ? (
                          <>
                            <ShoppingBag size={12} />
                            Pembeli
                          </>
                        ) : (
                          <>
                            <StoreIcon size={12} />
                            Penjual
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 glass rounded-xl hover:bg-red-500/20 transition-all group"
                >
                  <LogOut size={18} className="text-white group-hover:text-red-300 transition-colors" />
                  <span className="text-white font-semibold group-hover:text-red-300 transition-colors">Keluar</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-6 py-2 glass text-white font-bold rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="relative px-6 py-2 bg-white text-purple-600 font-bold rounded-xl hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles size={16} />
                    Daftar
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && isBuyer && (
              <Link to="/favorites" className="relative p-2 glass rounded-lg">
                <Heart size={20} className="text-white" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 glass rounded-lg hover:bg-white/30 transition-all"
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} className="text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 glass rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 space-y-2">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-white hover:bg-white/20 rounded-xl transition font-semibold"
              >
                Beranda
              </Link>

              {isAuthenticated && isBuyer && (
                <>
                  <Link
                    to="/home"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-white/20 rounded-xl transition font-semibold"
                  >
                    Produk
                  </Link>
                  <Link
                    to="/maps"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-white/20 rounded-xl transition font-semibold"
                  >
                    Peta Toko
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-white hover:bg-white/20 rounded-xl transition font-semibold"
                  >
                    Favorit ({favorites.length})
                  </Link>
                </>
              )}

              {isAuthenticated && isSeller && (
                <Link
                  to="/dashboard-seller"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-white hover:bg-white/20 rounded-xl transition font-semibold"
                >
                  Dashboard
                </Link>
              )}

              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 bg-white/10 rounded-xl">
                    <p className="text-white font-bold">{user.name}</p>
                    <p className="text-white/70 text-sm flex items-center gap-2 mt-1">
                      {user.role === "buyer" ? (
                        <>
                          <ShoppingBag size={14} />
                          Pembeli
                        </>
                      ) : (
                        <>
                          <StoreIcon size={14} />
                          Penjual
                        </>
                      )}
                      • {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-white hover:bg-red-500/20 rounded-xl transition flex items-center gap-2 font-semibold"
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
                    className="block px-4 py-3 glass text-white font-bold rounded-xl text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-white text-purple-600 font-bold rounded-xl text-center"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </nav>
  );
};