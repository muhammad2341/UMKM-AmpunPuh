// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Import klien Supabase kita
import type { Session, User } from "@supabase/supabase-js";

// Definisikan User App kita (termasuk role dari metadata)
interface AppUser {
  id: string;
  email?: string;
  role: "buyer" | "seller";
  // tambahkan data lain jika perlu
  name: string; 
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  // Fungsi login/register/logout sekarang diganti oleh Supabase
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, role: "buyer" | "seller") => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Cek sesi yang ada saat load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const appUser = mapSupabaseUserToAppUser(session.user);
        setUser(appUser);
      }
      setHydrated(true);
    });

    // Dengar perubahan status auth (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const appUser = session?.user ? mapSupabaseUserToAppUser(session.user) : null;
        setUser(appUser);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUserToAppUser = (supabaseUser: User): AppUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      role: supabaseUser.user_metadata?.role || 'buyer',
      name: supabaseUser.user_metadata?.name || 'User'
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      return false;
    }
    return true;
  };

  const register = async (name: string, email: string, phone: string, password: string, role: "buyer" | "seller"): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Kita simpan role & nama di metadata
        data: {
          name: name,
          phone: phone,
          role: role,
        },
      },
    });
    if (error) {
      alert(error.message);
      return false;
    }

    // Buat toko kosong jika mendaftar sebagai seller
    // (Ini bisa juga di-trigger oleh Supabase Function/Trigger)
    if (role === 'seller') {
      // Kita perlu login dulu untuk dapat user id
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if(loginData.user) {
        // Buat toko default
        await supabase.from('stores').insert({ 
          name: `${name}'s Store`, 
          description: 'Toko baru!',
          owner_id: loginData.user.id
        });
      }
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isBuyer: user?.role === "buyer",
        isSeller: user?.role === "seller",
        // @ts-expect-error expose hydrated flag for route guards
        hydrated,
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