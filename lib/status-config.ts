import { CheckCircle2, Clock, LucideIcon, UserCheck, XCircle } from "lucide-react";
import { ReservationStatus } from "./generated/prisma/enums";

export const statusConfig: Record<ReservationStatus, { label: string; color: string; icon: LucideIcon }> = {
  PENDING:   { label: 'Pendente',   color: 'bg-amber-500/10 text-amber-600 border border-amber-500/20', icon: Clock },
  CONFIRMED: { label: 'Confirmada',  color: 'bg-green-500/10 text-green-600 border border-green-500/20', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelada',   color: 'bg-red-500/10 text-red-600 border border-red-500/20', icon: XCircle },
  NO_SHOW:   { label: 'No Show',     color: 'bg-gray-500/10 text-gray-600 border border-gray-500/20', icon: UserCheck },
}