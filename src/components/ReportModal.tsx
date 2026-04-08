import React, { useState } from 'react';
import { X, Flag, AlertCircle, Shield, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: any) => void;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [type, setType] = useState<'Copyright' | 'Inappropriate' | 'Spam' | 'Other'>('Other');
  const [target, setTarget] = useState('');
  const [targetType, setTargetType] = useState<'Track' | 'User'>('Track');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const report = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      reporter: 'Current User', // In a real app, this would be the logged-in user's name
      target,
      targetType,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      description,
    };
    onSubmit(report);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Reset form
      setType('Other');
      setTarget('');
      setTargetType('Track');
      setDescription('');
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">Report Issue.</h2>
                  <p className="text-xs text-zinc-500 font-medium">Help us keep the community safe.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="p-8">
              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">Report Sent!</h3>
                    <p className="text-zinc-500 max-w-[280px] mx-auto mt-2">Thank you for your report. Our admin team will review it shortly.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Report Type */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Report Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['Copyright', 'Inappropriate', 'Spam', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={cn(
                            "px-4 py-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2",
                            type === t 
                              ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20" 
                              : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-rose-500/50"
                          )}
                        >
                          <AlertCircle className="w-4 h-4" />
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Type</label>
                      <select 
                        value={targetType}
                        onChange={(e) => setTargetType(e.target.value as 'Track' | 'User')}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all appearance-none"
                      >
                        <option value="Track">Track</option>
                        <option value="User">User / Artist</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Target Name</label>
                      <input 
                        type="text"
                        required
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder={targetType === 'Track' ? "Track Title" : "Artist Name"}
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Description</label>
                    <textarea 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide details about the issue..."
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-rose-500 transition-all min-h-[120px] resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Secure Admin Communication</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
