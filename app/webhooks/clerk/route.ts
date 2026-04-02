import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
// Antes tenías @supabase/supabase-client (que no existe en npm)
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  // 1. Obtener el secreto de Clerk desde tus variables de entorno
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // 2. Obtener los headers de Svix para validación
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // 3. Obtener el cuerpo de la petición
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
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', { status: 400 })
  }

  // 5. Lógica de Negocio: Crear la API Key al registrarse
  if (evt.type === 'user.created') {
    const clerkId = evt.data.id;
    
    // Generación segura de la key
    const rawKey = `nr_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPreview = `${rawKey.substring(0, 10)}...`;

    const { error } = await supabase
      .from('api_keys')
      .insert([
        { 
          user_id: clerkId, 
          key_hash: keyHash, 
          key_preview: keyPreview,
          key_plain: rawKey, // Se guarda para mostrarla en el Dashboard
          is_active: true,
          label: 'Primary Key'
        }
      ]);

    if (error) {
      console.error('Supabase Error:', error);
      return new Response('Error saving to DB', { status: 500 });
    }
    
    console.log(`✅ API Key generada para el usuario: ${clerkId}`);
  }

  return new Response('', { status: 200 })
}