# 🔑 Dummy Accounts untuk Testing

Semua akun dummy sudah **otomatis ter-inisialisasi** saat aplikasi dimuat.

## 📊 Ringkasan Akun

- **Total Akun**: 20
- **Akun Penjual (Seller)**: 19
- **Akun Pembeli (Buyer)**: 1
- **Password Semua Akun**: `password123` ✨

---

## 🏪 Akun Penjual (19 Toko)

| No | Nama Toko | Email | Password | Store ID |
|----|-----------|-------|----------|----------|
| 1 | Warung Tegal Gebang | warungtegal@gmail.com | password123 | 1 |
| 2 | Depot Bu Lusy | bulusy@gmail.com | password123 | 2 |
| 3 | Warung Mak Ni | makni@gmail.com | password123 | 3 |
| 4 | **Jumbo Juice SWK** | **faridgamever@gmail.com** | **password123** | 4 |
| 5 | Es Teler Sultan Savira | esteler@gmail.com | password123 | 5 |
| 6 | Rahayoe Es Krim | rahayoe@gmail.com | password123 | 6 |
| 7 | Garwin Fashion Textiles | garwin@gmail.com | password123 | 7 |
| 8 | Galery mamasusi | mamasusi@gmail.com | password123 | 8 |
| 9 | Family Fashion Muslim Store | familyfashion@gmail.com | password123 | 9 |
| 10 | JeCraft Buatan Jari Tangan | jecraft@gmail.com | password123 | 10 |
| 11 | Toko Mada Gerabah | madagerabah@gmail.com | password123 | 11 |
| 12 | Toko Victory 2 | victory2@gmail.com | password123 | 12 |
| 13 | Focus Accessries Handphone | focus@gmail.com | password123 | 13 |
| 14 | Kartini Salon | kartini@gmail.com | password123 | 14 |
| 15 | Lumiere Beauty Studio | lumiere@gmail.com | password123 | 15 |
| 16 | Estine Aesthetic Clinic | estine@gmail.com | password123 | 16 |
| 17 | Sakinah Supermarket | sakinah@gmail.com | password123 | 17 |
| 18 | Swalayan Remaja Dharmahusada | remaja@gmail.com | password123 | 18 |
| 19 | Toko Al Hidayah | alhidayah@gmail.com | password123 | 19 |

---

## 🛍️ Akun Pembeli

| Nama | Email | Password | Role |
|------|-------|----------|------|
| Pembeli Demo | buyer@gmail.com | password123 | buyer |

---

## 🚀 Quick Test Login

### Test sebagai Penjual:
1. Buka `/login`
2. Pilih role **Penjual** 
3. Login dengan:
   - Email: `faridgamever@gmail.com`
   - Password: `password123`
4. Otomatis redirect ke `/dashboard-seller`

### Test sebagai Pembeli:
1. Buka `/login`
2. Pilih role **Pembeli**
3. Login dengan:
   - Email: `buyer@gmail.com`
   - Password: `password123`
4. Otomatis redirect ke `/home`

---

## 🔄 Inisialisasi Ulang

Jika akun tidak muncul, jalankan di browser console:
```javascript
localStorage.clear();
location.reload();
```

Akun akan otomatis ter-inisialisasi ulang saat aplikasi dimuat.

---

## 📝 Catatan Penting

1. **Semua password sama**: `password123` untuk kemudahan testing
2. **Auto-initialization**: Akun otomatis ditambahkan ke localStorage saat app load
3. **Mapping Store**: Setiap akun seller sudah di-map ke store yang sesuai via `storeId`
4. **Role Protection**: Seller hanya bisa akses dashboard, buyer hanya bisa akses halaman pembeli

---

**Password Universal**: `password123` 🔑
