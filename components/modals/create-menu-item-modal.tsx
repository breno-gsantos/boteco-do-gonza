'use client'

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { createMenuItem } from "@/app/actions/menu/create-menu-item";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { uploadMenuImage } from "@/app/actions/menu/upload-image";

interface Category{
  id: string;
  name: string;
}

interface Props{
  categories: Category[]
}

const schema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Preço inválido"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
})

type FormData = z.infer<typeof schema>;

export function CreateMenuItemModal({ categories }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.input<typeof schema>, any, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: undefined
    }
  })

  const {control, handleSubmit, formState} = form

  async function onSubmit(values: FormData) {
    try {
      let imageUrl: string | undefined = undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        imageUrl = await uploadMenuImage(formData);
      }

      const result = await createMenuItem({
        ...values,
        price: Math.round(values.price * 100),
        imageUrl
      })

      if (result.success) {
        toast.success(result.message)
        form.reset()
        setImageFile(null)
        setOpen(false);
      } else {
        toast.error(result.message)
      }


    } catch (error) {
      console.error(error)
      toast.error('Erro ao criar item')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="size-4" />
          Novo Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Item</DialogTitle>
          <DialogDescription className="sr-only">Descrição do Item</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Capirinha" {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Opcional" {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step='0.01' placeholder="Ex: 29,90" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={formState.isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria"  />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormItem>
              <FormLabel>Imagem</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} disabled={formState.isSubmitting} />
              </FormControl>
            </FormItem>

            <Button disabled={formState.isSubmitting} className="w-full">
              {formState.isSubmitting ? 'Criando...' : 'Criar Item'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}