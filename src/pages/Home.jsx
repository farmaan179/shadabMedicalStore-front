import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import AIChat from "../components/AIChat";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Products />
      <Contact />
      <Footer />
      <AIChat />
    </div>
  );
}