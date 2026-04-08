import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Music, MoreHorizontal, ExternalLink, Search, Filter, ArrowLeft, Play, DollarSign, Users, Globe, Calendar, ArrowUpDown, X, Loader2, Pause, Trash2, BarChart3, FileText, Edit3, ShieldCheck, ShieldAlert, Shield, ChevronRight, Smartphone, CreditCard, Camera, ArrowRight, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import NewReleaseForm from './NewReleaseForm';
import DatePicker from './DatePicker';
import VerificationBanner from './VerificationBanner';
import { useTheme } from '../context/ThemeContext';

interface Track {
  title: string;
  streams: string;
  revenue: string;
  topDemographic: string;
  genre?: string;
  isrc?: string;
  upc?: string;
  explicit?: boolean;
  status?: string;
}

interface Release {
  id: number;
  title: string;
  artist: string;
  type: string;
  status: string;
  date: string;
  streams: string;
  cover: string;
  tracks: Track[];
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Live':
        return {
          color: 'bg-emerald-500 text-white',
          description: 'Active on stores. Your music is available for streaming and purchase worldwide.',
          nextStep: 'No action needed.'
        };
      case 'Processing':
        return {
          color: 'bg-brand-purple text-white',
          description: 'Under review. Our team is checking your metadata and assets for store compliance.',
          nextStep: 'Check back in 24-48h.'
        };
      case 'Scheduled':
        return {
          color: 'bg-blue-500 text-white',
          description: 'Upcoming release. Everything is ready! Your music will go live on the set date.',
          nextStep: 'Prepare your marketing.'
        };
      default:
        return {
          color: 'bg-zinc-500 text-white',
          description: 'Status unknown or pending initial review.',
          nextStep: 'Contact support if persists.'
        };
    }
  };

  const info = getStatusInfo(status);

  return (
    <div className="relative group/tooltip inline-block">
      <span className={cn(
        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg cursor-help flex items-center gap-1.5",
        info.color,
        className
      )}>
        {status === 'Processing' && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
        {status}
        {status === 'Processing' && (
          <span className="relative flex h-1.5 w-1.5 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
          </span>
        )}
      </span>
      
      {/* Tooltip Content */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1">{status} Status</p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">{info.description}</p>
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <p className="text-[9px] font-bold text-brand-purple uppercase tracking-tighter">Next Step:</p>
          <p className="text-[10px] text-zinc-600 dark:text-zinc-300">{info.nextStep}</p>
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-200 dark:border-t-zinc-800" />
      </div>
    </div>
  );
};

export default function Releases({ 
  verificationStatus, 
  setVerificationStatus, 
  isVerificationModalOpen, 
  setIsVerificationModalOpen, 
  isVerifying, 
  setIsVerifying,
  handleCompleteVerification
}: any) {
  const { theme } = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [releaseToDelete, setReleaseToDelete] = useState<Release | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedReleases, setSelectedReleases] = useState<Set<number>>(new Set());

  const handleStartVerification = () => {
    setIsVerificationModalOpen(true);
  };
  
  // Audio Preview State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playingTrackInfo, setPlayingTrackInfo] = useState<{ title: string; artist: string; cover: string } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (e: React.MouseEvent, trackId: string, trackInfo?: { title: string; artist: string; cover: string }) => {
    e.stopPropagation();
    if (playingTrackId === trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
      setPlayingTrackInfo(null);
    } else {
      setPlayingTrackId(trackId);
      if (trackInfo) {
        setPlayingTrackInfo(trackInfo);
      }
      // In a real app, we would set the src to a preview URL
      // For now, we'll use a placeholder audio or just simulate playing
      if (audioRef.current) {
        audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        audioRef.current.play().catch(err => console.error("Audio play failed:", err));
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortBy, setSortBy] = useState('newest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [releases, setReleases] = useState<Release[]>([
    { 
      id: 1, 
      title: 'Midnight Echoes', 
      artist: 'Alex Rivers', 
      type: 'Album', 
      status: 'Live', 
      date: 'Mar 12, 2026', 
      streams: '124,502', 
      cover: 'https://picsum.photos/seed/album1/100/100',
      tracks: [
        { title: 'Neon Pulse', streams: '45,201', revenue: '$180.80', topDemographic: 'USA (24%)', genre: 'Electronic', isrc: 'QM-G7P-26-00001', upc: '190295123456', explicit: false, status: 'Live' },
        { title: 'Midnight Echoes', streams: '32,100', revenue: '$128.40', topDemographic: 'UK (18%)', genre: 'Synthwave', isrc: 'QM-G7P-26-00002', upc: '190295123456', explicit: true, status: 'Live' },
        { title: 'Shadow Dance', streams: '28,401', revenue: '$113.60', topDemographic: 'Germany (15%)', genre: 'Electronic', isrc: 'QM-G7P-26-00003', upc: '190295123456', explicit: false, status: 'Live' },
        { title: 'After Hours', streams: '18,800', revenue: '$75.20', topDemographic: 'France (12%)', genre: 'Ambient', isrc: 'QM-G7P-26-00004', upc: '190295123456', explicit: false, status: 'Live' },
      ]
    },
    { 
      id: 2, 
      title: 'Neon Dreams', 
      artist: 'Alex Rivers', 
      type: 'Single', 
      status: 'Live', 
      date: 'Feb 28, 2026', 
      streams: '84,120', 
      cover: 'https://picsum.photos/seed/album2/100/100',
      tracks: [
        { title: 'Neon Dreams', streams: '84,120', revenue: '$336.48', topDemographic: 'USA (30%)', genre: 'Synthwave', isrc: 'QM-G7P-26-00005', explicit: false, status: 'Live' }
      ]
    },
    { 
      id: 3, 
      title: 'Summer Rain', 
      artist: 'Alex Rivers', 
      type: 'Single', 
      status: 'Processing', 
      date: 'Apr 05, 2026', 
      streams: '-', 
      cover: 'https://picsum.photos/seed/album3/100/100',
      tracks: [
        { title: 'Summer Rain', streams: '0', revenue: '$0.00', topDemographic: '-', genre: 'Pop', isrc: 'QM-G7P-26-00006', explicit: false, status: 'Processing' }
      ]
    },
    { 
      id: 4, 
      title: 'Lost in Time', 
      artist: 'Alex Rivers', 
      type: 'EP', 
      status: 'Live', 
      date: 'Jan 15, 2026', 
      streams: '210,340', 
      cover: 'https://picsum.photos/seed/album4/100/100',
      tracks: [
        { title: 'Time Warp', streams: '85,000', revenue: '$340.00', topDemographic: 'Canada (22%)', genre: 'Electronic', isrc: 'QM-G7P-26-00007', explicit: true, status: 'Live' },
        { title: 'Echoes of Past', streams: '75,340', revenue: '$301.36', topDemographic: 'USA (20%)', genre: 'Ambient', isrc: 'QM-G7P-26-00008', explicit: false, status: 'Live' },
        { title: 'Future Bound', streams: '50,000', revenue: '$200.00', topDemographic: 'Japan (15%)', genre: 'Electronic', isrc: 'QM-G7P-26-00009', explicit: false, status: 'Live' },
      ]
    },
    { 
      id: 5, 
      title: 'City Lights', 
      artist: 'Alex Rivers', 
      type: 'Single', 
      status: 'Live', 
      date: 'Dec 20, 2025', 
      streams: '45,200', 
      cover: 'https://picsum.photos/seed/album5/100/100',
      tracks: [
        { title: 'City Lights', streams: '45,200', revenue: '$180.80', topDemographic: 'USA (25%)', genre: 'Pop', isrc: 'QM-G7P-26-00010', explicit: false, status: 'Live' }
      ]
    },
  ]);

  const filteredAndSortedReleases = useMemo(() => {
    return releases
      .filter(release => {
        const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             release.tracks.some(track => track.title.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === 'All Types' || release.type === typeFilter.replace(/s$/, '');
        
        const releaseDate = new Date(release.date);
        const matchesStartDate = !startDate || releaseDate >= new Date(startDate);
        const matchesEndDate = !endDate || releaseDate <= new Date(endDate);
        
        return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === 'streams-high') {
          const streamsA = parseInt(a.streams.replace(/,/g, '')) || 0;
          const streamsB = parseInt(b.streams.replace(/,/g, '')) || 0;
          return streamsB - streamsA;
        }
        if (sortBy === 'streams-low') {
          const streamsA = parseInt(a.streams.replace(/,/g, '')) || 0;
          const streamsB = parseInt(b.streams.replace(/,/g, '')) || 0;
          return streamsA - streamsB;
        }
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        if (sortBy === 'alpha-reverse') return b.title.localeCompare(a.title);
        return 0;
      });
  }, [searchQuery, typeFilter, sortBy, startDate, endDate, releases]);

  // Bulk Selection Logic
  const isAllSelected = selectedReleases.size === filteredAndSortedReleases.length && filteredAndSortedReleases.length > 0;
  const isSomeSelected = selectedReleases.size > 0 && selectedReleases.size < filteredAndSortedReleases.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedReleases(new Set());
    } else {
      setSelectedReleases(new Set(filteredAndSortedReleases.map(r => r.id)));
    }
  };

  const handleSelectRelease = (e: React.MouseEvent | React.ChangeEvent, id: number) => {
    e.stopPropagation();
    setSelectedReleases(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkAction = (action: 'delete' | 'export') => {
    if (selectedReleases.size === 0) return;

    if (action === 'delete') {
      setReleases(prev => prev.filter(r => !selectedReleases.has(r.id)));
      setSelectedReleases(new Set());
    } else if (action === 'export') {
      // Mock export
      const selectedData = releases.filter(r => selectedReleases.has(r.id));
      const blob = new Blob([JSON.stringify(selectedData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `releases_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSelectedReleases(new Set());
    }
  };

  const handleDeleteRelease = (id: number) => {
    setReleases(prev => prev.filter(r => r.id !== id));
    setReleaseToDelete(null);
    setSelectedRelease(null);
    setActiveDropdownId(null);
  };

  const handleReleaseUpdate = (updatedData: any) => {
    if (editingRelease) {
      setReleases(prev => prev.map(r => r.id === editingRelease.id ? {
        ...r,
        title: updatedData.title,
        artist: updatedData.artist,
        type: updatedData.type,
        date: updatedData.date,
        cover: updatedData.coverArt || r.cover,
        tracks: updatedData.tracks.length > 0 ? updatedData.tracks : r.tracks
      } : r));
      
      if (selectedRelease?.id === editingRelease.id) {
        setSelectedRelease(prev => prev ? {
          ...prev,
          title: updatedData.title,
          artist: updatedData.artist,
          type: updatedData.type,
          date: updatedData.date,
          cover: updatedData.coverArt || prev.cover,
          tracks: updatedData.tracks.length > 0 ? updatedData.tracks : prev.tracks
        } : null);
      }
    } else {
      // Handle new release addition if needed, but NewReleaseForm currently just mocks it
      const newRelease: Release = {
        id: Math.max(...releases.map(r => r.id)) + 1,
        title: updatedData.title,
        artist: updatedData.artist,
        type: updatedData.type,
        status: 'Processing',
        date: updatedData.date,
        streams: '0',
        cover: updatedData.coverArt || 'https://picsum.photos/seed/new/100/100',
        tracks: updatedData.tracks
      };
      setReleases(prev => [newRelease, ...prev]);
    }
  };

  const handleTrackUpdate = (releaseId: number, trackIndex: number, field: keyof Track, value: any) => {
    setReleases(prev => prev.map(r => {
      if (r.id === releaseId) {
        const newTracks = [...r.tracks];
        newTracks[trackIndex] = { ...newTracks[trackIndex], [field]: value };
        const updatedRelease = { ...r, tracks: newTracks };
        if (selectedRelease?.id === releaseId) {
          setSelectedRelease(updatedRelease);
        }
        return updatedRelease;
      }
      return r;
    }));
  };

  const ActionMenu = ({ release, className }: { release: Release, className?: string }) => (
    <div className={cn("relative", className)} onClick={e => e.stopPropagation()}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setActiveDropdownId(activeDropdownId === release.id ? null : release.id);
        }}
        className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full hover:scale-110 transition-transform"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {activeDropdownId === release.id && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
          <button 
            onClick={() => {
              setEditingRelease(release);
              setActiveDropdownId(null);
            }}
            className="w-full px-4 py-2.5 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-3"
          >
            <Edit3 className="w-4 h-4 text-brand-purple" />
            Edit Release Details
          </button>
          <button className="w-full px-4 py-2.5 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-3">
            <Users className="w-4 h-4 text-blue-500" />
            View Audience
          </button>
          <button className="w-full px-4 py-2.5 text-left text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-3">
            <FileText className="w-4 h-4 text-emerald-500" />
            Download Statement
          </button>
          <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
          <button 
            onClick={() => setReleaseToDelete(release)}
            className="w-full px-4 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4" />
            Delete Release
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto">
      <audio 
        ref={audioRef} 
        onEnded={() => {
          setPlayingTrackId(null);
          setPlayingTrackInfo(null);
        }} 
        className="hidden" 
      />
      
      {/* Modals - Rendered at top level so they are available in both views */}
      <NewReleaseForm 
        isOpen={isFormOpen || !!editingRelease} 
        onClose={() => { setIsFormOpen(false); setEditingRelease(null); }} 
        initialData={editingRelease}
        onSuccess={handleReleaseUpdate}
      />

      {/* Delete Confirmation Modal */}
      {releaseToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-8 h-8 text-rose-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Delete Release?</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Are you sure you want to delete <span className="text-zinc-900 dark:text-white font-medium">"{releaseToDelete.title}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setReleaseToDelete(null)}
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteRelease(releaseToDelete.id)}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Artist Claim Modal removed from here as it's now in App.tsx */}

      {selectedRelease ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <button 
            onClick={() => setSelectedRelease(null)}
            className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to all releases
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <img 
              src={selectedRelease.cover} 
              alt={selectedRelease.title} 
              className="w-48 h-48 rounded-2xl shadow-2xl shadow-brand-purple/10"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 bg-brand-purple/10 text-brand-purple text-[10px] font-bold uppercase tracking-wider rounded">
                    {selectedRelease.type}
                  </span>
                  <StatusBadge status={selectedRelease.status} />
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">{selectedRelease.title}</h1>
                  <button 
                    onClick={(e) => togglePreview(e, `release-detail-${selectedRelease.id}`, {
                      title: selectedRelease.title,
                      artist: selectedRelease.artist,
                      cover: selectedRelease.cover
                    })}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                      playingTrackId === `release-detail-${selectedRelease.id}` 
                        ? "bg-brand-purple text-white scale-110" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white hover:scale-110"
                    )}
                    title="Play Preview"
                  >
                    {playingTrackId === `release-detail-${selectedRelease.id}` ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>
                <p className="text-xl text-zinc-500 dark:text-zinc-400">{selectedRelease.artist}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setEditingRelease(selectedRelease)}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-purple/20"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Release
                </button>
                <ActionMenu release={selectedRelease} />
              </div>
              <div className="flex gap-6 pt-2">
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-tighter">Release Date</p>
                  <p className="text-zinc-900 dark:text-white">{selectedRelease.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 uppercase font-bold tracking-tighter">Total Streams</p>
                  <p className="text-zinc-900 dark:text-white font-mono">{selectedRelease.streams}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Track Performance</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">Detailed metrics for each song in this release.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Song Title</th>
                    <th className="px-6 py-4 font-medium">Genre</th>
                    <th className="px-6 py-4 font-medium text-center">Explicit</th>
                    <th className="px-6 py-4 font-medium">ISRC</th>
                    <th className="px-6 py-4 font-medium">UPC</th>
                    <th className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-1">
                        <Play className="w-3 h-3" /> Streams
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> Revenue
                      </div>
                    </th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {selectedRelease.tracks.length > 0 ? (
                    selectedRelease.tracks.map((track, i) => {
                      const trackId = `track-${selectedRelease.id}-${i}`;
                      const isPlaying = playingTrackId === trackId;
                      
                      return (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                          <td className="px-6 py-4 text-sm text-zinc-400 dark:text-zinc-500 font-mono">{i + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={(e) => togglePreview(e, trackId, {
                                  title: track.title,
                                  artist: selectedRelease.artist,
                                  cover: selectedRelease.cover
                                })}
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                                  isPlaying ? "bg-brand-purple text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                                )}
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                              </button>
                              <div className="flex flex-col gap-1">
                                <input 
                                  type="text"
                                  value={track.title}
                                  onChange={(e) => handleTrackUpdate(selectedRelease.id, i, 'title', e.target.value)}
                                  className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-sm font-bold text-zinc-900 dark:text-white focus:border-brand-purple focus:outline-none w-48"
                                  placeholder="Track Title"
                                />
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-500">{track.topDemographic !== '-' ? `Top: ${track.topDemographic}` : 'No demographic data'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text"
                              value={track.genre || ''}
                              onChange={(e) => handleTrackUpdate(selectedRelease.id, i, 'genre', e.target.value)}
                              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs text-zinc-600 dark:text-zinc-300 focus:border-brand-purple focus:outline-none w-24"
                              placeholder="Genre"
                            />
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleTrackUpdate(selectedRelease.id, i, 'explicit', !track.explicit)}
                              className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold uppercase transition-all",
                                track.explicit 
                                  ? "bg-rose-500/20 text-rose-500 border border-rose-500/50" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                              )}
                            >
                              {track.explicit ? 'Explicit' : 'Clean'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text"
                              value={track.isrc || ''}
                              onChange={(e) => handleTrackUpdate(selectedRelease.id, i, 'isrc', e.target.value)}
                              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-600 dark:text-zinc-300 focus:border-brand-purple focus:outline-none w-28 font-mono"
                              placeholder="ISRC"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input 
                              type="text"
                              value={track.upc || ''}
                              onChange={(e) => handleTrackUpdate(selectedRelease.id, i, 'upc', e.target.value)}
                              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-600 dark:text-zinc-300 focus:border-brand-purple focus:outline-none w-28 font-mono"
                              placeholder="UPC"
                            />
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-mono">{track.streams}</td>
                          <td className="px-6 py-4 text-sm text-emerald-500 font-mono">{track.revenue}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={track.status || selectedRelease.status} className="scale-90 origin-left" />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500 italic">
                        No track data available for this release yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full lg:w-auto">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Catalog</h1>
                <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1">Manage your music catalog and distribution status.</p>
              </div>
              
              <div className="flex items-center gap-3 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-xl w-full sm:w-auto">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  verificationStatus === 'Verified' ? "bg-emerald-500/10 text-emerald-500" : 
                  verificationStatus === 'Pending' ? "bg-brand-purple/10 text-brand-purple" : 
                  verificationStatus === 'Rejected' ? "bg-rose-500/10 text-rose-500" :
                  "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                )}>
                  {verificationStatus === 'Verified' ? <ShieldCheck className="w-6 h-6" /> : 
                   verificationStatus === 'Pending' ? <Shield className="w-6 h-6 animate-pulse" /> : 
                   verificationStatus === 'Rejected' ? <XCircle className="w-6 h-6" /> :
                   <ShieldAlert className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest leading-none">Artist Status</p>
                    <span className={cn(
                      "text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-tighter",
                      verificationStatus === 'Verified' ? "bg-emerald-500 text-white" : 
                      verificationStatus === 'Pending' ? "bg-brand-purple text-white" : 
                      verificationStatus === 'Rejected' ? "bg-rose-500 text-white" :
                      "bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
                    )}>
                      {verificationStatus}
                    </span>
                  </div>
                  <div className="mt-1">
                    {verificationStatus === 'Unverified' || verificationStatus === 'Rejected' ? (
                      <button 
                        onClick={handleStartVerification}
                        disabled={isVerifying}
                        className={cn(
                          "text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50",
                          verificationStatus === 'Rejected' ? "text-rose-500 hover:text-rose-600" : "text-brand-purple hover:text-brand-purple/80"
                        )}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Starting...
                          </>
                        ) : (
                          <>
                            {verificationStatus === 'Rejected' ? 'Re-verify Now' : 'Get Verified Now'}
                            <ChevronRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    ) : verificationStatus === 'Pending' ? (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Review in progress (24-48h)</p>
                    ) : (
                      <p className="text-[11px] text-emerald-500/80 font-medium">Official Artist Channel</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                if (verificationStatus === 'Verified') {
                  setIsFormOpen(true);
                } else {
                  setIsVerificationModalOpen(true);
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-brand-gradient text-white rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-purple/20 w-full lg:w-auto text-sm"
            >
              <Plus className="w-5 h-5" />
              Create New Release
            </button>
          </div>

          {/* Prominent Verification Banner for Non-Verified Users */}
          {verificationStatus !== 'Verified' && (
            <VerificationBanner 
              status={verificationStatus} 
              onStartVerification={() => setIsVerificationModalOpen(true)} 
            />
          )}

          {releases.length > 0 && (
            <div className="flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search by title, artist, or track..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full bg-white dark:bg-zinc-950 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none transition-all",
                    searchQuery ? "border-brand-purple ring-1 ring-brand-purple/20" : "border-zinc-200 dark:border-zinc-800 focus:border-brand-purple"
                  )}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'grid' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-lg" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                    )}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      viewMode === 'table' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-lg" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                    )}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5">
                  <ArrowUpDown className="w-4 h-4 text-zinc-500" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-zinc-600 dark:text-zinc-300 text-sm border-none focus:ring-0 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="streams-high">Highest Streams</option>
                    <option value="streams-low">Lowest Streams</option>
                    <option value="alpha">A-Z Title</option>
                    <option value="alpha-reverse">Z-A Title</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5">
                  <Filter className="w-4 h-4 text-zinc-500" />
                  <select 
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-transparent text-zinc-600 dark:text-zinc-300 text-sm border-none focus:ring-0 cursor-pointer"
                  >
                    <option>All Types</option>
                    <option>Singles</option>
                    <option>EPs</option>
                    <option>Albums</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Calendar className="w-4 h-4" />
                <span>Release Date Range:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DatePicker 
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="Start date"
                  className="w-36"
                />
                <span className="text-zinc-600">to</span>
                <DatePicker 
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="End date"
                  className="w-36"
                />
                {(startDate || endDate) && (
                  <button 
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="p-2 text-orange-500 hover:text-orange-400 font-medium ml-2 hover:bg-orange-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="ml-auto flex items-center gap-4">
                {selectedReleases.size > 0 && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <span className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
                      {selectedReleases.size} Selected
                    </span>
                    <div className="relative group/bulk">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 shadow-sm">
                        Bulk Actions
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 py-2 opacity-0 invisible group-hover/bulk:opacity-100 group-hover/bulk:visible transition-all duration-200">
                        <button 
                          onClick={() => handleBulkAction('export')}
                          className="w-full px-4 py-2 text-left text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-3"
                        >
                          <FileText className="w-3.5 h-3.5 text-emerald-500" />
                          Export Selected
                        </button>
                        <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
                        <button 
                          onClick={() => handleBulkAction('delete')}
                          className="w-full px-4 py-2 text-left text-xs text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-3"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="text-xs text-zinc-500 flex items-center gap-2">
                  {searchQuery && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full font-medium animate-in fade-in zoom-in duration-300">
                      <Search className="w-3 h-3" />
                      Search Results
                    </span>
                  )}
                  Showing {filteredAndSortedReleases.length} releases
                </div>
              </div>
            </div>
          </div>
        )}

          {filteredAndSortedReleases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 relative">
                <Music className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
                <Plus className="w-6 h-6 text-brand-purple absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1 border-2 border-zinc-100 dark:border-zinc-800" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                {releases.length === 0 ? "No releases yet" : "No results found"}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
                {releases.length === 0 
                  ? "Start your journey by uploading your first track. We'll deliver it to 150+ stores worldwide."
                  : "We couldn't find any releases matching your current filters. Try adjusting your search or filters."}
              </p>
              {releases.length === 0 ? (
                <button 
                  onClick={() => {
                    if (verificationStatus === 'Verified') {
                      setIsFormOpen(true);
                    } else {
                      setIsVerificationModalOpen(true);
                    }
                  }}
                  className="w-full sm:w-auto px-10 py-5 bg-brand-gradient text-white rounded-full font-black text-lg uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-purple/40 flex items-center justify-center gap-3"
                >
                  <Plus className="w-6 h-6" />
                  Create New Release
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('All Types');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex items-center gap-2 border border-zinc-200 dark:border-zinc-700"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedReleases.map((release) => (
                <div 
                  key={release.id} 
                  onClick={() => setSelectedRelease(release)}
                  className={cn(
                    "bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden group transition-all duration-300 cursor-pointer relative",
                    selectedReleases.has(release.id) ? "border-orange-500 ring-1 ring-orange-500/50" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                  )}
                >
                  <div className="absolute top-3 left-3 z-10">
                    <input 
                      type="checkbox"
                      checked={selectedReleases.has(release.id)}
                      onChange={(e) => handleSelectRelease(e, release.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 transition-all cursor-pointer"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={release.cover} 
                      alt={release.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <ActionMenu release={release} />
                    </div>
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={release.status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-zinc-900 dark:text-white truncate flex-1">{release.title}</h3>
                      <button 
                        onClick={(e) => togglePreview(e, `release-${release.id}`, {
                          title: release.title,
                          artist: release.artist,
                          cover: release.cover
                        })}
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                          playingTrackId === `release-${release.id}` 
                            ? "bg-orange-500 text-white" 
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                        )}
                        title="Play Preview"
                      >
                        {playingTrackId === `release-${release.id}` ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </button>
                    </div>
                    <p className="text-sm text-zinc-500 truncate">{release.artist}</p>
                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="text-xs text-zinc-500">
                        <p className="uppercase tracking-tighter font-bold">Streams</p>
                        <p className="text-zinc-700 dark:text-zinc-300 font-mono">{release.streams}</p>
                      </div>
                      <div className="text-xs text-zinc-500 text-right">
                        <p className="uppercase tracking-tighter font-bold">Type</p>
                        <p className="text-zinc-700 dark:text-zinc-300">{release.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (verificationStatus === 'Verified') {
                    setIsFormOpen(true);
                  } else {
                    setIsVerificationModalOpen(true);
                  }
                }}
                className="bg-zinc-50 dark:bg-zinc-900/30 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 hover:border-orange-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all group"
              >
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                  <Plus className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="font-bold text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">Add New Release</p>
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-zinc-500 text-[10px] uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <th className="px-6 py-4 w-10">
                        <input 
                          type="checkbox"
                          checked={isAllSelected}
                          ref={el => {
                            if (el) el.indeterminate = isSomeSelected;
                          }}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 transition-all cursor-pointer"
                        />
                      </th>
                      <th 
                        className="px-6 py-4 font-bold cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors group/sort"
                        onClick={() => setSortBy(sortBy === 'alpha' ? 'alpha-reverse' : 'alpha')}
                      >
                        <div className="flex items-center gap-2">
                          Release
                          <ArrowUpDown className={cn(
                            "w-3 h-3 transition-colors",
                            (sortBy === 'alpha' || sortBy === 'alpha-reverse') ? "text-brand-purple" : "text-zinc-400 group-hover/sort:text-zinc-600 dark:group-hover/sort:text-zinc-300"
                          )} />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold">Artist</th>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th 
                        className="px-6 py-4 font-bold cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors group/sort"
                        onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                      >
                        <div className="flex items-center gap-2">
                          Release Date
                          <ArrowUpDown className={cn(
                            "w-3 h-3 transition-colors",
                            (sortBy === 'newest' || sortBy === 'oldest') ? "text-brand-purple" : "text-zinc-400 group-hover/sort:text-zinc-600 dark:group-hover/sort:text-zinc-300"
                          )} />
                        </div>
                      </th>
                      <th 
                        className="px-6 py-4 font-bold cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors group/sort"
                        onClick={() => setSortBy(sortBy === 'streams-high' ? 'streams-low' : 'streams-high')}
                      >
                        <div className="flex items-center gap-2">
                          Streams
                          <ArrowUpDown className={cn(
                            "w-3 h-3 transition-colors",
                            (sortBy === 'streams-high' || sortBy === 'streams-low') ? "text-brand-purple" : "text-zinc-400 group-hover/sort:text-zinc-600 dark:group-hover/sort:text-zinc-300"
                          )} />
                        </div>
                      </th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredAndSortedReleases.map((release) => (
                      <tr 
                        key={release.id} 
                        onClick={() => setSelectedRelease(release)}
                        className={cn(
                          "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group cursor-pointer",
                          selectedReleases.has(release.id) && "bg-orange-500/5"
                        )}
                      >
                        <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox"
                            checked={selectedReleases.has(release.id)}
                            onChange={(e) => handleSelectRelease(e, release.id)}
                            className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-white dark:focus:ring-offset-zinc-900 transition-all cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={release.cover} 
                              alt={release.title} 
                              className="w-10 h-10 rounded-lg object-cover shadow-lg"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col">
                              <span className="font-bold text-zinc-900 dark:text-white text-sm">{release.title}</span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">{release.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300">{release.artist}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{release.type}</td>
                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{release.date}</td>
                        <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-300 font-mono">{release.streams}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={release.status} className="scale-90 origin-left" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={(e) => togglePreview(e, `table-preview-${release.id}`, {
                                title: release.title,
                                artist: release.artist,
                                cover: release.cover
                              })}
                              className={cn(
                                "p-2 rounded-full transition-all",
                                playingTrackId === `table-preview-${release.id}` 
                                  ? "bg-orange-500 text-white" 
                                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
                              )}
                            >
                              {playingTrackId === `table-preview-${release.id}` ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <ActionMenu release={release} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={8} className="p-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (verificationStatus === 'Verified') {
                              setIsFormOpen(true);
                            } else {
                              setIsVerificationModalOpen(true);
                            }
                          }}
                          className="w-full py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-orange-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all group border-t border-zinc-100 dark:border-zinc-800"
                        >
                          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold">Add New Release</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
      {/* Player Bar */}
      {playingTrackInfo && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
              <img 
                src={playingTrackInfo.cover} 
                alt={playingTrackInfo.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-purple/20 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Music className="w-3 h-3 text-brand-purple animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Now Playing</span>
              </div>
              <h4 className="font-bold text-zinc-900 dark:text-white truncate text-sm">{playingTrackInfo.title}</h4>
              <p className="text-xs text-zinc-500 truncate">{playingTrackInfo.artist}</p>
            </div>

            <div className="flex items-center gap-3 pr-2">
              <button 
                onClick={(e) => togglePreview(e, playingTrackId || '')}
                className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-purple/20"
              >
                <Pause className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  setPlayingTrackId(null);
                  setPlayingTrackInfo(null);
                  if (audioRef.current) audioRef.current.pause();
                }}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
