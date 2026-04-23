'use server'

import { protectAction } from "@/lib/auth"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function DeleteMenuItem(id: string) {
  await protectAction();

  try {
    await prisma.menuItem.delete({
      where: { id }
    })

    revalidatePath('/admin/cardapio')
    revalidatePath('/')

    return {success: true, message: 'Item excluído!'}
  } catch (error) {
    return {success: false, message: 'Erro ao excluir item'}
  }
}