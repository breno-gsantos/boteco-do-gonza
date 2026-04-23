'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Calendar, Mail, MoreHorizontal, Phone, Plus, Search, Star } from "lucide-react"
import { useState } from "react"

interface Client {
  id: number
  name: string
  phone: string
  email?: string
  totalReservations: number
  lastVisit: string
  vip: boolean
}

const clients: Client[] = [
  { id: 1, name: "João Silva", phone: "(13) 99999-1234", email: "joao@email.com", totalReservations: 15, lastVisit: "2026-04-10", vip: true },
  { id: 2, name: "Maria Santos", phone: "(13) 99888-5678", email: "maria@email.com", totalReservations: 8, lastVisit: "2026-04-09", vip: false },
  { id: 3, name: "Pedro Costa", phone: "(13) 99777-9012", totalReservations: 22, lastVisit: "2026-04-11", vip: true },
  { id: 4, name: "Ana Oliveira", phone: "(13) 99666-3456", email: "ana@email.com", totalReservations: 5, lastVisit: "2026-04-08", vip: false },
  { id: 5, name: "Carlos Lima", phone: "(13) 99555-7890", totalReservations: 12, lastVisit: "2026-04-07", vip: true },
  { id: 6, name: "Fernanda Souza", phone: "(13) 99444-1234", email: "fernanda@email.com", totalReservations: 3, lastVisit: "2026-04-05", vip: false },
  { id: 7, name: "Roberto Alves", phone: "(13) 99333-5678", totalReservations: 18, lastVisit: "2026-04-06", vip: true },
  { id: 8, name: "Juliana Mendes", phone: "(13) 99222-9012", email: "juliana@email.com", totalReservations: 7, lastVisit: "2026-04-04", vip: false },
]

export default function ClientesPage(){
    const [search, setSearch] = useState<string>("")
    const [showVipOnly, setShowVipOnly] = useState<boolean>(false)

    const filteredClients = clients.filter((client) => {
        const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
            client.phone.includes(search) || client.email?.toLowerCase().includes(search.toLowerCase())
        const matchesVip = !showVipOnly || client.vip
        return matchesSearch && matchesVip
    })

    const stats = {
        total: clients.length,
        vip: clients.filter(c => c.vip).length,
        thisMonth: clients.filter(c => new Date(c.lastVisit) > new Date("2026-04-01")).length,
    }

    return(
        <div className="space-y-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">Clientes</h1>
                    <p className="text-muted-foreground mt-1">Gerencie sua base de clientes</p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Cliente
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                            <p className="text-sm text-muted-foreground">Total de Clientes</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.vip}</p>
                            <p className="text-sm text-muted-foreground">Clientes VIP</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
                            <p className="text-sm text-muted-foreground">Ativos este Mês</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome, telefone ou email..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <Button variant={showVipOnly ? "default" : "outline"} size="sm" onClick={() => setShowVipOnly(!showVipOnly)} className={showVipOnly ? "bg-amber-500 text-white hover:bg-amber-600" : "border-border gap-2"}>
                    <Star className={`h-4 w-4 ${showVipOnly ? "fill-white" : ""}`} />
                    Somente VIP
                </Button>
            </div>

            {/* Clients list */}
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="font-serif text-lg">Lista de Clientes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {filteredClients.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">Nenhum cliente encontrado</div>
                    ) : (
                        filteredClients.map((client) => (
                            <div key={client.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-lg font-semibold text-primary">
                                                {client.name.charAt(0)}
                                            </span>
                                        </div>
                                        {client.vip && (
                                            <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-500 flex items-center justify-center">
                                                <Star className="h-3 w-3 text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-foreground">{client.name}</p>
                                            {client.vip && (
                                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                                                    VIP
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {client.phone}
                                            </span>
                                            {client.email && (
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {client.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-medium text-foreground">{client.totalReservations} reservas</p>
                                        <p className="text-xs text-muted-foreground">
                                            Última visita: {new Date(client.lastVisit).toLocaleDateString("pt-BR")}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-card border-border">
                                            <DropdownMenuItem className="cursor-pointer">
                                                Ver Histórico
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                <Phone className="h-4 w-4 mr-2" />
                                                Ligar
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="cursor-pointer">
                                                {client.vip ? "Remover VIP" : "Tornar VIP"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    )
}