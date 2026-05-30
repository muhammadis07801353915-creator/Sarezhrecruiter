'use client';

import React, { useState, useEffect } from 'react';
import { useDataStore } from '../../store/dataStore';
import { FileText, Building2, Clock, MoreVertical, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { FormQuestion } from '../../types';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { jobRequests, cvSubmissions, fetchData, deleteCVSubmission, deleteJobRequest } = useDataStore();
  const [tab, setTab] = useState<'cv' | 'job' | 'settings'>('cv');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteCV = async (id: string) => {
    if (confirm('Are you sure you want to delete this CV? / دڵنیایت کە دەتەوێت ئەم سیڤییە بسڕیتەوە؟')) {
      await deleteCVSubmission(id);
      setOpenMenuId(null);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (confirm('Are you sure you want to delete this Job? / دڵنیایت کە دەتەوێت ئەم کارە بسڕیتەوە؟')) {
      await deleteJobRequest(id);
      setOpenMenuId(null);
    }
  };

  const sortedCVs = [...cvSubmissions].sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  const sortedJobs = [...jobRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('admin_panel')}</h1>
          <p className="text-gray-500">{t('admin_desc')}</p>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-xl self-start flex-wrap gap-1">
          <button
            onClick={() => setTab('cv')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'cv' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <FileText className="w-4 h-4" /> CVs ({cvSubmissions.length})
          </button>
          <button
            onClick={() => setTab('job')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'job' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            <Building2 className="w-4 h-4" /> Jobs ({jobRequests.length})
          </button>
          <button
            onClick={() => setTab('settings')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {t('settings')}
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {tab === 'cv' && (
          <div className="space-y-6">
            {sortedCVs.length === 0 && <p className="text-gray-500">{t('no_cv_admin')}</p>}
            {sortedCVs.map((cv, idx) => (
              <motion.div key={cv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold tracking-tight text-gray-900 text-lg">
                      {cv.candidate_name ? `${t('cv')}: ${cv.candidate_name}` : `Submission ID: ${cv.id}`}
                    </h3>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {cv.candidate_email && <span className="font-medium text-emerald-600">{cv.candidate_email}</span>}
                      {cv.candidate_phone && <span className="font-medium text-gray-600">{cv.candidate_phone}</span>}
                      {cv.target_job && <span className="text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md text-xs">{cv.target_job}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(cv.submitted_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${cv.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {cv.status}
                    </span>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === cv.id ? null : cv.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === cv.id && (
                      <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-10">
                        <button 
                          onClick={() => handleDeleteCV(cv.id)}
                          className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete / سڕینەوە
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cv.responses.map((r, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-semibold text-emerald-600 mb-1 uppercase tracking-wider">{r.question}</p>
                      <p className="text-gray-900 font-medium">
                        {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer?.toString() || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'job' && (
          <div className="space-y-6">
            {sortedJobs.length === 0 && <p className="text-gray-500">{t('no_job_admin')}</p>}
            {sortedJobs.map((job, idx) => (
              <motion.div key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold tracking-tight text-gray-900 text-xl">{job.title}</h3>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                      {job.employer_name && <span className="font-medium text-amber-600">{t('company')}: {job.employer_name}</span>}
                      {job.employer_email && <span className="text-gray-500">{job.employer_email}</span>}
                      {job.employer_phone && <span className="font-medium text-gray-600">{job.employer_phone}</span>}
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(job.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {job.status}
                    </span>
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {openMenuId === job.id && (
                      <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-10">
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete / سڕینەوە
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('location')}</p>
                      <p className="text-gray-900 font-medium">{job.location}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('job_type')}</p>
                      <p className="text-gray-900 font-medium">{job.job_type || '—'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('exp_req')}</p>
                      <p className="text-gray-900 font-medium">{job.experience_required ? `${job.experience_required} years` : '—'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('edu_req')}</p>
                      <p className="text-gray-900 font-medium">{job.education_required || '—'}</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('salary')}</p>
                    <p className="text-gray-900 font-medium">{job.salary_min} - {job.salary_max}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                     <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{t('description')}</p>
                     <p className="text-gray-900 whitespace-pre-wrap">{job.description}</p>
                  </div>
                  {job.responses && job.responses.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 border-t border-gray-100 pt-4">
                      {job.responses.map((r, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wider">{r.question}</p>
                          <p className="text-gray-900 font-medium">
                            {Array.isArray(r.answer) ? r.answer.join(', ') : r.answer?.toString() || '—'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {tab === 'settings' && (
          <div className="space-y-8">
            <CVFormBuilder />
            <JobFormBuilder />
          </div>
        )}
      </div>
    </div>
  );
}

function CVFormBuilder() {
  const { cvQuestions, updateCVQuestions } = useDataStore();
  const { t } = useTranslation();
  
  const baseIds = ['q1', 'q_phone', 'q_dob', 'q_gender', 'q8', 'q_address', 'q2', 'q6', 'q3', 'q_skills', 'q4', 'q7', 'q10', 'q9', 'q_references'];
  const [questions, setQuestions] = useState<FormQuestion[]>(
    cvQuestions ? cvQuestions.filter(q => !baseIds.includes(q.id)) : []
  );

  const addQuestion = () => {
    setQuestions([...questions, { id: `q_${Date.now()}`, type: 'text', question: '' }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateCVQuestions(questions);
    alert(t('saved_successfully'));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('cv_form_builder')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('cv_form_builder_desc')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold transition-all">
            {t('save_changes')}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 && <p className="text-gray-500">No extra custom questions added yet.</p>}
        {questions.map((q, idx) => (
          <div key={q.id} className="p-5 md:p-6 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('question')} {idx + 1}</label>
                <input 
                  type="text" 
                  value={q.question} 
                  onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <div className="w-full md:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('answer_type')}</label>
                <select 
                  value={q.type} 
                  onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="text">{t('short_text')}</option>
                  <option value="number">{t('number')}</option>
                  <option value="textarea">{t('long_text')}</option>
                  <option value="select">{t('dropdown')}</option>
                  <option value="multiselect">{t('multiselect')}</option>
                </select>
              </div>
              <button onClick={() => removeQuestion(idx)} className="mt-0 md:mt-7 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg self-end md:self-auto border border-red-200 md:border-transparent bg-white md:bg-transparent">
                {t('remove')}
              </button>
            </div>
            
            {(q.type === 'select' || q.type === 'multiselect') && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('options_comma')}</label>
                <input 
                  type="text" 
                  value={q.options?.join(',') || ''} 
                  onChange={(e) => updateQuestion(idx, 'options', e.target.value.split(',').map(o => o.trim()))}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            )}
          </div>
        ))}
        
        <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors">
          {t('add_extra_question')}
        </button>
      </div>
    </div>
  );
}

function JobFormBuilder() {
  const { jobQuestions, updateJobQuestions } = useDataStore();
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([...jobQuestions]);

  const addQuestion = () => {
    setQuestions([...questions, { id: `jq_${Date.now()}`, type: 'text', question: '' }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateJobQuestions(questions);
    alert(t('saved_successfully'));
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('job_form_builder')}</h2>
          <p className="text-gray-500 text-sm mt-1">{t('job_form_builder_desc')}</p>
        </div>
        <button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-bold transition-all">
          {t('save_changes')}
        </button>
      </div>

      <div className="space-y-6">
        {questions.length === 0 && <p className="text-gray-500">No custom questions added yet.</p>}
        {questions.map((q, idx) => (
          <div key={q.id} className="p-5 md:p-6 border border-gray-200 rounded-2xl bg-gray-50 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('question')} {idx + 1}</label>
                <input 
                  type="text" 
                  value={q.question} 
                  onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <div className="w-full md:w-64">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('answer_type')}</label>
                <select 
                  value={q.type} 
                  onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="text">{t('short_text')}</option>
                  <option value="number">{t('number')}</option>
                  <option value="textarea">{t('long_text')}</option>
                  <option value="select">{t('dropdown')}</option>
                  <option value="multiselect">{t('multiselect')}</option>
                </select>
              </div>
              <button onClick={() => removeQuestion(idx)} className="mt-0 md:mt-7 text-red-600 font-medium hover:bg-red-50 px-4 py-2 rounded-lg self-end md:self-auto border border-red-200 md:border-transparent bg-white md:bg-transparent">
                {t('remove')}
              </button>
            </div>
            
            {(q.type === 'select' || q.type === 'multiselect') && (
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t('options_comma')}</label>
                <input 
                  type="text" 
                  value={q.options?.join(',') || ''} 
                  onChange={(e) => updateQuestion(idx, 'options', e.target.value.split(',').map(o => o.trim()))}
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
            )}
          </div>
        ))}
        
        <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-400 transition-colors">
          {t('add_extra_question')}
        </button>
      </div>
    </div>
  );
}
