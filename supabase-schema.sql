-- Run this in your Supabase SQL editor

CREATE TABLE job_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id text,
  employer_name text,
  employer_email text,
  employer_phone text,
  title text,
  description text,
  location text,
  job_type text,
  experience_required text,
  education_required text,
  salary_min numeric,
  salary_max numeric,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  responses jsonb
);

CREATE TABLE cv_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id text,
  candidate_name text,
  candidate_email text,
  candidate_phone text,
  target_job text,
  status text DEFAULT 'pending',
  submitted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  responses jsonb
);

CREATE TABLE admin_settings (
  id text PRIMARY KEY,
  data jsonb
);

-- Init settings with empty arrays if you want or handle in code
INSERT INTO admin_settings (id, data) VALUES ('cv_questions', '[]') ON CONFLICT DO NOTHING;
INSERT INTO admin_settings (id, data) VALUES ('job_questions', '[]') ON CONFLICT DO NOTHING;

-- Enable RLS and create policies that allow anyone to insert/select (for demo purposes)
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to job_requests" ON job_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to job_requests" ON job_requests FOR SELECT USING (true);

CREATE POLICY "Allow public insert to cv_submissions" ON cv_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select to cv_submissions" ON cv_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public delete to cv_submissions" ON cv_submissions FOR DELETE USING (true);

CREATE POLICY "Allow public all to admin_settings" ON admin_settings FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete to job_requests" ON job_requests FOR DELETE USING (true);
