import React, { useState, useMemo } from 'react';
import { ProblemReport, AreaStat, CategoryStat, Language, ProblemStatus } from '../types';
import { UI_STRINGS } from '../data/mockData';
import { 
  Search, 
  ThumbsUp, 
  Eye, 
  MapPin, 
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ProblemFeedSectionProps {
  language: Language;
  problems: ProblemReport[];
  areas: AreaStat[];
  categories: CategoryStat[];
  selectedWard: string;
  onSelectWard: (ward: string) => void;
  onUpvote: (id: string) => void;
  onViewDetails: (problem: ProblemReport) => void;
}

export const ProblemFeedSection: React.FC<ProblemFeedSectionProps> = ({
  language,
  problems,
  areas,
  categories,
  selectedWard,
  onSelectWard,
  onUpvote,
  onViewDetails,
}) => {
  const strings = UI_STRINGS[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredProblems = useMemo(() => {
    return problems.filter((item) => {
      // Ward filter
      if (selectedWard && item.ward !== selectedWard) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLocation = item.specificLocation.toLowerCase().includes(query);
        const matchesCode = item.trackingCode.toLowerCase().includes(query);
        const matchesName = item.citizenName.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesLocation || matchesCode || matchesName;
      }
      return true;
    });
  }, [problems, selectedWard, selectedCategory, selectedStatus, searchQuery]);

  const getStatusLabel = (status: ProblemStatus) => {
    switch (status) {
      case 'resolved':
        return language === 'bn' ? 'সমাধান সম্পন্ন' : 'Resolved';
      case 'in_progress':
        return language === 'bn' ? 'কার্যক্রম চলমান' : 'Ongoing';
      case 'reviewing':
        return language === 'bn' ? 'ইউনিয়ন কর্তৃক যাচাই চলছে' : 'Checking by Union';
      case 'pending':
        return language === 'bn' ? 'নতুন আবেদন' : 'New Submission';
      default:
        return status;
    }
  };

  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return language === 'bn' ? 'জরুরি' : 'Critical';
      case 'high':
        return language === 'bn' ? 'উচ্চ অগ্রাধিকার' : 'High Priority';
      default:
        return language === 'bn' ? 'স্বাভাবিক' : 'Normal';
    }
  };

  const getWardName = (wardId: string) => {
    const area = areas.find((a) => a.wardNumber === wardId);
    if (!area) return wardId;
    return language === 'bn' ? area.wardNameBn : area.wardNameEn;
  };

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return catId;
    return language === 'bn' ? cat.nameBn : cat.nameEn;
  };

  return (
    <section id="problem-feed" className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              {language === 'bn' ? 'নাগরিক সমস্যা ও স্বচ্ছ নজরদারি' : 'Citizen Grievance Feed'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1">
              {strings.citizenFeedTitle}
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              {language === 'bn'
                ? 'আপনার এলাকার সমস্যা খুঁজুন অথবা নিজের সমস্যাটি সমাধান হলো কি না তা পর্যবেক্ষণ করুন'
                : 'Browse reported civic problems and monitor resolution progress'}
            </p>
          </div>

          <div className="text-sm text-neutral-500 font-mono-num">
            {language === 'bn' 
              ? `প্রদর্শিত হচ্ছে: ${filteredProblems.length} টি সমস্যা` 
              : `Showing: ${filteredProblems.length} reports`}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'সমস্যা, এলাকা বা ট্র্যাকিং কোড দিয়ে খুঁজুন...' : 'Search by issue, location or tracking code...'}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ward Select */}
            <div className="w-full sm:w-60">
              <select
                value={selectedWard}
                onChange={(e) => onSelectWard(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              >
                <option value="">{strings.allWards}</option>
                {areas.map((area) => (
                  <option key={area.wardNumber} value={area.wardNumber}>
                    {language === 'bn' ? area.wardNameBn : area.wardNameEn}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div className="w-full sm:w-52">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              >
                <option value="all">{strings.allCategories}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Tabs (Interactive Segmented Control) */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-200/60">
            <span className="text-xs font-medium text-neutral-500 mr-1">
              {language === 'bn' ? 'অবস্থা:' : 'Status:'}
            </span>
            {[
              { id: 'all', label: strings.allStatuses },
              { id: 'pending', label: strings.pending },
              { id: 'reviewing', label: strings.reviewing },
              { id: 'in_progress', label: strings.in_progress },
              { id: 'resolved', label: strings.resolved },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === tab.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-neutral-200 p-8">
            <HelpCircle className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">
              {language === 'bn' ? 'কোনো সমস্যা পাওয়া যায়নি' : 'No matching problems found'}
            </h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
              {language === 'bn'
                ? 'ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন অথবা সরাসরি আপনার এলাকার সমস্যা নথিভুক্ত করুন।'
                : 'Try adjusting your search filters or report a new problem in your area.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProblems.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(
                language === 'bn' ? 'bn-BD' : 'en-US',
                { month: 'short', day: 'numeric', year: 'numeric' }
              );

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 hover:border-neutral-300 transition-all shadow-xs"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Content */}
                    <div className="flex-1">
                      {/* Zero-pill metadata line with typographic bullet separators (Frontend design constitution compliant) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-2">
                        <span className="font-mono-num font-semibold text-emerald-800">
                          {item.trackingCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-neutral-700">
                          {getCategoryName(item.category)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-neutral-600">
                          <MapPin className="w-3.5 h-3.5" />
                          {getWardName(item.ward)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 text-neutral-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Specific location marker */}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-3">
                        <span className="font-medium text-neutral-700">
                          {language === 'bn' ? 'স্থান:' : 'Location:'}
                        </span>
                        <span>{item.specificLocation}</span>
                      </div>

                      {/* Resolution note preview if resolved */}
                      {item.resolutionNote && (
                        <div className="mt-3 bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block">
                              {language === 'bn' ? 'পদক্ষেপ ও সমাধান বিবরণ:' : 'Official Action Summary:'}
                            </span>
                            <span>{item.resolutionNote}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Status badge & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                      
                      {/* Status indicator */}
                      <div className="flex items-center gap-1.5">
                        {item.status === 'resolved' ? (
                          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            {getStatusLabel(item.status)}
                          </span>
                        ) : item.status === 'in_progress' ? (
                          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                            <Clock className="w-4 h-4 text-amber-600" />
                            {getStatusLabel(item.status)}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-neutral-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4 text-neutral-400" />
                            {getStatusLabel(item.status)}
                          </span>
                        )}

                        {item.urgency === 'critical' && (
                          <span className="text-[11px] font-bold text-red-700 ml-1">
                            ({getUrgencyText(item.urgency)})
                          </span>
                        )}
                      </div>

                      {/* Action buttons: Upvote & View Details */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpvote(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                            item.userUpvoted
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-semibold'
                              : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                          }`}
                          title={language === 'bn' ? 'সমর্থন জানান' : 'Support this issue'}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${item.userUpvoted ? 'fill-emerald-700 text-emerald-700' : ''}`} />
                          <span className="font-mono-num">{item.upvotes}</span>
                          <span className="hidden sm:inline">
                            {language === 'bn' ? 'সমর্থন' : 'Support'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewDetails(item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{strings.viewDetails}</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
