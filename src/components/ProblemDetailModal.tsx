import React from 'react';
import { Language, ProblemReport } from '../types';
import { UI_STRINGS } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ShieldAlert,
  Share2
} from 'lucide-react';

interface ProblemDetailModalProps {
  problem: ProblemReport | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onUpvote: (id: string) => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problem,
  isOpen,
  onClose,
  language,
  onUpvote,
}) => {
  const strings = UI_STRINGS[language];
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !problem) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: problem.title,
        text: `জনসেবা পোর্টাল - ট্র্যাকিং কোড: ${problem.trackingCode} | ${problem.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${problem.trackingCode} - ${problem.title}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400">
                {problem.trackingCode}
              </span>
              <span className="text-xs text-neutral-400">·</span>
              <span className="text-xs text-neutral-300">
                {problem.urgency === 'critical' ? (language === 'bn' ? 'জরুরি' : 'Critical') : (language === 'bn' ? 'স্বাভাবিক' : 'Normal')}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              {problem.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 flex-1 overflow-y-auto">
          
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-xs text-neutral-500 block">
                {language === 'bn' ? 'বর্তমান অবস্থা' : 'Current Status'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {problem.status === 'resolved' ? (
                  <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {language === 'bn' ? 'সমাধান সম্পন্ন' : 'Resolved / Demolished'}
                  </span>
                ) : problem.status === 'in_progress' ? (
                  <span className="text-sm font-bold text-amber-600 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    {language === 'bn' ? 'মাঠপর্যায়ে কার্যক্রম চলমান' : 'Right Now Ongoing'}
                  </span>
                ) : problem.status === 'reviewing' ? (
                  <span className="text-sm font-bold text-blue-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {language === 'bn' ? 'ইউনিয়ন কর্তৃক যাচাই চলছে' : 'Checking by Union'}
                  </span>
                ) : (
                  <span className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    {language === 'bn' ? 'নতুন আবেদন' : 'New Submission'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpvote(problem.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  problem.userUpvoted
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${problem.userUpvoted ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                <span className="font-mono-num">{problem.upvotes}</span>
                <span>{language === 'bn' ? 'সমর্থন' : 'Support'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer text-xs font-semibold"
                title={language === 'bn' ? 'শেয়ার করুন' : 'Share'}
              >
                <Share2 className="w-3.5 h-3.5" />
                {copied && <span className="text-emerald-700 text-[11px] font-bold">{language === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>}
              </button>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              {language === 'bn' ? 'সমস্যার বিস্তারিত বিবরণ' : 'Problem Description'}
            </h4>
            <p className="text-sm text-neutral-800 leading-relaxed bg-white p-4 rounded-2xl border border-neutral-200">
              {problem.description}
            </p>
          </div>

          {/* Location & Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">
                {language === 'bn' ? 'নির্দিষ্ট অবস্থান' : 'Specific Location'}
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{problem.specificLocation}</span>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-neutral-500 block mb-1 font-medium">
                {language === 'bn' ? 'দাখিলের তারিখ ও নাগরিক' : 'Submission Details'}
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                <Calendar className="w-4 h-4 text-neutral-500 shrink-0" />
                <span>{new Date(problem.createdAt).toLocaleDateString()} · {problem.citizenName}</span>
              </div>
            </div>
          </div>

          {/* Resolution summary if present */}
          {problem.resolutionNote && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{strings.officialNotes}</span>
              </div>
              <p className="leading-relaxed">{problem.resolutionNote}</p>
            </div>
          )}

          {/* Action History / Timeline */}
          <div>
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
              {language === 'bn' ? 'পদক্ষেপের হালনাগাদ ও অগ্রগতি' : 'Action Timeline & Field Updates'}
            </h4>
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-neutral-200">
              {problem.timeline.map((event, idx) => (
                <div key={event.id || idx} className="relative flex items-start gap-3 pl-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold z-10 shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-xl border border-neutral-200 text-xs shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-semibold text-neutral-800">{event.author}</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">
                      {language === 'bn' ? event.noteBn : event.noteEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
