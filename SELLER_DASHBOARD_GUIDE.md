# 📊 Panduan Dashboard Penjual

## 🎯 Fitur Utama Dashboard Seller

Dashboard Penjual di marketplace UMKM ini sudah **fully functional** dengan fitur-fitur lengkap untuk mengelola toko dan produk.

---

## 🔐 Login sebagai Penjual

Gunakan salah satu akun penjual dari [DUMMY_ACCOUNTS.md](./DUMMY_ACCOUNTS.md).

**Contoh akun:**
- Email: `faridgamever@gmail.com`
- Password: `password123`
- Toko: **Jumbo Juice SWK**

---

## 📌 Fitur-Fitur Dashboard

### 1️⃣ **Tab Ringkasan (Overview)**
Menampilkan statistik toko:
- 📦 **Total Produk** - Jumlah produk yang terdaftar
- 💰 **Penjualan** - Total penjualan (dummy data)
- ⭐ **Rating Toko** - Rating toko dari pembeli

### 2️⃣ **Tab Produk**
Mengelola semua produk toko Anda:

#### ➕ Tambah Produk Baru
Klik tombol **"+ Tambah Produk"** untuk membuka form:
- **Nama Produk** (required)
- **Kategori** (required) - Pilih dari: Makanan, Minuman, Fashion, Kerajinan, Aksesoris, Kecantikan
- **Harga** (required) - Harga jual produk
- **Harga Asli** (opsional) - Untuk menampilkan diskon
  - Sistem otomatis menghitung % diskon
  - Badge diskon akan muncul di product card
- **URL Gambar** (opsional) - Link gambar produk (contoh: Unsplash URL)
- **Stock** (opsional) - Jumlah stok tersedia
- **Deskripsi** - Detail produk

#### ✏️ Edit Produk
- Klik tombol **"Edit"** pada kartu produk
- Form yang sama dengan tambah produk, sudah terisi data lama
- Klik **"Perbarui Produk"** untuk menyimpan

#### 🗑️ Hapus Produk
- Klik tombol **"Hapus"** pada kartu produk
- Produk langsung dihapus dari daftar dan localStorage

#### 💾 Penyimpanan Data
- Semua perubahan produk **otomatis tersimpan** di localStorage
- Data disimpan per toko dengan key: `seller_products`
- Produk akan **langsung muncul** di halaman pembeli (HomeBuyer)

### 3️⃣ **Tab Info Toko**
Mengelola informasi toko:

#### 📝 Informasi yang Ditampilkan:
- Gambar toko
- Nama toko
- Deskripsi
- 📍 Alamat
- 📱 WhatsApp (klik untuk chat langsung)

#### ✏️ Edit Info Toko
Klik tombol **"Edit"** untuk membuka form:
- **Nama Toko** (required)
- **Kategori Toko** (opsional)
- **Deskripsi Toko** (required)
- **Alamat** (required)
- **WhatsApp** (required) - Format: +628xxxxxxxxxx
- **Jam Buka** (opsional)
- **Jam Tutup** (opsional)

#### 💾 Penyimpanan Info Toko
- Data toko tersimpan di localStorage dengan key: `seller_stores`
- Perubahan **langsung terlihat** di StoreDetail pembeli

---

## 🔄 Sinkronisasi Data

### Produk
1. **Seller menambah/edit/hapus produk** → Tersimpan di `localStorage.seller_products`
2. **Buyer membuka halaman** → HomeBuyer, ProductDetail, StoreDetail load data dari localStorage
3. **Data ter-merge** dengan dummy data (prioritas localStorage)

### Toko
1. **Seller edit info toko** → Tersimpan di `localStorage.seller_stores`
2. **Buyer membuka StoreDetail** → Load dari localStorage, fallback ke dummy data

---

## 🎨 Fitur Diskon

### Cara Menggunakan Diskon:
1. Isi **Harga** dengan harga setelah diskon (harga jual)
2. Isi **Harga Asli** dengan harga sebelum diskon
3. Sistem akan otomatis:
   - Menghitung persentase diskon
   - Menampilkan badge diskon di ProductCard
   - Menampilkan harga coret di samping harga jual

**Contoh:**
- Harga Asli: Rp 50.000
- Harga: Rp 35.000
- Badge: **-30%**
- Display: **Rp 35.000** ~~Rp 50.000~~

---

## 📦 Fitur Stock

### Cara Menggunakan Stock:
1. Saat tambah/edit produk, isi field **Stock**
2. Stock akan ditampilkan di ProductCard untuk kategori non-makanan/minuman
3. Jika stock = 0 → "Habis"
4. Jika stock > 0 → "X tersisa" (hijau)

**Catatan:**
- Kategori **Makanan** dan **Minuman** menggunakan toggle `isAvailable` (Tersedia/Tidak Tersedia)
- Kategori lain (Fashion, Kerajinan, dll.) menggunakan **stock number**

---

## 🛠️ Teknologi

### Data Persistence:
- **localStorage** untuk penyimpanan lokal browser
- **React State** untuk UI real-time
- **Merge Strategy** antara dummy data dan seller data

### Files yang Dimodifikasi:
- `src/pages/DashboardSeller.tsx` - Dashboard utama seller
- `src/pages/HomeBuyer.tsx` - Load produk dari localStorage
- `src/pages/ProductDetail.tsx` - Load produk dari localStorage
- `src/pages/StoreDetail.tsx` - Load store & produk dari localStorage
- `src/components/ProductCard.tsx` - Display discount & stock

---

## 🔑 Quick Start

### 1. Login sebagai Seller
```
Email: faridgamever@gmail.com
Password: password123
```

### 2. Dashboard otomatis terbuka di `/dashboard-seller`

### 3. Tambah Produk Pertama
- Klik tab **"Produk"**
- Klik **"+ Tambah Produk"**
- Isi form (minimal: Nama, Kategori, Harga)
- Klik **"Tambah Produk"**

### 4. Lihat Produk di Halaman Buyer
- Logout atau buka incognito
- Login sebagai buyer atau buka tanpa login
- Produk baru langsung muncul di homepage

---

## 📝 Catatan Penting

1. **Data localStorage bersifat lokal** - Hanya tersimpan di browser yang sama
2. **Clear browser data** akan menghapus semua produk yang ditambahkan seller
3. **Dummy data tetap ada** sebagai fallback jika localStorage kosong
4. **Setiap seller** punya isolasi data berdasarkan `storeId`
5. **Produk seller A** tidak akan muncul di dashboard seller B

---

## 🚀 Fitur Mendatang (Opsional)

- [ ] Upload gambar ke server (saat ini URL manual)
- [ ] Statistik penjualan real-time
- [ ] Notifikasi order baru
- [ ] Grafik analytics
- [ ] Export data produk
- [ ] Bulk upload produk

---

## 🐛 Troubleshooting

### Produk tidak muncul di buyer:
1. Pastikan sudah refresh halaman buyer
2. Cek localStorage di DevTools → Application → Local Storage
3. Pastikan `seller_products` ada dan berisi data

### Edit tidak tersimpan:
1. Pastikan mengisi field required
2. Pastikan klik tombol **"Perbarui Produk"** atau **"Simpan Perubahan"**
3. Cek console browser untuk error

### Dashboard tidak load data toko:
1. Pastikan login dengan akun seller yang ada di `dummyAccounts.ts`
2. Pastikan akun punya field `storeId`
3. Cek `localStorage.umkm_users` untuk data akun

---

**Dashboard Penjual sekarang sudah fully functional! 🎉**

Semua perubahan langsung tersinkronisasi dengan halaman pembeli.
