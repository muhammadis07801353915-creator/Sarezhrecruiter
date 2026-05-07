'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Diamond } from 'lucide-react';

export function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'ckb' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex py-3 md:h-16 max-w-7xl flex-col md:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 gap-3 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 w-full md:w-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 group">
            <div className="bg-gray-900 p-1.5 rounded-lg text-white group-hover:bg-amber-500 transition-colors">
               <Diamond className="h-5 w-5" />
            </div>
            <span className="tracking-tight">{t('app_title')}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 md:gap-6 mt-2 md:mt-0">
            <Link href="/admin" className="text-xs md:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {t('admin_panel')}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200/50">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${i18n.language === 'en' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ckb')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${i18n.language === 'ckb' ? 'bg-white shadow-sm text-gray-900 border border-gray-200' : 'text-gray-500 hover:text-gray-900'}`}
            >
              کوردی
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
