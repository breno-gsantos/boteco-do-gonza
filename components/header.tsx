'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react"
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#cardapio", label: "Cardápio" },
    { href: "#reservas", label: "Reservas" },
    { href: "#localizacao", label: "Localização" },
]

export function Header() {
    const { isSignedIn } = useUser();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return(
        <header 
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
                scrolled
                ? 'bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/20'
                : 'bg-transparent'
        )}>
            <div className="container mx-auto px-6 md:px-8">
                <div className="flex items-center justify-between h-20 md:h-24">
                    <Link href='/' className="flex items-center gap-2 group">
                        <Image src='/bdg.png' alt="Boteco do Gonza" width={160} height={60} className="h-15 md:h-30 w-auto transition-transform duration-300 group-hover:scale-105" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="relative text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300 tracking-wide uppercase group">
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5 h-auto font-medium tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            <Link href='#reservas'>Reservar Mesa</Link>
                        </Button>

                        {isSignedIn && (
                            <UserButton />
                        )}
                    </nav>

                    <button className="md:hidden relative size-10 flex items-center justify-center text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Fechar Menu" : "Abrir Menu"}>
                        <span className={cn(
                            "absolute transition-all duration-300",
                            isOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                        )}>
                            <Menu className="size-6" />
                        </span>
                        <span className={cn(
                            "absolute transition-all duration-300",
                            isOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                        )}>
                            <X className="h-6 w-6" />
                        </span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={cn(
                    "md:hidden overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
                )}>
                    <nav className="py-6 border-t border-border/50">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link, index) => (
                                <Link key={link.href} href={link.href} className="text-lg font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg transition-all duration-300" onClick={() => setIsOpen(false)} style={{ animationDelay: `${index * 50}ms` }}>
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4 px-4">
                                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-5 h-auto font-medium tracking-wide">
                                    <Link href="#reservas" onClick={() => setIsOpen(false)}>Reservar Mesa</Link>
                                </Button>
                            </div>
                        </div>
                        {isSignedIn && (
                            <div className="px-4 pt-4">
                                <UserButton />
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}