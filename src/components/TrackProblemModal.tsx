import React, { useState } from 'react';
import { Language, ProblemReport } from '../types';
import { UI_STRINGS } from '../data/mockData';
import { X, Search, CheckCircle2, Clock, AlertCircle, MapPin, Calendar, UserCheck } from 'lucide-react';

interface TrackProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  problems: ProblemReport[];
}

export const TrackProblemModal: React.FC<TrackProblemModalProps> = ({
  isOpen,
  onClose,
  language,
  problems,
}) => {
  const strings = UI_STRINGS[language];
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<ProblemReport | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const cleanQuery = query.trim().toLowerCase();
    const cleanDigits = query.replace(/[^0-9]/g, '');

    if (!cleanQuery) {
      setResult(null);
      return;
    }

    const found = problems.find((p) => {
      // 1. Exact tracking code match
      if (p.trackingCode.toLowerCase() === cleanQuery) {
        return true;
      }
      // 2. Full phone match (only if not anonymous and query has at least 10 digits)
      if (!p.isAnonymous && p.phone && cleanDigits.length >= 10) {
        const problemDigits = p.phone.replace(/[^0-9]/g, '');
        return problemDigits === cleanDigits;
      }
      return false;
    });

    setResult(found || null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {language === 'bn' ? 'সমাধান সম্পন্ন' : 'Resolved'}
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
            <Clock className="w-4 h-4 text-amber-600" />
            {language === 'bn' ? 'কার্যক্রম চলমান' : 'In Progress'}
          </span>
        );
      case 'reviewing':
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <Clock className="w-4 h-4 text-blue-600" />
            {language === 'bn' ? 'যাচাই করা হচ্ছে' : 'Under Review'}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
            <AlertCircle className="w-4 h-4 text-neutral-500" />
            {language === 'bn' ? 'অপেক্ষমাণ' : 'Pending'}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold">
              {strings.trackModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box & Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={strings.trackInputPlaceholder}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <button
              type="submit"
              className="px-4 sm:px-5 py-2 sm:py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              {strings.searchBtn}
            </button>
          </form>

          {/* Quick Guidance Hint */}
          <div className="mt-2 text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>
              {language === 'bn'
                ? 'অভিযোগ দাখিলের পর প্রাপ্ত ট্র্যাকিং কোড (উদাঃ JNS-2026-XXXX) দিয়ে অনুসন্ধান করুন।'
                : 'Enter the tracking code (e.g. JNS-2026-XXXX) provided upon submission.'}
            </span>
          </div>

          {/* Result Area */}
          {searched && !result && (
            <div className="mt-6 p-6 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
              <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-neutral-800">
                {strings.searchNotFound}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn' ? 'সঠিক কোড বা ফোন নম্বর লিখে পুনরায় অনুসন্ধান করুন।' : 'Please check your tracking code and search again.'}
              </p>
            </div>
          )}

          {result && (
            <div className="mt-6 p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200 space-y-4">
              
              {/* Top Details */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-200">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {result.trackingCode}
                  </span>
                  <h4 className="text-base font-bold text-neutral-900 mt-0.5">
                    {result.title}
                  </h4>
                </div>
                <div>
                  {getStatusBadge(result.status)}
                </div>
              </div>

              {/* Location & Info */}
              <div className="text-xs text-neutral-600 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{result.specificLocation}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{new Date(result.createdAt).toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
                </div>
                {result.assignedOfficer && (
                  <div className="flex items-center gap-1.5 text-neutral-800 font-medium pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{strings.assignedTo}: {result.assignedOfficer}</span>
                  </div>
                )}
              </div>

              {/* Resolution Note */}
              {result.resolutionNote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <span className="font-bold block mb-0.5">{strings.officialNotes}:</span>
                  {result.resolutionNote}
                </div>
              )}

              {/* Timeline Steps */}
              <div className="pt-3 border-t border-neutral-200">
                <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
                  {language === 'bn' ? 'পদক্ষেপের ইতিহাস' : 'Action Timeline'}
                </h5>
                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-neutral-200">
                  {result.timeline.map((step, idx) => (
                    <div key={step.id || idx} className="relative flex items-start gap-3 pl-1">
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold z-10 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-white p-2.5 rounded-xl border border-neutral-200 text-xs shadow-2xs">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                          <span className="font-semibold text-neutral-700">{step.author}</span>
                          <span>{new Date(step.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-neutral-700">
                          {language === 'bn' ? step.noteBn : step.noteEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
