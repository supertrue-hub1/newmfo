import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, ArrowRight, TrendingUp, Shield, CreditCard, PiggyBank, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    slug: 'kak-vybrat-mfo',
    title: 'Как правильно выбрать МФО: полное руководство',
    excerpt: 'Разбираем ключевые критерии выбора микрозайма: процентная ставка, сроки, скрытые комиссии и репутация компании.',
    category: 'Руководства',
    categoryIcon: CreditCard,
    readTime: '8 мин',
    date: '15 января 2025',
    featured: true,
  },
  {
    id: 2,
    slug: 'bezopasnost-zaimov',
    title: 'Безопасность онлайн-займов: как защитить свои данные',
    excerpt: 'Узнайте, как распознать мошенников и обезопасить личную информацию при оформлении займа онлайн.',
    category: 'Безопасность',
    categoryIcon: Shield,
    readTime: '5 мин',
    date: '12 января 2025',
    featured: true,
  },
  {
    id: 3,
    slug: 'kreditnaya-istoriya',
    title: 'Как улучшить кредитную историю',
    excerpt: 'Практические советы по исправлению кредитного рейтинга и повышению шансов на одобрение займа.',
    category: 'Финансы',
    categoryIcon: TrendingUp,
    readTime: '6 мин',
    date: '10 января 2025',
    featured: false,
  },
  {
    id: 4,
    slug: 'procentnaya-stavka',
    title: 'Что такое процентная ставка и как её рассчитать',
    excerpt: 'Объясняем простыми словами, как работает процентная ставка и сколько реально придётся заплатить.',
    category: 'Образование',
    categoryIcon: PiggyBank,
    readTime: '4 мин',
    date: '8 января 2025',
    featured: false,
  },
  {
    id: 5,
    slug: 'prosrochka-posledstviya',
    title: 'Последствия просрочки: что нужно знать',
    excerpt: 'Чем грозит несвоевременное погашение займа и как избежать штрафов и пени.',
    category: 'Важно',
    categoryIcon: AlertCircle,
    readTime: '5 мин',
    date: '5 января 2025',
    featured: false,
  },
  {
    id: 6,
    slug: 'refinansirovanie',
    title: 'Рефинансирование займов: когда это выгодно',
    excerpt: 'Как снизить долговую нагрузку с помощью рефинансирования и в каких случаях это имеет смысл.',
    category: 'Финансы',
    categoryIcon: TrendingUp,
    readTime: '7 мин',
    date: '2 января 2025',
    featured: false,
  },
];

const categories = [
  { name: 'Все статьи', count: 24 },
  { name: 'Руководства', count: 8 },
  { name: 'Безопасность', count: 5 },
  { name: 'Финансы', count: 7 },
  { name: 'Образование', count: 4 },
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Блог</span>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Блог о финансах
                </h1>
                <p className="text-muted-foreground">
                  Полезные статьи о займах, финансах и финансовой грамотности
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Популярные статьи
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="group overflow-hidden border-border hover:border-primary/30 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        <post.categoryIcon className="h-3 w-3 mr-1" />
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                      <Button variant="ghost" className="group/btn text-primary">
                        Читать
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
              {/* Posts Grid */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Все статьи
                </h2>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                  {regularPosts.map((post) => (
                    <Card key={post.id} className="group border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs border-border">
                            {post.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{post.date}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="mt-8 text-center">
                  <Button variant="outline" className="border-border">
                    Загрузить ещё
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="space-y-6">
                {/* Categories */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Категории</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {categories.map((cat, index) => (
                      <button
                        key={cat.name}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          index === 0 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-60">{cat.count}</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-border bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base">Подписка</CardTitle>
                    <CardDescription>
                      Получайте полезные статьи на почту
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <input
                      type="email"
                      placeholder="Ваш email"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button className="w-full">
                      Подписаться
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Полезные ссылки</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/#offers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <CreditCard className="h-4 w-4" />
                      Сравнить займы
                    </Link>
                    <Link href="/sravnit" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <PiggyBank className="h-4 w-4" />
                      Калькулятор займов
                    </Link>
                    <Link href="/#faq" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <AlertCircle className="h-4 w-4" />
                      Частые вопросы
                    </Link>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
