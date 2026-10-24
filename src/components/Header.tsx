import React from 'react';
import { Language } from '../types';
import { Globe, PlusCircle } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenReportModal: () => void;
  onOpenTrackModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onOpenReportModal,
  onOpenTrackModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand title, single line (Text only) */}
        <a 
          href="#home" 
          className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight text-emerald-900 hover:text-emerald-700 whitespace-nowrap shrink-0 transition-colors"
        >
          <span className="hidden min-[380px]:inline">{language === 'bn' ? 'জনসেবা মঞ্চ' : 'Jonoseba'}</span>
          <span className="min-[380px]:hidden">{language === 'bn' ? 'জনসেবা' : 'Seba'}</span>
        </a>

        {/* Zone 2: Concise public citizen nav links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-neutral-600">
          <a href="#hero-banner" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
            {language === 'bn' ? 'মূলবার্তা' : 'Overview'}
          </a>
          <a href="#statistics" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
            {language === 'bn' ? 'পরিসংখ্যান' : 'Statistics'}
          </a>
          <a href="#problem-feed" className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0">
            {language === 'bn' ? 'অভিযোগসমূহ' : 'Grievances'}
          </a>
          <button 
            type="button"
            onClick={onOpenTrackModal} 
            className="hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {language === 'bn' ? 'ট্র্যাকিং' : 'Track Status'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + Language toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onLanguageChange(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">{language === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReportModal}
            className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden min-[440px]:inline">{language === 'bn' ? 'সমস্যা জানান' : 'Report Problem'}</span>
            <span className="min-[440px]:hidden">{language === 'bn' ? 'জানান' : 'Report'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
