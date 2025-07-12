import { NextResponse } from 'next/server';
import TYPES_OF_BEDS from '@/db/TYPES_OF_BEDS.json';

export async function GET() {
  return NextResponse.json(TYPES_OF_BEDS);
}