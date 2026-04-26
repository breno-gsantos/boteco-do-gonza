'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteOperatingHour(dayOfWeek: number, time: string) {
  await protectAction();

  await prisma.operatingHour.delete({
    where: {
      dayOfWeek_time: { dayOfWeek, time }
    }
  });

  revalidatePath('/admin/horarios');
  revalidatePath('/');
}