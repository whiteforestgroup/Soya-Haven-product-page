import { useRef, useState } from "react";
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
import StickyCTA from "./components/StickyCTA";
import OrderConfirmation from "./components/OrderConfirmation";
import ShippingReturns from "./pages/ShippingReturns";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const staticPages = {
  "shipping-returns": ShippingReturns,
  "privacy-policy": PrivacyPolicy,
  terms: TermsOfService,
};

function App() {
  const [ctaSummary, setCtaSummary] = useState(null);
  const heroRef = useRef(null);

  const params = new URLSearchParams(window.location.search);
  const isOrderConfirmation = params.get("order") === "success";
  const PageComponent = staticPages[params.get("page")];

  if (isOrderConfirmation) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <OrderConfirmation />
        <Footer />
      </div>
    );
  }

  if (PageComponent) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <PageComponent />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      <AnnouncementBar />
      <Header />
      <div ref={heroRef}>
        <Hero onSummaryChange={setCtaSummary} />
      </div>
      <TrustBadges />
      <WhyUs />
      <BundleBanner />
      <Ingredients />
      <Testimonials />
      <FAQ />
      <Footer />
      <StickyCTA summary={ctaSummary} scrollTargetRef={heroRef} />
    </div>
  );
}

export default App;
