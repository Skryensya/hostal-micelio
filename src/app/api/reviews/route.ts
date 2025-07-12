import { NextResponse } from 'next/server';
import SCRAPED_REVIEWS from '@/db/SCRAPED_REVIEWS.json';

export async function GET() {
  return NextResponse.json(SCRAPED_REVIEWS);
}