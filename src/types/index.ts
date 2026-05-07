export type QuestionType = 'text' | 'number' | 'textarea' | 'select' | 'multiselect';

export interface FormQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Used for select/multiselect
  required?: boolean;
}

export type Role = 'employer' | 'candidate' | 'admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: Role;
  name: string;
  created_at: string;
}

export interface JobRequest {
  id: string;
  employer_id: string;
  employer_name?: string;
  employer_email?: string;
  employer_phone?: string;
  title: string;
  description: string;
  location: string;
  job_type?: string;
  experience_required?: string;
  education_required?: string;
  salary_min: number;
  salary_max: number;
  status: 'pending' | 'reviewed';
  created_at: string;
  responses?: SmartFormResponse[];
}

export interface SmartFormResponse {
  question: string;
  answer: string | string[] | number | null;
}

export interface CVSubmission {
  id: string;
  candidate_id: string;
  candidate_name?: string;
  candidate_email?: string;
  candidate_phone?: string;
  target_job?: string;
  submitted_at: string;
  responses: SmartFormResponse[];
  status: 'pending' | 'reviewed';
}
