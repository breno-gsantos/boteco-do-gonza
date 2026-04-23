'use server'

import prisma from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server"

export async function syncClerkUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const email = user.primaryEmailAddress?.emailAddress
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

  await prisma.account.upsert({
    where: { clerkId: user.id },
    update: {
      email: email || '',
      name: name
    },
    create: {
      clerkId: user.id,
      email: email || '',
      name: name,
      role: 'ADMIN'
    },
  });

  return { success: true };
}