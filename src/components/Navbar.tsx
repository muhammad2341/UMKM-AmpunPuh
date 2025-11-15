import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  Heart,
  ShoppingBag,
  Store as StoreIcon,
  Sparkles, // Ikon untuk logo
  Home, // Ikon untuk Beranda
  LayoutGrid, // Ikon untuk Produk
  Map, // Ikon untuk Peta Toko
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

// Helper component untuk NavLink Desktop
const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  text: string;
}> = ({ to, icon, text }) => {
  const location = useLocation();
  const isActive =
    (to === "/" && location.pathname === "/") ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`nav-link flex items-center space-x-2 px-3 py-2 rounded-lg ${isActive ? "active" : ""
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

// Helper component untuk NavLink Mobile
const MobileNavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}> = ({ to, icon, text, onClick }) => {
  const location = useLocation();
  const isActive =
    (to === "/" && location.pathname === "/") ||
    (to !== "/" && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`nav-link text-slate-700 flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${isActive ? "active" : ""
        }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

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
    <header className="fixed top-0 left-0 right-0 z-50 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="navbar-brand group"
          >
            <div className="flex items-center space-x-2 whitespace-nowrap">
              <Sparkles className="w-6 h-6" />
              <span>LARISMANIS</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">

            {isAuthenticated && isBuyer && (
              <>
                <NavLink
                  to="/home"
                  icon={<Home size={18} />}
                  text="Beranda"
                />
                <NavLink to="/maps" icon={<Map size={18} />} text="Peta Toko" />
              </>
            )}

            {isAuthenticated && isSeller && (
              <NavLink
                to="/dashboard-seller"
                icon={<StoreIcon size={18} />}
                text="Dashboard"
              />
            )}

            <div className="h-8 w-px bg-gray-300 mx-2"></div>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                {isBuyer && (
                  <Link
                    to="/favorites"
                    className="relative p-2 rounded-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:bg-white/20 hover:shadow-lg"
                    title="Favorit"
                  >
                    <Heart size={20} />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                <div className="px-3 py-2 rounded-lg text-white bg-white/20 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-tight">
                        {user.name}
                      </p>
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        {user.role === "buyer" ? (
                          <ShoppingBag size={12} />
                        ) : (
                          <StoreIcon size={12} />
                        )}
                        {user.role === "buyer" ? "Pembeli" : "Penjual"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="relative p-2 rounded-lg text-white transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:bg-white/20 hover:shadow-lg"
                  title="Keluar"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                    className="relative p-2 rounded-lg text-white bg-transparent transition-all duration-300 hover:-translate-y-0.5 hover:text-white hover:bg-white/20 hover:shadow-lg">
                  Login
                </Link>
                <Link
                  to="/register"
                    className="relative px-4 py-2 rounded-lg text-white bg-transparent font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:shadow-lg">
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {isAuthenticated && isBuyer && (
              <Link
                to="/favorites"
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              {isOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 space-y-2">
              <MobileNavLink
                to="/"
                icon={<Home size={20} />}
                text="Beranda"
                onClick={() => setIsOpen(false)}
              />

              {isAuthenticated && isBuyer && (
                <>
                  <MobileNavLink
                    to="/maps"
                    icon={<Map size={20} />}
                    text="Peta Toko"
                    onClick={() => setIsOpen(false)}
                  />
                  <MobileNavLink
                    to="/favorites"
                    icon={<Heart size={20} />}
                    text={`Favorit (${favorites.length})`}
                    onClick={() => setIsOpen(false)}
                  />
                </>
              )}

              {isAuthenticated && isSeller && (
                <MobileNavLink
                  to="/dashboard-seller"
                  icon={<StoreIcon size={20} />}
                  text="Dashboard"
                  onClick={() => setIsOpen(false)}
                />
              )}

              <hr className="border-gray-200 my-2" />

              {isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 bg-gray-900 text-white rounded-xl">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-gray-300 text-sm flex items-center gap-2 mt-1">
                      {user.role === "buyer" ? (
                        <ShoppingBag size={14} />
                      ) : (
                        <StoreIcon size={14} />
                      )}
                      {user.role === "buyer" ? "Pembeli" : "Penjual"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition flex items-center gap-3 font-medium"
                  >
                    <LogOut size={20} />
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-gray-100 text-gray-800 font-bold rounded-xl text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-blue-600 text-white font-bold rounded-xl text-center"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};