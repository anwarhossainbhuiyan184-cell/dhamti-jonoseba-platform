import React from 'react';
import { Language, LeaderProfile } from '../types';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Lock, FileSpreadsheet, ArrowRight } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenReportModal: () => void;
  onOpenTrackModal: () => void;
  onOpenAdmin: () => void;
  leaderProfile: LeaderProfile;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenReportModal,
  onOpenTrackModal,
  onOpenAdmin,
  leaderProfile,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-neutral-800">
          
          {/* Column 1: Brand & Leader */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-base mb-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                জ
              </span>
              <span>{language === 'bn' ? `ধামতী জনসেবা মঞ্চ — ${leaderProfile.name}` : `Dhamti Jonoseba — ${leaderProfile.name}`}</span>
            </div>
            <p className="text-neutral-400 text-xs max-w-md leading-relaxed">
              {language === 'bn'
                ? `“${leaderProfile.mainSlogan} — ${leaderProfile.subSlogan}।” ধামতীবাসীর সেবা ও এলাকার প্রতিটি অলিগলির সমস্যা দ্রুত সমাধানের উন্মুক্ত মঞ্চ।`
                : `“${leaderProfile.mainSlogan} — ${leaderProfile.subSlogan}.” Dedicated to resolving citizen issues across Dhamti Union.`}
            </p>
            <div className="flex items-center gap-2 mt-4 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === 'bn' ? 'সততা, স্বচ্ছতা ও সরাসরি জবাবদিহিতা' : 'Integrity, Transparency & Accountability'}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-xs">
              {language === 'bn' ? 'নাগরিক সেবা' : 'Citizen Actions'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'bn' ? 'নতুন সমস্যা জানান' : 'Report a Problem'}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenTrackModal}
                  className="hover:text-emerald-400 transition-colors cursor-pointer text-left"
                >
                  {language === 'bn' ? 'অভিযোগের অবস্থা জানুন' : 'Track Status by Code'}
                </button>
              </li>
              <li>
                <a href="#statistics" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'এলাকাভিত্তিক পরিসংখ্যান' : 'Area Statistics'}
                </a>
              </li>
              <li>
                <a href="#problem-feed" className="hover:text-emerald-400 transition-colors">
                  {language === 'bn' ? 'সকল অভিযোগের তালিকা' : 'Public Grievance Feed'}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Emergency Helplines */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider mb-3 text-xs">
              {language === 'bn' ? 'যোগাযোগ ও সহায়তা' : 'Helpline & Office'}
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{leaderProfile.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{leaderProfile.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{leaderProfile.officeAddress}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* DEDICATED ADMIN SECTION IN FOOTER PANEL */}
        <div className="mb-8 p-4 sm:p-5 bg-neutral-900/90 rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 text-left w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs sm:text-sm">
                  {language === 'bn' ? 'প্রশাসনিক ও সেবা দল প্যানেল' : 'Administrative & Service Cell Portal'}
                </span>
                <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 text-[10px] font-mono rounded">
                  PIN 223344
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                {language === 'bn'
                  ? 'শুধুমাত্র অ্যাডমিনের জন্য: অভিযোগের স্ট্যাটাস পরিবর্তন, গোপন মোবাইল নম্বর ও এক্সেল/গুগল শিট ব্যাকআপ।'
                  : 'Restricted for Admin: Complaint status dispatch, private phone numbers, and Excel/Google Sheets sync.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-neutral-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল প্রবেশ করুন' : 'Unlock Admin Panel'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom copyright row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 pt-2">
          <p>
            © {new Date().getFullYear()} {leaderProfile.name} জনসেবা ফোরাম। All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>{language === 'bn' ? 'জনগণের সেবায় নিবেদিত' : 'Dedicated to public service with'}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
