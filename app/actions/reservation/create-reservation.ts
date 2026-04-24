'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'   // ← você está usando esse import
import { protectAction } from '@/lib/auth'

const createReservationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  whatsapp: z
    .string()
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11, 'WhatsApp deve ter 11 dígitos (DDD + número)'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use yyyy-mm-dd)'),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Horário inválido'),
  guests: z.coerce.number().int().min(1, 'Pelo menos 1 pessoa').max(25),
  notes: z.string().optional(),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>

export async function createReservation(data: CreateReservationInput) {
  try {
    const validated = createReservationSchema.safeParse(data)
    if (!validated.success) {
      return { success: false, message: 'Dados inválidos' }
    }

    const { name, whatsapp, date, time, guests, notes } = validated.data

    const reservationDate = new Date(`${date}T00:00:00-03:00`)

    const existing = await prisma.reservation.findFirst({
      where: {
        date: reservationDate,
        time,
        status: {
          not: 'CANCELLED'
        }
      },
    })

    if (existing && existing.status !== 'CANCELLED') {
      return {
        success: false,
        message: `Horário ${time} já está reservado para este dia.`,
      }
    }

    // Cria a reserva
    const reservation = await prisma.reservation.create({
      data: {
        name: name.trim(),
        whatsapp,
        date: reservationDate,
        time,
        guests,
        notes: notes?.trim() || null,
        status: 'PENDING',
      },
    })

    revalidatePath('/')
    revalidatePath('/admin/reservas')
    revalidatePath('/admin')

    console.log(`✅ Reserva criada com sucesso: ${reservation.id}`)

    return {
      success: true,
      message: 'Reserva solicitada com sucesso! Entraremos em contato em breve.',
      reservationId: reservation.id,
    }
  } catch (error: any) {
    console.error('Erro ao criar reserva:', error)

    // Se der erro de unique constraint, mostramos mensagem amigável
    if (error.code === 'P2002') {
      return {
        success: false,
        message: 'Este horário já foi reservado por outra pessoa.',
      }
    }

    return {
      success: false,
      message: 'Erro interno ao processar a reserva. Tente novamente.',
    }
  }
}