'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Clock, Palette, Save, Store } from "lucide-react"

export default function ConfiguracoesPage(){
    return(
        <div className="space-y-8">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-bold text-foreground">Configurações</h1>
                    <p className="text-muted-foreground mt-1">Gerencie as configurações do sistema</p>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Business info */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Store className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-serif text-lg">Informações do Negócio</CardTitle>
                                <CardDescription>Dados básicos do estabelecimento</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Estabelecimento</Label>
                            <Input id="name" defaultValue="Boteco do Gonza" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" defaultValue="(13) 3333-4444" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="whatsapp">WhatsApp</Label>
                            <Input id="whatsapp" defaultValue="(13) 99999-8888" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="contato@botecogonza.com" className="bg-secondary border-border" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input id="address" defaultValue="Av. Ana Costa, 123 - Gonzaga, Santos/SP" className="bg-secondary border-border" />
                        </div>
                    </CardContent>
                </Card>

                {/* Opening hours */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-serif text-lg">Horário de Funcionamento</CardTitle>
                                <CardDescription>Configure os horários de atendimento</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Segunda a Quinta</Label>
                                <div className="flex gap-2">
                                    <Input defaultValue="18:00" className="bg-secondary border-border" />
                                    <span className="flex items-center text-muted-foreground">às</span>
                                    <Input defaultValue="00:00" className="bg-secondary border-border" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Sexta e Sábado</Label>
                                <div className="flex gap-2">
                                    <Input defaultValue="18:00" className="bg-secondary border-border" />
                                    <span className="flex items-center text-muted-foreground">às</span>
                                    <Input defaultValue="02:00" className="bg-secondary border-border" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Domingo</Label>
                            <div className="flex gap-2 max-w-[50%]">
                                <Input defaultValue="16:00" className="bg-secondary border-border" />
                                <span className="flex items-center text-muted-foreground">às</span>
                                <Input defaultValue="23:00" className="bg-secondary border-border" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Capacidade Máxima</Label>
                            <Input type="number" defaultValue="80" className="bg-secondary border-border max-w-30" />
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-serif text-lg">Notificações</CardTitle>
                                <CardDescription>Configure alertas e notificações</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Nova Reserva</p>
                                <p className="text-sm text-muted-foreground">Receber alerta ao receber nova reserva</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Reserva Cancelada</p>
                                <p className="text-sm text-muted-foreground">Notificar quando uma reserva for cancelada</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Lembrete Diário</p>
                                <p className="text-sm text-muted-foreground">Resumo das reservas do dia às 10h</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Email Marketing</p>
                                <p className="text-sm text-muted-foreground">Enviar promoções para clientes</p>
                            </div>
                            <Switch />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Palette className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-serif text-lg">Aparência</CardTitle>
                                <CardDescription>Personalize a aparência do sistema</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Modo Escuro</p>
                                <p className="text-sm text-muted-foreground">Usar tema escuro no dashboard</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Animações</p>
                                <p className="text-sm text-muted-foreground">Ativar animações de transição</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="space-y-2">
                            <Label>Cor Principal</Label>
                            <div className="flex gap-2">
                                <button className="h-8 w-8 rounded-full bg-amber-500 ring-2 ring-offset-2 ring-offset-background ring-amber-500" />
                                <button className="h-8 w-8 rounded-full bg-blue-500" />
                                <button className="h-8 w-8 rounded-full bg-green-500" />
                                <button className="h-8 w-8 rounded-full bg-purple-500" />
                                <button className="h-8 w-8 rounded-full bg-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}