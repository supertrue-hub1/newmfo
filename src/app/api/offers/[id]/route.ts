import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/offers/[id] - Get single offer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const offer = await db.loanOffer.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    // Transform to frontend format
    const transformedOffer = {
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
      customDescription: offer.customDescription || undefined,
      affiliateUrl: offer.affiliateUrl || '#',
      isFeatured: offer.isFeatured,
      isNew: offer.isNew,
      isPopular: offer.isPopular,
      status: offer.status,
      showOnHomepage: offer.showOnHomepage,
      sortOrder: offer.sortOrder,
      syncStatus: offer.syncStatus,
      syncSource: offer.syncSource || undefined,
      lastSync: offer.lastSyncAt?.toISOString() || new Date().toISOString(),
      requiresReview: offer.requiresReview,
      reviewReason: offer.reviewReason || undefined,
      views: offer.viewsCount,
      clicks: offer.clicksCount,
      conversions: offer.conversionsCount,
      metaTitle: offer.metaTitle || undefined,
      metaDescription: offer.metaDescription || undefined,
      apiData: {
        minAmount: offer.minAmount,
        maxAmount: offer.maxAmount,
        minTerm: offer.minTerm,
        maxTerm: offer.maxTerm,
        baseRate: offer.baseRate,
        firstLoanRate: offer.firstLoanRate ?? 0,
        decisionTime: offer.decisionTime,
        approvalRate: offer.approvalRate,
        payoutMethods: offer.payoutMethods ? JSON.parse(offer.payoutMethods) : [],
        features: offer.features ? JSON.parse(offer.features) : [],
        badCreditOk: offer.badCreditOk,
        noCalls: offer.noCalls,
        roundTheClock: offer.roundTheClock,
        minAge: offer.minAge,
        documents: offer.documents ? JSON.parse(offer.documents) : ['passport'],
      },
    };

    return NextResponse.json(transformedOffer);
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json({ error: 'Failed to fetch offer' }, { status: 500 });
  }
}

// PUT /api/offers/[id] - Update offer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const offer = await db.loanOffer.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        rating: body.rating,
        minAmount: body.minAmount,
        maxAmount: body.maxAmount,
        minTerm: body.minTerm,
        maxTerm: body.maxTerm,
        baseRate: body.baseRate,
        firstLoanRate: body.firstLoanRate,
        decisionTime: body.decisionTime,
        approvalRate: body.approvalRate,
        payoutMethods: body.payoutMethods ? JSON.stringify(body.payoutMethods) : undefined,
        features: body.features ? JSON.stringify(body.features) : undefined,
        badCreditOk: body.badCreditOk,
        noCalls: body.noCalls,
        roundTheClock: body.roundTheClock,
        minAge: body.minAge,
        documents: body.documents ? JSON.stringify(body.documents) : undefined,
        affiliateUrl: body.affiliateUrl,
        isFeatured: body.isFeatured,
        isNew: body.isNew,
        isPopular: body.isPopular,
        status: body.status,
        showOnHomepage: body.showOnHomepage,
        sortOrder: body.sortOrder,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        customDescription: body.customDescription || body.editorNote,
        requiresReview: false, // Reset review flag after update
        reviewReason: null,
      },
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to update offer', 
      details: errorMessage 
    }, { status: 500 });
  }
}

// DELETE /api/offers/[id] - Delete offer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await db.loanOffer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting offer:', error);
    return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 });
  }
}

// PATCH /api/offers/[id] - Partial update (for status changes, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const offer = await db.loanOffer.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Error patching offer:', error);
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }
}
