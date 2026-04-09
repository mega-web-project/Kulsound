/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Releases from './components/Releases';
import Revenue from './components/Revenue';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Onboarding from './components/Onboarding';
import ArtistClaimModal from './components/ArtistClaimModal';
import ReportModal from './components/ReportModal';
import ChatBot from './components/ChatBot';
import { useTheme } from './context/ThemeContext';
import { AdminRoleType } from './lib/permissions';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [view, setView] = useState<'landing' | 'auth' | 'onboarding' | 'app'>('landing');
  const [initialAuthView, setInitialAuthView] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [adminRole, setAdminRole] = useState<AdminRoleType | undefined>();
  const [verificationStatus, setVerificationStatus] = useState<'Unverified' | 'Pending' | 'Verified' | 'Rejected'>('Unverified');
  const [rejectionReason, setRejectionReason] = useState<string | undefined>();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const { theme } = useTheme();

  const handleAuthComplete = (isNewUser: boolean, role: 'user' | 'admin', selectedAdminRole?: AdminRoleType) => {
    setUserRole(role);
    setAdminRole(selectedAdminRole);
    if (isNewUser) {
      setView('onboarding');
    } else {
      setView('app');
      // If admin, default to admin tab
      if (role === 'admin') {
        setActiveTab('admin-overview');
      }
    }
  };

  const handleCompleteVerification = (data: any) => {
    setIsVerifying(true);
    setIsVerificationModalOpen(false);
    console.log('Artist Claim Data:', data);
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus('Pending');
      setIsVerifying(false);
    }, 2000);
  };

  const handleReportSubmit = (report: any) => {
    console.log('New Report Submitted:', report);
    setReports(prev => [report, ...prev]);
  };

  if (view === 'landing') {
    return <LandingPage onGetStarted={(mode) => {
      if (mode) setInitialAuthView(mode);
      setView('auth');
    }} />;
  }

  if (view === 'auth') {
    return (
      <AuthPage 
        initialView={initialAuthView}
        onAuthComplete={handleAuthComplete} 
        onBack={() => setView('landing')}
      />
    );
  }

  if (view === 'onboarding') {
    return <Onboarding onComplete={() => setView('app')} />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-sans selection:bg-brand-purple/30 selection:text-brand-purple transition-colors duration-300 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        userRole={userRole} 
        adminRole={adminRole}
        onOpenReport={() => {
          setIsReportModalOpen(true);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar 
          setActiveTab={setActiveTab} 
          userRole={userRole} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 pb-20 lg:pb-0">
          {activeTab === 'dashboard' && (
            <Dashboard 
              verificationStatus={verificationStatus} 
              setIsVerificationModalOpen={setIsVerificationModalOpen} 
              rejectionReason={rejectionReason}
            />
          )}
          {activeTab === 'catalog' && (
            <Releases 
              verificationStatus={verificationStatus}
              setVerificationStatus={setVerificationStatus}
              isVerificationModalOpen={isVerificationModalOpen}
              setIsVerificationModalOpen={setIsVerificationModalOpen}
              isVerifying={isVerifying}
              setIsVerifying={setIsVerifying}
              handleCompleteVerification={handleCompleteVerification}
            />
          )}
          {activeTab === 'audience' && <Analytics />}
          {activeTab === 'revenue' && <Revenue />}
          {activeTab.startsWith('admin-') && userRole === 'admin' && (
            <AdminDashboard 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              adminRole={adminRole}
              externalReports={reports}
            />
          )}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      <ArtistClaimModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onComplete={handleCompleteVerification}
      />

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />

      <ChatBot />
    </div>
  );
}

