import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import RetentionChartSection from "@/components/landing/RetentionChartSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import AnalyticsPreviewSection from "@/components/landing/AnalyticsPreviewSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050508] overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <RetentionChartSection />
      <HowItWorksSection />
      <AnalyticsPreviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}
