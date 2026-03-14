import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { generateMfoMetadata, generateBreadcrumb } from '@/lib/seo/metadata';
import { OfferCard } from '@/components/home/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, CreditCard, Clock, Star, ExternalLink, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export async function generateStaticParams() {
  const mfos = await db.loanOffer.findMany({
    where: { status: 'published' },
    select: { slug: true },
    take: 100,
  });
  
  return mfos.map(mfo => ({ slug: mfo.slug }));
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const mfo = await db.loanOffer.findUnique({
    where: { slug, status: 'published' },
  });
  
  if (!mfo) {
    return { title: 'МФО не найдено' };
  }
  
  return generateMfoMetadata(mfo.name, mfo.description || undefined, mfo.logo || undefined);
}

async function getMfoData(slug: string) {
  const mfo = await db.loanOffer.findUnique({
    where: { slug, status: 'published' },
    include: {
      tags: true,
    },
  });
  
  return mfo;
}

export default async function MfoPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const mfo = await getMfoData(slug);
  
  if (!mfo) {
    notFound();
  }
  
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'МФО', url: '/mfo' },
    { name: mfo.name, url: `/mfo/${slug}` },
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />
      
      <Header />
      
      <main className="flex-1">
        {/* MFO Header */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/mfo" className="hover:text-primary transition-colors">МФО</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{mfo.name}</span>
            </nav>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo */}
              {mfo.logo && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center p-2">
                  <img src={mfo.logo} alt={mfo.name} className="max-w-full max-h-full object-contain" />
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {mfo.name}
                </h1>
                
                {mfo.description && (
                  <p className="text-lg text-slate-600 mb-4">
                    {mfo.description}
                  </p>
                )}
                
                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" />
                    Рейтинг: {mfo.rating}/5
                  </Badge>
                  {mfo.minAmount && mfo.maxAmount && (
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5" />
                      {mfo.minAmount.toLocaleString()} - {mfo.maxAmount.toLocaleString()} ₽
                    </Badge>
                  )}
                  {mfo.decisionTime && (
                    <Badge variant="secondary" className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Ответ за {mfo.decisionTime}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col gap-2">
                <Button size="lg" asChild>
                  <a href={mfo.website || '#'} target="_blank" rel="noopener noreferrer">
                    Оформить займ
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/mfo/${slug}/zayavka`}>
                    Оставить заявку
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs navigation */}
        <section className="border-b sticky top-16 bg-white/95 backdrop-blur z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <nav className="flex gap-6 -mb-px">
              <Link 
                href={`/mfo/${slug}`}
                className="py-4 px-1 border-b-2 border-primary font-medium text-sm text-primary"
              >
                Обзор
              </Link>
              <Link 
                href={`/mfo/${slug}/otzyvy`}
                className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Отзывы
              </Link>
              <Link 
                href={`/mfo/${slug}/zayavka`}
                className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Заявка
              </Link>
            </nav>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              {/* Main info */}
              <div className="space-y-8">
                {/* Conditions */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Условия займа</h2>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Сумма займа</dt>
                      <dd className="font-semibold text-foreground">
                        {mfo.minAmount?.toLocaleString()} - {mfo.maxAmount?.toLocaleString()} ₽
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Срок займа</dt>
                      <dd className="font-semibold text-foreground">
                        до {mfo.maxTerm} дней
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Ставка</dt>
                      <dd className="font-semibold text-foreground">
                        от {mfo.firstLoanRate || mfo.interestRate}% в день
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Время решения</dt>
                      <dd className="font-semibold text-foreground">
                        {mfo.decisionTime}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Возраст</dt>
                      <dd className="font-semibold text-foreground">
                        от {mfo.minAge} до {mfo.maxAge} лет
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Способы получения</dt>
                      <dd className="font-semibold text-foreground">
                        {mfo.receivingMethods || 'На карту'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Требования к заёмщику</h2>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Гражданство РФ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>Возраст от {mfo.minAge} до {mfo.maxAge} лет</span>
                    </li>
                    {mfo.requirements && mfo.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact info */}
                {(mfo.phone || mfo.email || mfo.website) && (
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-4">Контакты</h2>
                    <div className="space-y-3">
                      {mfo.phone && (
                        <a href={`tel:${mfo.phone}`} className="flex items-center gap-3 text-primary hover:underline">
                          <Phone className="h-5 w-5" />
                          {mfo.phone}
                        </a>
                      )}
                      {mfo.email && (
                        <a href={`mailto:${mfo.email}`} className="flex items-center gap-3 text-primary hover:underline">
                          <Mail className="h-5 w-5" />
                          {mfo.email}
                        </a>
                      )}
                      {mfo.website && (
                        <a href={mfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-primary hover:underline">
                          <ExternalLink className="h-5 w-5" />
                          Официальный сайт
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar - Similar offers */}
              <aside>
                <div className="sticky top-36">
                  <h3 className="font-semibold text-slate-900 mb-4">Похожие МФО</h3>
                  <div className="space-y-3">
                    {/* Здесь можно добавить похожие МФО */}
                    <p className="text-sm text-muted-foreground">
                      Скоро появятся похожие предложения
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
