import { NextResponse } from 'next/server';
import TEAM from '@/db/TEAM.json';

export async function GET() {
  return NextResponse.json(TEAM);
}