# 🗺️ Fitur Peta UMKM dengan Leaflet + OpenStreetMap

## ✅ Perubahan yang Sudah Dilakukan

### 1. **Migrasi dari Google Maps ke Leaflet (100% Gratis)**
- ❌ Hapus `@googlemaps/js-api-loader` dan `@types/google.maps`
- ✅ Install `leaflet`, `react-leaflet`, `@types/leaflet`
- ✅ Tidak perlu API key, billing, atau kartu kredit

### 2. **Custom Marker Icons**
- 🔴 **Marker Merah**: Semua toko UMKM
- 🔵 **Marker Biru**: Toko yang dipilih/sedang dilihat
- Marker menggunakan SVG inline (tidak perlu file gambar eksternal)

### 3. **Fitur Peta**
- ✅ Multiple markers untuk semua toko
- ✅ Popup dengan detail toko (nama, alamat, rating)
- ✅ Tombol "Lihat Detail Toko" di popup
- ✅ Zoom dan pan interaktif
- ✅ Highlight marker toko yang dipilih

### 4. **Integrasi di Aplikasi**
- **ProductCard**: Tombol "Lihat Lokasi" → Maps dengan marker toko
- **StoreDetail**: Tombol "Lihat di Halaman Maps" → Maps dengan highlight toko

### 5. **File yang Dihapus**
- ❌ `src/components/GoogleMapsWrapper.tsx`
- ❌ `src/pages/index.tsx` (wrapper Google Maps)
- ❌ `src/pages/index.test.tsx`
- ❌ `examples/` folder
- ❌ `.env` dan `.env.example` (tidak perlu lagi)

## 🚀 Cara Menggunakan

### Jalankan Development Server
```powershell
npm run dev
```

Buka browser: `http://localhost:5173/`

### Akses Halaman Maps
1. **Dari Kartu Produk**: Klik "Lihat Lokasi" → Peta dengan marker toko
2. **Dari Detail Toko**: Klik "Lihat di Halaman Maps" → Peta dengan highlight toko

### URL Parameter Maps
- `?storeId=1` - Highlight toko dengan ID tertentu
- `?lat=-6.2088&lng=106.8456` - Set koordinat pusat peta
- `?q=Nama+Toko` - Set label/nama lokasi

## 📦 Dependencies Baru

```json
{
  "dependencies": {
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1"
  },
  "devDependencies": {
    "@types/leaflet": "^1.9.8"
  }
}
```

## 🎨 Custom Icon di Maps.tsx

Icon marker dibuat dengan SVG inline:
- Warna merah (#DC2626) untuk toko umum
- Warna biru (#2563EB) untuk toko terpilih
- Ukuran 40x50px dengan anchor di bawah

## 🔧 Konfigurasi

### tsconfig.json
```json
{
  "compilerOptions": {
    "types": ["vite/client", "@types/leaflet"]
  }
}
```

### Import CSS Leaflet
Di `Maps.tsx`:
```tsx
import "leaflet/dist/leaflet.css";
```

## 💡 Tips Pengembangan Lanjutan

### 1. Tambah Routing/Directions
```bash
npm install leaflet-routing-machine
```

### 2. Custom Tile Layers (Tampilan Peta)
Ganti `url` di `<TileLayer>`:
- **Satellite**: CartoDB Voyager, Esri World Imagery
- **Dark Mode**: CartoDB Dark Matter
- **Topografi**: OpenTopoMap

### 3. Cluster Markers (Untuk Banyak Toko)
```bash
npm install react-leaflet-cluster
```

### 4. Geolocation (Lokasi User)
Gunakan browser Geolocation API + marker khusus untuk posisi user

## 🆚 Perbandingan Google Maps vs Leaflet

| Fitur | Google Maps | Leaflet + OSM |
|-------|-------------|---------------|
| **Biaya** | Gratis $200/bulan (butuh billing) | 100% Gratis |
| **API Key** | Wajib | Tidak perlu |
| **Marker Custom** | Perlu setup | Mudah (SVG inline) |
| **Offline Support** | Tidak | Bisa (tile caching) |
| **Customization** | Terbatas | Sangat fleksibel |
| **Performance** | Baik | Sangat baik |

## 📌 Catatan Penting

- **Tidak perlu API key atau billing** - Langsung jalan!
- **Data koordinat** diambil dari `stores` di `dummy.ts`
- **Format koordinat** di `mapUrl`: `https://maps.google.com/maps?q=-6.2088,106.8456`
- **Tile server** menggunakan OpenStreetMap (gratis, open source)

## 🐛 Troubleshooting

### Peta tidak muncul
1. Pastikan `import "leaflet/dist/leaflet.css"` ada di `Maps.tsx`
2. Check console browser untuk error
3. Pastikan koordinat valid (lat: -90 to 90, lng: -180 to 180)

### Marker tidak muncul
1. Cek data `stores` punya `mapUrl` dengan format benar
2. Lihat console log untuk parsing error koordinat

### CSS Leaflet conflict
Jika ada konflik dengan Tailwind:
```css
/* global.css */
.leaflet-container {
  @apply h-full w-full;
}
```

## ✅ Testing Checklist

- [x] Dev server jalan tanpa error
- [x] Peta muncul di halaman `/maps`
- [x] Marker toko muncul dengan icon merah
- [x] Popup toko bisa diklik
- [x] Tombol "Lihat Lokasi" di kartu produk bekerja
- [x] Tombol "Lihat di Halaman Maps" di detail toko bekerja
- [x] Marker biru highlight toko yang dipilih
- [x] Tidak ada error TypeScript
- [x] Build production berhasil (`npm run build`)

---

**🎉 Selesai! Aplikasi UMKM sekarang punya fitur peta gratis dengan custom marker icons.**
