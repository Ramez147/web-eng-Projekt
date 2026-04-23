import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import "@testing-library/jest-dom";

// Mock IntersectionObserver für jsdom
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock window.matchMedia für jsdom
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const envPath = path.resolve(process.cwd(), ".env.local");

console.log("ENV PATH:", envPath);
console.log("FILE EXISTS:", fs.existsSync(envPath));

dotenv.config({ path: envPath });

console.log("ENV VALUE:", process.env.NEXT_PUBLIC_SUPABASE_URL);