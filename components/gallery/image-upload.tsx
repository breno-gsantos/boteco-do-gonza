'use client'

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";

interface Props{
  onChange: (url: string) => void;
}

export function ImageUpload({ onChange }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="oqxwubwd"
      options={{
      folder: 'menu-items',
      multiple: false,
      sources: ['local', 'camera']
      }}
      onSuccess={(result) => {
        const info = result.info as { secure_url: string }
        onChange(info.secure_url)
      }}
    >
      {({ open }) => (
        <Button type="button" onClick={() => open}>
          Enviar Imagem
        </Button>
      )}
    </CldUploadWidget>
  )
}