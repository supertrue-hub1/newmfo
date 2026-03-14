'use client';

import * as React from 'react';
import { Header, Footer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Calendar,
  TrendingUp,
  Wallet,
  Percent,
  Timer,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock user data
const userData = {
  name: 'Александр',
  lastName: 'Михайлов',
  email: 'alexander@example.com',
  phone: '+7 (999) 123-45-67',
  avatar: null,
  creditScore: 680,
  maxCreditScore: 850,
  memberSince: '15 октября 2024',
  verified: true,
};

// Mock active loans
const activeLoans = [
  {
    id: '1',
    mfoName: 'Займер',
    amount: 15000,
    totalAmount: 17100,
    remainingAmount: 11400,
    dueDate: '28 января 2025',
    daysLeft: 12,
    status: 'active',
    progress: 33,
    rate: 0.8,
  },
  {
    id: '2',
    mfoName: 'MoneyMan',
    amount: 30000,
    totalAmount: 30000,
    remainingAmount: 30000,
    dueDate: '5 февраля 2025',
    daysLeft: 20,
    status: 'active',
    progress: 0,
    rate: 0,
  },
];

// Mock history
const historyItems = [
  {
    id: '1',
    type: 'approved',
    mfoName: 'Займер',
    amount: 15000,
    date: '16 января 2025',
    status: 'Одобрено',
  },
  {
    id: '2',
    type: 'approved',
    mfoName: 'MoneyMan',
    amount: 30000,
    date: '15 января 2025',
    status: 'Одобрено',
  },
  {
    id: '3',
    type: 'rejected',
    mfoName: 'Турбозайм',
    amount: 50000,
    date: '10 января 2025',
    status: 'Отклонено',
  },
  {
    id: '4',
    type: 'repaid',
    mfoName: 'еКапуста',
    amount: 5000,
    date: '5 января 2025',
    status: 'Погашено',
  },
];

// Mock stats
const stats = {
  totalLoans: 12,
  totalAmount: 185000,
  repaidLoans: 10,
  activeLoans: 2,
};

// Generate MFO logo
function MFOLogo({ name, className }: { name: string; className?: string }) {
  const colors: Record<string, string> = {
    'Займер': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'MoneyMan': 'bg-gradient-to-br from-green-500 to-green-600',
    'еКапуста': 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'Турбозайм': 'bg-gradient-to-br from-orange-500 to-orange-600',
    'Moneza': 'bg-gradient-to-br from-purple-500 to-purple-600',
    'Webbankir': 'bg-gradient-to-br from-sky-500 to-sky-600',
    'До зарплаты': 'bg-gradient-to-br from-amber-500 to-amber-600',
    'Lime': 'bg-gradient-to-br from-lime-500 to-lime-600',
  };
  const bgColor = colors[name] || 'bg-gradient-to-br from-slate-500 to-slate-600';
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className={cn('flex items-center justify-center rounded-xl text-white font-bold text-xs', bgColor, className)}>
      {initials}
    </div>
  );
}

// Menu item component
function MenuItem({ icon: Icon, label, active = false, badge }: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string | number;
}) {
  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
          {badge}
        </Badge>
      )}
    </button>
  );
}

export default function CabinetPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Profile Header */}
          <Card className="mb-6 border-border overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-10">
                <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                    {userData.name[0]}{userData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-2 sm:pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-foreground">
                      {userData.name} {userData.lastName}
                    </h1>
                    {userData.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Верифицирован
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 border-border">
                  <Settings className="h-4 w-4" />
                  Настройки
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-foreground">{stats.totalLoans}</div>
                  <div className="text-xs text-muted-foreground">Всего займов</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-foreground">{stats.totalAmount.toLocaleString('ru-RU')} ₽</div>
                  <div className="text-xs text-muted-foreground">Общая сумма</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-green-600">{stats.repaidLoans}</div>
                  <div className="text-xs text-muted-foreground">Погашено</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-bold text-primary">{stats.activeLoans}</div>
                  <div className="text-xs text-muted-foreground">Активных</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="space-y-4">
              {/* Credit Score */}
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Кредитный рейтинг
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-foreground">{userData.creditScore}</span>
                    <span className="text-muted-foreground text-sm mb-0.5">/ {userData.maxCreditScore}</span>
                  </div>
                  <Progress value={(userData.creditScore / userData.maxCreditScore) * 100} className="h-2 mb-1" />
                  <div className="text-xs text-green-600 font-medium">Хорошо</div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <Card className="border-border">
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    <MenuItem icon={CreditCard} label="Мои займы" active badge={2} />
                    <MenuItem icon={FileText} label="История заявок" />
                    <MenuItem icon={Wallet} label="Мои карты" />
                    <MenuItem icon={Bell} label="Уведомления" badge={3} />
                    <MenuItem icon={Shield} label="Безопасность" />
                    <MenuItem icon={HelpCircle} label="Помощь" />
                  </nav>
                </CardContent>
              </Card>

              {/* Logout */}
              <Button variant="outline" className="w-full gap-2 border-border text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </aside>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Active Loans */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Активные займы
                  </h2>
                  <Button variant="outline" size="sm" className="gap-2 border-border h-8">
                    <Plus className="h-3 w-3" />
                    Новый займ
                  </Button>
                </div>

                {activeLoans.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {activeLoans.map((loan) => (
                      <Card key={loan.id} className="border-border hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <MFOLogo name={loan.mfoName} className="h-8 w-8" />
                              <div>
                                <h3 className="font-medium text-foreground text-sm">{loan.mfoName}</h3>
                                <div className="text-xs text-muted-foreground">
                                  {loan.rate === 0 ? '0%' : `${loan.rate}%`}
                                </div>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                              Активен
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">К возврату</span>
                              <span className="font-medium text-foreground">{loan.totalAmount.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Осталось</span>
                              <span className="font-medium text-foreground">{loan.remainingAmount.toLocaleString('ru-RU')} ₽</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Прогресс</span>
                                <span className="font-medium">{loan.progress}%</span>
                              </div>
                              <Progress value={loan.progress} className="h-1.5" />
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-border">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 text-orange-500" />
                                <span>{loan.daysLeft} дн. до {loan.dueDate}</span>
                              </div>
                              <Button size="sm" className="gap-1 h-7 text-xs">
                                Погасить
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-border border-dashed">
                    <CardContent className="p-6 text-center">
                      <CreditCard className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-medium text-foreground mb-1 text-sm">Нет активных займов</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        Оформите первый займ
                      </p>
                      <Button size="sm" className="gap-2">
                        <Plus className="h-3 w-3" />
                        Получить займ
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* Quick Actions */}
              <section>
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  Быстрые действия
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: CreditCard, label: 'Новый займ', color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
                    { icon: ArrowDownLeft, label: 'Погасить', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
                    { icon: FileText, label: 'Документы', color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
                    { icon: HelpCircle, label: 'Поддержка', color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' },
                  ].map((action, i) => (
                    <Card key={i} className="border-border hover:border-primary/30 transition-colors cursor-pointer group">
                      <CardContent className="p-3 text-center">
                        <div className={cn('inline-flex h-10 w-10 items-center justify-center rounded-xl mb-1.5', action.color)}>
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* History */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    История заявок
                  </h2>
                </div>

                <Card className="border-border">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {historyItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors">
                          <MFOLogo name={item.mfoName} className="h-8 w-8" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground text-sm">{item.mfoName}</h4>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{item.amount.toLocaleString('ru-RU')} ₽</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{item.date}</div>
                          </div>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs',
                              item.type === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                              item.type === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                              item.type === 'repaid' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            )}
                          >
                            {item.type === 'approved' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {item.type === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                            {item.type === 'repaid' && <ArrowDownLeft className="h-3 w-3 mr-1" />}
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
