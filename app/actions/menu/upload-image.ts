'use server'

import { protectAction } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadMenuImage(formData: FormData): Promise<string> {
  await protectAction();

  const file = formData.get('image') as File;

  if (!file || file.size === 0) throw new Error('Nenhuma Imagem Enviada')
  
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'boteco-do-gonza/menu',
        resource_type: 'image',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url as string)
      }
    ).end(buffer)
  });
}