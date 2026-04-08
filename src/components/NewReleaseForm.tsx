import React, { useState } from 'react';
import { X, Upload, Music, Image as ImageIcon, Check, Plus, Trash2, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import DatePicker from './DatePicker';

interface Track {
  id: string;
  title: string;
  isrc?: string;
  upc?: string;
  genre?: string;
  explicit?: boolean;
  fileName: string;
  size: string;
  progress: number; // 0 to 100
}

interface NewReleaseFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess?: (data: any) => void;
}

export default function NewReleaseForm({ isOpen, onClose, initialData, onSuccess }: NewReleaseFormProps) {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form State
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    artist: initialData?.artist || 'Alex Rivers',
    type: initialData?.type || 'Single',
    genre: initialData?.genre || 'Electronic',
    date: initialData?.date || '',
    explicit: initialData?.explicit || 'Not Explicit',
    upc: initialData?.upc || '',
    isrc: initialData?.isrc || '',
    coverArt: initialData?.cover || null as string | null
  });

  const [tracks, setTracks] = useState<Track[]>(initialData?.tracks?.map((t: any, i: number) => ({
    id: `track-${i}`,
    title: t.title,
    fileName: `${t.title}.wav`,
    size: '12.4 MB',
    progress: 100
  })) || []);
  
  // Update form data when initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        artist: initialData.artist || 'Alex Rivers',
        type: initialData.type || 'Single',
        genre: initialData.genre || 'Electronic',
        date: initialData.date || '',
        explicit: initialData.explicit || 'Not Explicit',
        upc: initialData.upc || '',
        isrc: initialData.isrc || '',
        coverArt: initialData.cover || null
      });
      setTracks(initialData.tracks?.map((t: any, i: number) => ({
        id: `track-${i}`,
        title: t.title,
        fileName: `${t.title}.wav`,
        size: '12.4 MB',
        progress: 100
      })) || []);
    }
  }, [initialData]);
  
  const audioInputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: FileList | null = null;
    if ('files' in e.target && e.target.files) {
      files = e.target.files;
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      files = e.dataTransfer.files;
    }

    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
      
      if (newFiles.length > 0) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.tracks;
          return newErrors;
        });
      }

      newFiles.forEach(file => {
        const id = Math.random().toString(36).substr(2, 9);
        const newTrack: Track = {
          id,
          title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          fileName: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          progress: 0
        };
        
        setTracks(prev => [...prev, newTrack]);

        // Simulate upload progress
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 30;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
          }
          setTracks(prev => prev.map(t => t.id === id ? { ...t, progress: currentProgress } : t));
        }, 500);
      });
      
      // Reset input so same file can be uploaded again if needed
      if (audioInputRef.current) audioInputRef.current.value = '';
    }
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleAudioUpload(e);
  };

  const triggerAudioUpload = () => {
    audioInputRef.current?.click();
  };

  const removeTrack = (id: string) => {
    setTracks(tracks.filter(t => t.id !== id));
  };

  const updateTrack = (id: string, field: keyof Track, value: any) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Release title is required';
      if (!formData.artist.trim()) newErrors.artist = 'Primary artist is required';
      if (!formData.date) newErrors.date = 'Release date is required';
    } else if (step === 2) {
      if (!formData.coverArt) newErrors.coverArt = 'Cover art is required';
      if (tracks.length === 0) newErrors.tracks = 'At least one track is required';
      else if (!tracks.every(t => t.progress === 100)) newErrors.tracks = 'Please wait for all tracks to finish uploading';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) setStep(step + 1);
      else handleSubmit();
    }
  };

  const canContinue = () => {
    // We still use this for the disabled state of the button, 
    // but handleNext will show the actual error messages.
    if (step === 1) {
      return formData.title.trim() !== '' && formData.date !== '' && formData.artist.trim() !== '';
    }
    if (step === 2) {
      return tracks.length > 0 && tracks.every(t => t.progress === 100) && formData.coverArt !== null;
    }
    return true;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    
    if (onSuccess) {
      onSuccess({
        ...formData,
        tracks: tracks.map(t => ({
          title: t.title,
          streams: '0',
          revenue: '$0.00',
          topDemographic: 'N/A',
          genre: t.genre || formData.genre,
          explicit: t.explicit || (formData.explicit === 'Explicit'),
          isrc: t.isrc || '',
          upc: t.upc || formData.upc
        }))
      });
    }

    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setStep(1);
      if (!initialData) {
        setFormData({
          title: '',
          artist: 'Alex Rivers',
          type: 'Single',
          genre: 'Electronic',
          date: '',
          explicit: 'Not Explicit',
          upc: '',
          isrc: '',
          coverArt: null
        });
        setTracks([]);
      }
      setErrors({});
    }, 2000);
  };

  const [coverArtProgress, setCoverArtProgress] = useState(0);

  const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverArtProgress(0);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.coverArt;
        return newErrors;
      });
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        // Simulate upload progress
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += Math.random() * 25;
          if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(interval);
            setFormData(prev => ({ ...prev, coverArt: result }));
          }
          setCoverArtProgress(currentProgress);
        }, 300);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-2xl p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Release Submitted!</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Your music is being processed and will be delivered to stores soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Edit Release' : 'Distribute New Music'}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-500">Step {step} of 3: {step === 1 ? 'Release Info' : step === 2 ? 'Upload Assets' : 'Review'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400 dark:text-zinc-400" />
          </button>
        </div>

        <div className="p-4 sm:p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Release Title</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Midnight Echoes"
                    className={cn(
                      "w-full bg-white dark:bg-zinc-950 border rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none transition-colors",
                      errors.title ? "border-rose-500 focus:border-rose-500" : "border-zinc-200 dark:border-zinc-800 focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
                    )}
                  />
                  {errors.title && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Primary Artist</label>
                  <input 
                    type="text" 
                    name="artist"
                    value={formData.artist}
                    onChange={handleInputChange}
                    className={cn(
                      "w-full bg-white dark:bg-zinc-950 border rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none transition-colors",
                      errors.artist ? "border-rose-500 focus:border-rose-500" : "border-zinc-200 dark:border-zinc-800 focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20"
                    )}
                  />
                  {errors.artist && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{errors.artist}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Release Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors appearance-none"
                  >
                    <option>Single</option>
                    <option>EP</option>
                    <option>Album</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Genre</label>
                  <select 
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors appearance-none"
                  >
                    <option>Electronic</option>
                    <option>Pop</option>
                    <option>Hip Hop</option>
                    <option>Rock</option>
                    <option>Jazz</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Release Date</label>
                  <div className={cn(
                    "rounded-lg transition-colors",
                    errors.date ? "ring-1 ring-rose-500" : ""
                  )}>
                    <DatePicker 
                      value={formData.date}
                      onChange={(date) => {
                        setFormData(prev => ({ ...prev, date }));
                        if (errors.date) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.date;
                            return newErrors;
                          });
                        }
                      }}
                      placeholder="Select release date"
                    />
                  </div>
                  {errors.date && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Explicit Content</label>
                  <select 
                    name="explicit"
                    value={formData.explicit}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors appearance-none"
                  >
                    <option>Not Explicit</option>
                    <option>Explicit</option>
                    <option>Clean Version</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">UPC (Optional)</label>
                  <input 
                    type="text" 
                    name="upc"
                    value={formData.upc}
                    onChange={handleInputChange}
                    placeholder="Leave blank to auto-generate"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">ISRC (Optional)</label>
                  <input 
                    type="text" 
                    name="isrc"
                    value={formData.isrc}
                    onChange={handleInputChange}
                    placeholder="Leave blank to auto-generate"
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-colors"
                  />
                </div>
              </div>

              <p className="text-xs text-zinc-500">We recommend choosing a release date at least 14 days in the future for playlist consideration.</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Cover Art</label>
                  <div className={cn(
                    "aspect-square bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors cursor-pointer group overflow-hidden relative",
                    errors.coverArt ? "border-rose-500" : "border-zinc-200 dark:border-zinc-800 hover:border-brand-purple/50"
                  )}>
                    {formData.coverArt ? (
                      <>
                        <img src={formData.coverArt} alt="Cover Art" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              setFormData(prev => ({ ...prev, coverArt: null }));
                              setCoverArtProgress(0);
                            }}
                            className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </>
                    ) : coverArtProgress > 0 && coverArtProgress < 100 ? (
                      <div className="w-full px-4 text-center space-y-3">
                        <div className="h-1 w-full bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-purple transition-all duration-300"
                            style={{ width: `${coverArtProgress}%` }}
                          />
                        </div>
                        <p className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Uploading {Math.round(coverArtProgress)}%</p>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                        <ImageIcon className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mb-2 group-hover:text-brand-purple transition-colors" />
                        <p className="text-sm text-zinc-500 text-center">Drag & drop or click to upload</p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-2">3000x3000px, JPG or PNG</p>
                        <input type="file" accept="image/*" className="hidden" onChange={handleCoverArtChange} />
                      </label>
                    )}
                  </div>
                  {errors.coverArt && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">{errors.coverArt}</p>}
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Track List</label>
                    <div className="flex items-center gap-3">
                      {tracks.length > 0 && (
                        <button 
                          onClick={() => setTracks([])}
                          className="text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                      <button 
                        onClick={triggerAudioUpload}
                        className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Track
                      </button>
                    </div>
                    <input 
                      type="file" 
                      ref={audioInputRef} 
                      className="hidden" 
                      multiple 
                      accept="audio/*" 
                      onChange={handleAudioUpload} 
                    />
                  </div>
                  
                  {errors.tracks && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{errors.tracks}</p>
                    </div>
                  )}

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {tracks.length === 0 ? (
                      <div 
                        onClick={triggerAudioUpload}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={cn(
                          "h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer group",
                          isDragging 
                            ? "bg-brand-purple/10 border-brand-purple" 
                            : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-brand-purple"
                        )}
                      >
                        <Music className={cn(
                          "w-8 h-8 mb-2 transition-colors",
                          isDragging ? "text-brand-purple" : "text-zinc-400 dark:text-zinc-600 group-hover:text-brand-purple"
                        )} />
                        <p className={cn(
                          "text-sm transition-colors",
                          isDragging ? "text-brand-purple" : "text-zinc-500"
                        )}>
                          {isDragging ? "Drop audio files here" : "Upload your master tracks"}
                        </p>
                      </div>
                    ) : (
                      tracks.map((track, i) => (
                        <div key={track.id} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-900 rounded flex items-center justify-center text-xs font-bold text-zinc-400 dark:text-zinc-500">
                                {i + 1}
                              </div>
                              <div className="flex-1">
                                <input 
                                  type="text" 
                                  value={track.title}
                                  onChange={(e) => updateTrack(track.id, 'title', e.target.value)}
                                  className="bg-transparent border-none p-0 text-sm font-bold text-zinc-900 dark:text-white focus:ring-0 w-full"
                                  placeholder="Track Title"
                                />
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">{track.fileName} • {track.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {track.progress < 100 && (
                                <span className="text-[10px] font-bold text-brand-purple">{Math.round(track.progress)}%</span>
                              )}
                              <button 
                                onClick={() => removeTrack(track.id)}
                                className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {track.progress < 100 ? (
                            <div className="space-y-2 animate-in fade-in duration-300">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-brand-purple animate-pulse">Uploading...</span>
                                <span className="text-zinc-500">{Math.round(track.progress)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800/50">
                                <div 
                                  className="h-full bg-brand-gradient transition-all duration-300 relative"
                                  style={{ width: `${track.progress}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
                              <div className="col-span-2 flex items-center gap-2 mb-1">
                                <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-emerald-500" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Upload Complete</span>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">ISRC (Optional)</label>
                                <input 
                                  type="text" 
                                  value={track.isrc || ''}
                                  onChange={(e) => updateTrack(track.id, 'isrc', e.target.value)}
                                  placeholder="Auto-generate"
                                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-zinc-400"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">UPC (Optional)</label>
                                <input 
                                  type="text" 
                                  value={track.upc || ''}
                                  onChange={(e) => updateTrack(track.id, 'upc', e.target.value)}
                                  placeholder="Auto-generate"
                                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-zinc-400"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Genre</label>
                                <input 
                                  type="text" 
                                  value={track.genre || ''}
                                  onChange={(e) => updateTrack(track.id, 'genre', e.target.value)}
                                  placeholder="Genre"
                                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-zinc-400"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">Explicit</label>
                                <select 
                                  value={track.explicit ? 'Yes' : 'No'}
                                  onChange={(e) => updateTrack(track.id, 'explicit', e.target.value === 'Yes')}
                                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-colors appearance-none"
                                >
                                  <option value="No">No</option>
                                  <option value="Yes">Yes</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 py-8 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{initialData ? 'Update Release?' : 'Ready to Submit?'}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
                {initialData 
                  ? `Your changes to "${formData.title || 'Untitled Release'}" will be updated across all platforms.`
                  : `Your release "${formData.title || 'Untitled Release'}" is ready to be delivered to 150+ stores worldwide.`
                }
              </p>
              <div className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Artist</span>
                  <span className="text-zinc-900 dark:text-white font-medium">{formData.artist}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Type</span>
                  <span className="text-zinc-900 dark:text-white font-medium">{formData.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Release Date</span>
                  <span className="text-zinc-900 dark:text-white font-medium">{formData.date || 'Not set'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Tracks</span>
                  <span className="text-zinc-900 dark:text-white font-medium">{tracks.length} track{tracks.length !== 1 ? 's' : ''} uploaded</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button 
            onClick={handleNext}
            className={cn(
              "px-8 py-2 rounded-lg font-bold transition-all active:scale-95",
              canContinue() 
                ? "bg-brand-gradient text-white hover:opacity-90 shadow-lg shadow-brand-purple/20" 
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
            )}
          >
            {step === 3 ? (initialData ? 'Update Release' : 'Submit Release') : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
