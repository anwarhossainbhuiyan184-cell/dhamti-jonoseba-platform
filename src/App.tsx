import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { Language, ProblemReport, AreaStat, CategoryStat, ProblemStatus, LeaderProfile } from './types';
import { INITIAL_AREAS, CATEGORIES, INITIAL_PROBLEMS, DEFAULT_PROFILE } from './data/mockData';
import { initAuth } from './services/auth';
import { getStoredSpreadsheetId, appendProblemToSheet } from './services/sheets';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatisticsSection } from './components/StatisticsSection';
import { ProblemFeedSection } from './components/ProblemFeedSection';
import { SubmitProblemModal } from './components/SubmitProblemModal';
import { TrackProblemModal } from './components/TrackProblemModal';
import { ProblemDetailModal } from './components/ProblemDetailModal';
import { AdminSectionModal } from './components/AdminSectionModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { Footer } from './components/Footer';

const STORAGE_KEY_PROBLEMS = 'dhamti_real_problems_v1';
const STORAGE_KEY_PROFILE = 'dhamti_leader_profile_v1';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');

  // Load real problems from local storage or empty array (Zero Mock Data!)
  const [problems, setProblems] = useState<ProblemReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROBLEMS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PROBLEMS; // []
  });

  // Persistent Leader Profile & Private Slogan/Contact Data
  const [leaderProfile, setLeaderProfile] = useState<LeaderProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [selectedWard, setSelectedWard] = useState<string>('');

  // Google Sheets state
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(getStoredSpreadsheetId());
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeDetailProblem, setActiveDetailProblem] = useState<ProblemReport | null>(null);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setAuthUser(user);
        setAccessToken(token);
      },
      () => {
        setAuthUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sync real problems to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROBLEMS, JSON.stringify(problems));
    } catch {
      // storage unavailable
    }
  }, [problems]);

  // Sync leader profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(leaderProfile));
    } catch {
      // storage unavailable
    }
  }, [leaderProfile]);

  // Compute 100% REAL statistics strictly from actual complaints (Zero Mock Numbers!)
  const totalSubmissions = problems.length;
  const totalResolved = problems.filter((p) => p.status === 'resolved').length;
  const totalInProgress = problems.filter((p) => p.status === 'in_progress').length;

  // Real dynamic ward problem counts
  const computedAreas: AreaStat[] = useMemo(() => {
    return INITIAL_AREAS.map((area) => {
      const wardProblems = problems.filter((p) => p.ward === area.wardNumber);
      const resolved = wardProblems.filter((p) => p.status === 'resolved');
      return {
        ...area,
        totalProblems: wardProblems.length,
        resolvedProblems: resolved.length,
      };
    });
  }, [problems]);

  // Real dynamic category counts
  const computedCategories: CategoryStat[] = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      count: problems.filter((p) => p.category === cat.id).length,
    }));
  }, [problems]);

  // Add new problem report
  const handleAddNewProblem = (newProblem: ProblemReport) => {
    setProblems((prev) => [newProblem, ...prev]);

    // Auto-append to Google Sheet if connected
    if (accessToken && spreadsheetId) {
      appendProblemToSheet(accessToken, spreadsheetId, newProblem).then((success) => {
        if (success) {
          console.log('Appended grievance to Google Sheet successfully');
        }
      });
    }
  };

  // Upvote problem
  const handleUpvote = (problemId: string) => {
    setProblems((prev) =>
      prev.map((item) => {
        if (item.id === problemId) {
          const isUpvoted = item.userUpvoted;
          return {
            ...item,
            upvotes: isUpvoted ? item.upvotes - 1 : item.upvotes + 1,
            userUpvoted: !isUpvoted,
          };
        }
        return item;
      })
    );

    if (activeDetailProblem && activeDetailProblem.id === problemId) {
      setActiveDetailProblem((prev) => {
        if (!prev) return null;
        const isUpvoted = prev.userUpvoted;
        return {
          ...prev,
          upvotes: isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          userUpvoted: !isUpvoted,
        };
      });
    }
  };

  // Delete problem from Admin
  const handleDeleteProblem = (problemId: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== problemId));
    if (activeDetailProblem?.id === problemId) {
      setActiveDetailProblem(null);
    }
  };

  // Update status from Admin (supports checking by union, ongoing, resolved/demolished)
  const handleUpdateStatus = (
    problemId: string,
    newStatus: ProblemStatus,
    noteText: string,
    officerName: string
  ) => {
    const nowIso = new Date().toISOString();

    setProblems((prev) =>
      prev.map((item) => {
        if (item.id === problemId) {
          const newTimelineEvent = {
            id: `t-${Date.now()}`,
            timestamp: nowIso,
            status: newStatus,
            noteBn: noteText,
            noteEn: noteText,
            author: officerName || leaderProfile.name,
          };

          return {
            ...item,
            status: newStatus,
            assignedOfficer: officerName || item.assignedOfficer,
            resolutionNote: newStatus === 'resolved' ? noteText : item.resolutionNote,
            timeline: [newTimelineEvent, ...item.timeline],
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Top Bar Header (Clean Citizen View) */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section matching sketch with Leader Profile and popping image */}
        <HeroSection
          language={language}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          onOpenTrackModal={() => setIsTrackModalOpen(true)}
          totalProblemsCount={totalSubmissions}
          resolvedProblemsCount={totalResolved}
          leaderProfile={leaderProfile}
        />

        {/* Real Statistics Section */}
        <StatisticsSection
          language={language}
          areas={computedAreas}
          categories={computedCategories}
          selectedWard={selectedWard}
          onSelectWard={setSelectedWard}
          totalSubmissions={totalSubmissions}
          totalResolved={totalResolved}
          totalInProgress={totalInProgress}
        />

        {/* Grievances Feed & Status Monitor */}
        <ProblemFeedSection
          language={language}
          problems={problems}
          areas={computedAreas}
          categories={computedCategories}
          selectedWard={selectedWard}
          onSelectWard={setSelectedWard}
          onUpvote={handleUpvote}
          onViewDetails={(problem) => setActiveDetailProblem(problem)}
        />
      </main>

      {/* Modals & Overlays */}
      <SubmitProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        language={language}
        areas={computedAreas}
        categories={computedCategories}
        onSubmit={handleAddNewProblem}
      />

      <TrackProblemModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
        language={language}
        problems={problems}
      />

      <ProblemDetailModal
        problem={activeDetailProblem}
        isOpen={Boolean(activeDetailProblem)}
        onClose={() => setActiveDetailProblem(null)}
        language={language}
        onUpvote={handleUpvote}
      />

      {/* Complete Dedicated Admin Section Modal */}
      <AdminSectionModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        language={language}
        problems={problems}
        areas={computedAreas}
        categories={computedCategories}
        leaderProfile={leaderProfile}
        onUpdateLeaderProfile={setLeaderProfile}
        onUpdateProblemStatus={handleUpdateStatus}
        onDeleteProblem={handleDeleteProblem}
        onOpenGoogleSheets={() => setIsSheetsModalOpen(true)}
        isSheetsConnected={Boolean(spreadsheetId && accessToken)}
      />

      {/* Google Sheets Modal */}
      <GoogleSheetsModal
        isOpen={isSheetsModalOpen}
        onClose={() => setIsSheetsModalOpen(false)}
        language={language}
        user={authUser}
        accessToken={accessToken}
        spreadsheetId={spreadsheetId}
        onSpreadsheetConnected={(id) => setSpreadsheetId(id)}
        onUserAuthChange={(u, token) => {
          setAuthUser(u);
          setAccessToken(token);
        }}
        problems={problems}
      />

      {/* Quiet Footer */}
      <Footer
        language={language}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenTrackModal={() => setIsTrackModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        leaderProfile={leaderProfile}
      />
    </div>
  );
}
