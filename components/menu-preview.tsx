'use client'

import { cn } from "@/lib/utils";
import { Beef, Drumstick, Hamburger, ImageOff, Sandwich, Sparkles, UtensilsCrossed, Wine, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import Image from "next/image";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { MenuItem } from "@/lib/generated/prisma/client";
import { Button } from "./ui/button";

interface ItemProps {
    id: string;
    name: string;
    description: string | null;
    price: number;
    isFeatured: boolean;
    imageUrl?: string;
}

interface CategoryProps {
    id: string;
    name: string;
    slug: string;
    items: ItemProps[]
}

const iconMap = {
  entradas: UtensilsCrossed,
  porcoes: Drumstick,
  pasteis: Sandwich,
  "tabuas-e-grelhados": Beef,
  lanches: Hamburger,
}

export function MenuPreview({categories}: {categories: CategoryProps[]}){
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id);

    const [selectedItem, setSelectedItem] = useState<ItemProps | null>(null)
    
    const currentCategory = categories.find((cat) => cat.id === activeCategory);

    useEffect(() => {
        const el = document.getElementById("menu-items")
        el?.scrollTo({ top: 0, behavior: "smooth" })
    }, [activeCategory])

    return (
        <section id="cardapio" className="py-28 md:py-36 bg-background relative overflow-hidden">
            <div className="absolute top-1/4 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 md:px-8 relative">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">Nosso Cardápio</span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                        Sabores que <span className="text-gradient">Conquistam</span>
                    </h2>
                    <div className="w-20 h-1 bg-linear-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
                    <p className="text-muted-foreground text-lg md:text-xl">
                        Cada prato conta uma história, cada drink inspira um brinde.
                    </p>
                </div>

                {/* Category Tabs */}

                <div className="flex justify-center gap-3 md:gap-4 mb-16">
                    <Carousel opts={{ align: 'start' }}>
                        <CarouselContent className="-ml-2">
                            {categories.map((category) => {
                                const Icon = iconMap[category.slug.toLowerCase() as keyof typeof iconMap] || Wine
                            
                                return (
                                    <CarouselItem key={category.id} className="pl-2 basis-1/2 md:basis-1/3">
                                        <button
                                            onClick={() => setActiveCategory(category.id)}
                                            className={cn(
                                                "cursor-pointer group flex items-center gap-2 px-5 md:px-8 py-4 rounded-full font-medium transition-all duration-300",
                                                activeCategory === category.id
                                                    ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                                                    : "bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary/30"
                                            )}>
                                            <Icon className={cn(
                                                "size-6 transition-transform duration-300",
                                                activeCategory === category.id ? "" : "group-hover:scale-110"
                                            )} />
                                            <span className="hidden sm:inline tracking-wide whitespace-nowrap">{category.name}</span>
                                        </button>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>

                {/* Menu items */}
                <div id="menu-items" className="max-w-3xl mx-auto h-200 overflow-y-auto p-4">
                    <div className="grid gap-4">
                        {currentCategory?.items.map((item, index) => (
                            <div key={index} className={cn(
                                "group relative bg-card p-6 md:p-8 rounded-2xl border transition-all duration-300 ease-out hover:scale-[1.015] hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] active:scale-[0.99]",
                                item.isFeatured
                                    ? "border-primary/30 bg-linear-to-r from-card to-primary/5"
                                    : "border-border/50 hover:border-primary/20")} style={{ animationDelay: `${index * 100}ms` }} onClick={() => setSelectedItem(item)}>

                                {item.isFeatured && (
                                    <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                        <Sparkles className="w-3 h-3" />
                                        Destaque
                                    </div>
                                )}
                                
                                <div className="flex items-center justify-center gap-5">
                                    {/* Image container */}
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0">
                                        {item.imageUrl ? (
                                            <>
                                                <Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 768px) 120px, 160px" className="object-cover" />
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                                                <ImageOff className="size-6 text-muted-foreground/40" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center gap-6">
                                        <div className="flex-1">
                                            <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                                                {item.name}
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-2xl md:text-3xl font-serif font-bold text-primary whitespace-nowrap">
                                                R$ {(item.price / 100).toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-border to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-opacity duration-500" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-muted-foreground/60 mt-12 text-sm tracking-wide">
                    * Cardápio sujeito a alterações. Consulte disponibilidade no local.
                </p>
            </div>

            <Dialog
                open={selectedItem !== null}
                onOpenChange={(open) => {
                    if (!open) setSelectedItem(null)
                }}
            >
                <DialogContent className="max-w-2xl w-[95vw] p-0 overflow-hidden bg-card border-border/50 rounded-2xl">
                    <DialogTitle className="sr-only">{selectedItem?.name || "Detalhes do item"}</DialogTitle>
                    <DialogDescription className="sr-only">{selectedItem?.description || "Descrição do item"}</DialogDescription>
                    {selectedItem && (
                        <div className="flex flex-col">

                            {/* IMAGE (menor e mais elegante) */}
                            <div className="relative w-full aspect-video bg-muted overflow-hidden">

                                {selectedItem.imageUrl ? (
                                    <Image
                                        src={selectedItem.imageUrl}
                                        alt={selectedItem.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 700px"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageOff className="size-10 text-muted-foreground/40" />
                                    </div>
                                )}

                                {/* overlay suave */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                                {/* badge */}
                                {selectedItem.isFeatured && (
                                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Destaque
                                    </div>
                                )}
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 md:p-6 space-y-4">

                                <div className="flex items-start justify-between gap-4">
                                    <h2 className="text-xl md:text-2xl font-serif font-bold">
                                        {selectedItem.name}
                                    </h2>

                                    <span className="text-xl md:text-2xl font-serif font-bold text-primary whitespace-nowrap">
                                        R$ {(selectedItem.price / 100).toFixed(2).replace(".", ",")}
                                    </span>
                                </div>

                                {selectedItem.description && (
                                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                                        {selectedItem.description}
                                    </p>
                                )}

                            </div>
                        </div>
                    )}

                </DialogContent>
            </Dialog>
        </section>
    );
}