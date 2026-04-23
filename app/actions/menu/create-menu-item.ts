'use server'

import { protectAction } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.string(),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  order: z.number().int().default(0),
  imageUrl: z.string().optional(),
})

export async function createMenuItem(values: unknown) {
  await protectAction();

  try {
    const validated = schema.safeParse(values);

    if (!validated.success) return { success: false, message: 'Dados Inválidos' }
    
    await prisma.menuItem.create({
      data: validated.data
    })

    revalidatePath('/admin/cardapio')
    revalidatePath('/')

    return {success: true, message: 'Item adicionado ao cardápio!'}
  } catch (error) {
    return {success: false, message: 'Erro ai criar o item'}
  }
}