import { Cta } from "./components/Cta";
import { FAQ } from "./components/FAQ";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { Pricing } from "./components/Pricing";
import { ScrollToTop } from "./components/ScrollToTop";
import { Sponsors } from "./components/Sponsors";
import { Testimonials } from "./components/Testimonials";

function App() {
  return (
    <div className="ml-4 md:ml-10">
      <Navbar />
      <Hero />
      <Login />
      <Sponsors />
      <Testimonials />
      <Features />
      <Pricing />
      <FAQ />
      <Cta />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
