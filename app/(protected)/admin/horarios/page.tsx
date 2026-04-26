import { getBlockedSlots, getOperatingHours } from "@/app/actions/schedule/getSchedule";
import { ClientDisponibility } from "@/components/admin/hours/client-disponibility";
import { getReservations } from "../reservas/page";

export default async function HorariosPage() {
    const operatingHours = await getOperatingHours();
    const blockedSlots = await getBlockedSlots();
    const reservations = await getReservations();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-bold">Disponibilidade de Reservas</h1>
                <p className="text-muted-foreground mt-1">Configure os horários de funcionamento e bloqueios pontuais</p>
            </div>

            <ClientDisponibility blockedSlots={blockedSlots} operatingHours={operatingHours} reservations={reservations} />
        </div>
    )
}