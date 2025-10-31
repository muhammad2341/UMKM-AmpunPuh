"use client";

import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShoppingCart } from "lucide-react";

interface NavbarProps {
  user?: { role: "buyer" | "seller"; name: string } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout?.();
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
              UMKM Hub
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
            <Link
              to="/"
              className="text-white font-medium hover:text-yellow-100 transition"
            >
              Produk
            </Link>
            <a
              href="#"
              className="text-white font-medium hover:text-yellow-100 transition"
            >
              Tentang
            </a>
            <a
              href="#"
              className="text-white font-medium hover:text-yellow-100 transition"
            >
              Kontak
            </a>

            {/* Right side */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <p className="text-white text-sm font-semibold">
                    {user.name}
                  </p>
                  <p className="text-yellow-100 text-xs capitalize">
                    {user.role}
                  </p>
                </div>
                {user.role === "buyer" && (
                  <button className="relative p-2 text-white hover:bg-white/20 rounded-lg transition">
                    <ShoppingCart size={24} />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      0
                    </span>
                  </button>
                )}
                {user.role === "seller" && (
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-yellow-100 transition"
                  >
                    Dashboard
                  </Link>
                )}
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
                  className="px-6 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-yellow-100 transition"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user?.role === "buyer" && (
              <button className="relative p-2 text-white">
                <ShoppingCart size={24} />
              </button>
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
              className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
            >
              Beranda
            </Link>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
            >
              Produk
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
            >
              Tentang
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-white/20 rounded transition"
            >
              Kontak
            </a>
            {user ? (
              <>
                <div className="px-4 py-2 bg-white/20 rounded text-white">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs capitalize text-yellow-100">
                    {user.role}
                  </p>
                </div>
                {user.role === "seller" && (
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 bg-white text-green-600 font-semibold rounded transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-white hover:bg-white/20 rounded transition"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 bg-white text-green-600 font-semibold rounded transition"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
