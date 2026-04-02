import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// 1. Inicialización segura para el Build de Vercel
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// No inicializamos el cliente globalmente con "!" para evitar que falle el build 
// si las variables de entorno aún no están cargadas en Vercel.
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null

export async function POST(req: Request) {
  // Verificación de configuración de base de datos
  if (!supabase) {
    console.error('❌ Supabase configuration missing')
    return new Response('Internal Configuration Error', { status: 500 })
  }

  // 1. Obtener el secreto de Clerk
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env')
  }

  // 2. Obtener los headers de Svix (Añadido await para compatibilidad Next.js 15)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // 3. Obtener el cuerpo de la petición de forma segura
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. Validar la firma del Webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Error verifying webhook:', err);
    return new Response('Error occured during verification', { status: 400 })
  }

  // 5. Lógica de Negocio: Crear la API Key al registrarse
  if (evt.type === 'user.created') {
    const clerkId = evt.data.id;
    
    // Generación segura de la key (nr_...)
    const rawKey = `nr_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPreview = `${rawKey.substring(0, 10)}...`;

    // Inserción en Supabase
    const { error } = await supabase
      .from('api_keys')
      .insert([
        { 
          user_id: clerkId, 
          key_hash: keyHash, 
          key_preview: keyPreview,
          key_plain: rawKey, // Se guarda para mostrarla en el Dashboard
          is_active: true,
          label: 'Primary Key',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('❌ Supabase Error:', error);
      return new Response('Error saving to DB', { status: 500 });
    }
    
    console.log(`✅ API Key generada exitosamente para: ${clerkId}`);
  }

  return new Response('Webhook processed successfully', { status: 200 })
}