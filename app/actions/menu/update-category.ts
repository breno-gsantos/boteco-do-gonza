'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import z from "zod"

const schema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nome obrigatório"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  type: z.enum(["food", "drinks"]),
});

export async function updateCategory(values: unknown) {
  await protectAction();

  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    return {success: false, error: 'Dados Inválidos'}
  }

  const { id, ...data } = parsed.data;

  try {
    await prisma.category.update({
      where: { id },
      data
    });

    revalidatePath('/admin/cardapio')
    revalidatePath('/')

    return {success: true, message: 'Categoria Atualizada!'}
  } catch (error: any) {
    if (error.code === 'P2002') {
      return {success: false, message: 'Slug já existe'}
    }

    return {success: false, message: 'Erro ao atualizar a categoria'}
  }
}