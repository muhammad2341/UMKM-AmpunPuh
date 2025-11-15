import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string, role: "buyer" | "seller") => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("umkm_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (name: string, email: string, phone: string, password: string, role: "buyer" | "seller"): boolean => {
    try {
      // Get existing users from localStorage
      const usersData = localStorage.getItem("umkm_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        alert("Email sudah terdaftar!");
        return false;
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password, // In production, this should be hashed!
        role,
      };

      // Save to users list
      users.push(newUser);
      localStorage.setItem("umkm_users", JSON.stringify(users));

      // Auto login after register
      const userWithoutPassword = { id: newUser.id, name, email, phone, role };
      setUser(userWithoutPassword);
      localStorage.setItem("umkm_user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const login = (email: string, password: string): boolean => {
    try {
      // Get users from localStorage
      const usersData = localStorage.getItem("umkm_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Find user
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!foundUser) {
        alert("Email atau password salah!");
        return false;
      }

      // Set user (without password)
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role || "buyer", // Default to buyer for old accounts
      };
      setUser(userWithoutPassword);
      localStorage.setItem("umkm_user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("umkm_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isBuyer: user?.role === "buyer",
        isSeller: user?.role === "seller",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
