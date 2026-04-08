import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Globe, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Save,
  Trash2,
  ExternalLink,
  FileText,
  Smartphone,
  Building2,
  Wallet,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    image: "https://picsum.photos/seed/artist/200/200",
    artistName: "Alex Rivers",
    displayName: "Alex Rivers",
    bio: "Electronic music producer and multi-instrumentalist based in London. Exploring the boundaries of sound and emotion.",
    location: "London, UK",
    website: "https://alexrivers.com"
  });

  // Account State
  const [accountData, setAccountData] = useState({
    email: "alex.rivers@example.com",
    language: "English (US)",
    timezone: "UTC +00:00 (London)"
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications State
  const [notificationPrefs, setNotificationPrefs] = useState({
    releaseUpdates: true,
    streamMilestones: true,
    revenueReports: true,
    securityAlerts: true,
    promotionalOffers: false
  });
  
  const [payoutData, setPayoutData] = useState({
    momo: { number: '+237 670 000 000', name: 'Alex Rivers' },
    bank: { name: '', account: '', holder: '', swift: '' },
    paypal: { email: '' }
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      // Reset success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileData({ ...profileData, image: "" });
  };

  const handleUpdatePassword = () => {
    if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
      alert("Please fill in all password fields.");
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Settings</h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1">Manage your account preferences and distribution settings.</p>
        </div>
        <AnimatePresence>
          {saveSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-bold"
            >
              <CheckCircle2 className="w-4 h-4" />
              Changes Saved Successfully
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <nav className="flex flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  activeSection === section.id 
                    ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/20" 
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                <section.icon className={cn(
                  "w-5 h-5",
                  activeSection === section.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-400"
                )} />
                <span className="font-medium text-sm">{section.label}</span>
                {activeSection === section.id && (
                  <motion.div layoutId="active-indicator" className="ml-auto">
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-8 shadow-xl backdrop-blur-sm">
          {activeSection === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden ring-4 ring-brand-purple/10 group-hover:ring-brand-purple/20 transition-all">
                    {profileData.image ? (
                      <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                        <User className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-brand-gradient text-white rounded-full shadow-lg hover:opacity-90 transition-all active:scale-90 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Profile Photo</h3>
                  <p className="text-sm text-zinc-500 mt-1">Update your artist avatar for store profiles.</p>
                  <div className="flex gap-3 mt-4">
                    <label className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-zinc-700 cursor-pointer">
                      Upload New
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    <button 
                      onClick={handleRemoveImage}
                      className="px-4 py-1.5 text-rose-500 text-xs font-bold hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Artist Name</label>
                  <input 
                    type="text" 
                    value={profileData.artistName}
                    onChange={(e) => setProfileData({ ...profileData, artistName: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Display Name</label>
                  <input 
                    type="text" 
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Bio</label>
                  <textarea 
                    rows={4}
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Website</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      type="text" 
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'account' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">Email Address</p>
                      <p className="text-xs text-zinc-500">{accountData.email}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 transition-colors">Change</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">Account Status</p>
                      <p className="text-xs text-zinc-500">Verified Pro Artist</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded">Active</span>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Language & Region</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                      value={accountData.language}
                      onChange={(e) => setAccountData({ ...accountData, language: e.target.value })}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple"
                    >
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                    <select 
                      value={accountData.timezone}
                      onChange={(e) => setAccountData({ ...accountData, timezone: e.target.value })}
                      className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple"
                    >
                      <option>UTC +00:00 (London)</option>
                      <option>UTC -05:00 (New York)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Change Password</h4>
                  <div className="space-y-4">
                    <input 
                      type="password" 
                      placeholder="Current Password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="New Password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleUpdatePassword}
                    className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm font-bold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                  >
                    Update Password
                  </button>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-xs text-zinc-500 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-brand-purple/10 text-brand-purple text-xs font-bold rounded-lg hover:bg-brand-purple/20 transition-all">Enable 2FA</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-sm font-bold text-rose-500">Danger Zone</h4>
                  <p className="text-xs text-zinc-500 mt-1">Permanently delete your account and all distribution data.</p>
                  <button className="mt-4 flex items-center gap-2 px-4 py-2 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                {[
                  { id: 'releaseUpdates', title: 'Release Status Updates', desc: 'Get real-time updates on your distribution status across all 150+ stores.' },
                  { id: 'streamMilestones', title: 'Stream Milestones', desc: 'Celebrate your success! Get notified when you reach major streaming goals.' },
                  { id: 'revenueReports', title: 'Revenue Reports', desc: 'Detailed monthly breakdowns of your earnings, royalties, and payout status.' },
                  { id: 'securityAlerts', title: 'Security Alerts', desc: 'Protect your account. Immediate alerts for new logins or security changes.' },
                  { id: 'promotionalOffers', title: 'Promotional Offers', desc: 'Be the first to know about new features, artist tools, and exclusive deals.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-brand-purple/30 transition-all group">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-brand-purple transition-colors">{item.title}</p>
                      <p className="text-xs text-zinc-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notificationPrefs[item.id as keyof typeof notificationPrefs]} 
                        onChange={(e) => setNotificationPrefs({ ...notificationPrefs, [item.id]: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-12 h-6 bg-zinc-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-purple shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-purple/20 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Withdrawal Settings</h3>
                      <p className="text-sm text-zinc-500">SonicDistro is free for artists. Manage your payout methods below.</p>
                    </div>
                  </div>
                  {editingMethod && (
                    <button 
                      onClick={() => setEditingMethod(null)}
                      className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      Back to Methods
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!editingMethod ? (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-4"
                    >
                      {/* Momo */}
                      <div className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-brand-purple/30 rounded-2xl ring-1 ring-brand-purple/10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-purple/20">
                            <Smartphone className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">Mobile Money (Momo)</p>
                              <span className="px-2 py-0.5 bg-brand-purple/20 text-brand-purple text-[10px] font-black uppercase rounded tracking-tighter">Default</span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-0.5">{payoutData.momo.number} • {payoutData.momo.name}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setEditingMethod('momo')}
                          className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                        >
                          Edit
                        </button>
                      </div>

                      {/* Bank Account */}
                      <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            payoutData.bank.account ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                          )}>
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-brand-purple transition-colors">Bank Account</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {payoutData.bank.account ? `${payoutData.bank.name} • ${payoutData.bank.account}` : 'Connect your local bank for direct deposits.'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setEditingMethod('bank')}
                          className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                        >
                          {payoutData.bank.account ? <ChevronRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* PayPal */}
                      <div className="flex items-center justify-between p-5 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl group hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                            payoutData.paypal.email ? "bg-blue-500/10 text-blue-500" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                          )}>
                            <Wallet className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-brand-purple transition-colors">PayPal</p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {payoutData.paypal.email ? payoutData.paypal.email : 'Receive international payments via PayPal.'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setEditingMethod('paypal')}
                          className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                        >
                          {payoutData.paypal.email ? <ChevronRight className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {editingMethod === 'momo' && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-brand-purple" />
                            Edit Mobile Money Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Phone Number</label>
                              <input 
                                type="text" 
                                value={payoutData.momo.number}
                                onChange={(e) => setPayoutData({...payoutData, momo: {...payoutData.momo, number: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Name</label>
                              <input 
                                type="text" 
                                value={payoutData.momo.name}
                                onChange={(e) => setPayoutData({...payoutData, momo: {...payoutData.momo, name: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {editingMethod === 'bank' && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-brand-purple" />
                            Bank Account Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Bank Name</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Standard Chartered"
                                value={payoutData.bank.name}
                                onChange={(e) => setPayoutData({...payoutData, bank: {...payoutData.bank, name: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Number / IBAN</label>
                              <input 
                                type="text" 
                                placeholder="Enter account number"
                                value={payoutData.bank.account}
                                onChange={(e) => setPayoutData({...payoutData, bank: {...payoutData.bank, account: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account Holder Name</label>
                              <input 
                                type="text" 
                                placeholder="Full name on account"
                                value={payoutData.bank.holder}
                                onChange={(e) => setPayoutData({...payoutData, bank: {...payoutData.bank, holder: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">SWIFT / BIC Code</label>
                              <input 
                                type="text" 
                                placeholder="Optional"
                                value={payoutData.bank.swift}
                                onChange={(e) => setPayoutData({...payoutData, bank: {...payoutData.bank, swift: e.target.value}})}
                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {editingMethod === 'paypal' && (
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-brand-purple" />
                            PayPal Account
                          </h4>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">PayPal Email Address</label>
                            <input 
                              type="email" 
                              placeholder="email@example.com"
                              value={payoutData.paypal.email}
                              onChange={(e) => setPayoutData({...payoutData, paypal: {...payoutData.paypal, email: e.target.value}})}
                              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                            />
                            <p className="text-[10px] text-zinc-500 italic">Make sure this email is verified on PayPal to receive payments.</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button 
                          onClick={() => setEditingMethod(null)}
                          className="px-6 py-2 bg-brand-gradient text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all"
                        >
                          Confirm Details
                        </button>
                        <button 
                          onClick={() => setEditingMethod(null)}
                          className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Withdrawal History</h4>
                  <button className="text-xs font-bold text-brand-purple hover:underline">View All</button>
                </div>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-700 mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">No withdrawals yet</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1 max-w-[240px]">Your earnings will appear here once you request your first payout.</p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button Footer */}
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-4">
            <button className="px-6 py-2.5 text-sm font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all">Cancel</button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-2.5 bg-brand-gradient text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-purple/20 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Save className="w-4 h-4" />
                  </motion.div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
