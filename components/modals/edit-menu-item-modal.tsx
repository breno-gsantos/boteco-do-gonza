'use client'

import { updateMenuItem } from "@/app/actions/menu/update-menu-item";
import { Category, MenuItem } from "@/lib/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { uploadMenuImage } from "@/app/actions/menu/upload-image";
import Image from "next/image";

const schema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  categoryId: z.string(),
})

type FormData = z.input<typeof schema>;

interface Props{
  item: MenuItem
  categories: Category[]
}

export function EditMenuItemModal({categories, item}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(item.imageUrl ?? null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item.name,
      description: item.description ?? '',
      price: item.price / 100,
      categoryId: item.categoryId,
    }
  })

  const { formState, handleSubmit, control } = form;

  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile])

  async function onSubmit(values: FormData) {
    try {
      let imageUrl = item.imageUrl ?? undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        imageUrl = await uploadMenuImage(formData);
      }

      const response = await updateMenuItem({
        id: item.id,
        ...values,
        price: Math.round(values.price * 100),
        imageUrl
      });

      if (response.success) {
        toast.success(response.message)
        setOpen(false);
      } else {
        toast.error(response.message)
      }

    } catch (err) {
      console.error(err)
      toast.error('Erro ao atualizar item')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Pencil className="size-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState.isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Preço (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step='0.01' value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} disabled={formState.isSubmitting} />
                </FormControl>
              </FormItem>
            )} />

            <FormField control={control} name="categoryId" render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={formState.isSubmitting}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )} />

            

            <FormItem>
              <FormLabel>Trocar Imagem</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} disabled={formState.isSubmitting} />
              </FormControl>
            </FormItem>

            <Button disabled={formState.isSubmitting} className="w-full">
              {formState.isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}