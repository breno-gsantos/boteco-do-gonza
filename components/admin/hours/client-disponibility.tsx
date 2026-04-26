'use client'

import { addOperatingHour } from "@/app/actions/schedule/addOperatingHour";
import { deleteOperatingHour } from "@/app/actions/schedule/deleteOperatingHour";
import { toggleBlockedSlot } from "@/app/actions/schedule/toggleBlockedSlot";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { BlockedSlot, OperatingHour, Reservation } from "@/lib/generated/prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Ban, CalendarDays, CalendarIcon, Check, Clock, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type TimeSlot = {
  time: string;
  status: 'available' | 'blocked' | 'booked'
};

interface Props{
  operatingHours: OperatingHour[];
  blockedSlots: BlockedSlot[];
  reservations: Reservation[];
}

export function ClientDisponibility({ blockedSlots, operatingHours, reservations }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [newTime, setNewTime] = useState<string>("")
  const [loadingTime, setLoadingTime] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState<boolean>(false)

  const getDayName = (date: Date) => {
    return format(date, "EEEE", { locale: ptBR })
  }

  const dateKey = format(selectedDate, "yyyy-MM-dd")
  const dayOfWeek = selectedDate.getDay()

  const baseSlots = useMemo(() => {
    return operatingHours
      .filter(h => h.dayOfWeek === dayOfWeek && h.isActive)
      .map(h => h.time)
      .sort()
  }, [operatingHours, dayOfWeek])

  const blockedForDate = useMemo(() => {
    return blockedSlots
      .filter(b => format(b.date, "yyyy-MM-dd") === dateKey)
      .map(b => b.time)
  }, [blockedSlots, dateKey])

  const bookedForDate = useMemo(() => {
  return reservations
    .filter(r =>
      format(new Date(r.date), "yyyy-MM-dd") === dateKey &&
      ['PENDING', 'CONFIRMED'].includes(r.status)
    )
    .map(r => r.time)
}, [reservations, dateKey])

  const timeSlots: TimeSlot[] = useMemo(() => {
    return baseSlots.map(time => {
      if (bookedForDate.includes(time)) {
        return { time, status: 'booked' }
      }

      if (blockedForDate.includes(time)) {
        return { time, status: 'blocked' }
      }

      return { time, status: 'available' }
    })
  }, [baseSlots, blockedForDate, bookedForDate])

  const stats = {
    total: timeSlots.length,
    available: timeSlots.filter(t => t.status === 'available').length,
    blocked: timeSlots.filter(t => t.status === 'blocked').length,
    booked: timeSlots.filter(t => t.status === 'booked').length,
  }

  async function handleToggleBlock(time: string) {
    if (loadingTime) return

    try {
      setLoadingTime(time)
      await toggleBlockedSlot(dateKey, time)
      toast.success("Horário atualizado")
    } catch (error) {
      toast.error("Erro ao atualizar horário")
    } finally {
      setLoadingTime(null)
    }
  }

  async function handleBlockAll() {
    try {
      setBulkLoading(true)

      const availableTimes = timeSlots
        .filter(t => t.status === 'available')
        .map(t => t.time)

      await Promise.all(
        availableTimes.map(time => toggleBlockedSlot(dateKey, time))
      )

      toast.success("Todos horários bloqueados")
    } catch {
      toast.error("Erro ao bloquear horários")
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleUnblockAll() {
    try {
      setBulkLoading(true)

      await Promise.all(
        blockedForDate.map(time => toggleBlockedSlot(dateKey, time))
      )

      toast.success("Horários liberados")
    } catch {
      toast.error("Erro ao liberar horários")
    } finally {
      setBulkLoading(false)
    }
  }

  async function handleAddTimeSlot() {
    if (!newTime) return

    if (baseSlots.includes(newTime)) {
      toast.error("Horário já existe")
      return
    }

    try {
      await addOperatingHour(dayOfWeek, newTime)
      toast.success("Horário adicionado")
      setNewTime("")
      setIsAddDialogOpen(false)
    } catch {
      toast.error("Erro ao adicionar horário")
    }
  }

  async function handleDelete(time: string) {
    if (loadingTime) return;

    try {
      setLoadingTime(time);

      await deleteOperatingHour(dayOfWeek, time);

      toast.success("Horário removido");
    } catch (error) {
      toast.error("Erro ao remover horário");
    } finally {
      setLoadingTime(null);
  }
}

  return (
    <div className="space-y-8">
      {/* Date Selector */}
      <Card className="bg-card border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CalendarDays className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data Selecionada</p>
                <p className="font-medium text-foreground capitalize">
                  {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  {getDayName(selectedDate)}
                </p>
              </div>
            </div>
            <div className="sm:ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto gap-2">
                    <CalendarIcon className="size-4" />
                    Selecionar Data
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Check className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-sm text-muted-foreground">Disponíveis</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <Ban className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.blocked}</p>
              <p className="text-sm text-muted-foreground">Bloqueados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-2xl font-bold">{stats.booked}</p>
              <p className="text-sm text-muted-foreground">Ocupados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={stats.available === 0 || bulkLoading}>
              <Lock className="size-4 mr-2" />
              Bloquear Todos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bloquear o dia inteiro?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso vai bloquear todos os horários disponíveis.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleBlockAll}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" onClick={handleUnblockAll} disabled={stats.blocked === 0 || bulkLoading}>
          <Unlock className="size-4 mr-2" />
          Liberar Todos
        </Button>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="size-4 mr-2" />
              Adicionar Horário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Horário</DialogTitle>
              <DialogDescription>
                Adicione um horário extra
              </DialogDescription>
            </DialogHeader>

            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddTimeSlot}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle>
            Horários • {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {timeSlots.map(slot => (
            <div key={slot.time} className="flex justify-between items-center p-3 rounded-lg bg-muted">
              <span>{slot.time}</span>

              <div className="flex items-center gap-3">
                <Badge variant={slot.status === 'blocked' ? 'destructive' : slot.status === 'booked' ? 'secondary' : 'default'}>
                  {slot.status === 'blocked' ? 'Bloqueado' : slot.status === 'booked' ? 'Reservado' : 'Disponível'}
                </Badge>

                <Switch
                  checked={slot.status === 'available'}
                  onCheckedChange={() => handleToggleBlock(slot.time)}
                  disabled={slot.status === 'booked' || loadingTime === slot.time}
                  className="cursor-pointer bg-primary"
                />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size='icon' variant='ghost' disabled={slot.status === 'booked' || loadingTime === slot.time} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover horário?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso vai remover permanentemente o horário <strong>{slot.time}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <DialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(slot.time)}>
                        Remover
                      </AlertDialogAction>
                    </DialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}