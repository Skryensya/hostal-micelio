import { NextResponse } from 'next/server';
import ATTRACTIONS from '@/db/ATTRACTIONS.json';

export async function GET() {
  return NextResponse.json(ATTRACTIONS);
}