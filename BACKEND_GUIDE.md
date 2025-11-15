# 📚 Panduan Implementasi Backend untuk UMKM Marketplace

## 🎯 Overview
Saat ini aplikasi menggunakan **localStorage** untuk menyimpan data user. Untuk implementasi production dengan fitur user review, Anda memerlukan **backend yang proper**.

---

## 🏗️ Arsitektur yang Direkomendasikan

```
Frontend (React)  ←→  Backend API  ←→  Database
     (Vite)           (Express.js)      (MySQL/PostgreSQL)
```

---

## 💾 Database Schema

### 1. **Tabel Users**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL, -- hashed with bcrypt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. **Tabel Stores**
```sql
CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image VARCHAR(500),
  description TEXT,
  address TEXT,
  whatsapp VARCHAR(20),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  rating DECIMAL(2, 1) DEFAULT 0,
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

### 3. **Tabel Products**
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image VARCHAR(500),
  description TEXT,
  rating DECIMAL(2, 1) DEFAULT 0,
  store_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);
```

### 4. **Tabel Reviews** ⭐ (PENTING untuk fitur review)
```sql
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT,
  product_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  -- Pastikan user hanya bisa review sekali per product/store
  UNIQUE KEY unique_user_product (user_id, product_id),
  UNIQUE KEY unique_user_store (user_id, store_id)
);
```

### 5. **Tabel Orders** (Opsional untuk e-commerce)
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (store_id) REFERENCES stores(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 🔧 Backend Stack yang Direkomendasikan

### **Option 1: Node.js + Express + MySQL** (Paling Cocok)
```bash
# Install dependencies
npm install express mysql2 bcryptjs jsonwebtoken cors dotenv
npm install --save-dev nodemon
```

**Folder Structure:**
```
backend/
├── config/
│   └── database.js          # MySQL connection
├── controllers/
│   ├── authController.js    # Login, Register
│   ├── storeController.js   # CRUD Stores
│   ├── productController.js # CRUD Products
│   └── reviewController.js  # CRUD Reviews
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── routes/
│   ├── auth.js
│   ├── stores.js
│   ├── products.js
│   └── reviews.js
├── models/                  # Optional: Sequelize models
├── .env
└── server.js
```

**server.js Example:**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/reviews', require('./routes/reviews'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **Option 2: Laravel + MySQL** (Jika familiar dengan PHP)
```bash
composer create-project laravel/laravel umkm-backend
cd umkm-backend
php artisan make:model User -m
php artisan make:model Store -m
php artisan make:model Product -m
php artisan make:model Review -m
```

### **Option 3: Python + Flask/FastAPI + MySQL**
```bash
pip install flask flask-sqlalchemy flask-cors mysql-connector-python bcrypt pyjwt
```

---

## 🔐 API Endpoints yang Perlu Dibuat

### **Authentication**
```
POST   /api/auth/register       - Register user baru
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (protected)
```

### **Stores**
```
GET    /api/stores              - Get all stores
GET    /api/stores/:id          - Get store detail
POST   /api/stores              - Create store (protected)
PUT    /api/stores/:id          - Update store (protected)
DELETE /api/stores/:id          - Delete store (protected)
```

### **Products**
```
GET    /api/products            - Get all products
GET    /api/products/:id        - Get product detail
GET    /api/stores/:id/products - Get products by store
POST   /api/products            - Create product (protected)
PUT    /api/products/:id        - Update product (protected)
DELETE /api/products/:id        - Delete product (protected)
```

### **Reviews** ⭐
```
GET    /api/reviews/store/:storeId    - Get reviews for store
GET    /api/reviews/product/:productId - Get reviews for product
POST   /api/reviews                    - Create review (protected)
PUT    /api/reviews/:id                - Update review (protected)
DELETE /api/reviews/:id                - Delete review (protected)
```

---

## 🔄 Cara Migrasi dari Frontend-Only ke Backend

### **Step 1: Update AuthContext**
Ganti localStorage dengan API calls:

```typescript
// src/contexts/AuthContext.tsx
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.message);
      return false;
    }
    
    const data = await response.json();
    setUser(data.user);
    localStorage.setItem('token', data.token); // Store JWT token
    localStorage.setItem('umkm_user', JSON.stringify(data.user));
    return true;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

### **Step 2: Create API Service**
```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, phone: string, password: string) =>
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    }),

  // Stores
  getStores: () =>
    fetch(`${API_URL}/stores`, { headers: getAuthHeaders() }),

  getStore: (id: string) =>
    fetch(`${API_URL}/stores/${id}`, { headers: getAuthHeaders() }),

  // Reviews
  createReview: (data: { storeId?: string; productId?: string; rating: number; comment: string }) =>
    fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }),

  getStoreReviews: (storeId: string) =>
    fetch(`${API_URL}/reviews/store/${storeId}`, { headers: getAuthHeaders() }),
};
```

### **Step 3: Update Data Fetching**
Ganti `import { stores } from '../data/dummy'` dengan API calls:

```typescript
// src/pages/HomeBuyer.tsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';

const [stores, setStores] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchStores = async () => {
    try {
      const response = await api.getStores();
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchStores();
}, []);
```

---

## 🌐 Environment Variables

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

### **Backend (.env)**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=umkm_db
JWT_SECRET=your-super-secret-jwt-key-here
```

---

## 📦 Deployment

### **Backend (Node.js):**
- **Railway.app** (Free tier)
- **Render.com** (Free tier)
- **Heroku** (Paid)
- **VPS** (Digital Ocean, AWS, GCP)

### **Database:**
- **PlanetScale** (MySQL, Free tier)
- **Supabase** (PostgreSQL, Free tier)
- **Railway** (Built-in database)

### **Frontend:**
- **Vercel** (Recommended for Vite)
- **Netlify**
- **GitHub Pages**

---

## 🎓 Tutorial untuk Belajar

1. **Node.js + Express + MySQL:**
   - https://www.youtube.com/watch?v=l8WPWK9mS5M (Full Stack Tutorial)
   - https://www.freecodecamp.org/news/rest-api-tutorial-rest-client-rest-service-and-api-calls-explained-with-code-examples/

2. **JWT Authentication:**
   - https://www.youtube.com/watch?v=mbsmsi7l3r4

3. **File Upload (untuk foto produk):**
   - Gunakan **Multer** (Node.js)
   - Atau **Cloudinary** untuk cloud storage

---

## ✅ Checklist Implementasi

- [ ] Setup database MySQL/PostgreSQL
- [ ] Buat semua tabel (users, stores, products, reviews)
- [ ] Setup backend Express.js dengan folder structure
- [ ] Implementasi authentication (register, login) dengan JWT
- [ ] Implementasi CRUD API untuk stores
- [ ] Implementasi CRUD API untuk products
- [ ] Implementasi CRUD API untuk reviews
- [ ] Update frontend untuk menggunakan API (ganti localStorage dengan fetch)
- [ ] Testing semua endpoint
- [ ] Deploy backend dan database
- [ ] Deploy frontend dengan environment variable yang benar

---

## 🚀 Status Saat Ini

✅ **Sudah Selesai (Frontend-Only):**
- Authentication dengan localStorage
- Protected routes
- Register & Login UI
- Navbar dengan status login

⏳ **Belum Dikerjakan (Perlu Backend):**
- Data persisten di database
- User review system
- Real authentication dengan JWT
- Upload foto produk/toko
- Order management

---

**💡 Tips:** Mulai dengan backend sederhana dulu (auth + stores), lalu expand ke fitur review setelah basic flow berjalan.
