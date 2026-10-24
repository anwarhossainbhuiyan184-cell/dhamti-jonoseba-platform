import React from 'react';
import { AreaStat, CategoryStat, Language } from '../types';
import { UI_STRINGS } from '../data/mockData';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Percent, 
  MapPin, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface StatisticsSectionProps {
  language: Language;
  areas: AreaStat[];
  categories: CategoryStat[];
  selectedWard: string;
  onSelectWard: (ward: string) => void;
  totalSubmissions: number;
  totalResolved: number;
  totalInProgress: number;
}

export const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  language,
  areas,
  categories,
  selectedWard,
  onSelectWard,
  totalSubmissions,
  totalResolved,
  totalInProgress,
}) => {
  const strings = UI_STRINGS[language];
  const resolutionPercentage = totalSubmissions > 0 ? Math.round((totalResolved / totalSubmissions) * 100) : 0;

  return (
    <section id="statistics" className="py-12 sm:py-16 bg-neutral-50/70 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
            {language === 'bn' ? 'স্বচ্ছ নাগরিক ডেটা' : 'Citizen Transparency'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
            {strings.statsHeading}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2">
            {strings.statsSubheading}
          </p>
        </div>

        {/* 4 Core Quantitative Proof Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {/* Total Submissions */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-500 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {strings.totalReported}
              </span>
              <Users className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 font-mono-num">
                {totalSubmissions.toLocaleString()}
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn' ? 'সচেতন নাগরিক কর্তৃক দাখিলকৃত' : 'Logged by local residents'}
              </p>
            </div>
          </div>

          {/* Resolved */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {strings.totalResolved}
              </span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono-num">
                {totalResolved.toLocaleString()}
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn' ? 'বাস্তবে সমাধান ও রিপোর্ট আপডেট' : 'Verified completed actions'}
              </p>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-600 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {strings.totalInProgress}
              </span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono-num">
                {totalInProgress.toLocaleString()}
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn' ? 'মাঠ পর্যায়ে কাজ চলছে' : 'Active work in the field'}
              </p>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">
                {strings.resolutionRate}
              </span>
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 font-mono-num">
                  {resolutionPercentage}
                </span>
                <span className="text-xl font-bold text-blue-700">%</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn' ? 'গড় নিস্পত্তি সময় ৪৮ ঘণ্টা' : 'Avg. turnaround 48 hrs'}
              </p>
            </div>
          </div>
        </div>

        {/* Area / Ward-wise Breakdown Grid from sketch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 8 cols: Area-wise Problems Table / Cards */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                  <span>{language === 'bn' ? 'এলাকা অনুযায়ী সমস্যার তালিকা ও অগ্রগতি' : 'Area-wise Problems & Resolutions'}</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {language === 'bn' 
                    ? 'ওয়ার্ডে ক্লিক করে সরাসরি সেই এলাকার সমস্যাগুলো ফিল্টার করুন' 
                    : 'Click any ward to filter grievances for that specific area'}
                </p>
              </div>

              {selectedWard && (
                <button
                  type="button"
                  onClick={() => onSelectWard('')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer self-start sm:self-auto"
                >
                  {language === 'bn' ? 'সকল ওয়ার্ড দেখুন' : 'Show All Wards'}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {areas.map((area) => {
                const isSelected = selectedWard === area.wardNumber;
                const percentage = area.totalProblems > 0 ? Math.round((area.resolvedProblems / area.totalProblems) * 100) : 0;

                return (
                  <div
                    key={area.wardNumber}
                    onClick={() => onSelectWard(isSelected ? '' : area.wardNumber)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50/50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {area.wardNumber.replace('ward-', '#')}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">
                            {language === 'bn' ? area.wardNameBn : area.wardNameEn}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                            <span>{language === 'bn' ? 'প্রধান সমস্যা:' : 'Major Issue:'}</span>
                            <span className="font-medium text-neutral-700">
                              {language === 'bn' ? area.topCategoryBn : area.topCategoryEn}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:text-right shrink-0">
                        <div>
                          <div className="text-xs text-neutral-500">
                            {language === 'bn' ? 'আবেদন / সমাধান' : 'Reports / Resolved'}
                          </div>
                          <div className="text-sm font-bold text-neutral-900 font-mono-num">
                            <span className="text-emerald-700">{area.resolvedProblems}</span> / {area.totalProblems}
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          <span className="text-xs font-bold text-neutral-900 font-mono-num">{percentage}%</span>
                          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden mt-1">
                            <div 
                              className="bg-emerald-600 h-full rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <ArrowUpRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-700 rotate-90' : 'text-neutral-400'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4 cols: Category Distribution Breakdown */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-emerald-700" />
              <span>{language === 'bn' ? 'সমস্যার প্রধান খাতসমূহ' : 'Categories of Problems'}</span>
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              {language === 'bn' 
                ? 'নাগরিকদের দায়েরকৃত অভিযোগের খাতওয়ারী বিভাজন' 
                : 'Distribution of complaints across public sectors'}
            </p>

            <div className="space-y-4">
              {categories.map((cat) => {
                const totalCatCount = categories.reduce((acc, c) => acc + c.count, 0);
                const percent = Math.round((cat.count / totalCatCount) * 100);

                return (
                  <div key={cat.id} className="group">
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-neutral-800">
                        {language === 'bn' ? cat.nameBn : cat.nameEn}
                      </span>
                      <span className="text-neutral-500 font-mono-num">
                        {cat.count} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: cat.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Leader Commitment Quote */}
            <div className="mt-8 pt-6 border-t border-neutral-100 bg-emerald-50/60 p-4 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                {language === 'bn' ? 'মোঃ আনোয়ার হোসেন ভূঁইয়া' : 'Md. Anwar Hossain Bhuiyan'}
              </span>
              <p className="text-xs text-neutral-700 italic mt-1 leading-relaxed">
                {strings.leaderDirectQuote}
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
