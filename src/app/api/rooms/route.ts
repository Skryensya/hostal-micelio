import { NextResponse } from 'next/server';
import ROOMS from '@/db/ROOMS.json';

export async function GET() {
  return NextResponse.json(ROOMS);
}