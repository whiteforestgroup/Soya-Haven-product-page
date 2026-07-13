import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustBadges from "./components/TrustBadges";
import WhyUs from "./components/WhyUs";
import BundleBanner from "./components/BundleBanner";
import Ingredients from "./components/Ingredients";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <AnnouncementBar />
      <Header />
      <Hero />
      <TrustBadges />
      <WhyUs />
      <BundleBanner />
      <Ingredients />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

export default App;
