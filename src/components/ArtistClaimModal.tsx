import React, { useState, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Camera, 
  Music,
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  ShieldAlert,
  Smartphone,
  Upload,
  Check
} from 'lucide-react';
import { cn } from '../lib/utils';

interface ArtistClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
}

export default function ArtistClaimModal({ isOpen, onClose, onComplete }: ArtistClaimModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  const [formData, setFormData] = useState({
    legalName: '',
    artistName: '',
    email: '',
    phone: '',
    idType: 'Ghana Card',
    idFile: null as File | null,
    selfieFile: null as File | null,
  });

  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const idInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      // Simulate final submission
      setTimeout(() => {
        setIsLoading(false);
        onComplete(formData);
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'id') {
          setFormData({ ...formData, idFile: file });
          setIdPreview(event.target?.result as string);
        } else {
          setFormData({ ...formData, selfieFile: file });
          setSelfiePreview(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyCode = () => {
    setIsVerifyingCode(true);
    setTimeout(() => {
      setIsVerifyingCode(false);
      handleNext();
    }, 1500);
  };

  const steps = [
    { id: 1, title: 'Identity', icon: <User className="w-4 h-4" /> },
    { id: 2, title: 'Contact', icon: <Smartphone className="w-4 h-4" /> },
    { id: 3, title: 'ID Upload', icon: <CreditCard className="w-4 h-4" /> },
    { id: 4, title: 'Selfie', icon: <Camera className="w-4 h-4" /> },
    { id: 5, title: 'Claim', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-purple/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-brand-purple" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">Official Artist Claim</h2>
              <p className="text-xs text-zinc-500 font-medium tracking-tight">Verify your identity to unlock creator tools</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-brand-purple -translate-y-1/2 z-0 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((s) => (
              <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  step >= s.id 
                    ? "bg-brand-purple border-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                )}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Basic Information</h3>
                  <p className="text-sm text-zinc-500">Please provide your legal and professional names.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Legal Name (As on ID)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.legalName}
                        onChange={(e) => setFormData({...formData, legalName: e.target.value})}
                        placeholder="e.g. John Kwesi Mensah"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Artist / Stage Name</label>
                    <div className="relative">
                      <Music className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text" 
                        value={formData.artistName}
                        onChange={(e) => setFormData({...formData, artistName: e.target.value})}
                        placeholder="e.g. King Kwesi"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Contact Verification</h3>
                  <p className="text-sm text-zinc-500">We need to verify your email and phone number.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="artist@example.com"
                        className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+233 XX XXX XXXX"
                          className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl pl-12 pr-6 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                        />
                      </div>
                      <button className="px-6 bg-brand-purple/10 text-brand-purple rounded-2xl font-bold text-xs hover:bg-brand-purple/20 transition-colors">
                        Send Code
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Verification Code</label>
                    <input 
                      type="text" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Identity Document</h3>
                  <p className="text-sm text-zinc-500">Upload a clear photo of your Passport or Ghana Card.</p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {['Ghana Card', 'Passport'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({...formData, idType: type})}
                        className={cn(
                          "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                          formData.idType === type 
                            ? "bg-brand-purple/5 border-brand-purple text-brand-purple" 
                            : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-500"
                        )}
                      >
                        <CreditCard className="w-6 h-6" />
                        <span className="text-xs font-bold uppercase tracking-widest">{type}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div 
                    onClick={() => idInputRef.current?.click()}
                    className={cn(
                      "aspect-video border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer group relative overflow-hidden",
                      idPreview ? "border-brand-purple" : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 hover:border-brand-purple"
                    )}
                  >
                    {idPreview ? (
                      <img src={idPreview} alt="ID Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-zinc-400 group-hover:text-brand-purple transition-colors mb-2" />
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Upload {formData.idType}</p>
                        <p className="text-xs text-zinc-500 mt-1">Front side, clear and readable</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={idInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileChange(e, 'id')} 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Selfie Verification</h3>
                  <p className="text-sm text-zinc-500">Take a selfie to match with your ID document.</p>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div 
                    onClick={() => selfieInputRef.current?.click()}
                    className={cn(
                      "w-48 h-48 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer group relative overflow-hidden",
                      selfiePreview ? "border-brand-purple" : "bg-zinc-50 dark:bg-black border-zinc-200 dark:border-zinc-800 hover:border-brand-purple"
                    )}
                  >
                    {selfiePreview ? (
                      <img src={selfiePreview} alt="Selfie Preview" className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-10 h-10 text-zinc-400 group-hover:text-brand-purple transition-colors mb-2" />
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">Take Selfie</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={selfieInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      capture="user"
                      onChange={(e) => handleFileChange(e, 'selfie')} 
                    />
                  </div>
                  <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex gap-3 max-w-sm">
                    <ShieldAlert className="w-5 h-5 text-brand-purple shrink-0" />
                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      Make sure your face is clearly visible, well-lit, and matches the photo on your ID document.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Claim Artist Profile</h3>
                  <p className="text-sm text-zinc-500">Final review before submitting your claim.</p>
                </div>
                <div className="bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-purple/20 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 shadow-lg">
                      {selfiePreview ? (
                        <img src={selfiePreview} alt="Artist" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-brand-purple" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-zinc-900 dark:text-white">{formData.artistName || 'Artist Name'}</p>
                      <p className="text-xs text-zinc-500">{formData.legalName || 'Legal Name'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact</p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{formData.email}</p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ID Type</p>
                      <p className="text-xs text-zinc-700 dark:text-zinc-300">{formData.idType}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-[10px] text-emerald-500 leading-relaxed font-medium">
                    By claiming this profile, you unlock music uploads, monetization, and advanced creator tools.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
          <button 
            onClick={handleBack}
            className={cn(
              "px-6 py-3 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors",
              step === 1 && "invisible"
            )}
          >
            Back
          </button>
          
          {step === 2 && verificationCode.length === 6 ? (
            <button 
              onClick={verifyCode}
              disabled={isVerifyingCode}
              className="px-10 py-4 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-purple/20 flex items-center gap-3"
            >
              {isVerifyingCode ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify & Continue <ArrowRight className="w-5 h-5" /></>}
            </button>
          ) : (
            <button 
              onClick={handleNext}
              disabled={
                isLoading ||
                (step === 1 && (!formData.legalName || !formData.artistName)) ||
                (step === 2 && (!formData.email || !formData.phone)) ||
                (step === 3 && !formData.idFile) ||
                (step === 4 && !formData.selfieFile)
              }
              className="px-10 py-4 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-purple/20 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 5 ? 'Claim Profile' : 'Continue'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
