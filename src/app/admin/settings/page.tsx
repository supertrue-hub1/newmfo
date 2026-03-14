"use client"

import * as React from "react"
import { Settings, Globe, Bell, Shield, Database, Palette } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управление настройками агрегатора
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Общие настройки */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Общие настройки</CardTitle>
            </div>
            <CardDescription>
              Основные параметры сайта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Название сайта</Label>
              <Input id="site-name" defaultValue="cashpeek" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site-url">URL сайта</Label>
              <Input id="site-url" defaultValue="https://cashpeek.ru" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email администратора</Label>
              <Input id="admin-email" type="email" defaultValue="admin@cashpeek.ru" />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        {/* SEO настройки */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle>SEO настройки</CardTitle>
            </div>
            <CardDescription>
              Мета-теги и индексация
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input id="meta-title" defaultValue="cashpeek — Сравнить займы онлайн" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea 
                id="meta-description" 
                defaultValue="Сравните условия проверенных МФО. Займы онлайн под 0% для новых клиентов."
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Индексация поисковиками</Label>
                <p className="text-sm text-muted-foreground">
                  Разрешить индексацию сайта
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        {/* API интеграции */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              <CardTitle>API интеграции</CardTitle>
            </div>
            <CardDescription>
              Ключи доступа к внешним API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leads-api">Leads.su API Key</Label>
              <Input 
                id="leads-api" 
                type="password" 
                defaultValue="sk_live_xxxxxxxxxxxxx" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admitad-api">Admitad API Key</Label>
              <Input 
                id="admitad-api" 
                type="password" 
                placeholder="Введите API ключ" 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Режим тестирования</Label>
                <p className="text-sm text-muted-foreground">
                  Использовать тестовый API
                </p>
              </div>
              <Switch />
            </div>
            <Button>Сохранить изменения</Button>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Уведомления</CardTitle>
            </div>
            <CardDescription>
              Настройка оповещений
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email уведомления</Label>
                <p className="text-sm text-muted-foreground">
                  Получать уведомления на email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ошибки синхронизации</Label>
                <p className="text-sm text-muted-foreground">
                  Уведомлять об ошибках API
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Новые конверсии</Label>
                <p className="text-sm text-muted-foreground">
                  Уведомлять о новых конверсиях
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Еженедельный отчёт</Label>
                <p className="text-sm text-muted-foreground">
                  Получать сводку каждую неделю
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Безопасность */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Безопасность</CardTitle>
            </div>
            <CardDescription>
              Настройки безопасности панели
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Двухфакторная аутентификация</Label>
                <p className="text-sm text-muted-foreground">
                  Дополнительная защита аккаунта
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Срок действия сессии</Label>
              <Select defaultValue="24h">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 час</SelectItem>
                  <SelectItem value="6h">6 часов</SelectItem>
                  <SelectItem value="24h">24 часа</SelectItem>
                  <SelectItem value="7d">7 дней</SelectItem>
                  <SelectItem value="30d">30 дней</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Логирование действий</Label>
                <p className="text-sm text-muted-foreground">
                  Записывать все действия в лог
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="destructive">Сменить пароль</Button>
          </CardContent>
        </Card>

        {/* Внешний вид */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Внешний вид</CardTitle>
            </div>
            <CardDescription>
              Настройки отображения
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Тема по умолчанию</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Тёмная</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Акцентный цвет</Label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary cursor-pointer ring-2 ring-primary ring-offset-2" />
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Компактный режим</Label>
                <p className="text-sm text-muted-foreground">
                  Уменьшить отступы в таблицах
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
