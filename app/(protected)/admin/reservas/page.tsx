import { ReservationList } from "@/components/admin/reservation/reservation-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/db"
import { Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export async function getReservations() {
    const reservations = await prisma.reservation.findMany({
        orderBy: [
            { date: 'desc' },
            { time: 'asc' },
        ],
        take: 100
    })

    return reservations;
}

export default async function ReservasPage() {
    const reservations = await getReservations();

    return(
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">Reservas</h1>
                    <p className="text-muted-foreground mt-1">Gerencie as reservas do seu estabelecimento</p>
                </div>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Link href='#nova-reserva'className="flex items-center gap-2">
                        <Plus className="size-4" />
                        Nova Reserva
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lista de Reservas</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReservationList reservations={reservations} />
                </CardContent>
            </Card>
        </div>
    )
}