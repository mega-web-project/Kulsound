import React, { useState } from 'react';
import { 
  Music, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  Sun,
  Moon,
  Eye,
  EyeOff,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

import { AdminRoleType } from '../lib/permissions';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface AuthPageProps {
  initialView?: 'login' | 'signup';
  onAuthComplete: (isNewUser: boolean, role: 'user' | 'admin', adminRole?: AdminRoleType) => void;
  onBack: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot-password' | 'otp-verification' | 'new-password' | 'signup-otp';

export default function AuthPage({ initialView = 'login', onAuthComplete, onBack }: AuthPageProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('signup-otp');
      }, 1500);
      return;
    }

    if (view === 'signup-otp') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onAuthComplete(true, 'user');
      }, 1500);
      return;
    }

    if (view === 'forgot-password') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('otp-verification');
      }, 1500);
      return;
    }

    if (view === 'otp-verification') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setView('new-password');
      }, 1500);
      return;
    }

    if (view === 'new-password') {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Password reset successfully!");
        setView('login');
      }, 1500);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo purposes, we still infer role from email
      // admin@kulsound.com -> admin
      // super@kulsound.com -> super_admin
      const isLogin = view === 'login';
      const role = formData.email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const adminRole = role === 'admin' ? (formData.email.toLowerCase().includes('super') ? 'super_admin' : 'admin') : undefined;
      onAuthComplete(!isLogin, role, adminRole); 
    }, 1500);
  };

  const titles = {
    login: 'Welcome Back',
    signup: 'Join the Movement',
    'forgot-password': 'Reset Password',
    'otp-verification': 'Verify OTP',
    'new-password': 'New Password',
    'signup-otp': 'Verify Email'
  };

  const subtitles = {
    login: 'Enter your credentials to access your dashboard',
    signup: 'Start your global distribution journey today',
    'forgot-password': 'Enter your email to receive a reset code',
    'otp-verification': `We've sent a 6-digit code to ${formData.email}`,
    'new-password': 'Create a strong new password for your account',
    'signup-otp': `Enter the 6-digit code sent to ${formData.email}`
  };

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

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 group mb-4"
          >
            <div className="w-12 h-12 bg-brand-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-brand-purple/20 group-hover:scale-110 transition-transform">
              <Music className="text-white w-7 h-7" />
            </div>
          </button>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">
            {titles[view]}
          </h1>
          <p className="text-zinc-500 text-sm font-medium">
            {subtitles[view]}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-2xl transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6">
            {(view === 'login' || view === 'signup' || view === 'forgot-password') && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="email" 
                    required
                    disabled={view === 'otp-verification' || view === 'signup-otp'}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700 disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {(view === 'otp-verification' || view === 'signup-otp') && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl focus:border-brand-purple focus:outline-none transition-all"
                    />
                  ))}
                </div>
                <div className="text-center">
                  <button type="button" className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 uppercase tracking-widest">
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {(view === 'login' || view === 'signup' || view === 'new-password') && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  {view === 'new-password' ? 'New Password' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {(view === 'signup' || view === 'new-password') && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-700"
                  />
                </div>
              </div>
            )}

            {view === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setView('forgot-password')}
                  className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 uppercase tracking-widest"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-black uppercase tracking-tight hover:opacity-90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-purple/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {view === 'login' ? 'Sign In' : 
                   view === 'signup' ? 'Create Account' : 
                   view === 'forgot-password' ? 'Send Reset Code' :
                   (view === 'otp-verification' || view === 'signup-otp') ? 'Verify Code' :
                   'Update Password'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {(view === 'login' || view === 'signup') && (
            <div className="mt-8 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-100 dark:border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase font-bold tracking-[0.2em] text-zinc-600">
                  <span className="bg-white dark:bg-zinc-900 px-4 transition-colors">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button className="flex items-center justify-center gap-3 py-3 bg-zinc-50 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-900 dark:text-white">
                  <GoogleIcon />
                  <span className="text-sm font-bold">Google</span>
                </button>
              </div>
            </div>
          )}

          {(view === 'forgot-password' || view === 'otp-verification' || view === 'new-password' || view === 'signup-otp') && (
            <div className="mt-6">
              <button 
                onClick={() => setView('login')}
                className="flex items-center justify-center gap-2 w-full py-3 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-bold"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          )}
        </div>

        {/* Toggle Auth Mode */}
        {(view === 'login' || view === 'signup') && (
          <p className="text-center text-zinc-500 text-sm font-medium">
            {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setView(view === 'login' ? 'signup' : 'login')}
              className="text-brand-purple font-bold hover:text-brand-purple/80 transition-colors"
            >
              {view === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
