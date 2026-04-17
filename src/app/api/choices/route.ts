import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM responses ORDER BY timestamp DESC');
    
    // Transform DB snake_case to camelCase for frontend
    const choices = result.rows.map(row => ({
      id: row.id,
      timestamp: row.timestamp,
      quizAnswers: row.quiz_answers,
      acknowledgedDislikes: row.acknowledged_dislikes,
      extraNote: row.extra_note
    }));
    
    return NextResponse.json(choices);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Failed to fetch choices' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizAnswers, acknowledgedDislikes, extraNote } = body;
    
    await query(
      'INSERT INTO responses (quiz_answers, acknowledged_dislikes, extra_note) VALUES ($1, $2, $3)',
      [JSON.stringify(quizAnswers), JSON.stringify(acknowledgedDislikes), extraNote]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving choice:', error);
    return NextResponse.json({ error: 'Failed to save choice' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      await query('DELETE FROM responses WHERE id = $1', [id]);
    } else {
      await query('DELETE FROM responses');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Failed to delete choices' }, { status: 500 });
  }
}
