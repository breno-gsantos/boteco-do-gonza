import { auth } from "@clerk/nextjs/server";

export async function protectAction() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Unauthorized: Você precisa estar logado para realizar esta ação.')
  }

  return userId;
}