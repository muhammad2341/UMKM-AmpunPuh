# Sistem Role Authentication - UMKM Marketplace

## Overview
Aplikasi ini menggunakan sistem role-based authentication dengan dua role utama: **Pembeli (Buyer)** dan **Penjual (Seller)**.

## Fitur Role System

### 1. Registrasi dengan Pilihan Role
- User dapat memilih role saat mendaftar:
  - 🛒 **Pembeli**: Untuk berbelanja produk UMKM
  - 🏪 **Penjual**: Untuk menjual produk UMKM
- Role tersimpan di localStorage dan database user

### 2. Login dengan Redirect Otomatis
- Pembeli → redirect ke `/home` (halaman produk)
- Penjual → redirect ke `/dashboard-seller` (dashboard penjual)

### 3. Middleware Protection (RoleProtectedRoute)
Komponen `RoleProtectedRoute` melindungi halaman berdasarkan role:
- Mencegah pembeli mengakses halaman penjual
- Mencegah penjual mengakses halaman pembeli
- Redirect otomatis ke halaman yang sesuai dengan role
- Menampilkan alert jika user mencoba akses halaman yang tidak sesuai

## Route Structure

### Public Routes (Tanpa Login)
- `/` - Landing Page
- `/login` - Halaman Login
- `/register` - Halaman Registrasi

### Buyer Routes (Hanya Pembeli)
- `/home` - Halaman Produk
- `/product/:id` - Detail Produk
- `/store/:id` - Detail Toko
- `/maps` - Peta Toko
- `/favorites` - Favorit

### Seller Routes (Hanya Penjual)
- `/dashboard-seller` - Dashboard Penjual
- `/dashboard` - Alias untuk dashboard penjual

## Navbar Behavior

### Pembeli (Buyer)
Menampilkan:
- Beranda
- Produk
- Peta Toko
- Favorit (dengan counter)
- User Info (🛒 Pembeli)
- Keluar

### Penjual (Seller)
Menampilkan:
- Beranda
- Dashboard
- User Info (🏪 Penjual)
- Keluar

## AuthContext API

### Properties
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
}
```

### Methods & Helpers
- `login(email, password)` - Login user
- `register(name, email, phone, password, role)` - Register user dengan role
- `logout()` - Logout user
- `isAuthenticated` - Boolean, apakah user sudah login
- `isBuyer` - Boolean, apakah user adalah pembeli
- `isSeller` - Boolean, apakah user adalah penjual
- `user` - Object user yang sedang login

## Testing

### Test sebagai Pembeli
1. Buka `/register`
2. Pilih role "Pembeli"
3. Isi form dan submit
4. Akan redirect ke `/home`
5. Coba akses `/dashboard-seller` → akan di-redirect kembali ke `/home`

### Test sebagai Penjual
1. Buka `/register`
2. Pilih role "Penjual"
3. Isi form dan submit
4. Akan redirect ke `/dashboard-seller`
5. Coba akses `/home` → akan di-redirect kembali ke `/dashboard-seller`

## Backward Compatibility
Sistem ini kompatibel dengan user lama yang belum memiliki role:
- Default role: `buyer`
- User lama akan otomatis mendapat role "buyer" saat login

## Security Notes
⚠️ **Important untuk Production:**
1. Password harus di-hash (gunakan bcrypt/argon2)
2. Gunakan JWT token untuk session management
3. Validasi role di backend/server-side
4. Implementasi refresh token
5. Rate limiting untuk login/register

## File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Context dengan role system
├── components/
│   ├── ProtectedRoute.tsx       # Basic auth protection
│   ├── RoleProtectedRoute.tsx   # Role-based protection
│   └── Navbar.tsx               # Navbar dengan role-aware menu
├── pages/
│   ├── LoginPage.tsx            # Login dengan role redirect
│   ├── RegisterPage.tsx         # Register dengan role selection
│   ├── HomeBuyer.tsx           # Buyer home page
│   ├── DashboardSeller.tsx     # Seller dashboard
│   └── ...
└── App.tsx                      # Route configuration dengan middleware
```

## Future Enhancements
- [ ] Admin role untuk moderasi
- [ ] Multi-store untuk satu penjual
- [ ] Verifikasi penjual
- [ ] Badge/rating untuk penjual terpercaya
- [ ] Analytics dashboard untuk penjual
- [ ] Customer support chat
