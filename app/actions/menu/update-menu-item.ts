'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import z from "zod"

const schema = z.object({
  id: z.string(),
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  categoryId: z.string(),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().optional(),
})

export async function updateMenuItem(values: unknown) {
  await protectAction();

  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    return {success: false, message: 'Dados Inválidos'}
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.menuItem.update({
      where: { id },
      data
    })

    revalidatePath('/admin/cardapio')
    revalidatePath('/')

    return { success: true, message: "Item atualizado!" }
  } catch (error) {
    return { success: false, message: "Erro ao atualizar" }
  }
}