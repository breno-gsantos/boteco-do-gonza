import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  console.log("🌱 Iniciando seed de horários...");

  const days = [0, 1, 2, 3, 4, 5, 6];
  const times = ["18:00", "19:00", "20:00", "21:00"];

  for (const day of days) {
    for (const time of times) {
      await prisma.operatingHour.upsert({
        where: {
          dayOfWeek_time: {
            dayOfWeek: day,
            time,
          },
        },
        update: {},
        create: {
          dayOfWeek: day,
          time,
          isActive: true,
        },
      });
    }
  }

  console.log("✅ Seed finalizado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });