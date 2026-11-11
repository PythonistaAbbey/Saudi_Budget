/**
 * MOCK INVENTORY — every vehicle, price and availability figure here is
 * synthetic demonstration data. Models are shown "or similar", as is common
 * in car rental. Nothing here reflects Budget Saudi's actual fleet or tariffs.
 */

export type Category = "economy" | "compact" | "sedan" | "suv" | "family" | "luxury" | "pickup" | "electric";
export type Body = "hatch" | "sedan" | "suv" | "van" | "pickup" | "coupe";
export type Fuel = "petrol" | "hybrid" | "electric" | "diesel";

export interface Vehicle {
  id: string;
  model: string;
  category: Category;
  body: Body;
  year: number;
  seats: number;
  bags: number; // large suitcases
  doors: number;
  transmission: "automatic" | "manual";
  fuel: Fuel;
  engine: string;
  economy: string; // fuel economy or range
  dailyRate: number; // SAR, simulated
  deposit: number; // SAR, simulated
  kmPerDay: number;
  color: string; // illustration paint
  features: string[];
  availableIn: string[]; // city ids (simulated)
  rating: number;
}

const ALL = ["riyadh", "jeddah", "dammam", "makkah", "madinah", "khobar", "alula", "abha", "tabuk", "taif"];
const MAJOR = ["riyadh", "jeddah", "dammam", "khobar"];

export const vehicles: Vehicle[] = [
  { id: "hyundai-accent", model: "Hyundai Accent", category: "economy", body: "sedan", year: 2025, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "petrol", engine: "1.6L 4-cyl", economy: "17 km/L", dailyRate: 129, deposit: 1000, kmPerDay: 250, color: "#d9dde4", features: ["Apple CarPlay", "Bluetooth", "Rear camera"], availableIn: ALL, rating: 4.4 },
  { id: "kia-pegas", model: "Kia Pegas", category: "economy", body: "sedan", year: 2025, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "petrol", engine: "1.4L 4-cyl", economy: "18 km/L", dailyRate: 115, deposit: 1000, kmPerDay: 250, color: "#b8202c", features: ["Bluetooth", "USB-C"], availableIn: ALL, rating: 4.2 },
  { id: "nissan-sunny", model: "Nissan Sunny", category: "economy", body: "sedan", year: 2024, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "petrol", engine: "1.6L 4-cyl", economy: "16 km/L", dailyRate: 119, deposit: 1000, kmPerDay: 250, color: "#f2f2f0", features: ["Bluetooth", "Cruise control"], availableIn: ALL, rating: 4.3 },
  { id: "toyota-yaris", model: "Toyota Yaris Hatch", category: "compact", body: "hatch", year: 2025, seats: 5, bags: 1, doors: 5, transmission: "automatic", fuel: "petrol", engine: "1.5L 4-cyl", economy: "19 km/L", dailyRate: 139, deposit: 1000, kmPerDay: 250, color: "#2f6fd6", features: ["Apple CarPlay", "Lane assist", "Rear camera"], availableIn: ALL, rating: 4.5 },
  { id: "mg-5", model: "MG 5", category: "compact", body: "sedan", year: 2025, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "petrol", engine: "1.5L 4-cyl", economy: "16 km/L", dailyRate: 135, deposit: 1000, kmPerDay: 250, color: "#6d7480", features: ["Touchscreen", "Rear camera", "Bluetooth"], availableIn: MAJOR, rating: 4.1 },
  { id: "toyota-corolla", model: "Toyota Corolla Hybrid", category: "sedan", body: "sedan", year: 2026, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "hybrid", engine: "1.8L hybrid", economy: "24 km/L", dailyRate: 179, deposit: 1500, kmPerDay: 300, color: "#e9e7e2", features: ["Adaptive cruise", "Apple CarPlay", "Android Auto", "Lane assist"], availableIn: ALL, rating: 4.7 },
  { id: "toyota-camry", model: "Toyota Camry", category: "sedan", body: "sedan", year: 2026, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "hybrid", engine: "2.5L hybrid", economy: "21 km/L", dailyRate: 229, deposit: 1500, kmPerDay: 300, color: "#1d2433", features: ["Adaptive cruise", "Heated & ventilated seats", "Wireless charging", "Blind-spot monitor"], availableIn: ALL, rating: 4.8 },
  { id: "hyundai-sonata", model: "Hyundai Sonata", category: "sedan", body: "sedan", year: 2025, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "petrol", engine: "2.5L 4-cyl", economy: "14 km/L", dailyRate: 209, deposit: 1500, kmPerDay: 300, color: "#8a8f99", features: ["Panoramic display", "Ventilated seats", "Smart cruise"], availableIn: MAJOR, rating: 4.6 },
  { id: "hyundai-tucson", model: "Hyundai Tucson", category: "suv", body: "suv", year: 2025, seats: 5, bags: 4, doors: 5, transmission: "automatic", fuel: "petrol", engine: "2.0L 4-cyl", economy: "13 km/L", dailyRate: 249, deposit: 2000, kmPerDay: 300, color: "#3c4a3e", features: ["AWD", "Apple CarPlay", "360° camera", "Smart cruise"], availableIn: ALL, rating: 4.6 },
  { id: "toyota-rav4", model: "Toyota RAV4 Hybrid", category: "suv", body: "suv", year: 2026, seats: 5, bags: 4, doors: 5, transmission: "automatic", fuel: "hybrid", engine: "2.5L hybrid AWD", economy: "18 km/L", dailyRate: 279, deposit: 2000, kmPerDay: 300, color: "#c9a77b", features: ["AWD", "Adaptive cruise", "Lane trace", "Wireless charging"], availableIn: ALL, rating: 4.8 },
  { id: "toyota-fortuner", model: "Toyota Fortuner", category: "suv", body: "suv", year: 2025, seats: 7, bags: 4, doors: 5, transmission: "automatic", fuel: "petrol", engine: "2.7L 4WD", economy: "10 km/L", dailyRate: 319, deposit: 2500, kmPerDay: 300, color: "#f4f3ef", features: ["4WD", "7 seats", "Hill descent control", "Rear A/C"], availableIn: ALL, rating: 4.6 },
  { id: "toyota-landcruiser", model: "Toyota Land Cruiser", category: "suv", body: "suv", year: 2026, seats: 7, bags: 5, doors: 5, transmission: "automatic", fuel: "petrol", engine: "3.5L V6 twin-turbo 4WD", economy: "8 km/L", dailyRate: 649, deposit: 5000, kmPerDay: 350, color: "#20242c", features: ["4WD", "Multi-terrain select", "Ventilated seats", "Premium audio", "360° camera"], availableIn: ALL, rating: 4.9 },
  { id: "hyundai-staria", model: "Hyundai Staria", category: "family", body: "van", year: 2025, seats: 9, bags: 6, doors: 5, transmission: "automatic", fuel: "diesel", engine: "2.2L diesel", economy: "11 km/L", dailyRate: 389, deposit: 3000, kmPerDay: 300, color: "#d6d9de", features: ["9 seats", "Sliding doors", "Rear A/C", "USB at every row"], availableIn: MAJOR.concat(["makkah", "madinah"]), rating: 4.7 },
  { id: "kia-carnival", model: "Kia Carnival", category: "family", body: "van", year: 2026, seats: 8, bags: 5, doors: 5, transmission: "automatic", fuel: "petrol", engine: "3.5L V6", economy: "10 km/L", dailyRate: 429, deposit: 3000, kmPerDay: 300, color: "#5a1f2a", features: ["Power sliding doors", "Captain chairs", "Dual sunroof", "Rear entertainment"], availableIn: MAJOR.concat(["makkah", "madinah", "alula"]), rating: 4.8 },
  { id: "mercedes-e", model: "Mercedes-Benz E-Class", category: "luxury", body: "sedan", year: 2026, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "petrol", engine: "2.0L turbo mild-hybrid", economy: "13 km/L", dailyRate: 899, deposit: 7500, kmPerDay: 350, color: "#0e0f12", features: ["Massage seats", "Burmester audio", "Ambient lighting", "Driver assistance package"], availableIn: MAJOR, rating: 4.9 },
  { id: "bmw-x5", model: "BMW X5", category: "luxury", body: "suv", year: 2026, seats: 5, bags: 4, doors: 5, transmission: "automatic", fuel: "petrol", engine: "3.0L inline-6 xDrive", economy: "10 km/L", dailyRate: 1099, deposit: 7500, kmPerDay: 350, color: "#2d3e57", features: ["xDrive AWD", "Panoramic roof", "Head-up display", "Harman Kardon audio"], availableIn: MAJOR, rating: 4.9 },
  { id: "genesis-g80", model: "Genesis G80", category: "luxury", body: "sedan", year: 2025, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "petrol", engine: "2.5L turbo", economy: "12 km/L", dailyRate: 749, deposit: 6000, kmPerDay: 350, color: "#7a6a58", features: ["Nappa leather", "Lexicon audio", "Highway driving assist"], availableIn: ["riyadh", "jeddah"], rating: 4.8 },
  { id: "toyota-hilux", model: "Toyota Hilux Double Cab", category: "pickup", body: "pickup", year: 2025, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "diesel", engine: "2.8L diesel 4WD", economy: "11 km/L", dailyRate: 269, deposit: 2500, kmPerDay: 300, color: "#f0efeb", features: ["4WD", "Load bed", "Tow hitch"], availableIn: ALL, rating: 4.5 },
  { id: "isuzu-dmax", model: "Isuzu D-Max", category: "pickup", body: "pickup", year: 2025, seats: 5, bags: 2, doors: 4, transmission: "manual", fuel: "diesel", engine: "3.0L diesel", economy: "12 km/L", dailyRate: 239, deposit: 2500, kmPerDay: 300, color: "#9aa0a6", features: ["Load bed", "Rear camera"], availableIn: MAJOR, rating: 4.3 },
  { id: "byd-seal", model: "BYD Seal", category: "electric", body: "sedan", year: 2026, seats: 5, bags: 2, doors: 4, transmission: "automatic", fuel: "electric", engine: "Single motor RWD", economy: "~510 km range", dailyRate: 299, deposit: 2500, kmPerDay: 300, color: "#7cc7c9", features: ["Rotating display", "Panoramic roof", "Fast charging", "Vehicle-to-load"], availableIn: ["riyadh", "jeddah", "dammam"], rating: 4.6 },
  { id: "lucid-air", model: "Lucid Air", category: "electric", body: "sedan", year: 2026, seats: 5, bags: 3, doors: 4, transmission: "automatic", fuel: "electric", engine: "Dual motor AWD", economy: "~660 km range", dailyRate: 1199, deposit: 8000, kmPerDay: 350, color: "#cfd3d6", features: ["Glass canopy roof", "DreamDrive", "Surreal Sound audio", "Fast charging"], availableIn: ["riyadh", "jeddah"], rating: 4.9 },
];

export const categories: Category[] = ["economy", "compact", "sedan", "suv", "family", "luxury", "pickup", "electric"];

export const findVehicle = (id: string) => vehicles.find((v) => v.id === id);

export const allFeatures = Array.from(new Set(vehicles.flatMap((v) => v.features))).sort();
