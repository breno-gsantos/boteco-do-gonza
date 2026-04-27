import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from '@clerk/themes';
import {ptBR} from '@clerk/localizations'

const _geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Boteco do Gonza | Bar & Gastronomia em Santos",
  description: "A esquina mais charmosa de Santos ✨. Comida irresistível, bebida gelada e resenha garantida. Reserve sua mesa agora!",

  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={cn('font-sans antialiased', _geist.variable, _playfair.variable)}>
        <ClerkProvider afterSignOutUrl='/' localization={ptBR} appearance={{theme: shadcn}}>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  )
}
