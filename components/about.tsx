'use client'

import { Beer, Music, UtensilsCrossed } from "lucide-react"
import { useRef } from "react"

const features = [
  {
    icon: Beer,
    title: "Drinks Autorais & Clássicos",
    description: "Dos clássicos que todo mundo conhece até criações da casa, preparados pra acompanhar cada momento da sua noite.",
    highlight: "+50 opções no cardápio",
  },
  {
    icon: UtensilsCrossed,
    title: "Comida de Boteco Completa",
    description: "Petiscos, lanches e pratos que vão do compartilhamento até aquela fome de respeito.",
    highlight: "Pra qualquer hora",
  },
  {
    icon: Music,
    title: "Música & Ambiente",
    description: "Som ambiente na medida certa e um clima descontraído pra você curtir, conversar e relaxar.",
    highlight: "Clima leve e animado",
  },
]

export function About(){
    const sectionRef = useRef<HTMLElement>(null);

    return(
        <section id="sobre" className="py-28 md:py-36 bg-card relative overflow-hidden" ref={sectionRef}>
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-20 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

            {/* Section Header */}

            <div className="container mx-auto px-6 md:px-8 relative">
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">Nossa História</span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
                        O Melhor <span className="text-gradient">Boteco</span> de Santos
                    </h2>
                    <div className="w-20 h-1 bg-linear-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
                    <p className="text-muted-foreground text-lg md:text-xl leading-relaxed text-pretty">
                        Há mais de 03 anos, o Boteco do Gonza é o ponto de encontro favorito dos santistas. 
                        Um lugar onde a <span className="text-foreground font-medium">boa comida</span>, drinks de qualidade e música envolvente se encontram 
                        para criar <span className="text-foreground font-medium">experiências memoráveis</span>. 
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, index) => (
                        <div key={index} className="group relative bg-background/50 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border boder-border/50 hover:border-primary/30 transition-all duration-500 hover-lift flex flex-col">
                            <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110">
                                <feature.icon className="size-8 text-primary" />
                            </div>

                            <h3 className="font-serif text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed mb-6">{feature.description}</p>

                            <div className="mt-auto inline-flex justify-center items-center gap-2 px-2 py-2 rounded-full bg-primary/10 border border-primary/20">
                                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-sm font-medium text-primary">{feature.highlight}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}