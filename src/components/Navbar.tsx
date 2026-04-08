import React, { useState, useRef, useEffect } from 'react';
import { Bell, Settings, LogOut, User, ChevronDown, Search, Sun, Moon, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  setActiveTab: (tab: string) => void;
  userRole: 'user' | 'admin';
  onMenuClick?: () => void;
}

export default function Navbar({ setActiveTab, userRole, onMenuClick }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'New Stream Milestone', message: 'Your track "City Lights" reached 50k streams!', time: '2h ago', read: false },
    { id: 2, title: 'Payout Processed', message: 'Your monthly revenue of $1,240.50 has been sent.', time: '5h ago', read: true },
    { id: 3, title: 'Release Approved', message: 'Your album "Midnight Echoes" is now live on all stores.', time: '1d ago', read: true },
  ];

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-xl relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-brand-purple transition-colors" />
          <input 
            type="text" 
            placeholder="Search for tracks, artists, or analytics..." 
            className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-purple rounded-full border-2 border-white dark:border-zinc-950" />
            )}
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                  <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
                  <button className="text-xs text-brand-purple hover:text-brand-purple/80 font-medium">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn(
                      "p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer",
                      !n.read && "bg-brand-purple/5"
                    )}>
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{n.title}</p>
                        <span className="text-[10px] text-zinc-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-zinc-200 dark:border-zinc-800">
                  <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 pl-3 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-full hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
          >
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-xs font-bold text-zinc-900 dark:text-white leading-none">
                {userRole === 'admin' ? 'Admin User' : 'Alex Rivers'}
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">
                {userRole === 'admin' ? 'Platform Admin' : 'Pro Artist'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 overflow-hidden ring-2 ring-transparent group-hover:ring-brand-purple/20 transition-all">
              <img 
                src={userRole === 'admin' ? "https://picsum.photos/seed/admin/100/100" : "https://picsum.photos/seed/artist/100/100"} 
                alt="Profile" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform duration-200", isProfileOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
              >
                <button 
                  onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('settings'); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-500/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
