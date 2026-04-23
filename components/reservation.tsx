'use client'

import { ArrowRight, CalendarIcon, CheckCircle2, Clock, Phone, User, Users } from "lucide-react"
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { IMaskInput } from "react-imask";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { createReservation } from "@/app/actions/reservation/create-reservation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getAvailableTimes } from "@/app/actions/reservation/get-available-times";
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ptBR } from 'date-fns/locale';
import { Calendar } from "./ui/calendar";

const benefits = [
    "Confirmação em até 2 horas",
    "Atendimento personalizado",
    "Mesas para grupos de até 20 pessoas",
]

const formSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    whatsapp: z.string().transform((val) => val.replace(/\D/g, "")).refine((val) => val.length === 11, {message: "WhatsApp deve ter 11 dígitos (DDD + número)"}).refine((val) => /^[1-9]{2}9\d{8}$/.test(val), {message: "WhatsApp inválido",}),
    date: z.date({error: 'Selecione uma data' }),
    time: z.string().min(1, 'Selecione um horário'),
    guests: z.string().min(1, "Selecione o número de pessoas"),
})

type FormSchema = z.infer<typeof formSchema>;

export function Reservation() {
    const [availableTimes, setAvailableTimes] = useState<string[]>([])
    const [isLoadingTimes, setIsLoadingTimes] = useState<boolean>(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            whatsapp: '',
            date: undefined,
            time: '',
            guests: '',
        }
    })

    const { control, handleSubmit, reset, formState, watch, setValue } = form;
    const selectedDate = watch('date');

    useEffect(() => {
        if (!selectedDate) {
            setAvailableTimes([])
            return
        }

        const loadTimes = async () => {
            setIsLoadingTimes(true)
            try {
                const times = await getAvailableTimes(format(selectedDate, 'yyyy-MM-dd'))   
                setAvailableTimes(times)

                // Limpa horário selecionado se não tiver mais disponível
                const currentTime = form.getValues('time')
                if (currentTime && !times.includes(currentTime)) {
                    setValue('time', '')
                }
            } catch (error) {
                toast.error('Erro ao carregar horários')
            } finally {
                setIsLoadingTimes(false)
            }
        }

        loadTimes()

    }, [selectedDate, form, setValue])

    async function onSubmit(values: FormSchema){
        try {
            const payload = {
                ...values,
                date: format(values.date, 'yyyy-MM-dd'),
                guests: Number(values.guests)
            }

            const result = await createReservation(payload);

            if (result.success) {
                toast.success(result.message)
                reset()
                setAvailableTimes([])
            } else {
                toast.error(result.message || 'Erro ao solicitar reserva')
            }
        } catch (error) {
            toast.error('Erro inesperado. Tente novamente.')
            console.error(error)
        }
    }

    const disabledDates = (date: Date) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return date < today
    }

    return(
        <section id="reservas" className="py-28 md:py-36 bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-1/3 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 md:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center max-w-6xl mx-auto">
                    <div>
                        <span className="inline-block text-primary/80 text-sm tracking-[0.3em] uppercase font-medium mb-6">Reservas</span>
                        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
                            Reserve sua <span className="text-gradient">Mesa</span>
                        </h2>
                        <div className="w-20 h-1 bg-linear-to-r from-primary to-accent mb-8 rounded-full" />
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10">
                            Garanta seu lugar para uma noite inesquecível. Nosso time entrará em contato para confirmar sua reserva.
                        </p>

                        <div className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-3 text-foreground/80">
                                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="size-4 text-primary" />
                                    </div>
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Card className="w-full sm:max-w-md">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
                                <FormField control={control} name="name" render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Nome Completo</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <Input placeholder="Seu nome" className="pl-12 h-14 bg-card border-border focus:border-primary rounded-xl text-base" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={control} name="whatsapp" render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">Número WhatsApp</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                <IMaskInput mask="(00) 00000-0000" value={field.value || ""}  onAccept={(value) => field.onChange(value.replace(/\D/g, ""))} className="pl-12 h-14 w-full bg-card border border-border focus:border-primary rounded-xl text-base" placeholder="(13) 99999-9999" />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )} />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={control} name="date" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Data da Reserva</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant='outline' className={cn('w-full h-14 pl-5 justify-start text-left font-normal bg-card border-border', !field.value && 'text-muted-foreground')}>
                                                            <CalendarIcon className="mr-3 size-5 text-muted-foreground" />
                                                            {field.value ? format(field.value, "dd 'de' MMMM yyyy", {locale: ptBR}) : 'Selecione a data'}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={disabledDates}
                                                        autoFocus
                                                        locale={ptBR}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={control} name="time" render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground font-medium">Horário</FormLabel>
                                            <FormControl>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingTimes || availableTimes.length === 0}>
                                                    <SelectTrigger className="w-full h-14 pl-5 justify-start text-left font-normal bg-card border-border">
                                                            <Clock className=" size-5" />
                                                            <SelectValue placeholder={isLoadingTimes ? 'Carregando...' : 'Selecione o horário'} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                        {availableTimes.length > 0 ? (
                                                            availableTimes.map((time) => (
                                                                <SelectItem key={time} value={time}>{time}</SelectItem>
                                                            ))
                                                        ) : (
                                                                <div className="px-4 py-3 text-sm text-muted-foreground">
                                                                    Selecione uma data para ver horários disponíveis
                                                                </div>
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>

                                <FormField control={control} name="guests" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Número de Pessoas</FormLabel>
                                        <FormControl>
                                            <div className="relative group">
                                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10 group-focus-within:text-primary transition-colors" />
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="pl-12 h-14 bg-card border-border focus:border-primary rounded-xl text-base">
                                                        <SelectValue placeholder="Quantas pessoas?" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                            <SelectItem key={n} value={n.toString()}>
                                                                {n} pessoas{n > 1 ? 's' : '  '}
                                                            </SelectItem>
                                                        ))}
                                                        <SelectItem value="11-15">11 a 15 pessoas</SelectItem>
                                                        <SelectItem value="16-20">16 a 20 pessoas</SelectItem>
                                                        <SelectItem value="21-25">21 a 25 pessoas</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <Button className="w-full h-14 text-base" disabled={formState.isSubmitting}>
                                    {formState.isSubmitting ? 'Enviando...' : 'Solicitar Reserva'}
                                    {!formState.isSubmitting && <ArrowRight className="ml-2 size-5" />}
                                </Button>
                            </form>
                        </Form>
                    </Card>
                </div>
            </div>
        </section>
    )
}