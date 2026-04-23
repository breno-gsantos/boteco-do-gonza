'use server'

import { protectAction } from '@/lib/auth';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW']),
  tableNumber: z.number().int().positive().optional(),
  notes: z.string().optional(),
})

export type UpdateReservationStatusInput = z.infer<typeof updateStatusSchema>;

export async function updateReservationStatus(values: unknown) {
  await protectAction();

  try {
    const validated = updateStatusSchema.safeParse(values);

    if (!validated.success) {
      return {success: false, message: 'Dados inválidos'}
    }

    const { id, status, notes, tableNumber } = validated.data;

    if (status === 'PENDING' || status === 'CONFIRMED') {
      const reservation = await prisma.reservation.findUnique({
        where: {id}
      })

      if (!reservation) {
        return {success: false, message: 'Reserva não encontrada'}
      }

      const conflict = await prisma.reservation.findFirst({
        where: {
          date: reservation.date,
          time: reservation.time,
          status: {
            in: ['PENDING', 'CONFIRMED']
          },
          NOT: {
            id: reservation.id
          }
        }
      })

      if (conflict) {
        return {
          success: false, message: 'Já existe outra reserva ativa para este horário.'
        }
      }
    }

    await prisma.reservation.update({
      where: { id },
      data: {
        status,
        tableNumber: tableNumber || undefined,
        notes: notes?.trim() || null,
        updatedAt: new Date()
      }
    })

    revalidatePath('/admin/reservas')

    return {success: true, message: `Reserva ${status === 'CONFIRMED' ? 'confirmada' : status === 'CANCELLED' ? 'cancelada' : 'atualizada'} com sucesso!`}
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error)
    return { success: false, message: 'Erro ao atualizar reserva'}
  }
}