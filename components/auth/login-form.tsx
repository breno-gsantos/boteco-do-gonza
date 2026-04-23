"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simular autenticação
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Demo: aceita qualquer email/senha
    if (formData.email && formData.password) {
      router.push("/admin")
    } else {
      setError("Por favor, preencha todos os campos")
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_1fr] bg-background">
      {/* Left side - Decorative */}
      <div className="hidden lg:grid relative overflow-hidden">
        {/* Background image with overlay */}
        <Image
          src="/bdg-wall.jpg"
          alt="Boteco do Gonza"
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-linear-to-br from-background/95 via-background/80 to-background/60" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col gap-12 p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/bdg.png"
              alt="Boteco do Gonza"
              width={80}
              height={80}
              className="rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <span className="font-serif text-2xl font-semibold text-foreground">Boteco do Gonza</span>
              <span className="block text-xs text-primary tracking-[0.3em]">Desde 2022</span>
            </div>
          </Link>

          {/* Decorative text */}
          <div className="space-y-6 max-w-md">
            <div className="w-16 h-px bg-linear-to-r from-primary to-transparent" />
            <h1 className="font-serif text-4xl xl:text-5xl text-foreground leading-tight">
              Gerencie seu<br />
              <span className="text-primary">negócio</span> com<br />
              facilidade
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Acesse o painel administrativo para gerenciar reservas, cardápio, clientes e muito mais.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-1/4 right-12 w-32 h-32 border border-primary/20 rounded-full" />
        <div className="pointer-events-none absolute bottom-1/3 right-24 w-48 h-48 border border-primary/10 rounded-full" />
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/bdg-wall.jpg"
                alt="Boteco do Gonza"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <div>
                <span className="font-serif text-xl font-semibold text-foreground">Boteco do Gonza</span>
                <span className="block text-xs text-primary tracking-[0.2em] uppercase">Admin</span>
              </div>
            </Link>
          </div>

          {/* Form header */}
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-foreground mb-3">Bem-vindo de volta</h2>
            <p className="text-muted-foreground">Entre com suas credenciais para acessar o painel</p>
          </div>

          {/* Login form */}
          <SignIn
            appearance={{
              elements: {
                card: "!bg-transparent !shadow-none !border-none",
                headerTitle: "!text-2xl !font-serif !text-yellow-200 !tracking-tight",
                headerSubtitle: "!text-zinc-400 !text-sm",
              }
            }}
          />

          {/* Back to site */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="size rotate-180" />
              Voltar para o site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}