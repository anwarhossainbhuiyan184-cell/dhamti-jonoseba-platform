import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { Language, ProblemReport } from '../types';
import { googleSignIn, logout } from '../services/auth';
import { 
  createCivicSpreadsheet, 
  syncAllProblemsToSheet, 
  setStoredSpreadsheetId 
} from '../services/sheets';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  LogOut,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  user: User | null;
  accessToken: string | null;
  spreadsheetId: string | null;
  onSpreadsheetConnected: (id: string) => void;
  onUserAuthChange: (user: User | null, token: string | null) => void;
  problems: ProblemReport[];
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  language,
  user,
  accessToken,
  spreadsheetId,
  onSpreadsheetConnected,
  onUserAuthChange,
  problems,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [customSheetInput, setCustomSheetInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  if (!isOpen) return null;

  // 1-Click Instant Offline/Local Spreadsheet Download (Zero setup, 100% reliable)
  const handleInstantExport = () => {
    try {
      const headers = [
        'Tracking Code', 
        'Title', 
        'Ward / Area', 
        'Category', 
        'Urgency', 
        'Status', 
        'Specific Location', 
        'Citizen Name', 
        'Citizen Mobile Number', 
        'Submission Date', 
        'Assigned Officer', 
        'Action Notes'
      ];
      
      const rows = problems.map((p) => [
        p.trackingCode,
        `"${(p.title || '').replace(/"/g, '""')}"`,
        p.ward,
        p.category,
        p.urgency,
        p.status,
        `"${(p.specificLocation || '').replace(/"/g, '""')}"`,
        `"${(p.citizenName || 'নাগরিক').replace(/"/g, '""')}"`,
        p.phone || 'N/A',
        new Date(p.createdAt).toLocaleString(),
        `"${(p.assignedOfficer || 'ধামতী ইউনিয়ন সেবাদল').replace(/"/g, '""')}"`,
        `"${(p.resolutionNote || 'কার্যক্রম গ্রহণ করা হয়েছে').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `dhamti-grievances-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setStatusMessage(
        language === 'bn'
          ? 'এক্সেল/স্প্রেডশিট ফাইল ডাউনলোড হয়েছে! এটি সরাসরি Excel বা Google Sheets-এ খুলতে পারবেন।'
          : 'Spreadsheet downloaded! You can open it directly in Excel or Google Sheets.'
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Download failed.');
    }
  };

  // 1-Click Auto Cloud Sync (Unified login + sheet creation + data sync)
  const handleAutoCloudSync = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setStatusMessage(null);

    try {
      let activeToken = accessToken;
      let activeUser = user;

      // Step 1: Sign in if not yet authenticated
      if (!activeToken || !activeUser) {
        const authRes = await googleSignIn();
        if (!authRes) {
          setIsProcessing(false);
          return;
        }
        activeToken = authRes.accessToken;
        activeUser = authRes.user;
        onUserAuthChange(authRes.user, authRes.accessToken);
      }

      // Step 2: Auto-create sheet if not existing
      let targetId = spreadsheetId;
      if (!targetId) {
        const metadata = await createCivicSpreadsheet(
          activeToken,
          'আমাদের ধামতী আমরাই গড়ব - নাগরিক অভিযোগ ও সেবা ট্র্যাকার'
        );
        targetId = metadata.spreadsheetId;
        onSpreadsheetConnected(targetId);
      }

      // Step 3: Auto-sync all current grievances
      const res = await syncAllProblemsToSheet(activeToken, targetId, problems);
      setStatusMessage(
        language === 'bn'
          ? `সফল হয়েছে! ${res.count} টি অভিযোগ স্বয়ংক্রিয়ভাবে আপনার গুগল শিটে সিঙ্ক হয়েছে।`
          : `Success! ${res.count} complaints auto-synced to your Google Sheet.`
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || (language === 'bn' ? 'গুগল সিঙ্ক সম্পন্ন করা যায়নি। চাইলে ইনস্ট্যান্ট এক্সেল ডাউনলোড ব্যবহার করতে পারেন।' : 'Cloud sync failed. You can use the Instant Excel Download.')
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onUserAuthChange(null, null);
    setStatusMessage(null);
  };

  const handleLinkExistingSheet = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanedId = customSheetInput.trim();
    if (!cleanedId) return;

    const match = cleanedId.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      cleanedId = match[1];
    }

    onSpreadsheetConnected(cleanedId);
    setStoredSpreadsheetId(cleanedId);
    setStatusMessage(
      language === 'bn' ? 'গুগল শিট সফলভাবে যুক্ত হয়েছে।' : 'Google Sheet linked successfully.'
    );
    setCustomSheetInput('');
  };

  const sheetUrl = spreadsheetId 
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit` 
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-800 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold">
                {language === 'bn' ? 'এক্সেল ও গুগল শিট ব্যবস্থাপনা' : 'Excel & Google Sheets Sync'}
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-200">
                {language === 'bn' ? 'কোনো জটিলতা ছাড়া ১-ক্লিকে ডেটা সেভ ও ভিউ করুন' : 'Simple, zero-hassle spreadsheet backup'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 flex-1 overflow-y-auto">
          
          {/* Status and Error Alert */}
          {statusMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>{statusMessage}</span>
                {sheetUrl && (
                  <div className="mt-1.5">
                    <a
                      href={sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'সরাসরি গুগল শিটটি ব্রাউজারে খুলুন ↗' : 'Open Google Sheet in Browser ↗'}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* METHOD 1: Instant Zero-Setup Download (Super Easy) */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-2xl border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {language === 'bn' ? 'পদ্ধতি ১ (সবচেয়ে সহজ)' : 'Method 1 (Instant)'}
                </span>
                <span className="text-xs font-bold text-neutral-800">
                  {language === 'bn' ? '১-ক্লিকে এক্সেল স্প্রেডশিট ডাউনলোড' : 'Instant 1-Click Excel Download'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                {problems.length} {language === 'bn' ? 'টি তথ্য' : 'Records'}
              </span>
            </div>
            
            <p className="text-xs text-neutral-600 leading-relaxed mb-3.5">
              {language === 'bn' 
                ? 'কোনো অ্যাকাউন্ট লগইন বা ক্লাউড কনফিগারেশনের প্রয়োজন নেই। ক্লিক করলেই তাৎক্ষণিক সকল নাগরিক অভিযোগ ও মোবাইল নম্বরসহ স্প্রেডশিট ফাইল আপনার ডিভাইসে ডাউনলোড হবে।' 
                : 'Zero setup required. Instantly downloads all complaints, citizen numbers, and statuses as an Excel-ready spreadsheet.'}
            </p>

            <button
              type="button"
              onClick={handleInstantExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'bn' ? 'এক্সেল ফাইল ডাউনলোড করুন (.CSV)' : 'Download Spreadsheet (.CSV)'}</span>
            </button>
          </div>

          {/* METHOD 2: 1-Click Google Drive / Sheets Cloud Auto-Sync */}
          <div className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-neutral-800 text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {language === 'bn' ? 'পদ্ধতি ২ (ক্লাউড)' : 'Method 2 (Cloud)'}
                </span>
                <span className="text-xs font-bold text-neutral-800">
                  {language === 'bn' ? 'গুগল ড্রাইভ ও গুগল শিট অটো-সিঙ্ক' : 'Google Drive & Sheets Auto-Sync'}
                </span>
              </div>
              
              {user && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-red-600 font-semibold cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{language === 'bn' ? 'লগআউট' : 'Sign out'}</span>
                </button>
              )}
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              {language === 'bn'
                ? 'আপনার নিজস্ব গুগল ড্রাইভে স্বয়ংক্রিয়ভাবে একটি লাইভ গুগল শিট তৈরি করে ডেটা সিঙ্ক রাখুন।'
                : 'Automatically create and sync a live Google Sheet in your personal Google Drive.'}
            </p>

            {/* If Connected and Sheet Exists */}
            {user && spreadsheetId ? (
              <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{language === 'bn' ? 'গুগল শিট সক্রিয় আছে' : 'Google Sheet Active'}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono truncate max-w-[180px]">
                    {user.email}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={sheetUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors border border-emerald-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'শিটটি খুলুন' : 'Open Sheet ↗'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleAutoCloudSync}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>{isProcessing ? (language === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (language === 'bn' ? 'এখনই রিফ্রেশ সিঙ্ক' : 'Sync All Now')}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Single Big 1-Click Auto Button */
              <button
                type="button"
                onClick={handleAutoCloudSync}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-neutral-100 active:scale-98 border border-neutral-300 rounded-xl shadow-2xs text-xs sm:text-sm font-bold text-neutral-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>
                  {isProcessing
                    ? (language === 'bn' ? 'স্বয়ংক্রিয়ভাবে তৈরি ও সিঙ্ক হচ্ছে...' : 'Auto-connecting & syncing...')
                    : (language === 'bn' ? 'গুগল দিয়ে ১-ক্লিকে শিট তৈরি ও অটো-সিঙ্ক' : 'Connect Google & Auto-Sync Sheet')}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </button>
            )}

            {/* Optional Collapsed Advanced Link */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'bn' ? 'উন্নত সেটিংস (বিদ্যমান শিট লিংক করতে চাইলে)' : 'Advanced: Link an existing custom sheet'}</span>
                {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showAdvanced && (
                <form onSubmit={handleLinkExistingSheet} className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={customSheetInput}
                    onChange={(e) => setCustomSheetInput(e.target.value)}
                    placeholder={language === 'bn' ? 'গুগল শিটের লিংক বা আইডি পেস্ট করুন' : 'Paste Sheet URL or ID'}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                  >
                    {language === 'bn' ? 'যুক্ত করুন' : 'Link'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* FAQ / Simple Guide Reassurance Accordion */}
          <div className="border border-neutral-200 rounded-2xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setShowFaq(!showFaq)}
              className="w-full p-3 bg-neutral-50 hover:bg-neutral-100 flex items-center justify-between font-bold text-neutral-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>{language === 'bn' ? 'Vercel ও গুগল শিট নিয়ে আপনার জানা প্রয়োজন' : 'Vercel & Google Sheets FAQ'}</span>
              </div>
              {showFaq ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>

            {showFaq && (
              <div className="p-3.5 space-y-2 bg-white text-neutral-600 text-[11px] leading-relaxed">
                <p>
                  <strong>১. Vercel-এ কোনো ডাটাবেজ ছাড়াই কি সব কাজ করবে?</strong><br />
                  হ্যাঁ, ১০০% কাজ করবে। 'এক্সেল ডাউনলোড' যে-কারো ব্রাউজারেই সরাসরি তাৎক্ষণিক কাজ করবে কোনো ডাটাবেজ ছাড়াই।
                </p>
                <p>
                  <strong>২. সাধারণ নাগরিক বা অভিযোগকারীদের কি গুগল লগইন করতে হবে?</strong><br />
                  না! সাধারণ নাগরিকরা কোনো লগইন ছাড়াই স্বাভাবিকভাবে অভিযোগ জমা দিতে পারবেন। গুগল শিট শুধু অ্যাডমিনের ব্যাকআপের জন্য।
                </p>
                <p>
                  <strong>৩. আমার গুগল শিটে কী কী তথ্য থাকবে?</strong><br />
                  ট্র্যাকিং কোড, শিরোনাম, ওয়ার্ড, সমস্যা ধরন, জরুরি মাত্রা, বর্তমান স্ট্যাটাস, মোবাইল নম্বর, তারিখ ও সমাধান নোট।
                </p>
              </div>
            )}
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'bn'
                ? 'নাগরিকদের ব্যক্তিগত তথ্য ও ফোন নম্বর সম্পূর্ণ সুরক্ষিত এবং অনুমোদিত টিম ছাড়া কারো কাছে প্রকাশিত হয় না।'
                : 'Citizen phone numbers and private details remain strictly confidential and secured.'}
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            {language === 'bn' ? 'ধামতী ইউনিয়ন নাগরিক সেবা মঞ্চ' : 'Dhamti Citizen Service Platform'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
