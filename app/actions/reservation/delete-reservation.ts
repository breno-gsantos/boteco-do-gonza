'use server'

import { protectAction } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import z from "zod"

const deleteReservationSchema = z.object({
  id: z.string()
})

export async function deleteReservation(values: unknown) {
  await protectAction();

  try {
    const validated = deleteReservationSchema.safeParse(values);

    if (!validated.success) {
      return {success: false, message: 'Dados Inválidos'}
    }

    const { id } = validated.data;

    await prisma.reservation.delete({
      where: { id }
    });

    revalidatePath('/admin/reservas');

    return {success: true, message: 'Reserva excluída com sucesso'}
  } catch (error) {
    console.error('Erro ao deletar reserva: ', error)
    return {success: false, message: 'Erro ao deletar reserva'}
  }
}