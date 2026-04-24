import prisma from "@/lib/db"

export async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const [
    totalToday,
    confirmedToday,
    pendingToday,
    cancelledToday,
    recentReservations
  ] = await Promise.all([
    prisma.reservation.count({
      where: {
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    prisma.reservation.count({
      where: {
        status: "CONFIRMED",
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    prisma.reservation.count({
      where: {
        status: "PENDING",
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    prisma.reservation.count({
      where: {
        status: "CANCELLED",
        date: {
          gte: today,
          lt: tomorrow
        }
      }
    }),
    prisma.reservation.findMany({
      orderBy: { date: "desc" },
      take: 5
    })
  ])

  return {
    totalToday,
    confirmedToday,
    pendingToday,
    cancelledToday,
    recentReservations
  }
}