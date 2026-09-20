import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { PrivacySection } from "@/components/landing/privacy-section";
import { FAQ } from "@/components/landing/faq";
import { FinalCTA } from "@/components/landing/final-cta";

export default function LandingPage() {
  return (
    <div className="space-y-0">
      <Hero />
      <HowItWorks />
      <Features />
      <PrivacySection />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
