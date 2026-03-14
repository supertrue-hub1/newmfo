import { Metadata } from 'next';
import { Header, Footer } from '@/components/layout';
import { db } from '@/lib/db';
import { generateBreadcrumb } from '@/lib/seo/metadata';
import { OfferCard } from '@/components/home/offer-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Search, Star, Filter } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'МФО России — все микрофинансовые организации',
  description: 'Полный список проверенных МФО России. Рейтинг, отзывы, условия займов. Выберите надёжного кредитора для получения денег.',
  alternates: {
    canonical: '/mfo',
  },
};

async function getAllMfos() {
  const mfos = await db.loanOffer.findMany({
    where: { status: 'published' },
    orderBy: { rating: 'desc' },
    take: 50,
  });
  
  return mfos;
}

export default async function MfoListPage() {
  const mfos = await getAllMfos();
  
  const breadcrumb = [
    { name: 'Главная', url: '/' },
    { name: 'МФО', url: '/mfo' },
  ];
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumb(breadcrumb)) }}
      />
      
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-b from-slate-50 to-white border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">МФО</span>
            </nav>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Все МФО России
            </h1>
            
            <p className="text-lg text-slate-600 max-w-3xl mb-6">
              Сравните {mfos.length} микрофинансовых организаций. 
              Выберите надёжного кредитора с лучшими условиями и высоким рейтингом.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск МФО..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-6 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{mfos.length}</Badge>
                <span className="text-sm text-muted-foreground">МФО в каталоге</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">24/7</Badge>
                <span className="text-sm text-muted-foreground">Работают круглосуточно</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">5 мин</Badge>
                <span className="text-sm text-muted-foreground">Среднее время заявки</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Фильтры
              </Button>
              <span className="text-sm text-muted-foreground">
                Сортировка: по рейтингу
              </span>
            </div>
            
            {/* MFO Grid */}
            <div className="grid gap-4">
              {mfos.map(mfo => (
                <Link
                  key={mfo.id}
                  href={`/mfo/${mfo.slug}`}
                  className="block bg-white border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {mfo.logo && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-2 flex-shrink-0">
                        <img src={mfo.logo} alt={mfo.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {mfo.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{mfo.rating}</span>
                            <span className="text-muted-foreground">/5</span>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold text-primary">
                            от {mfo.firstLoanRate || mfo.interestRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">в день</div>
                        </div>
                      </div>
                      
                      {mfo.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {mfo.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {mfo.minAmount && mfo.maxAmount && (
                          <Badge variant="outline" className="text-xs">
                            {mfo.minAmount.toLocaleString()} - {mfo.maxAmount.toLocaleString()} ₽
                          </Badge>
                        )}
                        {mfo.decisionTime && (
                          <Badge variant="outline" className="text-xs">
                            {mfo.decisionTime}
                          </Badge>
                        )}
                        {mfo.maxTerm && (
                          <Badge variant="outline" className="text-xs">
                            до {mfo.maxTerm} дней
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {mfos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  МФО пока не добавлены
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
