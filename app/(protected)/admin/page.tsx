'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, CalendarDays, CheckCircle2, Clock, DollarSign, TrendingUp, Users, XCircle } from "lucide-react"

const stats = [
  { name: "Reservas Hoje", value: "24", change: "+12%", trend: "up", icon: CalendarDays },
  { name: "Clientes Atendidos", value: "156", change: "+8%", trend: "up", icon: Users },
  { name: "Receita do Dia", value: "R$ 4.850", change: "+23%", trend: "up", icon: DollarSign },
  { name: "Taxa de Ocupação", value: "87%", change: "-3%", trend: "down", icon: TrendingUp },
]

const recentReservations = [
  { id: 1, name: "João Silva", date: "Hoje", time: "19:00", guests: 4, status: "confirmed" },
  { id: 2, name: "Maria Santos", date: "Hoje", time: "20:00", guests: 2, status: "pending" },
  { id: 3, name: "Pedro Costa", date: "Hoje", time: "20:30", guests: 6, status: "confirmed" },
  { id: 4, name: "Ana Oliveira", date: "Hoje", time: "21:00", guests: 3, status: "confirmed" },
  { id: 5, name: "Carlos Lima", date: "Amanhã", time: "19:30", guests: 5, status: "pending" },
]

const popularItems = [
  { name: "Caipirinha Original", orders: 45, revenue: "R$ 675" },
  { name: "Bolinho de Bacalhau", orders: 38, revenue: "R$ 570" },
  { name: "Picanha na Chapa", orders: 32, revenue: "R$ 1.280" },
  { name: "Chopp Pilsen", orders: 67, revenue: "R$ 670" },
]

export default function AdminPage(){
    return(
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Visão Geral do seu Negócio</p>
            </div>
            
            {/* Stats Grid */}
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {stats.map((stat) => (
                <Card key={stat.name} className="bg-card border-border hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">

                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className={cn('flex items-center gap-1 text-sm font-medium', stat.trend === 'up' ? 'text-green-500' : 'text-red-500')}>
                        {stat.change}
                        {stat.trend === 'up' ? (
                          <ArrowUpRight className="size-4" />
                        ) : (
                          <ArrowDownRight className="size-4" />
                        )}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 grid-cols-2">
              {/* Recent Reservations */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="font-serif text-lg">Reservas Recentes</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver todas</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentReservations.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {reservation.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{reservation.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-3" />
                            <span>{reservation.date}, {reservation.time}</span>
                            <span className="text-primary">•</span>
                            <span>{reservation.guests} pessoas</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {reservation.status === "confirmed" ? (
                          <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmada
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3" />
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Popular Items */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="font-serif text-lg">Itens Mais Vendidos</CardTitle>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">Ver cardápio</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {popularItems.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.orders} pedidos hoje</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">{item.revenue}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button className="h-auto py-4 flex-col gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                    <CalendarDays className="size-5" />
                    <span>Nova Reserva</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border">
                    <Users className="size-5" />
                    <span>Cadastrar Cliente</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border">
                    <XCircle className="size-5" />
                    <span>Bloquear Horário</span>
                  </Button>
                  <Button className="h-auto py-4 flex-col gap-2 bg-secondary text-foreground hover:bg-secondary/80 border border-border">
                    <TrendingUp className="size-5" />
                    <span>Ver Relatórios</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
    )
}