import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'choices.json');

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to fetch choices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataFile();
    const newChoice = await request.json();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const choices = JSON.parse(data);
    
    choices.push({
      id: Date.now().toString(),
      ...newChoice,
      timestamp: new Date().toISOString()
    });
    
    await fs.writeFile(DATA_FILE, JSON.stringify(choices, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving choice:', error);
    return NextResponse.json({ error: 'Failed to save choice' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ error: 'Failed to clear choices' }, { status: 500 });
  }
}
