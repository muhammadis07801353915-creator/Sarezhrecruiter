'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, FileText, Building2 } from 'lucide-react';

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar' || i18n.language === 'ckb';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
           {t('home_title')}
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          {t('home_desc')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Candidate Card */}
        <Link href="/submit-cv" className="group">
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-full bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                <FileText className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('home_candidate_title')}</h2>
              <p className="text-gray-500 mb-8 min-h-[60px] text-lg">
                {t('home_candidate_desc')}
              </p>
              <div className="flex items-center text-emerald-600 font-semibold text-lg group-hover:translate-x-2 transition-transform rtl:group-hover:-translate-x-2">
                {t('home_candidate_btn')} <ArrowIcon className="ml-2 w-5 h-5 rtl:mr-2 rtl:ml-0" />
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Employer Card */}
        <Link href="/post-job" className="group">
          <motion.div 
            whileHover={{ y: -5 }}
            className="h-full bg-gray-900 text-white border border-gray-800 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl hover:shadow-gray-900/20 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-gray-800 text-amber-400 border border-gray-700 rounded-2xl flex items-center justify-center mb-8">
                <Building2 className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4">{t('home_employer_title')}</h2>
              <p className="text-gray-400 mb-8 min-h-[60px] text-lg">
                {t('home_employer_desc')}
              </p>
              <div className="flex items-center text-amber-400 font-semibold text-lg group-hover:translate-x-2 transition-transform rtl:group-hover:-translate-x-2">
                {t('home_employer_btn')} <ArrowIcon className="ml-2 w-5 h-5 rtl:mr-2 rtl:ml-0" />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
