import { createClient } from '@supabase/supabase-client';
import crypto from 'crypto';
import { headers } from 'next/headers';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // IMPORTANTE: Usar Service Role para bypass RLS
);

export async function POST(req: Request) {
  const payload = await req.json();
  const { data, type } = payload;

  // 1. Validar que el evento sea de creación de usuario
  if (type === 'user.created') {
    const clerkId = data.id;
    
    // 2. Generar la API Key real (la que empieza con nr_...)
    const rawKey = `nr_${crypto.randomBytes(32).toString('hex')}`;
    
    // 3. Generar el HASH SHA256 (lo que guarda el backend)
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    
    // 4. Crear el Preview (ej: nr_a1b2c...)
    const keyPreview = `${rawKey.substring(0, 8)}...`;

    // 5. Insertar en Supabase
    const { error } = await supabase
      .from('api_keys')
      .insert([
        { 
          user_id: clerkId, 
          key_hash: keyHash, 
          key_preview: keyPreview,
          key_plain: rawKey, // Guardala solo si querés que el usuario la vea siempre
          is_active: true,
          label: 'Default Key'
        }
      ]);

    if (error) {
      console.error('Error Supabase:', error);
      return new Response('Error inserting key', { status: 500 });
    }

    return new Response('Webhook processed', { status: 200 });
  }

  return new Response('Event ignored', { status: 200 });
}