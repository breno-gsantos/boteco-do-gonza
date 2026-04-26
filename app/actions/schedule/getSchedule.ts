'use server'

import prisma from "@/lib/db"

export async function getOperatingHours() {
  const hours = await prisma.operatingHour.findMany({
    where: { isActive: true },
    orderBy: [{dayOfWeek: 'asc'}, {time: 'asc'}]
  })

  return hours
}

export async function getBlockedSlots() {
  const blocked = await prisma.blockedSlot.findMany({
    orderBy: {date: 'asc'}
  })

  return blocked
}