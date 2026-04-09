import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Music, 
  ShieldCheck, 
  DollarSign, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  UserPlus,
  Clock,
  AlertCircle,
  Flag,
  Settings as SettingsIcon,
  Shield,
  Lock,
  Mail,
  Smartphone,
  CreditCard,
  Camera,
  Play,
  Pause,
  ChevronRight,
  X,
  UserX,
  UserCheck,
  Trash2,
  ArrowUpDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { AdminRoleType, hasPermission, DEFAULT_ROLE_PERMISSIONS } from '../lib/permissions';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Artist' | 'Manager' | 'Admin';
  status: 'Active' | 'Suspended' | 'Pending';
  joinedDate: string;
  avatar?: string;
}

interface AdminTrack {
  id: string;
  title: string;
  artist: string;
  status: 'Live' | 'Processing' | 'Rejected' | 'Draft';
  releaseDate: string;
  streams: string;
  cover: string;
  genre?: string;
  isrc?: string;
  upc?: string;
}

interface AdminReport {
  id: string;
  type: 'Copyright' | 'Inappropriate' | 'Spam' | 'Other';
  reporter: string;
  target: string;
  targetType: 'Track' | 'User';
  status: 'Open' | 'Resolved' | 'Dismissed';
  date: string;
  description: string;
}

interface VerificationRequest {
  id: string;
  artistName: string;
  legalName: string;
  email: string;
  idType: string;
  idImage: string;
  selfieImage: string;
  date: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

interface AdminRoyalty {
  id: string;
  artistId: string;
  artistName: string;
  balance: number;
  lifetimeEarnings: number;
  lastPayoutDate: string;
  payoutMethod: string;
  lastAutomatedRun?: string;
}

interface RoyaltyDistribution {
  id: string;
  artistId: string;
  artistName: string;
  amount: number;
  type: 'Automated' | 'Manual';
  period: string;
  date: string;
}

interface AdminPayoutRequest {
  id: string;
  artistId: string;
  artistName: string;
  amount: number;
  method: 'MoMo' | 'Bank' | 'PayPal';
  details: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

const mockUsers: AdminUser[] = [
  { id: '1', name: 'Neon Pulse', email: 'neon@pulse.com', role: 'Artist', status: 'Active', joinedDate: '2024-01-15', avatar: 'https://picsum.photos/seed/artist1/100/100' },
  { id: '2', name: 'King Kwesi', email: 'kwesi@music.gh', role: 'Artist', status: 'Pending', joinedDate: '2024-03-10', avatar: 'https://picsum.photos/seed/artist2/100/100' },
  { id: '3', name: 'Star Records', email: 'admin@starrecords.com', role: 'Manager', status: 'Active', joinedDate: '2023-11-20', avatar: 'https://picsum.photos/seed/label1/100/100' },
  { id: '4', name: 'Lofi Girl', email: 'lofi@beats.jp', role: 'Artist', status: 'Suspended', joinedDate: '2023-05-05', avatar: 'https://picsum.photos/seed/artist3/100/100' },
  { id: '5', name: 'Afro Beats HQ', email: 'contact@afrobeats.ng', role: 'Manager', status: 'Active', joinedDate: '2024-02-28', avatar: 'https://picsum.photos/seed/label2/100/100' },
];

const mockTracks: AdminTrack[] = [
  { id: '1', title: 'Midnight City', artist: 'Neon Pulse', status: 'Live', releaseDate: '2024-02-14', streams: '1.2M', cover: 'https://picsum.photos/seed/cover1/200/200', genre: 'Synthwave', isrc: 'QM-GZ2-24-00001', upc: '190295123456' },
  { id: '2', title: 'Golden Sun', artist: 'King Kwesi', status: 'Processing', releaseDate: '2024-04-20', streams: '0', cover: 'https://picsum.photos/seed/cover2/200/200', genre: 'Afrobeats', isrc: 'QM-GZ2-24-00002', upc: '190295123457' },
  { id: '3', title: 'Rainy Nights', artist: 'Lofi Girl', status: 'Live', releaseDate: '2023-12-01', streams: '5.8M', cover: 'https://picsum.photos/seed/cover3/200/200', genre: 'Lo-Fi', isrc: 'QM-GZ2-23-00999', upc: '190295123458' },
  { id: '4', title: 'Summer Vibe', artist: 'Afro Beats HQ', status: 'Rejected', releaseDate: '2024-01-10', streams: '0', cover: 'https://picsum.photos/seed/cover4/200/200', genre: 'Afrobeats', isrc: 'QM-GZ2-24-00003', upc: '190295123459' },
  { id: '5', title: 'Neon Dreams', artist: 'Neon Pulse', status: 'Live', releaseDate: '2024-03-01', streams: '450K', cover: 'https://picsum.photos/seed/cover5/200/200', genre: 'Synthwave', isrc: 'QM-GZ2-24-00004', upc: '190295123460' },
];

const mockReports: AdminReport[] = [
  { id: '1', type: 'Copyright', reporter: 'Sony Music', target: 'Midnight City', targetType: 'Track', status: 'Open', date: '2024-03-25', description: 'Suspected unauthorized sample from 80s pop track.' },
  { id: '2', type: 'Spam', reporter: 'User_99', target: 'Lofi Girl', targetType: 'User', status: 'Resolved', date: '2024-03-20', description: 'Bot-like behavior in comments section.' },
];

const mockVerifications: VerificationRequest[] = [
  { 
    id: '1', 
    artistName: 'King Kwesi', 
    legalName: 'Kwesi Mensah', 
    email: 'kwesi@music.gh', 
    idType: 'Ghana Card', 
    idImage: 'https://picsum.photos/seed/id1/600/400', 
    selfieImage: 'https://picsum.photos/seed/selfie1/400/400',
    date: '2024-03-10',
    status: 'Pending'
  }
];

const mockRoyalties: AdminRoyalty[] = [
  { id: '1', artistId: '1', artistName: 'Neon Pulse', balance: 1250.50, lifetimeEarnings: 15400.00, lastPayoutDate: '2024-03-01', payoutMethod: 'PayPal', lastAutomatedRun: '2024-04-01' },
  { id: '2', artistId: '2', artistName: 'King Kwesi', balance: 450.75, lifetimeEarnings: 890.00, lastPayoutDate: '2024-03-15', payoutMethod: 'MoMo', lastAutomatedRun: '2024-04-01' },
  { id: '3', artistId: '4', artistName: 'Lofi Girl', balance: 5800.20, lifetimeEarnings: 45200.00, lastPayoutDate: '2024-02-28', payoutMethod: 'Bank', lastAutomatedRun: '2024-04-01' },
];

const mockDistributions: RoyaltyDistribution[] = [
  { id: '1', artistId: '1', artistName: 'Neon Pulse', amount: 450.20, type: 'Automated', period: 'March 2024', date: '2024-04-01' },
  { id: '2', artistId: '4', artistName: 'Lofi Girl', amount: 1200.50, type: 'Automated', period: 'March 2024', date: '2024-04-01' },
  { id: '3', artistId: '2', artistName: 'King Kwesi', amount: 120.00, type: 'Manual', period: 'Adjustment - missing streams', date: '2024-03-28' },
];

const mockPayoutRequests: AdminPayoutRequest[] = [
  { id: '1', artistId: '1', artistName: 'Neon Pulse', amount: 500.00, method: 'PayPal', details: 'neon@pulse.com', status: 'Pending', date: '2024-04-05' },
  { id: '2', artistId: '4', artistName: 'Lofi Girl', amount: 2000.00, method: 'Bank', details: 'JP Morgan ****4567', status: 'Pending', date: '2024-04-07' },
];

interface AdminDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  adminRole?: AdminRoleType;
  externalReports?: AdminReport[];
}

export default function AdminDashboard({ activeTab, setActiveTab, adminRole, externalReports = [] }: AdminDashboardProps) {
  const activeSubTab = activeTab.replace('admin-', '') as 'overview' | 'users' | 'tracks' | 'verifications' | 'royalties' | 'reports' | 'settings';
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'joinedDate'; direction: 'asc' | 'desc' }>({
    key: 'joinedDate',
    direction: 'desc',
  });
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [tracks, setTracks] = useState<AdminTrack[]>(mockTracks);
  const [verifications, setVerifications] = useState<VerificationRequest[]>(mockVerifications);
  const [royalties, setRoyalties] = useState<AdminRoyalty[]>(mockRoyalties);
  const [distributions, setDistributions] = useState<RoyaltyDistribution[]>(mockDistributions);
  const [payoutRequests, setPayoutRequests] = useState<AdminPayoutRequest[]>(mockPayoutRequests);
  const [reports, setReports] = useState<AdminReport[]>([...externalReports, ...mockReports]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);
  
  // Update reports when externalReports changes
  useEffect(() => {
    setReports(prev => {
      // Avoid duplicates if needed, but for simplicity we'll just merge
      const newReports = externalReports.filter(er => !prev.some(p => p.id === er.id));
      return [...newReports, ...prev];
    });
  }, [externalReports]);
  
  // Clear selection and search when tab changes
  useEffect(() => {
    setSelectedUserIds([]);
    setSelectedTrackIds([]);
    setSearchQuery('');
  }, [activeSubTab]);

  // Modal States
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<AdminTrack | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [selectedRoyalty, setSelectedRoyalty] = useState<AdminRoyalty | null>(null);
  const [selectedPayout, setSelectedPayout] = useState<AdminPayoutRequest | null>(null);
  const [isAddRoyaltyModalOpen, setIsAddRoyaltyModalOpen] = useState(false);
  const [royaltyAmount, setRoyaltyAmount] = useState('');
  const [royaltyReason, setRoyaltyReason] = useState('');
  const [tracksToReject, setTracksToReject] = useState<AdminTrack[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Artist' as const });
  
  // Audio State for Review
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllUsers = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    }
  };

  const handleSortUsers = (key: 'name' | 'joinedDate') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackIds(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

  const handleSelectAllTracks = () => {
    if (selectedTrackIds.length === filteredTracks.length && filteredTracks.length > 0) {
      setSelectedTrackIds([]);
    } else {
      setSelectedTrackIds(filteredTracks.map(t => t.id));
    }
  };

  const handleBulkStatusUpdate = (newStatus: 'Active' | 'Suspended') => {
    setUsers(prev => prev.map(u => 
      selectedUserIds.includes(u.id) ? { ...u, status: newStatus } : u
    ));
    setSelectedUserIds([]);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} users?`)) {
      setUsers(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
      setSelectedUserIds([]);
    }
  };

  const handleVerifyArtist = (requestId: string, artistName: string) => {
    // 1. Update user role to Artist (if not already) and potentially add a verified badge
    setUsers(prev => prev.map(u => 
      u.name === artistName ? { ...u, role: 'Artist', status: 'Active' } : u
    ));
    // 2. Update verification status
    setVerifications(prev => prev.map(v => 
      v.id === requestId ? { ...v, status: 'Verified' } : v
    ));
    setSelectedVerification(null);
    // 3. Show success (simulated)
    alert(`${artistName} has been successfully verified!`);
  };

  const handleRejectVerification = (requestId: string, artistName: string) => {
    if (window.confirm(`Are you sure you want to reject the verification claim for ${artistName}?`)) {
      setVerifications(prev => prev.map(v => 
        v.id === requestId ? { ...v, status: 'Rejected' } : v
      ));
      setSelectedVerification(null);
    }
  };

  const handleUpdateVerificationStatus = (requestId: string, newStatus: 'Verified' | 'Pending' | 'Rejected') => {
    const verification = verifications.find(v => v.id === requestId);
    if (!verification) return;

    if (newStatus === 'Verified') {
      handleVerifyArtist(requestId, verification.artistName);
    } else {
      setVerifications(prev => prev.map(v => 
        v.id === requestId ? { ...v, status: newStatus } : v
      ));
    }
  };

  const handleApproveTrack = (trackId: string) => {
    setTracks(prev => prev.map(t => 
      t.id === trackId ? { ...t, status: 'Live' } : t
    ));
    setSelectedTrack(null);
  };

  const handleBulkApproveTracks = () => {
    setTracks(prev => prev.map(t => 
      selectedTrackIds.includes(t.id) ? { ...t, status: 'Live' } : t
    ));
    setSelectedTrackIds([]);
  };

  const handleRejectTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setTracksToReject([track]);
      setRejectionReason('');
    }
  };

  const handleBulkRejectTracks = () => {
    const selectedTracks = tracks.filter(t => selectedTrackIds.includes(t.id));
    if (selectedTracks.length > 0) {
      setTracksToReject(selectedTracks);
      setRejectionReason('');
    }
  };

  const confirmRejectTrack = () => {
    if (tracksToReject.length === 0) return;
    
    const trackIds = tracksToReject.map(t => t.id);
    setTracks(prev => prev.map(t => 
      trackIds.includes(t.id) ? { ...t, status: 'Rejected' } : t
    ));
    
    // In a real app, we'd send the rejectionReason to the backend
    console.log(`Tracks ${trackIds.join(', ')} rejected. Reason: ${rejectionReason}`);
    
    setTracksToReject([]);
    setSelectedTrack(null);
    setSelectedTrackIds([]);
    setRejectionReason('');
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, status: 'Suspended' } : u
    ));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, status: 'Suspended' } : null);
    }
  };

  const handleAddRoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoyalty || !royaltyAmount) return;

    const amount = parseFloat(royaltyAmount);
    
    // 1. Update artist balance
    setRoyalties(prev => prev.map(r => 
      r.id === selectedRoyalty.id 
        ? { ...r, balance: r.balance + amount, lifetimeEarnings: r.lifetimeEarnings + amount } 
        : r
    ));

    // 2. Add to distribution history
    const newDistribution: RoyaltyDistribution = {
      id: Math.random().toString(36).substr(2, 9),
      artistId: selectedRoyalty.artistId,
      artistName: selectedRoyalty.artistName,
      amount: amount,
      type: 'Manual',
      period: royaltyReason,
      date: new Date().toISOString().split('T')[0]
    };
    setDistributions(prev => [newDistribution, ...prev]);

    setIsAddRoyaltyModalOpen(false);
    setRoyaltyAmount('');
    setRoyaltyReason('');
    alert(`Successfully processed manual adjustment of $${amount} for ${selectedRoyalty.artistName}`);
  };

  const handleApprovePayout = (payoutId: string) => {
    const payout = payoutRequests.find(p => p.id === payoutId);
    if (!payout) return;

    // 1. Update payout status
    setPayoutRequests(prev => prev.map(p => 
      p.id === payoutId ? { ...p, status: 'Approved' } : p
    ));

    // 2. Deduct from artist balance
    setRoyalties(prev => prev.map(r => 
      r.artistId === payout.artistId 
        ? { ...r, balance: r.balance - payout.amount, lastPayoutDate: new Date().toISOString().split('T')[0] } 
        : r
    ));

    setSelectedPayout(null);
    alert(`Payout of $${payout.amount} for ${payout.artistName} has been approved and processed.`);
  };

  const handleRejectPayout = (payoutId: string) => {
    if (window.confirm('Are you sure you want to reject this payout request?')) {
      setPayoutRequests(prev => prev.map(p => 
        p.id === payoutId ? { ...p, status: 'Rejected' } : p
      ));
      setSelectedPayout(null);
    }
  };

  const handleResetPassword = (email: string) => {
    alert(`Password reset link has been sent to ${email}`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AdminUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://picsum.photos/seed/${newUser.name}/100/100`
    };
    setUsers(prev => [user, ...prev]);
    setIsAddUserModalOpen(false);
    setNewUser({ name: '', email: '', role: 'Artist' });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  }).sort((a, b) => {
    if (sortConfig.key === 'joinedDate') {
      const dateA = new Date(a.joinedDate).getTime();
      const dateB = new Date(b.joinedDate).getTime();
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
  });

  const filteredTracks = tracks.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReports = reports.filter(report => 
    report.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: '1,284', change: '+12%', trend: 'up', icon: Users },
    { label: 'Total Tracks', value: '8,432', change: '+5%', trend: 'up', icon: Music },
    { label: 'Pending Reviews', value: '42', change: '-8%', trend: 'down', icon: Clock },
    { label: 'Total Revenue', value: '$124,500', change: '+18%', trend: 'up', icon: DollarSign },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">Admin Galaxy.</h1>
          <p className="text-zinc-500 font-medium text-sm sm:text-base">Manage the KulSound ecosystem and its creators.</p>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-zinc-50 dark:bg-black rounded-2xl flex items-center justify-center group-hover:bg-brand-purple/10 transition-colors">
                    <stat.icon className="w-6 h-6 text-zinc-400 dark:text-zinc-600 group-hover:text-brand-purple transition-colors" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
                    stat.trend === 'up' ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-purple" />
                  Recent User Signups
                </h3>
                <button onClick={() => setActiveTab('admin-users')} className="text-xs font-bold text-brand-purple hover:underline">View All</button>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {mockUsers.slice(0, 4).map((user) => (
                  <div key={user.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                        <p className="text-[10px] text-zinc-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user.role}</p>
                      <p className="text-[10px] text-zinc-500">{user.joinedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-brand-purple" />
                  Pending Track Reviews
                </h3>
                <button onClick={() => setActiveTab('admin-tracks')} className="text-xs font-bold text-brand-purple hover:underline">View All</button>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {tracks.filter(t => t.status === 'Processing').map((track) => (
                  <div key={track.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{track.title}</p>
                        <p className="text-[10px] text-zinc-500">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleApproveTrack(track.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors" 
                        title="Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleRejectTrack(track.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors" 
                        title="Reject"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedTrack(track)}
                        className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" 
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">User Management.</h2>
              <p className="text-sm text-zinc-500">View and manage all users in the KulSound ecosystem.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Active Users</p>
              <p className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">
                {users.filter(u => u.status === 'Active').length}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Suspended</p>
              <p className="text-3xl font-black text-rose-500 tracking-tighter">
                {users.filter(u => u.status === 'Suspended').length}
              </p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Pending Verification</p>
              <p className="text-3xl font-black text-amber-500 tracking-tighter">
                {users.filter(u => u.status === 'Pending').length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search users by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              {selectedUserIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                  {(!adminRole || hasPermission(adminRole, 'manage_users')) && (
                    <>
                      <button 
                        onClick={() => handleBulkStatusUpdate('Active')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-bold hover:bg-emerald-500/20 transition-all"
                      >
                        <UserCheck className="w-4 h-4" />
                        Activate
                      </button>
                      <button 
                        onClick={() => handleBulkStatusUpdate('Suspended')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-sm font-bold hover:bg-amber-500/20 transition-all"
                      >
                        <UserX className="w-4 h-4" />
                        Suspend
                      </button>
                    </>
                  )}
                  {(!adminRole || adminRole === 'super_admin') && (
                    <button 
                      onClick={handleBulkDelete}
                      className="flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                  <div className="w-px h-8 bg-zinc-200 dark:border-zinc-800 mx-2" />
                </div>
              )}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-zinc-600 dark:text-zinc-300 border-none focus:ring-0 outline-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Artist">Artist</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-3 py-2">
                <Filter className="w-4 h-4 text-zinc-400" />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent text-xs font-bold text-zinc-600 dark:text-zinc-300 border-none focus:ring-0 outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2.5 bg-brand-gradient text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-purple/20"
              >
                Add User
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm relative">
            {/* Bulk Actions Bar */}
            <AnimatePresence>
              {selectedUserIds.length > 0 && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-2xl shadow-2xl border border-white/10 dark:border-zinc-200"
                >
                  <span className="text-xs font-bold uppercase tracking-widest border-r border-white/20 dark:border-zinc-200 pr-4 mr-2">
                    {selectedUserIds.length} Selected
                  </span>
                  <div className="flex items-center gap-2">
                    {(!adminRole || hasPermission(adminRole, 'manage_users')) && (
                      <>
                        <button 
                          onClick={() => handleBulkStatusUpdate('Active')}
                          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 dark:hover:bg-zinc-100 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          Activate
                        </button>
                        <button 
                          onClick={() => handleBulkStatusUpdate('Suspended')}
                          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 dark:hover:bg-zinc-100 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          <UserX className="w-4 h-4 text-amber-400" />
                          Suspend
                        </button>
                      </>
                    )}
                    {(!adminRole || adminRole === 'super_admin') && (
                      <button 
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-rose-500/20 rounded-xl transition-colors text-xs font-bold uppercase tracking-widest text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedUserIds([])}
                    className="ml-4 p-1 hover:bg-white/10 dark:hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAllUsers}
                        className="w-4 h-4 rounded border-zinc-300 text-brand-purple focus:ring-brand-purple"
                      />
                    </th>
                    <th className="px-6 py-4 font-black">
                      <button 
                        onClick={() => handleSortUsers('name')}
                        className="flex items-center gap-1 hover:text-brand-purple transition-colors"
                      >
                        User
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-black">Role</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black">
                      <button 
                        onClick={() => handleSortUsers('joinedDate')}
                        className="flex items-center gap-1 hover:text-brand-purple transition-colors"
                      >
                        Joined
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={cn(
                      "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group",
                      selectedUserIds.includes(user.id) && "bg-brand-purple/5 dark:bg-brand-purple/10"
                    )}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => handleSelectUser(user.id)}
                          className="w-4 h-4 rounded border-zinc-300 text-brand-purple focus:ring-brand-purple"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          user.status === 'Active' ? "bg-emerald-500/10 text-emerald-500" :
                          user.status === 'Pending' ? "bg-amber-500/10 text-amber-500" :
                          "bg-rose-500/10 text-rose-500"
                        )}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{user.joinedDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'tracks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Search tracks by title or artist..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
              {selectedTrackIds.length > 0 && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button 
                    onClick={handleBulkApproveTracks}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </button>
                  <button 
                    onClick={handleBulkRejectTracks}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <div className="w-px h-8 bg-zinc-200 dark:border-zinc-800 mx-2" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                <Filter className="w-4 h-4" />
                Status
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedTrackIds.length === filteredTracks.length && filteredTracks.length > 0}
                        onChange={handleSelectAllTracks}
                        className="w-4 h-4 rounded border-zinc-300 text-brand-purple focus:ring-brand-purple"
                      />
                    </th>
                    <th className="px-6 py-4 font-black">Track</th>
                    <th className="px-6 py-4 font-black">Artist</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black">Streams</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredTracks.map((track) => (
                    <tr key={track.id} className={cn(
                      "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group",
                      selectedTrackIds.includes(track.id) && "bg-brand-purple/5 dark:bg-brand-purple/10"
                    )}>
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          checked={selectedTrackIds.includes(track.id)}
                          onChange={() => handleSelectTrack(track.id)}
                          className="w-4 h-4 rounded border-zinc-300 text-brand-purple focus:ring-brand-purple"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                            <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{track.title}</p>
                            <p className="text-[10px] text-zinc-500">{track.releaseDate}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{track.artist}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          track.status === 'Live' ? "bg-emerald-500/10 text-emerald-500" :
                          track.status === 'Processing' ? "bg-brand-purple/10 text-brand-purple" :
                          track.status === 'Rejected' ? "bg-rose-500/10 text-rose-500" :
                          "bg-zinc-500/10 text-zinc-500"
                        )}>
                          {track.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500 font-mono">{track.streams}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedTrack(track)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'verifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 font-black">Artist</th>
                    <th className="px-6 py-4 font-black">ID Type</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {verifications.map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                            <img src={req.selfieImage} alt={req.artistName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{req.artistName}</p>
                            <p className="text-[10px] text-zinc-500">{req.legalName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs text-zinc-600 dark:text-zinc-400">{req.idType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={req.status}
                          onChange={(e) => handleUpdateVerificationStatus(req.id, e.target.value as any)}
                          className={cn(
                            "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer",
                            req.status === 'Verified' ? "text-emerald-500 bg-emerald-500/10" :
                            req.status === 'Pending' ? "text-amber-500 bg-amber-500/10" :
                            "text-rose-500 bg-rose-500/10"
                          )}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{req.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedVerification(req)}
                            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            title="Review Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateVerificationStatus(req.id, 'Verified')}
                            className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Quick Verify"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {verifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-brand-purple" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Verification Queue</h3>
                  <p className="text-sm text-zinc-500 max-w-xs mx-auto">There are currently no verification requests to review.</p>
                </div>
                <button 
                  onClick={() => setVerifications(mockVerifications)}
                  className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Refresh Queue
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'royalties' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Artist Royalties.</h2>
                    <p className="text-sm text-zinc-500">Balances are updated automatically based on streaming data.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    Last Auto-Run: April 1, 2024
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                          <th className="px-6 py-4 font-black">Artist</th>
                          <th className="px-6 py-4 font-black">Current Balance</th>
                          <th className="px-6 py-4 font-black">Lifetime Earnings</th>
                          <th className="px-6 py-4 font-black text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {royalties.map((royalty) => (
                          <tr key={royalty.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{royalty.artistName}</p>
                              <p className="text-[10px] text-zinc-500">ID: {royalty.artistId}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-emerald-500">${royalty.balance.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-zinc-900 dark:text-white">${royalty.lifetimeEarnings.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedRoyalty(royalty);
                                  setIsAddRoyaltyModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                              >
                                Manual Adjustment
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Distribution History.</h2>
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                          <th className="px-6 py-4 font-black">Date</th>
                          <th className="px-6 py-4 font-black">Artist</th>
                          <th className="px-6 py-4 font-black">Amount</th>
                          <th className="px-6 py-4 font-black">Type</th>
                          <th className="px-6 py-4 font-black">Period / Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {distributions.map((dist) => (
                          <tr key={dist.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                            <td className="px-6 py-4 text-xs text-zinc-500">{dist.date}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{dist.artistName}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-emerald-500">+${dist.amount.toLocaleString()}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                dist.type === 'Automated' ? "bg-brand-purple/10 text-brand-purple" : "bg-amber-500/10 text-amber-500"
                              )}>
                                {dist.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-xs text-zinc-500">{dist.period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Payout Requests.</h2>
              <div className="space-y-4">
                {payoutRequests.filter(p => p.status === 'Pending').map((payout) => (
                  <div key={payout.id} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{payout.artistName}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{payout.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-brand-purple">${payout.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase">{payout.method}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl mb-4">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Payment Details</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-mono break-all">{payout.details}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handleApprovePayout(payout.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectPayout(payout.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {payoutRequests.filter(p => p.status === 'Pending').length === 0 && (
                  <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center">
                    <p className="text-sm text-zinc-500 font-medium">No pending payout requests.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search reports by target, reporter, or description..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                <Filter className="w-4 h-4" />
                Type
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="px-6 py-4 font-black">Reported Item</th>
                    <th className="px-6 py-4 font-black">Type</th>
                    <th className="px-6 py-4 font-black">Reporter</th>
                    <th className="px-6 py-4 font-black">Status</th>
                    <th className="px-6 py-4 font-black">Date</th>
                    <th className="px-6 py-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            {report.targetType === 'Track' ? <Music className="w-4 h-4 text-zinc-400" /> : <Users className="w-4 h-4 text-zinc-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{report.target}</p>
                            <p className="text-[10px] text-zinc-500">{report.targetType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{report.type}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{report.reporter}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          report.status === 'Open' ? "bg-rose-500/10 text-rose-500" :
                          report.status === 'Resolved' ? "bg-emerald-500/10 text-emerald-500" :
                          "bg-zinc-500/10 text-zinc-500"
                        )}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">{report.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedReport(report)}
                          className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Platform Security</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">Maintenance Mode</p>
                    <p className="text-xs text-zinc-500">Disable all public access to the platform.</p>
                  </div>
                  <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">New User Registration</p>
                    <p className="text-xs text-zinc-500">Allow new artists to sign up.</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Revenue & Fees</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Platform Fee (%)</label>
                  <input 
                    type="number" 
                    defaultValue="15"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Minimum Payout ($)</label>
                  <input 
                    type="number" 
                    defaultValue="50"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Roles & Permissions Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Roles & Permissions</h3>
              </div>
              {adminRole === 'super_admin' && (
                <button className="px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                  Create New Role
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(Object.keys(DEFAULT_ROLE_PERMISSIONS) as AdminRoleType[]).map((role) => (
                <div key={role} className="p-6 bg-zinc-50 dark:bg-black rounded-[24px] border border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black uppercase tracking-tighter text-zinc-900 dark:text-white flex items-center gap-2">
                      {role.replace('_', ' ')}
                      {role === adminRole && <span className="text-[8px] bg-brand-purple/20 text-brand-purple px-1.5 py-0.5 rounded-full">YOU</span>}
                    </h4>
                    <button className="text-[10px] font-bold text-brand-purple hover:underline uppercase tracking-widest">Edit Permissions</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_ROLE_PERMISSIONS[role].map((perm) => (
                      <span key={perm} className="px-2 py-1 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg text-[9px] font-bold uppercase tracking-widest">
                        {perm.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Add New User.</h2>
                <p className="text-sm text-zinc-500">Create a new account manually.</p>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                <input 
                  required
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                <input 
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="e.g. john@example.com"
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Initial Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as any }))}
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all appearance-none"
                >
                  <option value="Artist">Artist</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-brand-gradient text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-purple/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">{selectedUser.name}</h2>
                  <p className="text-sm text-zinc-500">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Role</p>
                  <select 
                    value={selectedUser.role}
                    onChange={(e) => {
                      const newRole = e.target.value as any;
                      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                      setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
                    }}
                    className="w-full bg-transparent text-sm font-bold text-zinc-900 dark:text-white border-none focus:ring-0 p-0 cursor-pointer"
                  >
                    <option value="Artist">Artist</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                  <select 
                    value={selectedUser.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as any;
                      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
                      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
                    }}
                    className="w-full bg-transparent text-sm font-bold text-zinc-900 dark:text-white border-none focus:ring-0 p-0 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400">Manage User</h4>
                <div className="grid grid-cols-1 gap-2">
                  {(!adminRole || hasPermission(adminRole, 'manage_verifications')) && selectedUser.role !== 'Artist' && (
                    <button 
                      onClick={() => handleVerifyArtist(selectedUser.id, selectedUser.name)}
                      className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Verify Artist
                    </button>
                  )}
                  {(!adminRole || adminRole === 'super_admin') && (
                    <button 
                      onClick={() => handleResetPassword(selectedUser.email)}
                      className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Reset Password
                    </button>
                  )}
                  {(!adminRole || hasPermission(adminRole, 'manage_users')) && selectedUser.status !== 'Suspended' && (
                    <button 
                      onClick={() => handleSuspendUser(selectedUser.id)}
                      className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-2xl font-bold text-sm hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Suspend Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTrack && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 shadow-lg">
                  <img src={selectedTrack.cover} alt={selectedTrack.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">{selectedTrack.title}</h2>
                  <p className="text-lg text-zinc-500 font-medium">{selectedTrack.artist}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTrack(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="flex items-center gap-4 p-6 bg-zinc-900 rounded-3xl">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-brand-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-purple/20"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                </button>
                <div className="flex-1 space-y-2">
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-brand-gradient" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <span>1:12</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Genre</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedTrack.genre}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedTrack.status}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">ISRC</p>
                  <p className="text-sm font-mono text-zinc-900 dark:text-white">{selectedTrack.isrc}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">UPC</p>
                  <p className="text-sm font-mono text-zinc-900 dark:text-white">{selectedTrack.upc}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleApproveTrack(selectedTrack.id)}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Approve Track
                </button>
                <button 
                  onClick={() => handleRejectTrack(selectedTrack.id)}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Track
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedVerification && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">Artist Verification</h2>
                <p className="text-sm text-zinc-500">Reviewing claim for {selectedVerification.artistName}</p>
              </div>
              <button onClick={() => setSelectedVerification(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                    <Camera className="w-4 h-4" />
                    Selfie Verification
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <img src={selectedVerification.selfieImage} alt="Selfie" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                    <CreditCard className="w-4 h-4" />
                    {selectedVerification.idType}
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg">
                    <img src={selectedVerification.idImage} alt="ID Card" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-black rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Legal Name</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{selectedVerification.legalName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-lg font-bold text-zinc-900 dark:text-white">{selectedVerification.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleVerifyArtist(selectedVerification.id, selectedVerification.artistName)}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  Verify Artist
                </button>
                <button 
                  onClick={() => handleRejectVerification(selectedVerification.id, selectedVerification.artistName)}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                  <AlertCircle className="w-5 h-5" />
                  Reject Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">Report Details</h2>
                <p className="text-sm text-zinc-500">Case #{selectedReport.id}</p>
              </div>
              <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-6 h-6 text-zinc-400" />
              </button>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {selectedReport.type}
                  </span>
                  <span className="text-xs text-zinc-500">{selectedReport.date}</span>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Target {selectedReport.targetType}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedReport.target}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Reporter</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedReport.reporter}</p>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{selectedReport.description}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Resolve
                </button>
                <button className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tracksToReject.length > 0 && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white">
                  {tracksToReject.length === 1 ? 'Reject Track' : `Reject ${tracksToReject.length} Tracks`}
                </h2>
                <p className="text-sm text-zinc-500">
                  {tracksToReject.length === 1 ? tracksToReject[0].title : 'Bulk rejection action'}
                </p>
              </div>
              <button onClick={() => setTracksToReject([])} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Reason for Rejection</label>
                <textarea 
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g., Poor audio quality, Copyright issues, Explicit content..."
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all min-h-[120px] resize-none"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTracksToReject([])}
                  className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmRejectTrack}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddRoyaltyModalOpen && selectedRoyalty && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Manual Adjustment.</h2>
                <p className="text-sm text-zinc-500">Adjust balance for {selectedRoyalty.artistName}</p>
              </div>
              <button onClick={() => setIsAddRoyaltyModalOpen(false)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <form onSubmit={handleAddRoyalty} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Adjustment Amount (USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={royaltyAmount}
                    onChange={(e) => setRoyaltyAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all font-bold"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 ml-1 italic">Use negative values for deductions.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Reason for Adjustment</label>
                <input 
                  type="text" 
                  required
                  value={royaltyReason}
                  onChange={(e) => setRoyaltyReason(e.target.value)}
                  placeholder="e.g., Missing stream correction, Bonus, etc."
                  className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsAddRoyaltyModalOpen(false)}
                  className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
