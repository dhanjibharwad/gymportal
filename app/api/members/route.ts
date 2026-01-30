import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT 
          id,
          full_name,
          phone_number,
          profile_photo_url
        FROM members
        ORDER BY full_name ASC
      `);
      
      return NextResponse.json({
        success: true,
        members: result.rows
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Fetch members error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}