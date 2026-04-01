import { NextResponse } from 'next/server';

// Este es el método GET (para obtener datos)
export async function GET() {
  const usuarios = [
    { id: 1, nombre: "Juan", empresa: "Óptica Carballo" },
    { id: 2, nombre: "Valentino", empresa: "Neural Routing" }
  ];

  return NextResponse.json(usuarios);
}

// Este es el método POST (para recibir/guardar datos)
export async function POST(request: Request) {
  const data = await request.json(); // Aquí recibes lo que el usuario envía
  
  // Aquí iría la lógica para guardar en la base de datos
  console.log("Datos recibidos:", data);

  return NextResponse.json({ 
    message: "Usuario creado con éxito",
    usuario: data 
  }, { status: 201 });
}