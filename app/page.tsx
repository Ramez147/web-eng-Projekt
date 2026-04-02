"use client";

import App from "./landing_page/App";
import { ThemeProvider } from "./landing_page/components/theme-provider";
import "./landing_page/App.css";
import "./landing_page/index.css";

export default function Home() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}
