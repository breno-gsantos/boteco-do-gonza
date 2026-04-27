import Image from "next/image"
import Link from "next/link"
import { SiFacebook, SiIfood, SiInstagram, SiWhatsapp } from "react-icons/si"

const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#cardapio", label: "Cardápio" },
    { href: "#galeria", label: "Galeria" },
    { href: "#reservas", label: "Reservas" },
    { href: "#localizacao", label: "Localização" },
]

const socialLinks = [
  { href: "https://www.instagram.com/botecodogonza/", icon: SiInstagram, label: "Instagram" },
  { href: "https://wa.me/5513978267391?text=Olá%2C%20vim%20pelo%20site%20e%20estou%20com%20uma%20dúvida.", icon: SiWhatsapp, label: "WhatsApp" },
  { href: "https://www.ifood.com.br/delivery/santos-sp/boteco-do-gonza---lanches-e-porcoes-ponta-da-praia/a2ca3fec-7808-44bb-98ed-9e1fa0f58c78?UTM_Medium=share", icon: SiIfood, label: "IFood" },
]

export function Footer(){
    return (
        <footer className="bg-card relative overflow-hidden ">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            <div className="container mx-auto px-6 md:px-8">
                <div className="py-16 md:py-20">
                    <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-start">
                        <div className="text-center md:text-left">
                            <Link href='/' className="inline-block mb-6 group">
                                <Image src='/bdg.png' alt="Logo" width={160} height={60} className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" />
                            </Link>
                            <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto md:mx-0">
                                Desde 2022 sendo a esquina mais charmosa de Santos. Onde cada momento vira uma história para contar
                            </p>
                        </div>

                        <div className="text-center">
                            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">Navegação</h4>
                            <nav className="flex flex-col gap-3">
                                {navLinks.map((link) => (
                                    <Link href={link.href} key={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        <div className="text-center md:text-right">
                            <h4 className="font-serif text-lg font-semibold text-foreground mb-6">Redes Sociais</h4>
                            <div className="flex items-center justify-center md:justify-end gap-3">
                                {socialLinks.map((social) => (
                                    <Link key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110" aria-label={social.label}>
                                        <social.icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                            <p className="mt-6 text-sm text-muted-foreground">Siga-nos para novidades e promoções exclusivas</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/50 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                        <p className="text-muted-foreground/60 text-sm">
                            © {new Date().getFullYear()} Boteco do Gonza. Todos os direitos reservados.
                        </p>
                        <p className="text-muted-foreground/40 text-xs tracking-wide uppercase">
                            Beba com moderação
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}