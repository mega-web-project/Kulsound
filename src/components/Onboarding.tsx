import React, { useState, useRef } from 'react';
import { 
  Music, 
  User, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Camera,
  Loader2,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    accountType: '' as 'artist' | 'label' | '',
    artistName: '',
    genre: '',
    country: '',
    profileImage: null as string | null,
    termsAccepted: false,
    marketingAccepted: false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // Simulate saving profile
      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 2000);
    }
  };

  const steps = [
    { id: 1, title: 'Account Type', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 2, title: 'Identity', icon: <User className="w-5 h-5" /> },
    { id: 3, title: 'Profile Setup', icon: <Camera className="w-5 h-5" /> },
    { id: 4, title: 'Legal & Terms', icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 text-zinc-600" /> : <Sun className="w-5 h-5 text-zinc-400" />}
        </button>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-purple/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl space-y-12 relative z-10">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between px-8">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                  step >= s.id ? "bg-brand-purple border-brand-purple shadow-lg shadow-brand-purple/20" : "bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500"
                )}>
                  {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                </div>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  step >= s.id ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-600"
                )}>
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-4 rounded-full transition-all duration-500",
                  step > s.id ? "bg-brand-purple" : "bg-zinc-200 dark:bg-zinc-800"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 p-10 rounded-[40px] backdrop-blur-xl shadow-2xl min-h-[450px] flex flex-col transition-colors">
          <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">Who are you?</h2>
                  <p className="text-zinc-500 font-medium">Select the account type that best describes your role.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setFormData({...formData, accountType: 'artist'})}
                    className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-4 text-center group relative overflow-hidden",
                      formData.accountType === 'artist' 
                        ? "bg-brand-purple/10 border-brand-purple shadow-xl shadow-brand-purple/10" 
                        : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-white/10 hover:border-brand-purple/50"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110",
                      formData.accountType === 'artist' ? "bg-brand-purple text-white" : "bg-zinc-100 dark:bg-zinc-900"
                    )}>
                      🎤
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">I am an Artist</h3>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">I create and perform my own music.</p>
                    </div>
                    {formData.accountType === 'artist' && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-brand-purple" />
                      </div>
                    )}
                  </button>

                  <button 
                    onClick={() => setFormData({...formData, accountType: 'label'})}
                    className={cn(
                      "p-8 rounded-[32px] border-2 transition-all duration-300 flex flex-col items-center gap-4 text-center group relative overflow-hidden",
                      formData.accountType === 'label' 
                        ? "bg-brand-purple/10 border-brand-purple shadow-xl shadow-brand-purple/10" 
                        : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-white/10 hover:border-brand-purple/50"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110",
                      formData.accountType === 'label' ? "bg-brand-purple text-white" : "bg-zinc-100 dark:bg-zinc-900"
                    )}>
                      🏢
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">I represent an Artist</h3>
                      <p className="text-xs text-zinc-500 mt-1 font-medium">Manager, Label, or Representative.</p>
                    </div>
                    {formData.accountType === 'label' && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-6 h-6 text-brand-purple" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">
                    {formData.accountType === 'artist' ? 'Tell us who you are.' : 'Entity Information.'}
                  </h2>
                  <p className="text-zinc-500 font-medium">
                    {formData.accountType === 'artist' 
                      ? 'This is how your fans will find you across all platforms.' 
                      : 'Provide the name of the label or management group.'}
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                      {formData.accountType === 'artist' ? 'Artist Name' : 'Label / Management Name'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.artistName}
                      onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                      placeholder={formData.accountType === 'artist' ? "e.g. Neon Pulse" : "e.g. Pulse Records"}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Primary Genre</label>
                    <select 
                      value={formData.genre}
                      onChange={(e) => setFormData({...formData, genre: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all appearance-none"
                    >
                      <option value="">Select Genre</option>
                      <option value="electronic">Electronic</option>
                      <option value="pop">Pop</option>
                      <option value="hiphop">Hip Hop</option>
                      <option value="rock">Rock</option>
                      <option value="lofi">Lo-Fi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">Visual Identity.</h2>
                  <p className="text-zinc-500 font-medium">Upload your profile picture for your artist page.</p>
                </div>
                
                <div className="flex flex-col items-center gap-8">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-40 h-40 bg-zinc-50 dark:bg-zinc-950 border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-full flex flex-col items-center justify-center gap-2 group hover:border-brand-purple transition-colors cursor-pointer relative overflow-hidden"
                  >
                    {formData.profileImage ? (
                      <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-zinc-400 dark:text-zinc-700 group-hover:text-brand-purple transition-colors" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-700 group-hover:text-brand-purple transition-colors">Upload Photo</span>
                      </>
                    )}
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                  
                  <div className="w-full space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Base Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" 
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        placeholder="e.g. United States"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">The Fine Print.</h2>
                  <p className="text-zinc-500 font-medium">Last step before you take over the world.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-3xl space-y-4 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          id="terms"
                          checked={formData.termsAccepted}
                          onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                          className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border-zinc-300 dark:border-white/10 text-brand-purple focus:ring-brand-purple/20 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="terms" className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed cursor-pointer">
                        I agree to the <span className="text-zinc-900 dark:text-white font-bold underline">Terms of Service</span> and <span className="text-zinc-900 dark:text-white font-bold underline">Privacy Policy</span>. I confirm that I own the rights to all music I distribute.
                      </label>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="pt-1">
                        <input 
                          type="checkbox" 
                          id="marketing"
                          checked={formData.marketingAccepted}
                          onChange={(e) => setFormData({...formData, marketingAccepted: e.target.checked})}
                          className="w-5 h-5 rounded bg-white dark:bg-zinc-900 border-zinc-300 dark:border-white/10 text-brand-purple focus:ring-brand-purple/20 cursor-pointer"
                        />
                      </div>
                      <label htmlFor="marketing" className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed cursor-pointer">
                        Send me marketing tips, industry news, and platform updates. (Optional)
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl flex gap-4">
                    <ShieldCheck className="w-6 h-6 text-brand-purple flex-shrink-0" />
                    <p className="text-xs text-brand-purple/70 leading-relaxed">
                      Your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-zinc-100 dark:border-white/5">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1 || isLoading}
              className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors disabled:opacity-0"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              disabled={
                isLoading || 
                (step === 1 && !formData.accountType) ||
                (step === 2 && !formData.artistName) || 
                (step === 4 && !formData.termsAccepted)
              }
              className="px-10 py-4 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-purple/20 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 4 ? 'Complete Setup' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
