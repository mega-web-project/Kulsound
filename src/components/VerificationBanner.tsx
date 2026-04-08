import React from 'react';
import { ShieldAlert, CreditCard, Camera, Smartphone, ArrowRight, Clock, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface VerificationBannerProps {
  status: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  onStartVerification: () => void;
  rejectionReason?: string;
}

export default function VerificationBanner({ status, onStartVerification, rejectionReason }: VerificationBannerProps) {
  if (status === 'Verified') return null;

  const isPending = status === 'Pending';
  const isRejected = status === 'Rejected';

  return (
    <div className={cn(
      "relative overflow-hidden border rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-700 animate-in slide-in-from-top-4",
      isPending ? "bg-amber-500/5 border-amber-500/20 shadow-amber-500/5" :
      isRejected ? "bg-rose-500/5 border-rose-500/20 shadow-rose-500/5" :
      "bg-white dark:bg-zinc-900 border-brand-purple/20 dark:border-brand-purple/30 shadow-brand-purple/10"
    )}>
      {/* Background Accents */}
      <div className={cn(
        "absolute top-0 right-0 w-64 h-64 blur-3xl -mr-32 -mt-32 rounded-full",
        isPending ? "bg-amber-500/10" : isRejected ? "bg-rose-500/10" : "bg-brand-purple/5"
      )} />
      
      <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className={cn(
          "w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-inner",
          isPending ? "bg-amber-500/10" : isRejected ? "bg-rose-500/10" : "bg-brand-purple/10"
        )}>
          {isPending ? <Clock className="w-10 h-10 text-amber-500" /> :
           isRejected ? <XCircle className="w-10 h-10 text-rose-500" /> :
           <ShieldAlert className="w-10 h-10 text-brand-purple" />}
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-2">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            {isPending ? "Verification in Progress" :
             isRejected ? "Verification Rejected" :
             "Verify Your Artist Identity"}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed">
            {isPending ? "Our team is currently reviewing your identity documents. This usually takes 24-48 hours. We'll notify you once the process is complete." :
             isRejected ? (
               <>
                 Your artist claim was not approved. <span className="text-rose-500 font-bold">Reason: {rejectionReason || "Identity documents were unclear or mismatched."}</span> Please update your information and try again.
               </>
             ) :
             "To unlock music uploads, access monetization, and use advanced creator tools, you must complete the Official Artist Claim process."}
          </p>
          
          {!isPending && !isRejected && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ID Verification</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Camera className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Selfie Match</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Contact Sync</span>
              </div>
            </div>
          )}
        </div>
        
        {!isPending && (
          <button 
            onClick={onStartVerification}
            className={cn(
              "w-full md:w-auto px-10 py-5 text-white rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3",
              isRejected ? "bg-rose-500 shadow-rose-500/20" : "bg-brand-gradient shadow-brand-purple/20"
            )}
          >
            {isRejected ? (
              <>
                <RefreshCw className="w-5 h-5" />
                Try Again
              </>
            ) : (
              <>
                Start Verification
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
