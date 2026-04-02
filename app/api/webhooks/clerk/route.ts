import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// 1. Inicialización de Supabase con Service Role (para saltar RLS)
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null

export async function POST(req: Request) {
  if (!supabase) {
    console.error('❌ Supabase configuration missing')
    return new Response('Internal Configuration Error', { status: 500 })
  }

  // 1. Obtener el secreto de Clerk
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new Response('Error: Please add CLERK_WEBHOOK_SECRET', { status: 500 })
  }

  // 2. Obtener headers para validación de Svix
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

  // 3. Obtener el cuerpo de la petición
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // 4. Verificar que la petición viene REALMENTE de Clerk
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

  // 5. LÓGICA DE REGISTRO: Crear el perfil y la Key
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    
    // Generamos la key que se verá en el Dashboard (nr_live_...)
    const generatedKey = `nr_live_${crypto.randomBytes(24).toString('hex')}`;

    console.log(`Creating profile for user: ${id}`);

    // Insertamos en la tabla 'api_keys' (o 'profiles', ajustá el nombre si es necesario)
    const { error } = await supabase
      .from('api_keys') 
      .insert([
        { 
          user_id: id, 
          key: generatedKey, // <--- Columna 'key' tipo text de tu foto
          is_active: true,
          label: 'Primary Key',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('❌ Supabase Error:', error.message);
      return new Response('Error saving to DB', { status: 500 });
    }
    
    console.log(`✅ API Key generada exitosamente para: ${id}`);
  }

  return new Response('Webhook processed successfully', { status: 200 })
}