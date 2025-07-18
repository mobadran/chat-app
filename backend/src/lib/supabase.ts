import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

type MulterFile = {
  mimetype: string;
  buffer: Buffer;
};

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
console.log('Supabase Connected');

export async function uploadAvatar(file: MulterFile, userId: string, oldAvatarUrl?: string) {
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Invalid image type. Only JPEG, PNG, and WEBP are allowed.', { cause: 'invalid-image-type' });
  }

  const processedImageBuffer = await sharp(file.buffer)
    .resize(256, 256, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  const path = `avatars/${userId}-${Date.now()}.jpg`;
  const { error } = await supabase.storage.from('public-files').upload(path, processedImageBuffer, {
    contentType: 'image/jpeg',
    upsert: true,
  });

  if (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }

  const { data } = supabase.storage.from('public-files').getPublicUrl(path);

  if (oldAvatarUrl) {
    const { error } = await supabase.storage.from('public-files').remove([oldAvatarUrl]);
    if (error) {
      console.error('Error removing old avatar:', error);
    }
  }

  return data.publicUrl;
}
