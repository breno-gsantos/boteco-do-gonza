'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { endOfDay, startOfDay } from "date-fns";

const OPENING_HOURS: Record<number, string[]> = {
  1: ['17:00', '18:00', '19:00', '20:00', '21:00'], // Segunda
  2: ['17:00', '18:00', '19:00', '20:00', '21:00'],
  3: ['17:00', '18:00', '19:00', '20:00', '21:00'],
  4: ['17:00', '18:00', '19:00', '20:00', '21:00'],
  5: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'], // Sexta
  6: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'], // Sábado
  0: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'], // Domingo
}

export async function getAvailableTimes(selectedDate: string) {
  const date = new Date(selectedDate + 'T00:00:00-03:00');
  const dayOfWeek = date.getDay()

  const allPossibleTimes = OPENING_HOURS[dayOfWeek] || [];

  const existing = await prisma.reservation.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date)
      },
      status: { in: ['PENDING', 'CONFIRMED'] }
    },
    select: {time: true}
  })

  const occupied = new Set(existing.map(r => r.time))

  const available = allPossibleTimes.filter(time => !occupied.has(time));

  return available;
}