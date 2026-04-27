"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div 
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-muted-foreground/5 blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
          }}
        />
      </div>

      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <div 
            className="relative mb-8 select-none"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            }}
          >
            <span className="bg-linear-to-b from-foreground via-foreground/80 to-foreground/20 bg-clip-text text-[12rem] font-bold leading-none tracking-tighter text-transparent sm:text-[16rem]">
              404
            </span>
            {/* Reflection */}
            <span 
              className="absolute left-0 top-full -mt-4 bg-linear-to-b from-foreground/10 to-transparent bg-clip-text text-[12rem] font-bold leading-none tracking-tighter text-transparent blur-[1px] sm:text-[16rem]"
              style={{ transform: "scaleY(-0.3)" }}
              aria-hidden="true"
            >
              404
            </span>
          </div>

          {/* Text content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Página não encontrada
            </h1>
            <p className="mx-auto max-w-md text-base text-muted-foreground">
              A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
            </p>
          </div>

          {/* Divider */}
          <div className="my-10 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-linear-to-r from-transparent to-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            <div className="h-px w-16 bg-linear-to-l from-transparent to-border" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="default" size="lg" asChild className="group w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 size-4 transition-transform group-hover:-translate-y-0.5" />
                Voltar ao início
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()} className="group w-full sm:w-auto">
              <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
              Página anterior
            </Button>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          <div className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground/20" style={{ animationDelay: "0s" }} />
          <div className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground/20" style={{ animationDelay: "0.2s" }} />
          <div className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground/20" style={{ animationDelay: "0.4s" }} />
        </div>
      </main>
    </div>
  )
}
