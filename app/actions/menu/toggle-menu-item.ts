'use server'

import { protectAction } from "@/lib/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function toggleMenuItem(id: string, isAvailable: boolean) {
  await protectAction();

  await prisma.menuItem.update({
    where: { id },
    data: {
      isAvailable
    }
  })

  revalidatePath('/admin/cardapio');
  revalidatePath('/');
}