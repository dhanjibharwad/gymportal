import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Test basic connection
      const result = await client.query('SELECT NOW() as current_time');
      
      // Test if tables exist
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      
      return NextResponse.json({
        success: true,
        message: 'Database connection successful',
        currentTime: result.rows[0].current_time,
        tables: tablesResult.rows.map(row => row.table_name)
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}