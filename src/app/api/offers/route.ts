import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/offers - Get all published offers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const where: any = { status };
    
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const offers = await db.loanOffer.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { rating: 'desc' },
      ],
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    // Transform to frontend format
    const transformedOffers = offers.map((offer) => ({
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
    }));

    return NextResponse.json(transformedOffers);
  } catch (error) {
    console.error('Error fetching offers:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to fetch offers', 
      details: errorMessage 
    }, { status: 500 });
  }
}
