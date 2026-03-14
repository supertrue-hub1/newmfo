import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  HeroSection,
  ScenarioSection,
  OffersSection,
  CompareLoansSection,
  TrustSection,
  FAQSection,
  SEOSection,
} from '@/components/sections';
import { mockOffers, scenarios, faqItems } from '@/data/mock-offers';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <ScenarioSection scenarios={scenarios} />
        <OffersSection offers={mockOffers} />
        <CompareLoansSection offers={mockOffers} />
        <TrustSection />
        <FAQSection items={faqItems} />
        <SEOSection />
      </main>
      
      <Footer />
    </div>
  );
}
