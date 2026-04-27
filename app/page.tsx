import { About } from "@/components/about";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Location } from "@/components/location";
import { MenuPreview } from "@/components/menu-preview";
import { Reservation } from "@/components/reservation";
import prisma from "@/lib/db";

export default async function Home() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    include: {
      items: {
        where: { isAvailable: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { order: 'asc' }
  });

  const foodCategories = categories.filter(c => c.type === "food");
  const drinkCategories = categories.filter(c => c.type === "drinks");

  console.log(categories)

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <MenuPreview drinkCategories={drinkCategories} foodCategories={foodCategories} />
      <Gallery />
      <Reservation />
      <Location />
      <Footer />
    </main>
  );
}
