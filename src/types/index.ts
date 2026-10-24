export type Language = 'bn' | 'en';

export type ProblemStatus = 'pending' | 'reviewing' | 'in_progress' | 'resolved';

export type UrgencyLevel = 'normal' | 'high' | 'critical';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  status: ProblemStatus;
  noteEn: string;
  noteBn: string;
  author: string;
}

export interface ProblemReport {
  id: string;
  trackingCode: string; // e.g. JNS-2026-1042
  title: string;
  description: string;
  category: string;
  ward: string; // e.g. "Ward 1" or "ওয়ার্ড ১"
  specificLocation: string;
  citizenName: string;
  phone: string;
  isAnonymous: boolean;
  urgency: UrgencyLevel;
  status: ProblemStatus;
  createdAt: string;
  upvotes: number;
  userUpvoted?: boolean;
  timeline: TimelineEvent[];
  assignedOfficer?: string;
  resolutionNote?: string;
}

export interface AreaStat {
  wardNumber: string;
  wardNameBn: string;
  wardNameEn: string;
  totalProblems: number;
  resolvedProblems: number;
  topCategoryBn: string;
  topCategoryEn: string;
}

export interface CategoryStat {
  id: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  count: number;
  color: string;
}

export interface LeaderProfile {
  name: string;
  designation: string;
  promise: string;
  mainSlogan: string;
  subSlogan: string;
  heroAnnouncement: string;
  profileImage: string | null;
  phone: string;
  email: string;
  officeAddress: string;
}
