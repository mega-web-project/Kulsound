import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Filter,
  Calendar,
  Music,
  Globe,
  Coins,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Phone,
  CreditCard,
  ArrowUpDown,
  ChevronDown,
  LayoutDashboard,
  PieChart as PieChartIcon,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

type Currency = {
  code: string;
  symbol: string;
  rate: number;
};

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'GHS', symbol: 'GH₵', rate: 13.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'NGN', symbol: '₦', rate: 1500 },
];

const monthlyData = [
  { month: 'Oct', revenue: 4200 },
  { month: 'Nov', revenue: 3800 },
  { month: 'Dec', revenue: 5100 },
  { month: 'Jan', revenue: 4800 },
  { month: 'Feb', revenue: 5900 },
  { month: 'Mar', revenue: 6450 },
];

const platformEarnings = [
  { name: 'KulBox', amount: 12450.00, change: '+15.2%', trend: 'up', color: '#C026D3' },
];

const releaseEarnings = [
  { title: 'Midnight Echoes', type: 'Album', earnings: 4250.80, streams: '1.2M', date: 'Mar 2026' },
  { title: 'Neon Dreams', type: 'Single', earnings: 1840.20, streams: '450K', date: 'Feb 2026' },
  { title: 'Lost in Time', type: 'EP', earnings: 2100.45, streams: '620K', date: 'Jan 2026' },
  { title: 'City Lights', type: 'Single', earnings: 840.15, streams: '180K', date: 'Dec 2025' },
  { title: 'Neon Pulse', type: 'Single', earnings: 1420.00, streams: '310K', date: 'Nov 2025' },
];

const genreEarnings = [
  { name: 'Electronic', amount: 5420.00, percentage: 45, color: '#C026D3' },
  { name: 'Pop', amount: 3210.50, percentage: 26, color: '#3B82F6' },
  { name: 'Lo-Fi', amount: 1840.20, percentage: 15, color: '#8b5cf6' },
  { name: 'Ambient', amount: 1210.30, percentage: 10, color: '#06b6d4' },
  { name: 'Other', amount: 769.00, percentage: 4, color: '#71717a' },
];

const genrePerformance = [
  { genre: 'Electronic', earnings: 5420.00, growth: '+12.5%', topTrack: 'Midnight Echoes', color: '#C026D3' },
  { genre: 'Pop', earnings: 3210.50, growth: '+8.2%', topTrack: 'Neon Dreams', color: '#3B82F6' },
  { genre: 'Lo-Fi', earnings: 1840.20, growth: '+5.1%', topTrack: 'Lost in Time', color: '#8b5cf6' },
  { genre: 'Ambient', earnings: 1210.30, growth: '-2.4%', topTrack: 'City Lights', color: '#06b6d4' },
];

const payoutHistory = [
  { id: 'PO-1234', date: 'Mar 15, 2026', amount: 1250.00, method: 'MoMo', status: 'Completed' },
  { id: 'PO-1233', date: 'Feb 28, 2026', amount: 840.50, method: 'Bank', status: 'Completed' },
  { id: 'PO-1232', date: 'Feb 12, 2026', amount: 2100.00, method: 'PayPal', status: 'Completed' },
  { id: 'PO-1231', date: 'Jan 25, 2026', amount: 1500.00, method: 'MoMo', status: 'Completed' },
  { id: 'PO-1230', date: 'Jan 05, 2026', amount: 920.75, method: 'Bank', status: 'Processing' },
];

export default function Revenue() {
  const { theme } = useTheme();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'MoMo' | 'Bank' | 'PayPal'>('MoMo');
  const [payoutAmount, setPayoutAmount] = useState('100');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutStatus, setPayoutStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'payouts'>('overview');
  const [releaseSearch, setReleaseSearch] = useState('');

  // Filter and Sort State
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount'; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });

  const handleSort = (key: 'date' | 'amount') => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const filteredAndSortedPayouts = payoutHistory
    .filter((payout) => {
      const matchesStatus = statusFilter === 'All' || payout.status === statusFilter;
      const matchesMethod = methodFilter === 'All' || payout.method === methodFilter;
      return matchesStatus && matchesMethod;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortConfig.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const filteredReleases = releaseEarnings.filter(release => 
    release.title.toLowerCase().includes(releaseSearch.toLowerCase())
  );
  
  // Mock balance state
  const [totalBalance, setTotalBalance] = useState(12450.00);
  const [pendingPayouts, setPendingPayouts] = useState(3120.45);

  const formatValue = (value: number) => {
    const converted = value * selectedCurrency.rate;
    return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePayoutRequest = () => {
    const amount = parseFloat(payoutAmount);
    if (!payoutDetails || isNaN(amount) || amount <= 0 || amount > totalBalance) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setPayoutStatus('success');
      
      // Update balances
      setTotalBalance(prev => prev - amount);
      setPendingPayouts(prev => prev + amount);
    }, 2000);
  };

  const resetPayout = () => {
    setIsPayoutModalOpen(false);
    setPayoutStatus('idle');
    setIsConfirming(false);
    setPayoutDetails('');
    setPayoutAmount('100');
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {payoutStatus === 'success' ? (
              <div className="p-6 sm:p-8 text-center space-y-6">
                <div className="w-16 h-16 sm:w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 h-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white uppercase italic">Payout Requested!</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Your request for <span className="text-zinc-900 dark:text-white font-bold">{selectedCurrency.symbol}{payoutAmount}</span> via <span className="text-brand-purple font-bold">{payoutMethod}</span> has been received and is being processed.
                  </p>
                </div>
                <button 
                  onClick={resetPayout}
                  className="w-full py-3 sm:py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : isConfirming ? (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tight">Confirm Details</h3>
                  <button onClick={() => setIsConfirming(false)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</span>
                    <span className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white italic tracking-tighter">{selectedCurrency.symbol}{payoutAmount}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Method</span>
                    <span className="text-xs sm:text-sm font-bold text-brand-purple uppercase italic">{payoutMethod}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account</span>
                    <span className="text-xs sm:text-sm font-mono text-zinc-900 dark:text-white break-all text-right">{payoutDetails}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsConfirming(false)}
                    className="flex-1 py-3 sm:py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-2xl font-bold hover:text-zinc-900 dark:hover:text-white transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handlePayoutRequest}
                    disabled={isProcessing}
                    className="flex-[2] py-3 sm:py-4 bg-brand-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Confirm Payout'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white uppercase italic tracking-tight">Request Payout</h3>
                  <button onClick={resetPayout} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Select Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'MoMo', icon: <Phone className="w-4 h-4" />, label: 'MoMo' },
                        { id: 'Bank', icon: <CreditCard className="w-4 h-4" />, label: 'Bank' },
                        { id: 'PayPal', icon: <DollarSign className="w-4 h-4" />, label: 'PayPal' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPayoutMethod(method.id as any)}
                          className={cn(
                            "flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border transition-all",
                            payoutMethod === method.id 
                              ? "bg-brand-purple/10 border-brand-purple text-brand-purple" 
                              : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700"
                          )}
                        >
                          {method.icon}
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {payoutMethod === 'MoMo' ? 'Phone Number' : payoutMethod === 'Bank' ? 'Account Number' : 'Email Address'}
                    </label>
                    <input 
                      type="text"
                      placeholder={payoutMethod === 'MoMo' ? 'e.g. 0244123456' : payoutMethod === 'Bank' ? 'e.g. 1234567890' : 'e.g. artist@example.com'}
                      value={payoutDetails}
                      onChange={(e) => setPayoutDetails(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount ({selectedCurrency.code})</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{selectedCurrency.symbol}</span>
                      <input 
                        type="number"
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand-purple transition-all font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500">Available: {formatValue(totalBalance)}</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-2xl flex gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 h-5 text-brand-purple flex-shrink-0" />
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed">
                    Payouts are processed instantly for MoMo and PayPal. Bank transfers may take 1-3 business days.
                  </p>
                </div>

                <button 
                  onClick={() => setIsConfirming(true)}
                  disabled={isProcessing || !payoutDetails || !payoutAmount}
                  className="w-full py-3 sm:py-4 bg-brand-gradient text-white rounded-2xl font-bold hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-brand-purple/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  Review Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Revenue & Payouts</h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1">Track your earnings across all platforms and manage your finances.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 flex-1 sm:flex-none">
            <Coins className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <select 
              value={selectedCurrency.code}
              onChange={(e) => {
                const currency = currencies.find(c => c.code === e.target.value);
                if (currency) setSelectedCurrency(currency);
              }}
              className="bg-transparent text-zinc-600 dark:text-zinc-300 text-sm border-none focus:ring-0 cursor-pointer outline-none w-full"
            >
              {currencies.map(c => (
                <option key={c.code} value={c.code} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex-1 sm:flex-none text-sm">
            <Download className="w-4 h-4" />
            Statement
          </button>
          <button 
            onClick={() => setIsPayoutModalOpen(true)}
            className="px-4 py-2 bg-brand-gradient text-white rounded-lg font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-brand-purple/20 flex-1 sm:flex-none text-sm"
          >
            Request Payout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Total Balance</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{formatValue(totalBalance)}</h3>
          <div className="flex items-center gap-2 mt-4 text-emerald-600 dark:text-emerald-500 text-sm font-medium">
            <ArrowUpRight className="w-4 h-4" />
            <span>+{formatValue(1240.50)} this month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Pending Payouts</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{formatValue(pendingPayouts)}</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4">Next payout scheduled for Apr 15</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">Lifetime Earnings</p>
          <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">{formatValue(84200.00)}</h3>
          <div className="flex items-center gap-2 mt-4 text-zinc-500 dark:text-zinc-400 text-sm">
            <Globe className="w-4 h-4" />
            <span>Across 150+ stores</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'earnings', label: 'Earnings Breakdown', icon: PieChartIcon },
          { id: 'payouts', label: 'Payouts & History', icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative",
              activeTab === tab.id 
                ? "text-zinc-900 dark:text-white" 
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className={cn("w-4 h-4 relative z-10", activeTab === tab.id ? "text-brand-purple" : "")} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Monthly Revenue Trend</h3>
                    <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5">
                      <Calendar className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                      <select className="bg-transparent text-zinc-600 dark:text-zinc-300 text-sm border-none focus:ring-0 cursor-pointer outline-none">
                        <option className="bg-white dark:bg-zinc-900">Last 6 months</option>
                        <option className="bg-white dark:bg-zinc-900">Last 12 months</option>
                        <option className="bg-white dark:bg-zinc-900">All time</option>
                      </select>
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#27272a" : "#e4e4e7"} vertical={false} />
                        <XAxis dataKey="month" stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis 
                          stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                          tickFormatter={(value) => `${selectedCurrency.symbol}${Math.round(value * selectedCurrency.rate).toLocaleString()}`}
                        />
                        <Tooltip 
                          cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5', opacity: 0.4 }}
                          contentStyle={{ 
                            backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                            border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7', 
                            borderRadius: '8px',
                            color: theme === 'dark' ? '#ffffff' : '#18181b'
                          }}
                          itemStyle={{ color: '#C026D3' }}
                          formatter={(value) => [formatValue(Number(value)), 'Revenue']}
                        />
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                          {monthlyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#C026D3' : (theme === 'dark' ? '#27272a' : '#e4e4e7')} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm h-full flex flex-col">
                    <div className="w-12 h-12 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6">
                      <TrendingUp className="w-6 h-6 text-brand-purple" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Revenue Insights</h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed">
                      Based on your current performance, your <span className="text-brand-purple font-bold">Electronic</span> releases are generating the highest ROI. Consider increasing your distribution frequency for this genre.
                    </p>
                    <div className="mt-auto pt-6">
                      <button className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        Full Analysis
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-purple/5 to-transparent border border-brand-purple/10 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0">
                  <Globe className="w-8 h-8 text-brand-purple" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-lg font-bold text-zinc-900 dark:text-white uppercase italic tracking-tight">Global Reach Expanding</h4>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-1">Your music is now being streamed in <span className="text-zinc-900 dark:text-white font-bold">150+ stores</span> across <span className="text-zinc-900 dark:text-white font-bold">84 countries</span>. The US and UK markets show the most growth this month.</p>
                </div>
                <button className="px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-xl font-bold shadow-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  View Heatmap
                </button>
              </div>
            </>
          )}

          {activeTab === 'earnings' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Earnings per Release</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Revenue generated by your top performing releases.</p>
                    </div>
                    <div className="relative">
                      <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input 
                        type="text"
                        placeholder="Search releases..."
                        value={releaseSearch}
                        onChange={(e) => setReleaseSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-brand-purple outline-none w-full sm:w-64 transition-all"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                          <th className="px-6 py-4 font-medium">Release</th>
                          <th className="px-6 py-4 font-medium">Type</th>
                          <th className="px-6 py-4 font-medium">Streams</th>
                          <th className="px-6 py-4 font-medium">Period</th>
                          <th className="px-6 py-4 font-medium text-right">Earnings</th>
                          <th className="px-6 py-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredReleases.length > 0 ? (
                          filteredReleases.map((release, i) => (
                            <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                                    <Music className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                                  </div>
                                  <p className="text-sm font-bold text-zinc-900 dark:text-white">{release.title}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                                  {release.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{release.streams}</td>
                              <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{release.date}</td>
                              <td className="px-6 py-4 text-right">
                                <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatValue(release.earnings)}</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                  <ArrowUpRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                              No releases found matching "{releaseSearch}"
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">By Platform</h3>
                    <div className="space-y-6">
                      {platformEarnings.map((platform) => (
                        <div key={platform.name} className="flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: platform.color }} />
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{platform.name}</p>
                              <div className={cn(
                                "flex items-center text-[10px] font-bold uppercase",
                                platform.trend === 'up' ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
                              )}>
                                {platform.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                                {platform.change}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{formatValue(platform.amount)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">By Genre</h3>
                    <div className="h-[200px] w-full mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={genreEarnings}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="amount"
                            stroke="none"
                          >
                            {genreEarnings.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {genreEarnings.slice(0, 3).map((genre) => (
                        <div key={genre.name} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: genre.color }} />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">{genre.name}</span>
                          </div>
                          <span className="text-xs font-bold text-zinc-900 dark:text-white">{genre.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payouts' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Payout History</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">A record of your past withdrawals.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs rounded-lg px-2 py-1 outline-none"
                      >
                        <option value="All">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Processing">Processing</option>
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                          <th className="px-6 py-4 font-medium">Transaction ID</th>
                          <th 
                            className="px-6 py-4 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors"
                            onClick={() => handleSort('date')}
                          >
                            <div className="flex items-center gap-1">
                              Date
                              <ArrowUpDown className={cn("w-3 h-3", sortConfig.key === 'date' ? "text-brand-purple" : "opacity-30")} />
                            </div>
                          </th>
                          <th className="px-6 py-4 font-medium">Method</th>
                          <th 
                            className="px-6 py-4 font-medium cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors text-right"
                            onClick={() => handleSort('amount')}
                          >
                            <div className="flex items-center justify-end gap-1">
                              Amount
                              <ArrowUpDown className={cn("w-3 h-3", sortConfig.key === 'amount' ? "text-brand-purple" : "opacity-30")} />
                            </div>
                          </th>
                          <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {filteredAndSortedPayouts.length > 0 ? (
                          filteredAndSortedPayouts.map((payout) => (
                            <tr key={payout.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                              <td className="px-6 py-4 text-xs font-mono text-zinc-500">{payout.id}</td>
                              <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">{payout.date}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                                    {payout.method === 'MoMo' ? <Phone className="w-3 h-3 text-brand-purple" /> : 
                                     payout.method === 'Bank' ? <Globe className="w-3 h-3 text-brand-blue" /> : 
                                     <DollarSign className="w-3 h-3 text-emerald-500" />}
                                  </div>
                                  <span className="text-xs text-zinc-600 dark:text-zinc-300">{payout.method}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-sm font-bold text-zinc-900 dark:text-white">
                                {formatValue(payout.amount)}
                              </td>
                              <td className="px-6 py-4">
                                <div className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                  payout.status === 'Completed' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-orange-500/10 text-orange-600 dark:text-orange-500"
                                )}>
                                  {payout.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                                  {payout.status}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2 text-zinc-500 dark:text-zinc-400">
                                <AlertCircle className="w-8 h-8 opacity-20" />
                                <p className="text-sm">No payouts match your filters.</p>
                                <button 
                                  onClick={() => { setStatusFilter('All'); setMethodFilter('All'); }}
                                  className="text-xs font-bold text-brand-purple uppercase tracking-widest hover:underline"
                                >
                                  Clear Filters
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Withdrawal Methods</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'MoMo', label: 'Mobile Money', icon: <Phone className="w-4 h-4" />, desc: 'Instant' },
                        { id: 'Bank', label: 'Bank Transfer', icon: <Globe className="w-4 h-4" />, desc: '1-3 Days' },
                        { id: 'PayPal', label: 'PayPal', icon: <DollarSign className="w-4 h-4" />, desc: 'Instant' },
                      ].map((method) => (
                        <div 
                          key={method.id}
                          onClick={() => {
                            setPayoutMethod(method.id as any);
                            setIsPayoutModalOpen(true);
                          }}
                          className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between group hover:border-brand-purple transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white dark:bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-200 dark:border-zinc-800 group-hover:border-brand-purple/30">
                              {method.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{method.label}</p>
                              <p className="text-[10px] text-zinc-500">{method.desc}</p>
                            </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-brand-purple" />
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setIsPayoutModalOpen(true)}
                      className="w-full mt-6 py-3 bg-brand-gradient text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-purple/20"
                    >
                      Request Payout
                    </button>
                  </div>

                  <div className="bg-zinc-900 dark:bg-zinc-950 p-6 rounded-2xl text-white space-y-4">
                    <div className="flex items-center gap-2 text-brand-purple">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Payout Notice</span>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Please ensure your withdrawal details are correct. KulBox is not responsible for funds sent to incorrect accounts.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

