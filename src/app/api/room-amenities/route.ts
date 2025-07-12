import { NextResponse } from 'next/server';
import ROOM_AMENITIES from '@/db/ROOM_AMENITIES.json';

export async function GET() {
  return NextResponse.json(ROOM_AMENITIES);
}