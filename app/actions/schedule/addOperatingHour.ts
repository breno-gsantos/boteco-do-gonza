'use server'

import { protectAction } from "@/lib/auth"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addOperatingHour(dayOfWeek: number, time: string) {
  await protectAction();

  await prisma.operatingHour.upsert({
    where: {
      dayOfWeek_time: { dayOfWeek, time }
    },
    update: {
      isActive: true
    },
    create: {
      dayOfWeek,
      time,
      isActive: true
    }
  });

  revalidatePath('/admin/horarios');

  return { success: true }
}