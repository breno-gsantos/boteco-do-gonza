'use client'

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react"
import { Button } from "../ui/button";
import { CalendarDays, ChevronRight, Clock, LayoutDashboard, LogOut, Menu, UtensilsCrossed, X } from "lucide-react";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";

interface SidebarProps{
    children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Reservas", href: "/admin/reservas", icon: CalendarDays },
  { name: "Cardápio", href: "/admin/cardapio", icon: UtensilsCrossed },
  { name: "Horários", href: "/admin/horarios", icon: Clock },
]

export function Sidebar({ children }: SidebarProps) {
    const { user } = useUser();
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const pathname = usePathname();

    const UserButton = dynamic(
        () => import("@clerk/nextjs").then((mod) => mod.UserButton),
        { ssr: false }
    )

    return (
        <div className="min-h-screen bg-background">
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
            )}

            {/* Sidebar */}
            <aside className={cn('fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-out lg:translate-x-0', sidebarOpen ? 'translate-x-0' : '-translate-x-full')}>
                <div className="flex flex-col h-full">
                    <div className="h-20 flex items-center justify-between px-6 border-b border-border">
                        <Link href='/admin' className="flex items-center gap-3">
                            <Image src='/bdg.png' alt="Boteco do Gonza" width={48} height={48} className="rounded-lg" />
                            <div>
                                <span className="font-serif text-lg font-semibold text-foreground">Boteco do Gonza</span>
                                <span className="block text-xs text-muted-foreground tracking-wider">ADMIN</span>
                            </div>
                        </Link>
                        <Button variant='ghost' size='icon' className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="size-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))

                            return (
                                <Link key={item.name} href={item.href} className={cn('flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group', isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                                    <item.icon className={cn('size-5 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-primary' : '')} />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight className="size-4 ml-auto" />}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="p-4 border-t border-border">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary/50">
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-14 w-14"
                                    }
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user?.fullName || 'Usuário'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.primaryEmailAddress?.emailAddress}
                                </p>
                            </div>
                            <SignOutButton>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <LogOut className="size-4" />
                                </Button>
                            </SignOutButton>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}

            <div className="lg:pl-72">
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="size-5" />
                    </Button>
          
                    <div className="flex-1" />
          
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        Ver Site
                    </Link>
                </header>

                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}