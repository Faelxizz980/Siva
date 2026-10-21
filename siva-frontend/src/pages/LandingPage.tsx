import { AboutSection } from '../features/landing/components/AboutSection';
import { FeaturesSection } from '../features/landing/components/FeaturesSection';
import { HeroSection } from '../features/landing/components/HeroSection';
import { HowItWorksSection } from '../features/landing/components/HowItWorksSection';
import { RestrictedAccessSection } from '../features/landing/components/RestrictedAccessSection';
import { SiteFooter } from '../features/landing/components/SiteFooter';
import { SiteHeader } from '../features/landing/components/SiteHeader';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <RestrictedAccessSection />
      </main>

      <SiteFooter />
    </div>
  );
}
