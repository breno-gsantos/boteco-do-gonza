'use server'

import prisma from "@/lib/db";
import { endOfDay, startOfDay } from "date-fns";

export async function getAvailableTimes(selectedDate: string) {
  const date = new Date(selectedDate + 'T00:00:00-03:00');
  const dayOfWeek = date.getDay();

  // 🔥 1. horários base (admin define)
  const operatingHours = await prisma.operatingHour.findMany({
    where: {
      dayOfWeek,
      isActive: true
    },
    orderBy: {
      time: 'asc'
    },
    select: {
      time: true
    }
  });

  const allPossibleTimes = operatingHours.map(h => h.time);

  // 🔥 2. reservas existentes
  const existing = await prisma.reservation.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      },
      status: { in: ['PENDING', 'CONFIRMED'] }
    },
    select: { time: true }
  });

  const occupied = new Set(existing.map(r => r.time));

  // 🔥 3. bloqueios do admin
  const blocked = await prisma.blockedSlot.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    select: { time: true }
  });

  const blockedTimes = new Set(blocked.map(b => b.time));

  // 🔥 4. filtro final
  const available = allPossibleTimes.filter(
    time => !occupied.has(time) && !blockedTimes.has(time)
  );

  return available;
}