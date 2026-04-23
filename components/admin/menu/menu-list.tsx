'use client'

import { DeleteMenuItem } from "@/app/actions/menu/delete-menu-item"
import { toggleMenuItem } from "@/app/actions/menu/toggle-menu-item"
import { EditMenuItemModal } from "@/components/modals/edit-menu-item-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Category, MenuItem } from "@/lib/generated/prisma/client"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, MoreHorizontal, Pencil, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

type FilterType = 'all' | string

interface Props{
  items: (MenuItem & { category: Category })[]
  categories: Category[]
}

function getCategoryColor(slug: string) {
  switch (slug) {
    // 🍽️ COMIDA
    case "entradas":
      return "bg-orange-500/10 text-orange-500 border border-orange-500/20"

    case "porcoes":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20"

    case "tabuas-e-grelhados":
      return "bg-red-500/10 text-red-500 border border-red-500/20"

    case "lanches":
      return "bg-lime-500/10 text-lime-600 border border-lime-500/20"

    case "pasteis":
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20"


    // 🍹 BEBIDAS
    case "drinks-autorais":
      return "bg-purple-500/10 text-purple-500 border border-purple-500/20"

    case "drinks-classicos":
      return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"

    case "mocktail":
      return "bg-pink-500/10 text-pink-500 border border-pink-500/20"

    case "softs":
      return "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20"

    case "cervejas":
      return "bg-yellow-400/10 text-yellow-600 border border-yellow-400/20"


    default:
      return "bg-gray-500/10 text-gray-500 border border-gray-500/20"
  }
}

export function MenuList({ items, categories }: Props) {
  const [filter, setFilter] = useState<FilterType>("all")
  const [search, setSearch] = useState<string>("")

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === "all" || item.category.slug === filter
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  async function handleToggle(id: string, current: boolean) {
    await toggleMenuItem(id, !current)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return
    
    const response = await DeleteMenuItem(id)

    if (response.success) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button variant={filter === 'all' ? 'default' : 'outline'} size='sm' onClick={() => setFilter('all')}>
          Todos ({items.length})
        </Button>

        {categories.map((cat) => (
          <Button key={cat.id} variant={filter === cat.slug ? 'default' : 'outline'} size='sm' onClick={() => setFilter(cat.slug)}>
            {cat.name}
          </Button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar item..." className="pl-10 bg-secondary border-border" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={cn("bg-card border-border transition-all hover:border-primary/30", !item.isAvailable && "opacity-60")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category.slug)}`}>
                      {item.category.name}
                    </span>

                    {item.isFeatured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        Destaque
                      </span>
                    )}

                    {!item.isAvailable && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                        Inativo
                      </span>
                    )}
                  </div>

                  {/* NAME */}
                  <h3 className="font-semibold text-foreground truncate">
                    {item.name}
                  </h3>

                  {/* DESCRIPTION */}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>

                 {/* MENU */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="bg-card border-border">
                    <DropdownMenuItem>
                      <EditMenuItemModal item={item} categories={categories} />
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => handleToggle(item.id, item.isAvailable)}>
                      {item.isAvailable ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </DropdownMenuItem>

                    <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* PRICE */}
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  R$ {(item.price / 100).toFixed(2).replace('.', ',')}
                </span>
                  <EditMenuItemModal item={item} categories={categories} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhum item encontrado</p>
      )}
    </div>
  )
}