'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDataStore } from '../../store/dataStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FormQuestion } from '../../types';

export default function CVForm() {
  const router = useRouter();
  const { addCVSubmission, cvQuestions, fetchData } = useDataStore();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ckb';
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const baseQuestions: FormQuestion[] = useMemo(() => {
    const defaults: FormQuestion[] = [
      { id: 'q1', type: 'text', question: t('q_name') },
      { id: 'q_phone', type: 'text', question: t('q_phone') },
      { id: 'q_dob', type: 'text', question: t('q_dob') },
      { id: 'q_gender', type: 'select', question: t('q_gender'), options: t('q_gender_opts').split(',') },
      { id: 'q8', type: 'text', question: t('q_city') },
      { id: 'q_address', type: 'textarea', question: t('q_address') },
      { id: 'q2', type: 'multiselect', question: t('q_langs'), options: t('q_langs_opts').split(',') },
      { id: 'q6', type: 'select', question: t('q_edu'), options: t('q_edu_opts').split(',') },
      { id: 'q3', type: 'text', question: t('q_field') },
      { id: 'q_skills', type: 'textarea', question: t('q_skills') },
      { id: 'q4', type: 'number', question: t('q_exp') },
      { id: 'q7', type: 'select', question: t('q_avail'), options: t('q_avail_opts').split(',') },
      { id: 'q10', type: 'number', question: t('q_salary') },
      { id: 'q9', type: 'textarea', question: t('q_cert') },
      { id: 'q_references', type: 'textarea', question: t('q_references') },
    ];

    if (cvQuestions && cvQuestions.length > 0) {
      const baseIds = ['q1', 'q_phone', 'q_dob', 'q_gender', 'q8', 'q_address', 'q2', 'q6', 'q3', 'q_skills', 'q4', 'q7', 'q10', 'q9', 'q_references'];
      const extraQuestions = cvQuestions.filter(q => !baseIds.includes(q.id));
      
      return [...defaults, ...extraQuestions];
    }
    
    return defaults;
  }, [t, cvQuestions]);

  const questions = useMemo(() => {
    let finalQuestions: FormQuestion[] = [];
    baseQuestions.forEach(q => {
      finalQuestions.push(q);
      if (q.id === 'q2' && answers['q2'] && Array.isArray(answers['q2'])) {
        answers['q2'].forEach((lang: string) => {
          finalQuestions.push({
            id: `q2_prof_${lang}`,
            type: 'select',
            question: t('q_prof', { lang }),
            options: t('q_prof_opts').split(',')
          });
        });
      }
    });
    return finalQuestions;
  }, [answers, baseQuestions, t]);

  const isAuthStep = currentStepIndex === questions.length;
  const currentQuestion = questions[currentStepIndex];

  const handleNext = () => {
    setCurrentStepIndex(curr => curr + 1);
  };

  const handleBack = () => {
    setCurrentStepIndex(curr => Math.max(0, curr - 1));
  };

  const submitFinal = () => {
    const responses = questions.map(q => ({
      question: q.question,
      answer: answers[q.id]
    }));

    addCVSubmission({
      id: crypto.randomUUID(),
      candidate_id: crypto.randomUUID(),
      candidate_name: (answers['q1'] as string) || 'Unknown Candidate',
      candidate_email: '',
      candidate_phone: (answers['q_phone'] as string) || '',
      target_job: answers['q3'] || 'Unknown Field',
      submitted_at: new Date().toISOString(),
      responses,
      status: 'pending'
    });

    setIsSubmitted(true);
  };

  const currentAnswer = answers[currentQuestion?.id] || (currentQuestion?.type === 'multiselect' ? [] : '');
  const isAnswerValid = (currentQuestion?.id === 'q9' || currentQuestion?.id === 'q_references') ? true : 
    (currentQuestion?.type === 'multiselect' ? currentAnswer.length > 0 : currentAnswer !== '' && currentAnswer !== undefined);

  const toggleMultiselect = (option: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const updated = current.includes(option) 
      ? current.filter(o => o !== option)
      : [...current, option];
    setAnswers({ ...answers, [currentQuestion.id]: updated });
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 mt-12"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cv_success_title')}</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
          {t('cv_success_desc')}
        </p>
        <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => router.push('/')}>
          {t('go_home')}
        </Button>
      </motion.div>
    );
  }

  if (isAuthStep) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 mt-12"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('send_cv')}</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
          {t('send_cv_desc')}
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="outline" className="rounded-full border-gray-300 text-gray-700" onClick={handleBack}>
             {t('back')}
          </Button>
          <Button size="lg" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={submitFinal}>
            {t('send_cv')}
          </Button>
        </div>
      </motion.div>
    );
  }

  const progressPercentage = ((currentStepIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-8 min-h-[70vh] flex flex-col justify-center">
      <div className="mb-4">
        <h1 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-4">{t('cv_title')}</h1>
        <div className="w-full bg-gray-200 h-1.5 rounded-full mb-2 overflow-hidden">
          <motion.div 
            className="bg-emerald-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-sm text-gray-400 font-medium">{t('step')} {currentStepIndex + 1} {t('of')} {questions.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isRtl ? 20 : -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl min-h-[350px] flex flex-col"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 leading-tight">
            {currentQuestion.question}
          </h2>
          
          <div className="flex-1">
            {currentQuestion.type === 'text' && (
              <Input 
                autoFocus
                className="text-xl h-16 rounded-2xl border-gray-300 focus-visible:ring-emerald-500"
                value={currentAnswer} 
                onChange={e => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                onKeyDown={e => { if(e.key === 'Enter' && isAnswerValid) handleNext() }}
              />
            )}
            
            {currentQuestion.type === 'number' && (
              <Input 
                autoFocus
                type="number"
                className="text-xl h-16 rounded-2xl border-gray-300 focus-visible:ring-emerald-500"
                value={currentAnswer} 
                onChange={e => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                placeholder="0"
                onKeyDown={e => { if(e.key === 'Enter' && isAnswerValid) handleNext() }}
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <textarea 
                autoFocus
                className="w-full h-40 rounded-2xl border border-gray-300 p-5 text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 resize-none text-gray-900"
                value={currentAnswer} 
                onChange={e => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
              />
            )}

            {currentQuestion.type === 'select' && (
               <div className="flex flex-col gap-3">
                {currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setAnswers({...answers, [currentQuestion.id]: opt});
                      if(currentQuestion.id !== 'q9') {
                        setTimeout(handleNext, 300);
                      }
                    }}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${currentAnswer === opt ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm font-semibold text-gray-500">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-medium text-lg">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <div className="flex flex-col gap-3">
                {currentQuestion.options?.map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleMultiselect(opt)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${currentAnswer.includes(opt) ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'}`}
                  >
                    <span className="font-medium text-lg flex items-center gap-4">
                       <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${currentAnswer.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                         {currentAnswer.includes(opt) && <CheckCircle2 className="w-4 h-4 text-white" />}
                       </div>
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={currentStepIndex === 0}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full px-6"
            >
              <ArrowLeft className="w-5 h-5 rtl:hidden mr-2" /> 
              <ArrowRight className="w-5 h-5 hidden rtl:block ml-2" />
              {t('back')}
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={!isAnswerValid}
              size="lg"
              className="rounded-full px-8 bg-gray-900 hover:bg-gray-800 text-white shadow-lg disabled:opacity-30"
            >
              {currentStepIndex === questions.length - 1 ? t('finish') : t('continue')} 
               <ArrowRight className="w-5 h-5 rtl:hidden ml-2" />
               <ArrowLeft className="w-5 h-5 hidden rtl:block mr-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
