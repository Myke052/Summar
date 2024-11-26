import { NextResponse } from 'next/server'

export async function middleware(req) {
  const { pathname } = req.nextUrl // Ruta solicitada
  const username = req.cookies.get('auth-username')?.value
  const password = req.cookies.get('auth-password')?.value
  // Ignorar el middleware en rutas no protegidas como "/login"
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Validar credenciales
  if (username === 'admin' && password === '123') {
    // Credenciales válidas, permitir acceso
    return NextResponse.next()
  }

  // Redirigir al login si no está autenticado
  return NextResponse.redirect(new URL('/login', req.nextUrl))
}

export const config = {
  matcher: ['/', '/clients', '/solicitudes'], // Rutas protegidas
}
