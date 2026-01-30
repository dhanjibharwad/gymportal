import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      // Get members with membership and payment data using correct table/column names
      const result = await client.query(`
        SELECT 
          m.*,
          ms.start_date,
          ms.end_date,
          ms.status as membership_status,
          ms.trainer_assigned,
          ms.batch_time,
          ms.membership_type,
          ms.locker_required,
          mp.plan_name,
          mp.duration_months,
          mp.price as plan_price,
          p.total_amount,
          p.paid_amount,
          p.payment_status,
          p.payment_mode,
          p.next_due_date
        FROM members m
        LEFT JOIN memberships ms ON m.id = ms.member_id
        LEFT JOIN membership_plans mp ON ms.plan_id = mp.id
        LEFT JOIN payments p ON ms.id = p.membership_id
        ORDER BY m.id ASC
      `);
      
      return NextResponse.json({
        success: true,
        members: result.rows
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database error', 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}