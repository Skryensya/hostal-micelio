import { NextResponse } from 'next/server';
import ROOM_IMAGES from '@/db/ROOM_IMAGES.json';

export async function GET() {
  return NextResponse.json(ROOM_IMAGES);
}