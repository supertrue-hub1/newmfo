import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, User, ChevronRight, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { ContextualFAQ } from '@/components/blog/contextual-faq';
import { FAQSchema } from '@/components/seo/faq-schema';
import { PageFAQProvider } from '@/contexts/page-faq-context';
import { exampleArticleData, extractFAQsFromSections, type ArticleSection } from '@/lib/blog/faq-utils';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Генерация метаданных для SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // В реальном приложении здесь будет запрос к CMS/API
  if (slug !== exampleArticleData.slug) {
    return { title: 'Статья не найдена' };
  }

  const faqs = extractFAQsFromSections(exampleArticleData.sections);

  return {
    title: `${exampleArticleData.title} | Блог`,
    description: exampleArticleData.excerpt,
    openGraph: {
      title: exampleArticleData.title,
      description: exampleArticleData.excerpt,
      type: 'article',
      publishedTime: exampleArticleData.date,
      authors: [exampleArticleData.author.name],
    },
    // Дополнительные метаданные для статьи с FAQ
    other: {
      'article:section': exampleArticleData.category,
    },
  };
}

// Генерация статических путей (для SSG)
export async function generateStaticParams() {
  return [
    { slug: exampleArticleData.slug },
  ];
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // В реальном приложении здесь будет запрос к CMS/API
  if (slug !== exampleArticleData.slug) {
    notFound();
  }

  const article = exampleArticleData;
  const allFAQs = extractFAQsFromSections(article.sections);

  return (
    <>
      {/* JSON-LD Schema для FAQ - рендерится один раз со всеми вопросами */}
      <FAQSchema items={allFAQs} />

      <PageFAQProvider initialFAQs={allFAQs}>
        <div className="flex min-h-screen flex-col">
          <Header />

          <main className="flex-1">
            {/* Breadcrumbs */}
            <div className="bg-muted/30 py-3">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link href="/" className="hover:text-primary transition-colors">
                    Главная
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Блог
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-foreground truncate">{article.title}</span>
                </div>
              </div>
            </div>

            {/* Article Header */}
            <article className="py-8 md:py-12">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  {/* Back button (mobile) */}
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 md:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Назад к блогу
                  </Link>

                  {/* Meta info */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {article.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {article.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {article.title}
                  </h1>

                  {/* Author */}
                  <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{article.author.name}</p>
                      <p className="text-sm text-muted-foreground">Автор статьи</p>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <ArticleContent sections={article.sections} />
                  </div>

                  {/* Article Footer Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-8 pt-8 border-t border-border">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Поделиться
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Bookmark className="h-4 w-4" />
                      Сохранить
                    </Button>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Articles */}
            <section className="py-8 md:py-12 bg-muted/30">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Похожие статьи
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="p-4 border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <p className="text-sm text-muted-foreground mb-1">Безопасность</p>
                      <h3 className="font-medium text-foreground line-clamp-2">
                        Безопасность онлайн-займов: как защитить свои данные
                      </h3>
                    </Card>
                    <Card className="p-4 border-border hover:border-primary/30 transition-colors cursor-pointer">
                      <p className="text-sm text-muted-foreground mb-1">Финансы</p>
                      <h3 className="font-medium text-foreground line-clamp-2">
                        Как улучшить кредитную историю
                      </h3>
                    </Card>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </PageFAQProvider>
    </>
  );
}

/**
 * Серверный компонент для рендеринга контента статьи
 */
function ArticleContent({ sections }: { sections: ArticleSection[] }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'heading':
            const HeadingTag = `h${section.level}` as keyof JSX.IntrinsicElements;
            const headingClasses = {
              1: 'text-3xl font-bold mt-8 mb-4',
              2: 'text-2xl font-semibold mt-8 mb-4',
              3: 'text-xl font-semibold mt-6 mb-3',
              4: 'text-lg font-medium mt-4 mb-2',
              5: 'text-base font-medium mt-4 mb-2',
              6: 'text-sm font-medium mt-3 mb-2',
            };
            return (
              <HeadingTag
                key={index}
                className={headingClasses[section.level || 2]}
              >
                {section.content}
              </HeadingTag>
            );

          case 'text':
            return (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {section.content}
              </p>
            );

          case 'faq':
            if (!section.items?.length) return null;
            return (
              <ContextualFAQ
                key={index}
                items={section.items}
                title="Часто задаваемые вопросы"
                variant="default"
              />
            );

          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6"
              >
                {section.content}
                {section.author && (
                  <footer className="text-sm mt-2">— {section.author}</footer>
                )}
              </blockquote>
            );

          case 'image':
            return (
              <figure key={index} className="my-6">
                <img
                  src={section.src}
                  alt={section.alt || ''}
                  className="rounded-lg w-full"
                />
                {section.alt && (
                  <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                    {section.alt}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </>
  );
}
