'use client'

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface Props{
  children: React.ReactNode;
  className?: string
}

export function Ripple({ children, className }: Props) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = { x, y, id: Date.now() }
    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }

  return (
    <div onClick={handleClick} className={cn('relative overflow-hidden', className)}>
      {children}

      {ripples.map((ripple) => (
        <span key={ripple.id} className="absolute w-40 h-40 bg-primary/20 rounded-full animate-ping pointer-events-none" style={{left: ripple.x - 80, right: ripple.y - 80}}>

        </span>
      ))}
    </div>
  )
}