import { db } from '../src/lib/db';

async function main() {
  console.log('🌱 Seeding blog data...');

  // Create categories
  const categories = await Promise.all([
    db.blogCategory.upsert({
      where: { slug: 'finances' },
      update: {},
      create: {
        name: 'Финансы',
        slug: 'finances',
        description: 'Статьи о финансовой грамотности и управлении деньгами',
        color: '#10b981',
        icon: 'TrendingUp',
        sortOrder: 1,
      },
    }),
    db.blogCategory.upsert({
      where: { slug: 'guides' },
      update: {},
      create: {
        name: 'Руководства',
        slug: 'guides',
        description: 'Подробные инструкции и гайды',
        color: '#3b82f6',
        icon: 'BookOpen',
        sortOrder: 2,
      },
    }),
    db.blogCategory.upsert({
      where: { slug: 'safety' },
      update: {},
      create: {
        name: 'Безопасность',
        slug: 'safety',
        description: 'Защита данных и безопасность онлайн-займов',
        color: '#f59e0b',
        icon: 'Shield',
        sortOrder: 3,
      },
    }),
    db.blogCategory.upsert({
      where: { slug: 'credit-history' },
      update: {},
      create: {
        name: 'Кредитная история',
        slug: 'credit-history',
        description: 'Всё о кредитной истории и её улучшении',
        color: '#8b5cf6',
        icon: 'FileText',
        sortOrder: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create author
  const author = await db.blogAuthor.upsert({
    where: { slug: 'admin' },
    update: {},
    create: {
      name: 'Редакция CashPeek',
      slug: 'admin',
      bio: 'Эксперты в области микрофинансирования и финансовой грамотности',
      role: 'Финансовый эксперт',
    },
  });

  console.log(`✅ Created author: ${author.name}`);

  // Sample posts
  const posts = [
    {
      title: 'Как правильно выбрать МФО: полное руководство',
      slug: 'kak-vybrat-mfo',
      excerpt: 'Разбираем ключевые критерии выбора микрозайма: процентная ставка, сроки, скрытые комиссии и репутация компании.',
      content: `
<h2 id="vvedenie">Введение</h2>
<p>Выбор микрофинансовой организации — ответственный шаг, от которого зависит ваше финансовое благополучие. В этой статье мы подробно разберём все аспекты, на которые стоит обратить внимание.</p>

<h2 id="kriterii">Основные критерии выбора</h2>
<p>При выборе МФО важно учитывать несколько ключевых факторов:</p>

<h3 id="procentnaya-stavka">Процентная ставка</h3>
<p>Первое, на что стоит обратить внимание — это процентная ставка. Многие МФО предлагают льготные условия для новых клиентов — <strong>0% на первый займ</strong>.</p>

<h3 id="sroki">Сроки рассмотрения</h3>
<p>Время принятия решения варьируется от нескольких минут до 1-2 дней. Если деньги нужны срочно, выбирайте организации с мгновенным решением.</p>

<h3 id="summa">Максимальная сумма</h3>
<p>Лимиты для новых клиентов обычно ниже (10-30 тысяч рублей). При успешном погашении лимит увеличивается до 100 тысяч и выше.</p>

<h2 id="bezopasnost">Безопасность</h2>
<p>Всегда проверяйте наличие лицензии ЦБ РФ и регистрацию компании в реестре МФО. Это гарантирует законную работу и защиту ваших прав.</p>

<h2 id="vyvody">Выводы</h2>
<p>Не торопитесь с выбором. Сравните несколько предложений на нашем сайте и выберите оптимальный вариант для вашей ситуации.</p>
      `.trim(),
      categoryId: categories[1].id, // Guides
      authorId: author.id,
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: 'Безопасность онлайн-займов: как защитить свои данные',
      slug: 'bezopasnost-onlain-zaimov',
      excerpt: 'Узнайте, как распознать мошенников и обезопасить личную информацию при оформлении займа онлайн.',
      content: `
<h2 id="vvedenie">Введение</h2>
<p>Онлайн-займы стали удобным способом получения денег, но вместе с этим выросло количество мошенников. Расскажем, как защитить себя.</p>

<h2 id="priznaki-moshennikov">Признаки мошеннических сайтов</h2>
<ul>
<li>Поддельные сайты, копирующие известные МФО</li>
<li>Требование предоплаты до получения займа</li>
<li>Отсутствие лицензии в реестре ЦБ РФ</li>
</ul>

<h2 id="zashchita-dannyh">Защита персональных данных</h2>
<p>Никогда не передавайте данные карты третьим лицам. Используйте только официальные сайты и приложения МФО.</p>

<h2 id="proverka-mfo">Как проверить МФО</h2>
<p>Перед оформлением займа проверьте организацию в реестре микрофинансовых организаций на сайте ЦБ РФ.</p>
      `.trim(),
      categoryId: categories[2].id, // Safety
      authorId: author.id,
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(Date.now() - 86400000),
    },
    {
      title: 'Как улучшить кредитную историю',
      slug: 'kak-uluchshit-kreditnuyu-istoriyu',
      excerpt: 'Практические советы по исправлению кредитного рейтинга и повышению шансов на одобрение займа.',
      content: `
<h2 id="chto-takoe-ki">Что такое кредитная история</h2>
<p>Кредитная история — это dossier на заёмщика, которое ведут бюро кредитных историй (БКИ). Она влияет на решение банков и МФО.</p>

<h2 id="kak-proverit">Как проверить свою КИ</h2>
<p>Каждый гражданин РФ имеет право бесплатно узнать свою кредитную историю 2 раза в год в каждом БКИ.</p>

<h2 id="sposoby-uluchsheniya">Способы улучшения</h2>
<ol>
<li>Погасите все текущие задолженности</li>
<li>Оформите и своевременно погасите небольшой займ</li>
<li>Не подавайте много заявок одновременно</li>
<li>Используйте кредитные карты с умом</li>
</ol>

<h2 id="sroki">Сроки улучшения</h2>
<p>Заметное улучшение кредитной истории занимает от 6 до 12 месяцев регулярных платежей.</p>
      `.trim(),
      categoryId: categories[3].id, // Credit history
      authorId: author.id,
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      title: 'Что такое процентная ставка и как её рассчитать',
      slug: 'chto-takoe-procentnaya-stavka',
      excerpt: 'Объясняем простыми словами, как работает процентная ставка и сколько реально придётся заплатить.',
      content: `
<h2 id="osnovy">Основы процентной ставки</h2>
<p>Процентная ставка — это плата за пользование деньгами. В МФО она обычно указывается в день (например, 0.8% в день).</p>

<h2 id="rashchet">Как рассчитать переплату</h2>
<p>Формула проста: Сумма × Ставка × Дней = Переплата</p>
<p>Пример: 10 000 руб × 0.8% × 30 дней = 2 400 руб переплаты</p>

<h2 id="pds">Полная стоимость займа (ПСЗ)</h2>
<p>ПСЗ включает все комиссии и платежи. Внимательно читайте договор перед подписанием.</p>

<h2 id="lggoty">Льготные ставки</h2>
<p>Многие МФО предлагают 0% на первый займ. Это отличный способ получить деньги бесплатно при своевременном погашении.</p>
      `.trim(),
      categoryId: categories[0].id, // Finances
      authorId: author.id,
      status: 'published',
      isFeatured: false,
      publishedAt: new Date(Date.now() - 86400000 * 5),
    },
  ];

  for (const post of posts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log(`✅ Created ${posts.length} posts`);
  console.log('✨ Blog seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
