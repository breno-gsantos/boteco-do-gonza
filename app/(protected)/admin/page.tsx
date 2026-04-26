import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/db"
import { statusConfig } from "@/lib/status-config"
import { cn } from "@/lib/utils"
import { ArrowDownRight, ArrowUpRight, CalendarDays, CheckCircle2, Clock, DollarSign, TrendingUp, Users, XCircle } from "lucide-react"
import Link from "next/link"

const popularItems = [
  { name: "Caipirinha Original", orders: 45, revenue: "R$ 675" },
  { name: "Bolinho de Bacalhau", orders: 38, revenue: "R$ 570" },
  { name: "Picanha na Chapa", orders: 32, revenue: "R$ 1.280" },
  { name: "Chopp Pilsen", orders: 67, revenue: "R$ 670" },
]

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export default async function AdminPage(){
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23, 59, 59, 999
    )

    const [recentReservations, todayReservationsCount] = await Promise.all([
      prisma.reservation.findMany({
        orderBy: [
          { date: "desc" },
          { time: "asc" },
        ],
        take: 100,
      }),
      prisma.reservation.count({
        where: {
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ])

    const stats = [
      { name: "Reservas Hoje", value: todayReservationsCount.toString(), change: "+12%", trend: "up", icon: CalendarDays },
      { name: "Clientes Atendidos", value: "156", change: "+8%", trend: "up", icon: Users },
      { name: "Receita do Dia", value: "R$ 4.850", change: "+23%", trend: "up", icon: DollarSign },
      { name: "Taxa de Ocupação", value: "87%", change: "-3%", trend: "down", icon: TrendingUp },
    ]   

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
                    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      <Link href='/admin/reservas'>
                        Ver todas
                      </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentReservations.map((reservation) => {
                    const status = statusConfig[reservation.status]
                    const Icon = status.icon

                    return(
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
                            <span>{formatDate(reservation.date)}, {reservation.time}</span>
                            <span className="text-primary">•</span>
                            <span>{reservation.guests} pessoas</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn('flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full', status.color)}>
                          <Icon className='size-3' />
                          {status.label}
                        </span>
                      </div>
                    </div>
                    )
                  })}
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