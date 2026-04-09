import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Play, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '../lib/utils';
import NewReleaseForm from './NewReleaseForm';
import VerificationBanner from './VerificationBanner';
import { useTheme } from '../context/ThemeContext';

const data = [
  { name: 'Mon', streams: 4000 },
  { name: 'Tue', streams: 3000 },
  { name: 'Wed', streams: 2000 },
  { name: 'Thu', streams: 2780 },
  { name: 'Fri', streams: 1890 },
  { name: 'Sat', streams: 2390 },
  { name: 'Sun', streams: 3490 },
];

const StatCard = ({ title, value, change, trend, icon: Icon }: any) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm dark:shadow-none transition-colors duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <Icon className="w-5 h-5 text-brand-purple" />
      </div>
      <div className={cn(
        "flex items-center text-xs font-medium px-2 py-1 rounded-full",
        trend === 'up' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-rose-500/10 text-rose-600 dark:text-rose-500"
      )}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">{value}</h3>
  </div>
);

export default function Dashboard({ verificationStatus, setIsVerificationModalOpen, rejectionReason }: any) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto transition-colors duration-300">
      <NewReleaseForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Artist Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm sm:text-base">Welcome back, Alex. Here's what's happening with your music.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm dark:shadow-none text-sm">
            Export
          </button>
          <button 
            onClick={() => {
              if (verificationStatus === 'Verified') {
                setIsFormOpen(true);
              } else {
                setIsVerificationModalOpen(true);
              }
            }}
            className="flex-1 sm:flex-none px-4 py-2 bg-brand-gradient text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-lg shadow-brand-purple/20 text-sm"
          >
            New Release
          </button>
        </div>
      </div>

      {verificationStatus !== 'Verified' && (
        <VerificationBanner 
          status={verificationStatus} 
          onStartVerification={() => setIsVerificationModalOpen(true)} 
          rejectionReason={rejectionReason}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Streams" value="1.2M" change="+12.5%" trend="up" icon={Play} />
        <StatCard title="Monthly Listeners" value="84.2K" change="+5.2%" trend="up" icon={Users} />
        <StatCard title="Total Revenue" value="$12,450" change="-2.1%" trend="down" icon={DollarSign} />
        <StatCard title="Followers" value="12.8K" change="+18.4%" trend="up" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm dark:shadow-none transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Streaming Performance</h3>
            <select className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm border-none rounded-md px-2 py-1 focus:ring-0">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C026D3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C026D3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#27272a" : "#e4e4e7"} vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7', 
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#18181b'
                  }}
                  itemStyle={{ color: '#C026D3' }}
                />
                <Area type="monotone" dataKey="streams" stroke="#C026D3" fillOpacity={1} fill="url(#colorStreams)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm dark:shadow-none transition-colors duration-300">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Top Platforms</h3>
          <div className="space-y-6">
            {[
              { name: 'KulSound', streams: '1.2M', color: 'bg-brand-gradient' },
            ].map((platform) => (
              <div key={platform.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{platform.name}</span>
                  <span className="text-zinc-500">{platform.streams}</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", platform.color)} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-zinc-500 text-center italic">
            Currently only supported by KulSound
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Recent Releases</h3>
          <button className="text-brand-purple text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 font-medium">Release</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Release Date</th>
                <th className="px-6 py-4 font-medium">Streams</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                { title: 'Midnight Echoes', artist: 'Alex Rivers', type: 'Album', status: 'Live', date: 'Mar 12, 2026', streams: '124,502', cover: 'https://picsum.photos/seed/album1/100/100' },
                { title: 'Neon Dreams', artist: 'Alex Rivers', type: 'Single', status: 'Live', date: 'Feb 28, 2026', streams: '84,120', cover: 'https://picsum.photos/seed/album2/100/100' },
                { title: 'Summer Rain', artist: 'Alex Rivers', type: 'Single', status: 'Processing', date: 'Apr 05, 2026', streams: '-', cover: 'https://picsum.photos/seed/album3/100/100' },
              ].map((release, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={release.cover} alt={release.title} className="w-10 h-10 rounded shadow-lg" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{release.title}</p>
                        <p className="text-xs text-zinc-500">{release.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{release.type}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
                      release.status === 'Live' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500" : "bg-brand-purple/10 text-brand-purple"
                    )}>
                      {release.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">{release.date}</td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">{release.streams}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
