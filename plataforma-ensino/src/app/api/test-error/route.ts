import { NextResponse } from 'next/server';

export async function GET() {
  // Simular erro do servidor
  throw new Error('Teste de erro no servidor - Sentry funcionando!');
  
  return NextResponse.json({ message: 'Este código nunca será executado' });
}