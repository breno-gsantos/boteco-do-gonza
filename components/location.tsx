import { Clock, MapPin, Navigation, Phone } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

const info = [
  {
    icon: MapPin,
    title: "Endereço",
    lines: [
      "Rua Tolentino Filgueiras, 30",
      "Gonzaga - Santos/SP",
      "CEP: 11060-470",
    ],
  },
  {
    icon: Clock,
    title: "Funcionamento",
    lines: [
      "Seg - Qui: 17h às 00h",
      "Sex: 17h às 01:30h",
      "Sab: 13h às 01:30h",
      "Dom: 13h às 23:30h",
    ],
  },
  {
    icon: Phone,
    title: "Contato",
    lines: [
      "WhatsApp: (13) 97826-7391",
    ],
  },
]

export function Location(){
    return(
        <section id="localizacao" className="py-28 md:py-36 bg-background relative overflow-hidden">
            <div className="absolute top-20 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 md:px-8 relative">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">
                        Localização
                    </span>
                    <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
                        Venha nos <span className="text-gradient">Visitar</span>
                    </h2>
                    <div className="w-20 h-1 bg-linear-to-r from-primary to-accent mx-auto mb-8 rounded-full" />
                    <p className="text-muted-foreground text-lg md:text-xl">
                        Estamos no coração do Gonzaga, o bairro mais vibrante de Santos.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    <div className="lg:col-span-2 space-y-6">
                        {info.map((item, index) => (
                            <div key={index} className="group bg-card p-6 md:p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                                <div className="flex items-start gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                                        <item.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                                        <div className="space-y-1.5">
                                            {item.lines.map((line, i) => (
                                                <p key={i} className="text-muted-foreground">{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 text-base font-medium tracking-wide rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                            <Link href='https://www.google.com/maps/place/boteco+do+gonza/data=!4m2!3m1!1s0x94ce033893ca3c45:0xe82b7170091ef5ee?sa=X&ved=1t:242&ictx=111' target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                <Navigation className="size-5" />
                                Como chegar
                            </Link>
                        </Button>
                    </div>

                    <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-border/50 h-100 lg:h-130 relative group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                        <iframe
                            src="https://www.google.com/maps?q=boteco+do+gonza&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(30%) contrast(1.1)" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização do Boteco do Gonza"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}