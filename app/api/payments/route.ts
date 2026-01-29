import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      // Fetch payments with member and membership details
      const result = await client.query(`
        SELECT 
          p.id,
          p.membership_id,
          p.total_amount,
          p.paid_amount,
          p.payment_mode,
          p.payment_status,
          p.next_due_date,
          p.created_at,
          m.id as member_id,
          m.full_name,
          m.phone_number,
          m.profile_photo_url,
          ms.start_date,
          ms.end_date,
          mp.plan_name
        FROM payments p
        JOIN memberships ms ON p.membership_id = ms.id
        JOIN members m ON ms.member_id = m.id
        JOIN membership_plans mp ON ms.plan_id = mp.id
        ORDER BY p.created_at DESC
      `);
      
      return NextResponse.json({
        success: true,
        payments: result.rows
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Fetch payments error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}