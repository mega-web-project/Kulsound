import React, { useState } from 'react';
import { 
  Music, 
  Globe, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight,
  Play,
  CheckCircle2,
  DollarSign,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: (mode?: 'login' | 'signup') => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-gradient rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Music className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">KulSound</span>
              <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 ml-1">...the creator galaxy</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#why-us" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Why KulSound</a>
            <a href="#earnings" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Earnings</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5 text-zinc-600" /> : <Sun className="w-5 h-5 text-zinc-400" />}
            </button>
            <button 
              onClick={() => onGetStarted('login')}
              className="hidden sm:block px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:bg-brand-purple dark:hover:bg-brand-purple hover:text-white transition-all active:scale-95"
            >
              Login
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-zinc-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-black border-b border-zinc-200 dark:border-white/10 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                <a 
                  href="#features" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tighter"
                >
                  Features
                </a>
                <a 
                  href="#why-us" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tighter"
                >
                  Why KulSound
                </a>
                <a 
                  href="#earnings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tighter"
                >
                  Earnings
                </a>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onGetStarted('signup');
                  }}
                  className="w-full py-4 bg-brand-gradient text-white rounded-2xl font-black text-lg uppercase tracking-tight shadow-xl shadow-brand-purple/20"
                >
                  Login / Join Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-orange/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs font-bold uppercase tracking-widest text-brand-pink">
              <Zap className="w-3 h-3 fill-brand-pink" />
              Next-Gen Music Distribution
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic text-zinc-900 dark:text-white">
              Distribute <br />
              <span className="bg-brand-gradient bg-clip-text text-transparent">Your Sound</span> <br />
              Globally.
            </h1>

            <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              KulSound is the ultimate platform for independent artists. Upload for free, reach 150+ stores, and keep 100% of your streaming royalties.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button 
                onClick={() => onGetStarted('signup')}
                className="w-full sm:w-auto px-10 py-5 bg-brand-gradient text-white rounded-full font-black text-lg uppercase tracking-tight hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-brand-purple/40 flex items-center justify-center gap-3"
              >
                Get Started Now
                <ArrowRight className="w-6 h-6" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-full font-black text-lg uppercase tracking-tight hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 border border-zinc-200 dark:border-white/10">
                <Play className="w-5 h-5 fill-zinc-900 dark:fill-white" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Floating Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-32 border-t border-zinc-200 dark:border-white/10 pt-12">
            {[
              { label: 'Active Artists', value: '50K+' },
              { label: 'Stores Covered', value: '150+' },
              { label: 'Paid to Artists', value: '$12M+' },
              { label: 'Daily Streams', value: '5M+' },
            ].map((stat, i) => (
              <div key={i} className="text-center md:text-left">
                <p className="text-4xl font-black text-zinc-900 dark:text-white italic tracking-tighter">{stat.value}</p>
                <p className="text-xs uppercase font-bold text-zinc-500 tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-purple">The Process</h2>
            <h3 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">Simple. <span className="text-zinc-500 dark:text-zinc-400">Powerful.</span> Fast.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                title: 'Free Uploads',
                desc: 'Upload your high-quality audio files, cover art, and metadata for free using our intuitive interface.'
              },
              {
                step: '02',
                title: 'We Distribute',
                desc: 'Our team reviews your release and sends it to Spotify, Apple Music, TikTok, and 150+ other stores.'
              },
              {
                step: '03',
                title: 'Get Paid via MoMo',
                desc: 'Track your earnings in real-time and withdraw your royalties directly via Mobile Money (MoMo) or Bank.'
              }
            ].map((item, i) => (
              <div key={i} className="relative p-10 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-[40px] hover:border-brand-purple/30 transition-all group">
                <div className="text-7xl font-black text-zinc-200 dark:text-white/5 absolute top-6 right-10 group-hover:text-brand-purple/10 transition-colors uppercase italic">{item.step}</div>
                <div className="space-y-4 relative z-10">
                  <h4 className="text-2xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">{item.title}</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Upload Section */}
      <section id="why-us" className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-pink">The Artist Advantage</h2>
                <h3 className="text-5xl md:text-6xl font-black tracking-tighter leading-none uppercase italic text-zinc-900 dark:text-white">
                  Why you should <br />
                  <span className="text-zinc-500 dark:text-zinc-400">upload with us.</span>
                </h3>
              </div>

              <div className="space-y-8">
                {[
                  {
                    title: "Free Unlimited Uploads",
                    desc: "No hidden fees. Upload as much music as you want for free and keep 100% of your royalties.",
                    icon: <Music className="w-6 h-6 text-brand-purple" />
                  },
                  {
                    title: "Easy MoMo Withdrawals",
                    desc: "Withdraw your earnings directly to your Mobile Money (MoMo) wallet or bank account instantly.",
                    icon: <DollarSign className="w-6 h-6 text-brand-purple" />
                  },
                  {
                    title: "Global Reach in 48 Hours",
                    desc: "Get your music on Spotify, Apple Music, TikTok, and 150+ other platforms in record time.",
                    icon: <Globe className="w-6 h-6 text-brand-purple" />
                  },
                  {
                    title: "Advanced Analytics",
                    desc: "Understand your audience with deep insights into who is listening and where they are from.",
                    icon: <Zap className="w-6 h-6 text-brand-purple" />
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-white/5 group-hover:border-brand-purple/50 transition-colors">
                      {item.icon}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tight">{item.title}</h4>
                      <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-brand-gradient rounded-[40px] rotate-3 overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/music-studio/800/800" 
                  alt="Artist in studio" 
                  className="w-full h-full object-cover mix-blend-overlay opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <Play className="w-10 h-10 text-black fill-black ml-1" />
                  </div>
                </div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-10 -left-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-6 rounded-3xl shadow-2xl max-w-[280px] hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Payout Status</p>
                    <p className="text-lg font-black text-zinc-900 dark:text-white italic tracking-tighter">Verified</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  "KulSound changed my career. I went from 0 to 1M streams in 6 months."
                </p>
                <p className="text-xs font-bold text-brand-purple mt-4 uppercase tracking-widest">— Alex Rivera, Indie Artist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free & Earnings Section */}
      <section id="earnings" className="py-32 px-6 bg-white dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-purple">Zero Cost. Maximum Gain.</h2>
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-zinc-900 dark:text-white">
                  It's 100% <br />
                  <span className="bg-brand-gradient bg-clip-text text-transparent">Free to Use.</span>
                </h3>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
                We believe every artist deserves a chance to be heard without financial barriers. That's why KulSound is completely free to use. No subscription fees, no hidden charges, no bullshit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white uppercase italic mb-2">Unlimited Uploads</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Release as many tracks, EPs, and albums as you want at zero cost.</p>
                </div>
                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 rounded-3xl">
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white uppercase italic mb-2">Zero Commission</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">We don't take a percentage of your streaming revenue. It's all yours.</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 p-12 rounded-[60px] space-y-8 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-3xl rounded-full" />
              <div className="space-y-4">
                <TrendingUp className="w-12 h-12 text-brand-purple" />
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase italic tracking-tight">Gain from Every Stream</h3>
                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Every time your music is played on Spotify, Apple Music, or TikTok, you earn royalties. We collect these earnings from 150+ stores and deposit them directly into your KulSound account.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  'Monthly Payouts via MoMo',
                  'Real-time Streaming Analytics',
                  '100% Ownership of Your Your Masters',
                  'Direct Store Payouts'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-900 dark:text-white font-bold uppercase italic text-sm tracking-tight">
                    <CheckCircle2 className="w-5 h-5 text-brand-purple" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-brand-gradient rounded-[60px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-brand-purple/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-white">
            Ready to start <br />
            earning for free?
          </h2>
          <p className="text-white/70 text-lg md:text-xl font-bold max-w-xl mx-auto">
            Join thousands of artists who trust KulSound for their music distribution. No fees, no cuts, just your music.
          </p>
          <button 
            onClick={() => onGetStarted('signup')}
            className="px-12 py-6 bg-white text-black rounded-full font-black text-xl uppercase tracking-tight hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-200 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-gradient rounded-lg flex items-center justify-center">
                <Music className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white">KulSound</span>
                <span className="text-[6px] font-bold uppercase tracking-widest text-zinc-500 ml-1">...the creator galaxy</span>
              </div>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Empowering independent artists with the tools they need to succeed in the digital age.
            </p>
          </div>
          
          {[
            { title: 'Product', links: ['Distribution', 'Analytics', 'Marketing', 'Free Plan'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map((col, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-zinc-500 dark:text-zinc-400 text-sm hover:text-brand-purple transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 dark:text-zinc-500 text-xs uppercase font-bold tracking-widest">© 2026 KulSound Music. All rights reserved.</p>
          <div className="flex gap-6">
            {['Twitter', 'Instagram', 'Spotify', 'YouTube'].map((social, i) => (
              <a key={i} href="#" className="text-zinc-600 dark:text-zinc-500 text-xs uppercase font-bold tracking-widest hover:text-zinc-900 dark:hover:text-white transition-colors">{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
