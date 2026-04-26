'use server'

import prisma from "@/lib/db";
import { protectAction } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function blockManySlots(date: string, times: string[]) {
  await protectAction();

  const normalizedDate = new Date(date + "T00:00:00");

  await prisma.blockedSlot.createMany({
    data: times.map(time => ({
      date: normalizedDate,
      time
    })),
    skipDuplicates: true
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');

  return { success: true }
}

export async function unblockManySlots(date: string, times: string[]) {
  await protectAction();

  const normalizedDate = new Date(date + "T00:00:00");

  await prisma.blockedSlot.deleteMany({
    where: {
      date: normalizedDate,
      time: { in: times }
    }
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');

  return { success: true }
}