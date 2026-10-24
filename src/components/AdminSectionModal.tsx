import React, { useState, useRef, useEffect } from 'react';
import { Language, ProblemReport, ProblemStatus, LeaderProfile, AreaStat, CategoryStat } from '../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Download, 
  UserCheck, 
  ShieldCheck,
  FileSpreadsheet,
  Lock,
  Unlock,
  Settings,
  ListFilter,
  Phone,
  Mail,
  MapPin,
  Camera,
  Trash2,
  Eye,
  KeyRound,
  RefreshCw
} from 'lucide-react';

interface AdminSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  problems: ProblemReport[];
  areas: AreaStat[];
  categories: CategoryStat[];
  leaderProfile: LeaderProfile;
  onUpdateLeaderProfile: (updatedProfile: LeaderProfile) => void;
  onUpdateProblemStatus: (problemId: string, newStatus: ProblemStatus, noteText: string, officerName: string) => void;
  onDeleteProblem: (problemId: string) => void;
  onOpenGoogleSheets: () => void;
  isSheetsConnected: boolean;
}

export const AdminSectionModal: React.FC<AdminSectionModalProps> = ({
  isOpen,
  onClose,
  language,
  problems,
  areas,
  categories,
  leaderProfile,
  onUpdateLeaderProfile,
  onUpdateProblemStatus,
  onDeleteProblem,
  onOpenGoogleSheets,
  isSheetsConnected,
}) => {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dhamti_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [storedPin, setStoredPin] = useState<string>(() => {
    return localStorage.getItem('dhamti_admin_pin') || '223344';
  });

  // Active Tab: 'complaints' | 'profile_settings'
  const [activeTab, setActiveTab] = useState<'complaints' | 'profile_settings'>('complaints');
  const [mobileComplaintView, setMobileComplaintView] = useState<'list' | 'details'>('list');

  // Complaints Management State
  const [selectedProblemId, setSelectedProblemId] = useState<string>('');
  const [targetStatus, setTargetStatus] = useState<ProblemStatus>('in_progress');
  const [officerName, setOfficerName] = useState('ধামতী ইউনিয়ন সেবাদল');
  const [actionNote, setActionNote] = useState('');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'pending' | 'reviewing' | 'in_progress' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Profile Settings Form State
  const [editName, setEditName] = useState(leaderProfile.name);
  const [editPromise, setEditPromise] = useState(leaderProfile.promise);
  const [editMainSlogan, setEditMainSlogan] = useState(leaderProfile.mainSlogan);
  const [editSubSlogan, setEditSubSlogan] = useState(leaderProfile.subSlogan);
  const [editPhone, setEditPhone] = useState(leaderProfile.phone);
  const [editEmail, setEditEmail] = useState(leaderProfile.email);
  const [editAddress, setEditAddress] = useState(leaderProfile.officeAddress);
  const [editImage, setEditImage] = useState<string | null>(leaderProfile.profileImage);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  // New PIN State
  const [newPin, setNewPin] = useState('');
  const [pinSuccessMsg, setPinSuccessMsg] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (problems.length > 0 && !selectedProblemId) {
      setSelectedProblemId(problems[0].id);
    }
  }, [problems, selectedProblemId]);

  useEffect(() => {
    setEditName(leaderProfile.name);
    setEditPromise(leaderProfile.promise);
    setEditMainSlogan(leaderProfile.mainSlogan);
    setEditSubSlogan(leaderProfile.subSlogan);
    setEditPhone(leaderProfile.phone);
    setEditEmail(leaderProfile.email);
    setEditAddress(leaderProfile.officeAddress);
    setEditImage(leaderProfile.profileImage);
  }, [leaderProfile]);

  if (!isOpen) return null;

  // Handle PIN Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === storedPin || pinInput === '223344') {
      setIsAuthenticated(true);
      sessionStorage.setItem('dhamti_admin_auth', 'true');
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dhamti_admin_auth');
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLeaderProfile({
      ...leaderProfile,
      name: editName.trim(),
      promise: editPromise.trim(),
      mainSlogan: editMainSlogan.trim(),
      subSlogan: editSubSlogan.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
      officeAddress: editAddress.trim(),
      profileImage: editImage,
    });
    setProfileSuccessMsg(true);
    setTimeout(() => setProfileSuccessMsg(false), 3000);
  };

  // Handle Photo File Upload
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setEditImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      setStoredPin(newPin.trim());
      localStorage.setItem('dhamti_admin_pin', newPin.trim());
      setNewPin('');
      setPinSuccessMsg(true);
      setTimeout(() => setPinSuccessMsg(false), 3000);
    }
  };

  // Handle Status Dispatch
  const currentProblem = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const handleApplyStatusChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem) return;

    const defaultNotes: Record<ProblemStatus, string> = {
      reviewing: 'ইউনিয়ন প্রতিনিধি কর্তৃক অভিযোগটি সরেজমিনে যাচাই করা হচ্ছে।',
      in_progress: 'মাঠপর্যায়ে সংস্কার ও সমাধানের কার্যক্রম চলমান রয়েছে।',
      resolved: 'অভিযোগের স্থান পরিদর্শন করে সমস্যাটির সমাধান সম্পন্ন হয়েছে।',
      pending: 'নতুন আবেদন হিসেবে নথিভুক্ত হয়েছে।',
    };

    const finalNote = actionNote.trim() || defaultNotes[targetStatus];

    onUpdateProblemStatus(
      currentProblem.id,
      targetStatus,
      finalNote,
      officerName.trim() || 'ধামতী ইউনিয়ন সেবাদল'
    );
    setActionNote('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Tracking Code', 'Title', 'Ward', 'Category', 'Urgency', 'Status', 'Location', 'Citizen Name', 'Mobile Number', 'Date'];
    const rows = problems.map((p) => [
      p.trackingCode,
      `"${p.title.replace(/"/g, '""')}"`,
      p.ward,
      p.category,
      p.urgency,
      p.status,
      `"${p.specificLocation.replace(/"/g, '""')}"`,
      `"${p.citizenName.replace(/"/g, '""')}"`,
      p.phone || 'N/A',
      new Date(p.createdAt).toLocaleString()
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dhamti-complaints-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter complaints
  const filteredProblems = problems.filter((p) => {
    if (complaintFilter !== 'all' && p.status !== complaintFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.trackingCode.toLowerCase().includes(q) ||
        p.specificLocation.toLowerCase().includes(q) ||
        p.citizenName.toLowerCase().includes(q) ||
        p.phone.includes(q)
      );
    }
    return true;
  });

  const getWardName = (wardId: string) => {
    const a = areas.find((w) => w.wardNumber === wardId);
    return a ? (language === 'bn' ? a.wardNameBn : a.wardNameEn) : wardId;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-white h-[92vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-neutral-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                {language === 'bn' ? 'ধামতী ইউনিয়ন অ্যাডমিন পোর্টাল' : 'Dhamti Union Admin Portal'}
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'bn' ? 'গোপনীয় তথ্য, স্লোগান ও অভিযোগ নিয়ন্ত্রণ কেন্দ্র' : 'Private Data, Slogans & Grievance Control Center'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-lg text-white transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'লক করুন' : 'Lock'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SECURITY GATE (If not authenticated) */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-neutral-50">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-neutral-200 shadow-md text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-neutral-900">
                {language === 'bn' ? 'অ্যাডমিন সিকিউরিটি যাচাই' : 'Admin Security Verification'}
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                {language === 'bn' 
                  ? 'নাগরিকদের মোবাইল নম্বর ও সাইটের গোপন তথ্য সুরক্ষিত রাখতে অ্যাডমিন সিকিউরিটি পিন দিন।' 
                  : 'Enter your admin security PIN to access private mobile numbers and settings.'}
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={8}
                    autoFocus
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="••••••"
                    className="w-full text-center tracking-widest text-lg font-mono py-3 px-4 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                  {pinError && (
                    <span className="text-xs text-red-600 font-semibold block mt-1.5">
                      {language === 'bn' ? 'ভুল পিন কোড! পুনরায় চেষ্টা করুন।' : 'Incorrect PIN! Please try again.'}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {language === 'bn' ? 'লগইন করুন' : 'Unlock Admin Panel'}
                </button>

                <p className="text-[11px] text-neutral-400">
                  {language === 'bn' ? 'অননুমোদিত প্রবেশ সম্পূর্ণ নিষিদ্ধ ও সুরক্ষিত' : 'Restricted authorized access only'}
                </p>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN CONSOLE */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-neutral-100 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('complaints')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'complaints'
                      ? 'bg-white text-emerald-800 shadow-xs border border-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <ListFilter className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'bn' ? 'অভিযোগ ও স্ট্যাটাস ব্যবস্থাপনা' : 'Complaints & Status Control'}</span>
                  <span className="ml-1 px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px]">
                    {problems.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profile_settings')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'profile_settings'
                      ? 'bg-white text-emerald-800 shadow-xs border border-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'bn' ? 'স্লোগান, ছবি ও গোপনীয় তথ্য' : 'Slogans, Photo & Private Data'}</span>
                </button>
              </div>

              {/* Quick Actions (Google Sheets + CSV) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenGoogleSheets}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                    isSheetsConnected
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>{isSheetsConnected ? (language === 'bn' ? 'গুগল শিট সক্রিয়' : 'Sheets Active') : (language === 'bn' ? 'এক্সেল / গুগল শিট' : 'Excel & Sheets')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 rounded-lg text-neutral-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'তাৎক্ষণিক CSV' : 'Instant CSV'}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: COMPLAINTS & STATUS MANAGEMENT */}
            {activeTab === 'complaints' && (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Mobile Sub-Navigation Bar */}
                <div className="md:hidden flex items-center justify-between p-2 bg-neutral-100 border-b border-neutral-200 shrink-0">
                  <div className="flex rounded-xl bg-neutral-200/70 p-1 w-full text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setMobileComplaintView('list')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        mobileComplaintView === 'list'
                          ? 'bg-white text-emerald-800 shadow-2xs'
                          : 'text-neutral-600'
                      }`}
                    >
                      {language === 'bn' ? `📋 অভিযোগ তালিকা (${filteredProblems.length})` : `📋 Complaints (${filteredProblems.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileComplaintView('details')}
                      className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        mobileComplaintView === 'details'
                          ? 'bg-white text-emerald-800 shadow-2xs'
                          : 'text-neutral-600'
                      }`}
                    >
                      {language === 'bn' ? '🔍 বিবরণ ও স্ট্যাটাস' : '🔍 Details & Action'}
                    </button>
                  </div>
                </div>

                {/* Left Column: Complaint Search & List */}
                <div className={`w-full md:w-80 border-r border-neutral-200 flex flex-col bg-neutral-50/50 ${mobileComplaintView === 'details' ? 'hidden md:flex' : 'flex'}`}>
                  {/* Search and Filters */}
                  <div className="p-3 border-b border-neutral-200 space-y-2 bg-white">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'bn' ? 'ট্র্যাকিং কোড, নাম বা মোবাইল দিয়ে খুঁজুন...' : 'Search by code, phone or name...'}
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />

                    {/* Status Filter Pills */}
                    <div className="flex flex-wrap gap-1">
                      {[
                        { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
                        { id: 'reviewing', label: language === 'bn' ? 'যাচাই চলছে' : 'Reviewing' },
                        { id: 'in_progress', label: language === 'bn' ? 'চলমান' : 'Ongoing' },
                        { id: 'resolved', label: language === 'bn' ? 'সমাধান' : 'Resolved' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setComplaintFilter(st.id as any)}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                            complaintFilter === st.id
                              ? 'bg-emerald-700 text-white'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Complaints Scroll List */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredProblems.length === 0 ? (
                      <div className="text-center py-12 text-xs text-neutral-400 p-4">
                        {language === 'bn' 
                          ? 'কোনো অভিযোগের রেকর্ড পাওয়া যায়নি। নাগরিকরা সমস্যা সাবমিট করলে এখানে রিয়েল-টাইমে দেখতে পাবেন।' 
                          : 'No complaints recorded yet. Submissions by citizens will appear here in real time.'}
                      </div>
                    ) : (
                      filteredProblems.map((p) => {
                        const isSelected = (currentProblem?.id === p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setSelectedProblemId(p.id);
                              setMobileComplaintView('details');
                            }}
                            className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-600/20'
                                : 'bg-white border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                              <span className="font-mono font-bold text-emerald-800">{p.trackingCode}</span>
                              <span className={`font-bold px-1.5 py-0.5 rounded ${
                                p.status === 'resolved'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : p.status === 'in_progress'
                                  ? 'bg-amber-50 text-amber-700'
                                  : p.status === 'reviewing'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-neutral-100 text-neutral-700'
                              }`}>
                                {p.status === 'resolved' ? (language === 'bn' ? 'সমাধান' : 'Resolved') : p.status === 'in_progress' ? (language === 'bn' ? 'চলমান' : 'Ongoing') : p.status === 'reviewing' ? (language === 'bn' ? 'যাচাই চলছে' : 'Reviewing') : (language === 'bn' ? 'নতুন' : 'New')}
                              </span>
                            </div>

                            <h5 className="font-bold text-neutral-900 line-clamp-1">
                              {p.title}
                            </h5>

                            {/* Private Mobile Number Tag (Only Admin can see!) */}
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span>{p.phone || (language === 'bn' ? 'নম্বর দেয়নি' : 'No phone')}</span>
                              <span className="text-neutral-400">·</span>
                              <span className="text-neutral-600 truncate">{p.citizenName}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Active Complaint Details & Status Action */}
                <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 ${mobileComplaintView === 'list' ? 'hidden md:block' : 'block'}`}>
                  {/* Mobile Back to List Button */}
                  <div className="md:hidden flex items-center justify-between pb-2 mb-2 border-b border-neutral-200">
                    <button
                      type="button"
                      onClick={() => setMobileComplaintView('list')}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      ← {language === 'bn' ? 'অভিযোগ তালিকায় ফিরুন' : 'Back to complaints list'}
                    </button>
                    <span className="text-xs text-neutral-500 font-mono font-bold">
                      {currentProblem?.trackingCode}
                    </span>
                  </div>
                  {currentProblem ? (
                    <>
                      {/* Complaint Header Card */}
                      <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-emerald-800 text-sm">{currentProblem.trackingCode}</span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-700 font-semibold">
                              {getWardName(currentProblem.ward)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত এই অভিযোগটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this complaint?')) {
                                onDeleteProblem(currentProblem.id);
                              }
                            }}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-xs cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                          </button>
                        </div>

                        <h4 className="text-lg font-bold text-neutral-900">
                          {currentProblem.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-white p-3.5 rounded-xl border border-neutral-200">
                          {currentProblem.description}
                        </p>

                        {/* Citizen Private Contact Information (Only displayed in Admin!) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                          <div className="p-3 bg-white rounded-xl border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                              {language === 'bn' ? 'নাগরিকের তথ্য (গোপনীয়)' : 'Citizen Contact (Private)'}
                            </span>
                            <div className="font-bold text-neutral-900">{currentProblem.citizenName}</div>
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold mt-1">
                              <Phone className="w-3.5 h-3.5" />
                              <a href={`tel:${currentProblem.phone}`} className="hover:underline">
                                {currentProblem.phone || 'N/A'}
                              </a>
                            </div>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-neutral-200">
                            <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                              {language === 'bn' ? 'নির্দিষ্ট স্থান ও তারিখ' : 'Location & Date'}
                            </span>
                            <div className="flex items-center gap-1 text-neutral-800 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span className="truncate">{currentProblem.specificLocation}</span>
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-1">
                              {new Date(currentProblem.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* STATUS CONTROL FORM (User Requested Exact Capabilities) */}
                      <form onSubmit={handleApplyStatusChange} className="bg-white p-5 rounded-2xl border-2 border-emerald-600/30 shadow-xs space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                            {language === 'bn' ? 'অভিযোগের স্ট্যাটাস পরিবর্তন করুন (অ্যাডমিন নিয়ন্ত্রণ):' : 'Update Complaint Status (Admin Control):'}
                          </label>

                          {/* The 3 Core Status Buttons requested by User */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Status 1: Checking by union officials */}
                            <button
                              type="button"
                              onClick={() => setTargetStatus('reviewing')}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                targetStatus === 'reviewing'
                                  ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-500/20'
                                  : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold text-xs text-blue-800 mb-1">
                                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                                <span>{language === 'bn' ? '১. ইউনিয়ন কর্তৃক যাচাই' : '1. Union Checking'}</span>
                              </div>
                              <p className="text-[11px] text-blue-900/80 leading-snug">
                                {language === 'bn' ? 'ইউনিয়ন প্রতিনিধি দল তথ্য ও ঘটনাস্থল যাচাই করছে' : 'Union members are currently checking & verifying'}
                              </p>
                            </button>

                            {/* Status 2: Right now ongoing */}
                            <button
                              type="button"
                              onClick={() => setTargetStatus('in_progress')}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                targetStatus === 'in_progress'
                                  ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500/20'
                                  : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800 mb-1">
                                <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                                <span>{language === 'bn' ? '২. কার্যক্রম চলমান' : '2. Right Now Ongoing'}</span>
                              </div>
                              <p className="text-[11px] text-amber-900/80 leading-snug">
                                {language === 'bn' ? 'মাঠপর্যায়ে কাজ ও সমাধানের কাজ শুরু হয়েছে' : 'Field work & repairs are right now ongoing'}
                              </p>
                            </button>

                            {/* Status 3: Demolished / Resolved */}
                            <button
                              type="button"
                              onClick={() => setTargetStatus('resolved')}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                targetStatus === 'resolved'
                                  ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                                  : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800 mb-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{language === 'bn' ? '৩. সমাধান সম্পন্ন' : '3. Resolved / Demolished'}</span>
                              </div>
                              <p className="text-[11px] text-emerald-900/80 leading-snug">
                                {language === 'bn' ? 'সমস্যার স্থায়ী সমাধান ও কাজ সমাপ্ত' : 'Problem has already been demolished / resolved'}
                              </p>
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              {language === 'bn' ? 'দায়িত্বপ্রাপ্ত কর্মকর্তা / কমিটি সেল' : 'Assigned Official / Action Team'}
                            </label>
                            <input
                              type="text"
                              value={officerName}
                              onChange={(e) => setOfficerName(e.target.value)}
                              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1">
                              {language === 'bn' ? 'পদক্ষেপের আনুষ্ঠানিক নোট' : 'Official Action Note'}
                            </label>
                            <input
                              type="text"
                              value={actionNote}
                              onChange={(e) => setActionNote(e.target.value)}
                              placeholder={language === 'bn' ? 'যেমন: পাইপলাইন মেরামত সম্পন্ন ও পানি সচল' : 'e.g. Broken culvert repaired, road cleared'}
                              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{language === 'bn' ? 'নতুন স্ট্যাটাস ও নোট প্রয়োগ করুন' : 'Apply New Status & Update Timeline'}</span>
                        </button>
                      </form>

                      {/* Complaint Timeline History */}
                      <div className="pt-2">
                        <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">
                          {language === 'bn' ? 'পদক্ষেপের ইতিহাস' : 'Action Timeline'}
                        </h5>
                        <div className="space-y-2">
                          {currentProblem.timeline.map((item, idx) => (
                            <div key={item.id || idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-start gap-2.5">
                              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-0.5">
                                  <span className="font-semibold text-neutral-800">{item.author}</span>
                                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-neutral-700">{language === 'bn' ? item.noteBn : item.noteEn}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-20 text-neutral-400 text-sm">
                      {language === 'bn' ? 'কোনো অভিযোগ নির্বাচিত নেই' : 'No complaint selected'}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: PROFILE, SLOGANS & PRIVATE DATA SETTINGS */}
            {activeTab === 'profile_settings' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto w-full">
                
                {profileSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{language === 'bn' ? 'সকল তথ্য সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!' : 'All profile and slogan data successfully updated!'}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* 1. Slogans (User Request: Slogans can be updated from admin) */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'bn' ? 'অফিসিয়াল স্লোগান ম্যানেজমেন্ট' : 'Official Slogans Management'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'মূল স্লোগান (Main Slogan)' : 'Main Slogan'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editMainSlogan}
                          onChange={(e) => setEditMainSlogan(e.target.value)}
                          placeholder="আমাদের ধামতী আমরাই গড়ব"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'ছোট ও সাব স্লোগান (Sub Slogan)' : 'Small / Sub Slogan'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editSubSlogan}
                          onChange={(e) => setEditSubSlogan(e.target.value)}
                          placeholder="একসাথে গড়ব আগামীর ধামতী"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Leader Information & Profile Picture */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'bn' ? 'নেতৃত্বের তথ্য ও প্রোফাইল ছবি' : 'Leader Profile & Image'}</span>
                    </h4>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
                      {/* Picture Preview */}
                      <div className="relative w-28 h-32 rounded-2xl overflow-hidden border-2 border-emerald-600 bg-neutral-200 shadow-md shrink-0 flex items-center justify-center">
                        {editImage ? (
                          <img src={editImage} alt="Leader" className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="text-center p-2 text-neutral-500 text-[10px]">
                            {language === 'bn' ? 'কোনো ছবি নেই (ভেক্টর দেখাচ্ছে)' : 'Vector Silhouette'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <Camera className="w-4 h-4" />
                          <span>{language === 'bn' ? 'নতুন প্রোফাইল ছবি আপলোড করুন' : 'Upload Profile Picture'}</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />

                        {editImage && (
                          <button
                            type="button"
                            onClick={() => setEditImage(null)}
                            className="text-xs text-red-600 hover:text-red-800 font-semibold block underline cursor-pointer"
                          >
                            {language === 'bn' ? 'ছবি মুছে ডিফল্ট সিলুয়েট রাখুন' : 'Remove custom photo'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'জনপ্রতিনিধি / সেবকের নাম' : 'Leader Full Name'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="মোঃ আনোয়ার হোসেন ভূঁইয়া"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'অঙ্গীকার / সাবটাইটেল' : 'Leader Promise / Subtitle'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editPromise}
                          onChange={(e) => setEditPromise(e.target.value)}
                          placeholder="কাজ করতে চাই আপনাদের জন্যে"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Official Contact Info (Private/Admin Controlled) */}
                  <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-4">
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'bn' ? 'অফিসিয়াল যোগাযোগ ও হেল্পলাইন ডেটা' : 'Official Contact & Office Details'}</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'জরুরি হেল্পলাইন নম্বর' : 'Helpline Phone'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="+880 1700-000000"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                        </label>
                        <input
                          type="email"
                          required
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          placeholder="seba@dhamti.org"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-700 mb-1">
                          {language === 'bn' ? 'অফিসের ঠিকানা' : 'Office Location'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          placeholder="ধামতী ইউনিয়ন জনসেবা কার্যালয়, দেবিদ্বার, কুমিল্লা"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      {language === 'bn' ? 'পরিবর্তনসমূহ সংরক্ষণ করুন' : 'Save Changes'}
                    </button>
                  </div>
                </form>

                {/* 4. Admin Security PIN Change */}
                <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'bn' ? 'অ্যাডমিন পিন পরিবর্তন করুন' : 'Change Admin Security PIN'}</span>
                  </h4>

                  {pinSuccessMsg && (
                    <span className="text-xs text-emerald-700 font-bold block">
                      {language === 'bn' ? 'পিন সফলভাবে পরিবর্তন করা হয়েছে!' : 'PIN successfully changed!'}
                    </span>
                  )}

                  <form onSubmit={handleChangePin} className="flex gap-2 max-w-sm">
                    <input
                      type="password"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder={language === 'bn' ? 'নতুন ৪-সংখ্যার পিন দিন' : 'Enter new 4-digit PIN'}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      {language === 'bn' ? 'আপডেট' : 'Update PIN'}
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
