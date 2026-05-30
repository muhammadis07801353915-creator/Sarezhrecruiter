import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  // If no service key, try with anon key (won't work for policy creation but will show the error)
  const key = supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !key) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, key);

  // Try to create DELETE policies
  const queries = [
    `CREATE POLICY IF NOT EXISTS "Allow public delete cv_submissions" ON cv_submissions FOR DELETE USING (true)`,
    `CREATE POLICY IF NOT EXISTS "Allow public delete job_requests" ON job_requests FOR DELETE USING (true)`,
  ];

  const results = [];
  for (const query of queries) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      results.push({ query, success: !error, error: error?.message || null });
    } catch (e: any) {
      results.push({ query, success: false, error: e.message });
    }
  }

  return NextResponse.json({ 
    message: 'Policy setup attempted. If this failed, please run the SQL manually in Supabase SQL Editor.',
    results,
    manual_sql: queries.join(';\n')
  });
}
