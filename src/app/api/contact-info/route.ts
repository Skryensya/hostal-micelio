import { NextResponse } from 'next/server';
import CONTACT_INFO from '@/db/CONTACT_INFO.json';

export async function GET() {
  return NextResponse.json(CONTACT_INFO);
}