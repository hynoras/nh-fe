import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: dayjs().toISOString(),
  });
}