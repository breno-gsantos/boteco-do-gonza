import { MenuList } from "@/components/admin/menu/menu-list"
import { CreateCategoryModal } from "@/components/modals/create-category-modal"
import { CreateMenuItemModal } from "@/components/modals/create-menu-item-modal"
import { Button } from "@/components/ui/button"
import prisma from "@/lib/db"
import { Plus } from "lucide-react"

type Category = "drinks" | "porcoes" | "pratos"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: Category
  active: boolean
  featured?: boolean
}


export default async function CardapioPage(){
    const items = await prisma.menuItem.findMany({
        include: {
            category: true
        },
        orderBy: {
            order: 'asc'
        }
    });

    const categories = await prisma.category.findMany({
        orderBy: {
            order: 'asc'
        }
    });

    return (
        <div className="space-y-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">Cardápio</h1>
                    <p className="text-muted-foreground mt-1">Gerencie os itens do seu cardápio</p>
                </div>
                <div className="flex gap-4">
                    <CreateMenuItemModal categories={categories} />
                    <CreateCategoryModal />
                </div>
            </div>

            <MenuList items={items} categories={categories} />
        </div>
    )
}