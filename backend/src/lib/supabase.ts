import { createClient } from '@supabase/supabase-js';

type MulterFile = {
  mimetype: string;
  buffer: Buffer;
};

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
console.log('Supabase Connected');

export async function uploadAvatar(file: MulterFile, userId: string) {
  if (!file) {
    throw new Error('No file uploaded');
  }

  const path = `avatars/${userId}.jpg`;
  const { error } = await supabase.storage.from('public-files').upload(path, file.buffer, {
    contentType: file.mimetype,
    upsert: true,
  });

  if (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }

  const { data } = supabase.storage.from('public-files').getPublicUrl(path);

  return data.publicUrl;
}
