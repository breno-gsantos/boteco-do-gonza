'use client'

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import { SiInstagram } from "react-icons/si";

interface GalleryImageProps{
    image: typeof galleryImages[0];
    index: number;
    onClick: () => void;
}

export const galleryImages = [
  { id: 1, src: "/gonza-1.jpg", alt: "Ambiente interno do Boteco do Gonza", caption: "Ambiente aconchegante" },
  { id: 2, src: "/gonza-2.jpg", alt: "Drink exclusivo do Boteco", caption: "Drinks artesanais" },
  { id: 3, src: "/gonza-3.jpg", alt: "Música ao vivo no Boteco", caption: "Noites especiais" },
  { id: 4, src: "/gonza-4.jpg", alt: "Petiscos deliciosos", caption: "Gastronomia de qualidade" },
  { id: 5, src: "/gonza-5.jpg", alt: "Bar com drinks", caption: "Bar completo" },
  { id: 6, src: "/gonza-6.jpg", alt: "Celebração no Boteco", caption: "Momentos especiais" },
  { id: 7, src: "/gonza-7.jpg", alt: "Área externa", caption: "Espaço ao ar livre" },
  { id: 8, src: "/gonza-8.jpg", alt: "Coquetel colorido", caption: "Criações únicas" },
]

export function GalleryImage({image, index, onClick}: GalleryImageProps){
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, index * 100)
        return () => clearTimeout(timer)
    }, [index])
    
    return(
        <div className={cn('group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} onClick={onClick}>
            {/* Skeleton */}
            {!isLoaded && (
                <Skeleton className="absolute inset-0 rounded-2xl" />
            )}

            <Image src={image.src} alt={image.alt} fill className={cn('object-cover transition-transform duration-500 group-hover:scale-105', isLoaded ? 'opacity-100' : 'opacity-0')} onLoad={() => setIsLoaded(true)} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />

            {/* Hover */}

            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    {/* Instagram icon */}
                    <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        <SiInstagram className="w-6 h-6 text-primary" />
                    </div>
          
                    {/* Caption */}
                    <span className="text-foreground font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                        Ver no Instagram
                    </span>
                </div>
            </div>
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
        </div>
    )
}