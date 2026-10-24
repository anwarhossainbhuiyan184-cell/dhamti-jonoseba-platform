import { ProblemReport, AreaStat, CategoryStat, LeaderProfile } from '../types';

export const DEFAULT_PROFILE: LeaderProfile = {
  name: 'মোঃ আনোয়ার হোসেন ভূঁইয়া',
  designation: 'ধামতী ইউনিয়ন সেবক',
  promise: 'কাজ করতে চাই আপনাদের জন্যে',
  mainSlogan: 'আমাদের ধামতী আমরাই গড়ব',
  subSlogan: 'একসাথে গড়ব আগামীর ধামতী',
  heroAnnouncement: 'আমরা এখানে আছি আপনাদের সমস্যা সম্পর্কে জানতে',
  profileImage: null,
  phone: '+880 1700-000000',
  email: 'seba@dhamti.org',
  officeAddress: 'ধামতী ইউনিয়ন জনসেবা কার্যালয়, দেবিদ্বার, কুমিল্লা',
};

// Start with clean authentic areas without artificial mock numbers
export const INITIAL_AREAS: AreaStat[] = [
  {
    wardNumber: 'ward-01',
    wardNameBn: 'ওয়ার্ড নং ০১ (উত্তর ধামতী ও স্কুল রোড)',
    wardNameEn: 'Ward 01 (North Dhamti & School Rd)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'সড়ক মেরামত ও ড্রেনেজ',
    topCategoryEn: 'Road Repair & Drainage'
  },
  {
    wardNumber: 'ward-02',
    wardNameBn: 'ওয়ার্ড নং ০২ (ধামতী কলেজ রোড ও মধ্যপাড়া)',
    wardNameEn: 'Ward 02 (Dhamti College Rd & Madhyapara)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'সড়ক বাতি ও নিরাপত্তা',
    topCategoryEn: 'Street Lights & Safety'
  },
  {
    wardNumber: 'ward-03',
    wardNameBn: 'ওয়ার্ড নং ০৩ (রাধানগর ও সবুজবাগ)',
    wardNameEn: 'Ward 03 (Radhanagar & Sabujbagh)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'বিশুদ্ধ খাবার পানি',
    topCategoryEn: 'Clean Drinking Water'
  },
  {
    wardNumber: 'ward-04',
    wardNameBn: 'ওয়ার্ড নং ০৪ (ধামতী বাজার ও ইউনিয়ন পরিষদ রোড)',
    wardNameEn: 'Ward 04 (Dhamti Bazaar & UP Road)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'ড্রেনেজ ও জলাবদ্ধতা',
    topCategoryEn: 'Drainage & Waterlogging'
  },
  {
    wardNumber: 'ward-05',
    wardNameBn: 'ওয়ার্ড নং ০৫ (পুরাতন বাজার ও ঘাট এলাকা)',
    wardNameEn: 'Ward 05 (Old Market & Ghat Area)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'বর্জ্য অপসারণ ও পরিচ্ছন্নতা',
    topCategoryEn: 'Waste Management'
  },
  {
    wardNumber: 'ward-06',
    wardNameBn: 'ওয়ার্ড নং ০৬ (কাজী পাড়া ও ইসলামপুর)',
    wardNameEn: 'Ward 06 (Kazi Para & Islampur)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'কালভার্ট ও সাঁকো মেরামত',
    topCategoryEn: 'Culvert & Footbridge Repair'
  },
  {
    wardNumber: 'ward-07',
    wardNameBn: 'ওয়ার্ড নং ০৭ (দক্ষিণ ধামতী ও স্বাস্থ্যকেন্দ্র রোড)',
    wardNameEn: 'Ward 07 (South Dhamti & Health Center Rd)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'স্বাস্থ্যসেবা ও পয়ঃনিষ্কাশন',
    topCategoryEn: 'Healthcare & Sanitation'
  },
  {
    wardNumber: 'ward-08',
    wardNameBn: 'ওয়ার্ড নং ০৮ (নূরপুর ও মাদ্রাসা পাড়া)',
    wardNameEn: 'Ward 08 (Noorpur & Madrasa Para)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'বিদ্যুৎ ও ট্রান্সফরমার ত্রুটি',
    topCategoryEn: 'Power & Transformer Issues'
  },
  {
    wardNumber: 'ward-09',
    wardNameBn: 'ওয়ার্ড নং ০৯ (পূর্বাশা ও বিল্লা বাড়ি এলাকা)',
    wardNameEn: 'Ward 09 (Purbasha & Billa Bari Area)',
    totalProblems: 0,
    resolvedProblems: 0,
    topCategoryBn: 'খেলার মাঠ ও খাল খনন',
    topCategoryEn: 'Playground & Canal Dredging'
  }
];

export const CATEGORIES: CategoryStat[] = [
  {
    id: 'road',
    nameBn: 'সড়ক ও অবকাঠামো',
    nameEn: 'Roads & Infrastructure',
    iconName: 'Hammer',
    count: 0,
    color: '#0284c7'
  },
  {
    id: 'drainage',
    nameBn: 'ড্রেনেজ ও জলাবদ্ধতা',
    nameEn: 'Drainage & Waterlogging',
    iconName: 'Droplets',
    count: 0,
    color: '#0d9488'
  },
  {
    id: 'lighting',
    nameBn: 'সড়ক বাতি ও বিদ্যুৎ',
    nameEn: 'Street Lighting & Power',
    iconName: 'Lightbulb',
    count: 0,
    color: '#d97706'
  },
  {
    id: 'waste',
    nameBn: 'বর্জ্য অপসারণ ও পরিচ্ছন্নতা',
    nameEn: 'Waste & Sanitation',
    iconName: 'Trash2',
    count: 0,
    color: '#16a34a'
  },
  {
    id: 'water',
    nameBn: 'বিশুদ্ধ পানি সরবরাহ',
    nameEn: 'Drinking Water Supply',
    iconName: 'GlassWater',
    count: 0,
    color: '#2563eb'
  },
  {
    id: 'safety',
    nameBn: 'নিরাপত্তা ও জনশৃঙ্খলা',
    nameEn: 'Public Safety & Peace',
    iconName: 'ShieldAlert',
    count: 0,
    color: '#dc2626'
  }
];

// Completely clean: Zero mock problems!
export const INITIAL_PROBLEMS: ProblemReport[] = [];

export const UI_STRINGS = {
  bn: {
    portalName: 'ধামতী জনসেবা মঞ্চ',
    portalSubtitle: 'নাগরিক সেবা ও সমস্যা নিরসন পোর্টাল',
    leaderGreeting: 'আমি মোঃ আনোয়ার হোসেন ভূঁইয়া',
    leaderPromise: 'কাজ করতে চাই আপনাদের জন্যে',
    mainSlogan: 'আমাদের ধামতী আমরাই গড়ব',
    subSlogan: 'একসাথে গড়ব আগামীর ধামতী',
    heroSlogan: 'আমরা এখানে আছি আপনাদের সমস্যা সম্পর্কে জানতে',
    heroActionPrompt: 'আপনাদের সমস্যা সম্পর্কে জানান নিচের বাটনে ক্লিক করে',
    reportButton: 'সমস্যা জানান / অভিযোগ দিন',
    trackButton: 'অভিযোগের অবস্থা জানুন',
    adminButton: 'অ্যাডমিন প্যানেল',
    statsHeading: 'ধামতী ইউনিয়নভিত্তিক নাগরিক সমস্যা ও সমাধানের পরিসংখ্যান',
    statsSubheading: 'স্বচ্ছতা ও জবাবদিহিতা নিশ্চিতকরণে প্রতিটি নাগরিক আবেদনের অগ্রগতি',
    totalReported: 'মোট প্রাপ্ত অভিযোগ',
    totalResolved: 'সমাধান সম্পন্ন',
    totalInProgress: 'কার্যক্রম চলমান',
    totalReviewing: 'যাচাই-বাছাই চলছে',
    resolutionRate: 'সমাধানের হার',
    filterByArea: 'এলাকা / ওয়ার্ড অনুযায়ী বাছাই',
    filterByCategory: 'সমস্যার ধরণ অনুযায়ী বাছাই',
    allWards: 'সকল ওয়ার্ড',
    allCategories: 'সকল ধরণ',
    allStatuses: 'সকল স্ট্যাটাস',
    pending: 'নতুন আবেদন',
    reviewing: 'ইউনিয়ন প্রতিনিধি কর্তৃক যাচাই চলছে',
    in_progress: 'মাঠপর্যায়ে কার্যক্রম চলমান',
    resolved: 'সম্পূর্ণ সমাধান সম্পন্ন',
    critical: 'জরুরি',
    high: 'উচ্চ অগ্রাধিকার',
    normal: 'সাধারণ',
    upvote: 'আমিও একমত / সমর্থন',
    viewDetails: 'বিস্তারিত দেখুন',
    submitTitle: 'ধামতীর যেকোনো সমস্যা সরাসরি জানান',
    submitDescription: 'আপনার দেওয়া তথ্য সরাসরি মোঃ আনোয়ার হোসেন ভূঁইয়া ও তাঁর সেবাদলের কাছে পৌঁছাবে।',
    formFullName: 'আপনার নাম (ঐচ্ছিক)',
    formPhone: 'মোবাইল নম্বর',
    formWard: 'ওয়ার্ড / এলাকা নির্বাচন করুন',
    formCategory: 'সমস্যার ধরণ',
    formLocation: 'নির্দিষ্ট রাস্তা বা স্থান',
    formTitle: 'সমস্যার শিরোনাম',
    formDesc: 'বিস্তারিত বর্ণনা লিখুন',
    formUrgency: 'অগ্রাধিকার মাত্রা',
    formAnonymous: 'আমার নাম গোপন রাখুন',
    submitNow: 'অভিযোগ দাখিল করুন',
    cancel: 'বাতিল',
    trackingSuccessTitle: 'আপনার অভিযোগ সফলভাবে গৃহীত হয়েছে!',
    trackingSuccessDesc: 'আপনার ট্র্যাকিং কোডটি সংরক্ষণ করুন:',
    copyCode: 'কোড কপি করুন',
    copied: 'কপি হয়েছে!',
    trackModalTitle: 'আপনার অভিযোগের বর্তমান অবস্থা জানুন',
    trackInputPlaceholder: 'ট্র্যাকিং কোড (যেমন: JNS-2026-8942) অথবা মোবাইল নম্বর দিন',
    searchBtn: 'অনুসন্ধান করুন',
    searchNotFound: 'এই ট্র্যাকিং কোড বা মোবাইল নম্বরে কোনো অভিযোগ পাওয়া যায়নি।',
    assignedTo: 'দায়িত্বপ্রাপ্ত কর্মকর্তা / দল',
    officialNotes: 'কর্তৃপক্ষের পদক্ষেপের বিবরণ',
    citizenFeedTitle: 'ধামতীবাসীর সাম্প্রতিক অভিযোগ ও উন্নয়ন অগ্রগতি',
    leaderDirectQuote: '“আমাদের ধামতী আমরাই গড়ব—একসাথে গড়ব আগামীর ধামতী। ধামতীকে একটি আদর্শ, উন্নত ও দুর্নীতিমুক্ত জনপদ হিসেবে গড়ে তুলতে আপনাদের প্রতিটি সমস্যা সমাধানে আমি দৃঢ়প্রতিজ্ঞ।”'
  },
  en: {
    portalName: 'Dhamti Jonoseba Portal',
    portalSubtitle: 'Citizen Voice & Community Action Platform',
    leaderGreeting: 'I am Md. Anwar Hossain Bhuiyan',
    leaderPromise: 'I want to work for you & our community',
    mainSlogan: 'We Will Build Our Dhamti Ourselves',
    subSlogan: 'Together We Build the Future Dhamti',
    heroSlogan: 'We are here to listen and learn about your problems',
    heroActionPrompt: 'Report your community problem by clicking the button below',
    reportButton: 'Report a Problem',
    trackButton: 'Track Status',
    adminButton: 'Admin Panel',
    statsHeading: 'Statistics on Citizen Reports & Area Problems in Dhamti',
    statsSubheading: 'Real-time transparency tracking citizen submissions and community resolutions',
    totalReported: 'Total Reports',
    totalResolved: 'Resolved',
    totalInProgress: 'In Progress',
    totalReviewing: 'Under Review',
    resolutionRate: 'Resolution Rate',
    filterByArea: 'Filter by Ward / Area',
    filterByCategory: 'Filter by Category',
    allWards: 'All Wards',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    pending: 'New Submission',
    reviewing: 'Checking by Union Officials',
    in_progress: 'Field Work Ongoing',
    resolved: 'Resolved / Demolished',
    critical: 'Critical',
    high: 'High',
    normal: 'Normal',
    upvote: 'Me too / Support',
    viewDetails: 'View Details',
    submitTitle: 'Submit a Community Problem Directly',
    submitDescription: 'Your report directly reaches Md. Anwar Hossain Bhuiyan and his dedicated civic action team.',
    formFullName: 'Your Name (Optional)',
    formPhone: 'Phone Number',
    formWard: 'Select Ward / Area',
    formCategory: 'Problem Category',
    formLocation: 'Specific Street or Landmark',
    formTitle: 'Problem Title',
    formDesc: 'Detailed Description',
    formUrgency: 'Urgency Level',
    formAnonymous: 'Submit Anonymously',
    submitNow: 'Submit Grievance',
    cancel: 'Cancel',
    trackingSuccessTitle: 'Your Problem Has Been Successfully Registered!',
    trackingSuccessDesc: 'Please save your unique tracking code:',
    copyCode: 'Copy Code',
    copied: 'Copied!',
    trackModalTitle: 'Check Your Report Status',
    trackInputPlaceholder: 'Enter Tracking Code (e.g. JNS-2026-8942) or Phone Number',
    searchBtn: 'Search',
    searchNotFound: 'No problem report found matching this tracking code or phone number.',
    assignedTo: 'Assigned Action Team / Officer',
    officialNotes: 'Official Action & Progress Details',
    citizenFeedTitle: 'Recent Citizen Reports & Progress Feed in Dhamti',
    leaderDirectQuote: '“We will build our Dhamti ourselves — together we build the future Dhamti. My dedication is to build a prosperous and modern community where every citizen concern is heard and addressed.”'
  }
};
