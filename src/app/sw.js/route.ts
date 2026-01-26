import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const swPath = path.join(process.cwd(), 'public', 'sw.js');
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    return new NextResponse(swContent, {
      headers: { 'Content-Type': 'application/javascript' }
    });
  } catch (error) {
    console.error('Error reading sw.js:', error);
    return NextResponse.json({ error: 'Service Worker not found' }, { status: 404 });
  }
}