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
import { scenarios, faqItems } from '@/data/mock-offers';
import { db } from '@/lib/db';
import type { Offer } from '@/types/offer';

// Disable cache - always fetch fresh data from DB
export const revalidate = 0;

// Transform DB offer to frontend Offer type
function transformOffer(offer: any): Offer {
  return {
    id: offer.id,
    name: offer.name,
    slug: offer.slug,
    logo: offer.logo || undefined,
    rating: offer.rating,
    minAmount: offer.minAmount,
    maxAmount: offer.maxAmount,
    minTerm: offer.minTerm,
    maxTerm: offer.maxTerm,
    baseRate: offer.baseRate,
    firstLoanRate: offer.firstLoanRate ?? undefined,
    decisionTime: offer.decisionTime,
    approvalRate: offer.approvalRate,
    payoutMethods: offer.payoutMethods ? JSON.parse(offer.payoutMethods) : [],
    features: offer.features ? JSON.parse(offer.features) : [],
    badCreditOk: offer.badCreditOk,
    noCalls: offer.noCalls,
    roundTheClock: offer.roundTheClock,
    minAge: offer.minAge,
    documents: offer.documents ? JSON.parse(offer.documents) : ['passport'],
    editorNote: offer.customDescription || undefined,
    affiliateUrl: offer.affiliateUrl || '#',
    isFeatured: offer.isFeatured,
    isNew: offer.isNew,
    isPopular: offer.isPopular,
  };
}

// Server component - fetches offers from DB
async function getOffers(): Promise<Offer[]> {
  try {
    const offers = await db.loanOffer.findMany({
      where: { 
        status: 'published',
        showOnHomepage: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { rating: 'desc' },
      ],
    });

    return offers.map(transformOffer);
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

export default async function Home() {
  const offers = await getOffers();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <ScenarioSection scenarios={scenarios} />
        {offers.length > 0 ? (
          <>
            <OffersSection offers={offers} />
            <CompareLoansSection offers={offers} />
          </>
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            <p>Загрузка предложений...</p>
          </div>
        )}
        <TrustSection />
        <FAQSection items={faqItems} />
        <SEOSection />
      </main>
      
      <Footer />
    </div>
  );
}
