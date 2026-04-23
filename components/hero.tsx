'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react"
import { Button } from "./ui/button";
import Link from "next/link";

const statsData = [
    { number: "3+ anos", label: "de Resenha" },
    { number: "1000+", label: "Happy Hours" },
    { number: "+50", label: "Drinks no Cardápio" },
]

export function Hero(){
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    return(
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image src='/bdg-wall.jpg' alt="Boteco do Gonza - Ambiente" fill className="object-cover scale-110" priority />
                <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/40 to-background" />
                <div className="absolute inset-0 bg-linear-to-r from-background/60 via-transparent to-background/60" />
                <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-transparent to-background/80" />
            </div>
            <div className="absolute top-1/4 left-10 w-px h-32 bg-linear-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />
            <div className="absolute top-1/3 right-10 w-px h-40 bg-linear-to-b from-transparent via-primary/30 to-transparent hidden lg:block" />
            <div className="absolute bottom-1/4 left-20 w-20 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent hidden lg:block" />
            <div className="absolute bottom-1/3 right-20 w-24 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent hidden lg:block" />

            <div className="container mx-auto px-6 md:px-8 relative z-10 pt-24 pb-16">
                <div className="max-w-4xl mx-auto text-center">
                    <div className={cn('inline-flex items-center gap-3 mb-8', mounted ? 'animate-fade-in-down' : 'opacity-0')}>
                        <span className="h-px w-8 bg-primary/60" />
                        <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">
                            Est. 2022 - Santos/SP
                        </span>
                        <span className="h-px w-8 bg-primary/60" />
                    </div>

                    <h1 className={cn('font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-foreground mb-8 tracking-tight', mounted ? 'animate-fade-in-up' : 'opacity-0')}>
                        <span className="text-gradient animate-glow inline-block">Boteco</span>
                        <span className="block text-foreground/90 text-[0.6em] font-light tracking-wide mt-2">do</span>
                        <span className="text-gradient animate-glow inline-block">Gonza</span>
                    </h1>

                    <p className={cn('text-lg md:text-xl lg:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide', mounted ? 'animate-fade-in-up delay-200' : 'opacity-0')}>
                        Onde cada <span className="text-primary font-medium">drink</span> conta uma história e cada{" "}
                        <span className="text-primary font-medium">momento</span> vira memória.
                    </p>

                    {/* CTA BUTTONS */}

                    <div className={cn('flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center', mounted ? 'animate-fade-in-up delay-300' : 'opacity-0')}>
                        <Button asChild size="lg" className="group relative bg-primary text-primary-foreground hover:bg-primary/90 text-base px-10 py-6 h-auto font-medium tracking-wide overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <Link href="#reservas">
                                <span className="relative z-10">Reservar Mesa</span>
                                <span className="absolute inset-0 bg-linear-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="group border-2 border-primary/50 text-primary hover:bg-primary/10 hover:border-primary text-base px-10 py-6 h-auto font-medium tracking-wide transition-all duration-300">
                            <Link href="#cardapio">
                                <span>Ver Cardápio</span>
                                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className={cn('mt-20 grid grid-cols-3 gap-8 mx-auto', mounted ? 'animate-fade-in-up delay-500' : 'opacity-0')}>
                        {statsData.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1">{stat.number}</div>
                                <div className="text-xs md:text-sm text-foreground/50 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}