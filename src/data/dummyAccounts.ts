// Dummy accounts for all stores
// Run initializeDummyAccounts() in console or on app load to populate localStorage

export const dummyAccounts = [
  {
    id: "1",
    name: "Warung Tegal Gebang",
    email: "warungtegal@gmail.com",
    phone: "+628000000001",
    password: "password123",
    role: "seller",
    storeId: "1"
  },
  {
    id: "2",
    name: "Warung Mak Ni",
    email: "makni@gmail.com",
    phone: "+628000000003",
    password: "password123",
    role: "seller",
    storeId: "2"
  },
  {
    id: "3",
    name: "Jumbo Juicce SWK",
    email: "faridgamever@gmail.com",
    phone: "+628000000004",
    password: "password123",
    role: "seller",
    storeId: "3"
  },
  {
    id: "4",
    name: "Es Teler Sultan Savira",
    email: "esteler@gmail.com",
    phone: "+628000000005",
    password: "password123",
    role: "seller",
    storeId: "4"
  },
  {
    id: "5",
    name: "Rahayoe Es Krim",
    email: "rahayoe@gmail.com",
    phone: "+628000000006",
    password: "password123",
    role: "seller",
    storeId: "5"
  },
  {
    id: "6",
    name: "Garwin Fashion Textiles",
    email: "garwin@gmail.com",
    phone: "+628000000007",
    password: "password123",
    role: "seller",
    storeId: "6"
  },
  {
    id: "7",
    name: "Galery mamasusi",
    email: "mamasusi@gmail.com",
    phone: "+628000000008",
    password: "password123",
    role: "seller",
    storeId: "7"
  },
  {
    id: "8",
    name: "Family Fashion Muslim Store",
    email: "familyfashion@gmail.com",
    phone: "+628000000009",
    password: "password123",
    role: "seller",
    storeId: "8"
  },
  {
    id: "9",
    name: "JeCraft Buatan Jari Tangan",
    email: "jecraft@gmail.com",
    phone: "+628000000010",
    password: "password123",
    role: "seller",
    storeId: "9"
  },
  {
    id: "10",
    name: "Toko Mada Gerabah",
    email: "madagerabah@gmail.com",
    phone: "+628000000011",
    password: "password123",
    role: "seller",
    storeId: "10"
  },
  {
    id: "11",
    name: "Toko Victory 2",
    email: "victory2@gmail.com",
    phone: "+628000000012",
    password: "password123",
    role: "seller",
    storeid: "11"
  },
  {
    id: "12",
    name: "Focus Accessries Handphone",
    email: "focus@gmail.com",
    phone: "+628000000013",
    password: "password123",
    role: "seller",
    storeid: "12"
  },
  {
    id: "13",
    name: "Kartini Salon",
    email: "kartini@gmail.com",
    phone: "+628000000014",
    password: "password123",
    role: "seller",
    storeid: "13"
  },
  {
    id: "14",
    name: "Lumiere Beauty Studio",
    email: "lumiere@gmail.com",
    phone: "+628000000015",
    password: "password123",
    role: "seller",
    storeid: "14"
  },
  {
    id: "15",
    name: "Estine Aesthetic Clinic",
    email: "estine@gmail.com",
    phone: "+628000000016",
    password: "password123",
    role: "seller",
    storeid: "15"
  },
  {
    id: "16",
    name: "Sakinah Supermarket",
    email: "sakinah@gmail.com",
    phone: "+628000000017",
    password: "password123",
    role: "seller",
    storeid: "16"
  },
  {
    id: "17",
    name: "Swalayan Remaja Dharmahusada",
    email: "remaja@gmail.com",
    phone: "+628000000018",
    password: "password123",
    role: "seller",
    storeid: "17"
  },
  {
    id: "18",
    name: "Toko Al Hidayah",
    email: "alhidayah@gmail.com",
    phone: "+628000000019",
    password: "password123",
    role: "seller",
    storeid: "18"
  },
  // Dummy buyer account
  {
    id: "20",
    name: "Pembeli Demo",
    email: "buyer@gmail.com",
    phone: "+628123456789",
    password: "password123",
    role: "buyer",
  }
];

// Function to initialize dummy accounts in localStorage
export const initializeDummyAccounts = () => {
  const existingUsers = localStorage.getItem("umkm_users");
  const users = existingUsers ? JSON.parse(existingUsers) : [];
  
  // Upsert dummy accounts (ensure passwords/roles/current mapping stay consistent)
  dummyAccounts.forEach(account => {
    const idx = users.findIndex((u: any) => u.email === account.email);
    if (idx === -1) {
      users.push(account);
    } else {
      // Preserve id if present, but sync critical auth fields
      const current = users[idx];
      users[idx] = {
        ...current,
        ...account,
        id: current?.id ?? account.id,
        password: account.password, // enforce known test password
        role: account.role,
        storeId: (account as any).storeId,
      };
    }
  });
  
  localStorage.setItem("umkm_users", JSON.stringify(users));
  console.log("✅ Dummy accounts initialized!");
  console.log(`📊 Total accounts: ${users.length}`);
  return users;
};

// Auto-initialize on import (optional)
// Uncomment the line below to auto-initialize when app loads
// if (typeof window !== 'undefined') {
//   initializeDummyAccounts();
// }
