'use server'

import { protectAction } from "@/lib/auth"
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleBlockedSlot(date: string, time: string, reason?: string) {
  await protectAction();

  const normalizedDate = new Date(date + "T00:00:00");

  const existing = await prisma.blockedSlot.findUnique({
    where: {
      date_time: {
        date: normalizedDate,
        time
      }
    }
  });

  if (existing) {
    await prisma.blockedSlot.delete({
      where: { id: existing.id }
    });

    revalidatePath('/admin/horarios');
    revalidatePath('/');

    return { status: 'unblocked' }
  }

  await prisma.blockedSlot.create({
    data: {
      date: normalizedDate,
      time,
      reason
    }
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');

  return { status: 'blocked' }
}