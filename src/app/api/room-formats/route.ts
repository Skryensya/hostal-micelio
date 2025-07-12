import { NextResponse } from 'next/server';
import ROOM_FORMATS from '@/db/ROOM_FORMATS.json';

export async function GET() {
  return NextResponse.json(ROOM_FORMATS);
}