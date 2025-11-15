import { Icon, type LatLngExpression, type LatLngBoundsExpression } from "leaflet";

// Default center to Surabaya
export const DEFAULT_CENTER: LatLngExpression = [-7.2575, 112.7521];
export const DEFAULT_ZOOM = 13;

// Rough bounding box around Surabaya to limit panning
// Southwest [lat, lng], Northeast [lat, lng]
export const SURABAYA_BOUNDS: LatLngBoundsExpression = [
  [-7.40, 112.50],
  [-7.05, 112.95],
];

// Helper to create a Leaflet icon from inline SVG with custom color
export const createSvgIcon = (hexColor: string) =>
  new Icon({
    iconUrl:
      "data:image/svg+xml;base64," +
      btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="60" viewBox="0 0 24 24">
        <path fill="${hexColor}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `),
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  });

// Default icons: red for stores, blue for selected store
export const STORE_ICON = createSvgIcon("#DC2626");
export const SELECTED_ICON = createSvgIcon("#2563EB");

// If you prefer using static files, put SVG/PNG under public/icons and use:
// export const STORE_ICON = new Icon({ iconUrl: "/icons/store-red.svg", iconSize:[40,50], iconAnchor:[20,50], popupAnchor:[0,-50] });
// export const SELECTED_ICON = new Icon({ iconUrl: "/icons/store-blue.svg", iconSize:[40,50], iconAnchor:[20,50], popupAnchor:[0,-50] });

// Category-based icons using files placed under /public/icons
const iconFromFile = (file: string) =>
  new Icon({
    iconUrl: `/icons/${file}`,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });

// File-based category icons (drop your PNG/SVG in public/icons)
export const CATEGORY_FILE_ICONS: Record<string, Icon> = {
  Makanan: new Icon({
    iconUrl: "/icons/makanan.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Minuman: new Icon({
    iconUrl: "/icons/minuman.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Fashion: new Icon({
    iconUrl: "/icons/fashion.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Kerajinan: new Icon({
    iconUrl: "/icons/kerajinan.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Aksesoris: new Icon({
    iconUrl: "/icons/aksesoris.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Kecantikan: new Icon({
    iconUrl: "/icons/kecantikan.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
  Toserba: new Icon({
    iconUrl: "/icons/toserba.webp",
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -60],
  }),
};

// Fallback colored SVG icons per category (used if file not desired)
const CATEGORY_COLOR_ICONS: Record<string, Icon> = {
  Makanan: createSvgIcon("#F97316"), // orange
  Minuman: createSvgIcon("#06B6D4"), // cyan
  Fashion: createSvgIcon("#EC4899"), // pink
  Kerajinan: createSvgIcon("#8B5CF6"), // violet
  Aksesoris: createSvgIcon("#F59E0B"), // amber
  Kecantikan: createSvgIcon("#FB7185"), // rose
  Toserba: createSvgIcon("#10B981"), // emerald
};

// Toggle which set to use by default
export const getIconByCategory = (category?: string): Icon => {
  if (!category) return STORE_ICON;
  // Prefer file-based icons if the file exists. We can't detect existence here,
  // so we'll return the file icon; if it's missing, consider switching to color set.
  return CATEGORY_FILE_ICONS[category] || CATEGORY_COLOR_ICONS[category] || STORE_ICON;
};
