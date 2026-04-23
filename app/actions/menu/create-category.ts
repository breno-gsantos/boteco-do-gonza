'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import z from "zod"

const schema = z.object({
  name: z.string().min(2, 'Nome da categoria é obrigatório'),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'Slug deve ser lowercase com hífens'),
  order: z.number().int().default(0),
})

export async function createCategory(values: unknown) {
  await protectAction();

  try {
    const validated = schema.safeParse(values);

    if (!validated.success) {
      return{success: false, message: 'Dados Inválidos'}
    }

    const category = await prisma.category.create({
      data: validated.data
    })

    revalidatePath('/admin/cardapio');
    revalidatePath('/')

    return {success: true, message: 'Categoria criada!', category}

  } catch (error: any) {
    if (error.code === 'P2002') return { success: false, message: 'Slug já existe' }
    return {success: false, message: 'Erro ao criar categoria'}
  }
}