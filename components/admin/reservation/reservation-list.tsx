'use client'

import { Button } from "@/components/ui/button";
import type { Reservation, ReservationStatus } from "@/lib/generated/prisma/client"
import type { LucideIcon } from "lucide-react";
import { Calendar, CheckCircle2, Clock, Filter, MoreHorizontal, Phone, Search, Trash, UserCheck, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { updateReservationStatus, UpdateReservationStatusInput } from "@/app/actions/reservation/update-reservation-status";
import { toast } from "sonner";
import { SiWhatsapp } from "react-icons/si";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deleteReservation } from "@/app/actions/reservation/delete-reservation";
import { statusConfig } from "@/lib/status-config";

type FilterType = 'all' | ReservationStatus

interface Props{
  reservations: Reservation[]
}

export function ReservationList({reservations}: Props) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState("")
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.whatsapp.includes(search)

    return matchesFilter && matchesSearch
  })

  const stats = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "CONFIRMED").length,
    pending: reservations.filter(r => r.status === "PENDING").length,
    cancelled: reservations.filter(r => r.status === "CANCELLED").length,
  }

  async function handleStatusChange(id: string, newStatus: ReservationStatus,tableNumber?: number) {
  if (loadingId === id) return

  setLoadingId(id)

  try {
    const payload: UpdateReservationStatusInput = {
      id,
      status: newStatus,
      tableNumber,
    }

    const result = await updateReservationStatus(payload)

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message || "Erro ao atualizar")
    }
    } catch (error) {
      toast.error("Erro inesperado")
    } finally {
      setLoadingId(null)
    }

    if (reservations.length === 0) {
      return <p className="text-muted-foreground py-8 text-center">Nenhuma Reserva Encontrada.</p>
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta reserva? Essa ação não pode ser desfeita.')) return

    const result = await deleteReservation({ id })

    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className={`cursor-pointer transition-all ${filter === "all" ? "border-primary bg-primary/5" : "bg-card border-border hover:border-primary/30"}`} onClick={() => setFilter("all")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className='cursor-pointer transition-all' onClick={() => setFilter("CONFIRMED")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.confirmed}</p>
              <p className="text-sm text-muted-foreground">Confirmadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className='cursor-pointer transition-all' onClick={() => setFilter("PENDING")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pendentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className='cursor-pointer transition-all' onClick={() => setFilter("CANCELLED")}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="size-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground">Canceladas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou telefone..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-2 border-border">
          <Filter className="size-4" />
          Filtros
        </Button>
      </div>

      {/* Reservations list */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-serif text-lg">
            {filter === "all" ? "Todas as Reservas" : `Reservas ${statusConfig[filter].label}s`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">Nenhuma reserva encontrada</div>
          ) : (
            filteredReservations.map((reservation) => {
              const status = statusConfig[reservation.status]
              const Icon = status.icon
              
              return (
                <div key={reservation.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">{reservation.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{reservation.name}</p>
                        {reservation.notes && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{reservation.notes}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Phone className="size-3" />{reservation.whatsapp}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {format(new Date(reservation.date), "dd 'de' MMMM yyyy", {locale: ptBR})}, {reservation.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {reservation.guests} pessoas
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${status.color}`}>
                      <Icon className="size-3" />
                      {status.label}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        {reservation.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')} disabled={loadingId === reservation.id}>
                              <CheckCircle2 className="size-4 text-green-500" />
                                Confirmar
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => handleStatusChange(reservation.id, 'CANCELLED')} disabled={loadingId === reservation.id}>
                              <XCircle className="size-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}

                        {reservation.status === 'CONFIRMED' && (
                          <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleStatusChange(reservation.id, 'NO_SHOW')} disabled={loadingId === reservation.id}>
                              <UserCheck className="size-4" />
                              Marcar No-Show
                            </DropdownMenuItem>

                            <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => handleStatusChange(reservation.id, 'CANCELLED')} disabled={loadingId === reservation.id}>
                              <XCircle className="size-4" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                          
                        )}

                        {reservation.status === 'CANCELLED' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'PENDING')} disabled={loadingId === reservation.id}>
                            <Clock className="size-4 text-amber-500" />
                            Reativar
                          </DropdownMenuItem>
                        )}

                        {/* NO SHOW */}
                        {reservation.status === 'NO_SHOW' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(reservation.id, 'CONFIRMED')} disabled={loadingId === reservation.id}>
                            <CheckCircle2 className="size-4 text-green-500" />
                            Marcar como compareceu
                          </DropdownMenuItem>
                        )}

                        {/* WhatsApp */}
                        <DropdownMenuItem onClick={() => window.open(`https://wa.me/55${reservation.whatsapp}`)}>
                          <SiWhatsapp className="size-4" />
                          WhatsApp
                        </DropdownMenuItem>

                        {/* DELETE GERAL */}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(reservation.id)}>
                          <Trash className="size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}