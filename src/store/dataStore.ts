import { create } from 'zustand';
import { JobRequest, CVSubmission, FormQuestion } from '../types';
import { supabase, hasSupabaseConfig } from '../lib/supabase';

interface DataState {
  jobRequests: JobRequest[];
  cvSubmissions: CVSubmission[];
  cvQuestions: FormQuestion[];
  jobQuestions: FormQuestion[];
  isLoaded: boolean;
  addJobRequest: (job: JobRequest) => Promise<void>;
  addCVSubmission: (cv: CVSubmission) => Promise<void>;
  updateCVQuestions: (questions: FormQuestion[]) => Promise<void>;
  updateJobQuestions: (questions: FormQuestion[]) => Promise<void>;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataState>()(
  (set, get) => ({
    jobRequests: [],
    cvSubmissions: [],
    cvQuestions: [],
    jobQuestions: [],
    isLoaded: false,
    fetchData: async () => {
      if (!hasSupabaseConfig || !supabase) return;
      
      try {
        const [jobsRes, cvsRes, settingsRes] = await Promise.all([
          supabase.from('job_requests').select('*'),
          supabase.from('cv_submissions').select('*'),
          supabase.from('admin_settings').select('*')
        ]);

        if (jobsRes.data) {
          set({ jobRequests: jobsRes.data as JobRequest[] });
        }
        if (cvsRes.data) {
          set({ cvSubmissions: cvsRes.data as CVSubmission[] });
        }
        if (settingsRes.data) {
          const cvQ = settingsRes.data.find(s => s.id === 'cv_questions');
          const jobQ = settingsRes.data.find(s => s.id === 'job_questions');
          if (cvQ && cvQ.data) set({ cvQuestions: cvQ.data as FormQuestion[] });
          if (jobQ && jobQ.data) set({ jobQuestions: jobQ.data as FormQuestion[] });
        }
        set({ isLoaded: true });
      } catch (err) {
        console.error("Failed to fetch from Supabase:", err);
      }
    },
    addJobRequest: async (job) => {
      // Optimistic UI update
      set((state) => ({ jobRequests: [...state.jobRequests, job] }));
      if (hasSupabaseConfig && supabase) {
        const { error } = await supabase.from('job_requests').insert([job]);
        if (error) console.error("Error inserting job_request:", error);
      }
    },
    addCVSubmission: async (cv) => {
      // Optimistic UI update
      set((state) => ({ cvSubmissions: [...state.cvSubmissions, cv] }));
      if (hasSupabaseConfig && supabase) {
        const { error } = await supabase.from('cv_submissions').insert([cv]);
        if (error) console.error("Error inserting cv_submission:", error);
      }
    },
    updateCVQuestions: async (questions) => {
      set({ cvQuestions: questions });
      if (hasSupabaseConfig && supabase) {
        const { error } = await supabase.from('admin_settings').upsert({ id: 'cv_questions', data: questions });
        if (error) console.error("Error updating cv_questions:", error);
      }
    },
    updateJobQuestions: async (questions) => {
      set({ jobQuestions: questions });
      if (hasSupabaseConfig && supabase) {
        const { error } = await supabase.from('admin_settings').upsert({ id: 'job_questions', data: questions });
        if (error) console.error("Error updating job_questions:", error);
      }
    },
  })
);

