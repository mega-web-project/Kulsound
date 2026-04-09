import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { 
  Users, 
  Play, 
  Heart, 
  Share2, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor,
  Tablet,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toPng } from 'html-to-image';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

const periodData: Record<string, any> = {
  '7D': [
    { date: 'Mar 24', streams: 12400, listeners: 8200 },
    { date: 'Mar 25', streams: 15600, listeners: 9800 },
    { date: 'Mar 26', streams: 13200, listeners: 8900 },
    { date: 'Mar 27', streams: 18900, listeners: 11200 },
    { date: 'Mar 28', streams: 22400, listeners: 14500 },
    { date: 'Mar 29', streams: 25800, listeners: 16200 },
    { date: 'Mar 30', streams: 28400, listeners: 18100 },
  ],
  '28D': [
    { date: 'Week 1', streams: 84000, listeners: 52000 },
    { date: 'Week 2', streams: 96000, listeners: 61000 },
    { date: 'Week 3', streams: 112000, listeners: 74000 },
    { date: 'Week 4', streams: 128000, listeners: 85000 },
  ],
  '90D': [
    { date: 'Jan', streams: 320000, listeners: 210000 },
    { date: 'Feb', streams: 380000, listeners: 250000 },
    { date: 'Mar', streams: 450000, listeners: 310000 },
  ],
  '1Y': [
    { date: 'Q1', streams: 1200000, listeners: 840000 },
    { date: 'Q2', streams: 1500000, listeners: 980000 },
    { date: 'Q3', streams: 1800000, listeners: 1200000 },
    { date: 'Q4', streams: 2200000, listeners: 1500000 },
  ],
};

const countryData = [
  { name: 'United States', value: 42, color: '#C026D3' },
  { name: 'United Kingdom', value: 18, color: '#D946EF' },
  { name: 'Germany', value: 12, color: '#E879F9' },
  { name: 'Brazil', value: 10, color: '#F0ABFC' },
  { name: 'Other', value: 18, color: '#F5D0FE' },
];

const sourceData = [
  { name: 'Editorial Playlists', value: 45, color: '#C026D3' },
  { name: 'User Libraries', value: 30, color: '#8b5cf6' },
  { name: 'Algorithmic', value: 15, color: '#ec4899' },
  { name: 'Direct Search', value: 10, color: '#06b6d4' },
];

const ageData = [
  { range: '18-24', percentage: 35 },
  { range: '25-34', percentage: 42 },
  { range: '35-44', percentage: 15 },
  { range: '45+', percentage: 8 },
];

const heatmapData = [
  { day: 'Mon', data: [12, 8, 5, 3, 2, 4, 15, 35, 65, 85, 95, 110, 125, 130, 120, 115, 140, 185, 210, 245, 195, 150, 85, 45] },
  { day: 'Tue', data: [15, 10, 6, 4, 3, 5, 18, 40, 70, 90, 105, 120, 135, 140, 130, 125, 150, 195, 220, 255, 205, 160, 95, 55] },
  { day: 'Wed', data: [18, 12, 8, 5, 4, 6, 20, 45, 75, 95, 115, 130, 145, 150, 140, 135, 160, 205, 230, 265, 215, 170, 105, 65] },
  { day: 'Thu', data: [20, 15, 10, 6, 5, 8, 25, 50, 80, 100, 125, 140, 155, 160, 150, 145, 170, 215, 240, 275, 225, 180, 115, 75] },
  { day: 'Fri', data: [25, 20, 15, 10, 8, 12, 35, 65, 95, 120, 145, 165, 185, 195, 190, 185, 220, 285, 340, 410, 385, 295, 185, 115] },
  { day: 'Sat', data: [85, 65, 45, 35, 25, 20, 45, 85, 125, 165, 195, 225, 255, 275, 285, 295, 325, 385, 440, 510, 485, 395, 285, 185] },
  { day: 'Sun', data: [95, 75, 55, 45, 35, 30, 55, 95, 135, 175, 205, 235, 265, 285, 295, 305, 335, 395, 450, 520, 495, 405, 295, 195] },
];

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

const geoData = [
  { id: 'USA', value: 450000 },
  { id: 'GBR', value: 180000 },
  { id: 'DEU', value: 120000 },
  { id: 'BRA', value: 100000 },
  { id: 'CAN', value: 85000 },
  { id: 'FRA', value: 75000 },
  { id: 'AUS', value: 65000 },
  { id: 'JPN', value: 55000 },
  { id: 'NGA', value: 45000 },
  { id: 'GHA', value: 35000 },
];

export default function Analytics() {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('7D');
  const [isExporting, setIsExporting] = useState(false);
  const mapRef = useRef<SVGSVGElement>(null);

  const currentStreamData = useMemo(() => periodData[selectedPeriod], [selectedPeriod]);

  useEffect(() => {
    if (!mapRef.current) return;

    const width = 800;
    const height = 400;
    const svg = d3.select(mapRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolatePurples)
      .domain([0, 500000]);

    // Fetch world map data
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then((data: any) => {
      svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", (d: any) => {
          const country = geoData.find(c => c.id === d.id);
          return country ? colorScale(country.value) : (theme === 'dark' ? '#27272a' : '#f4f4f5');
        })
        .attr("stroke", theme === 'dark' ? "#18181b" : "#ffffff")
        .attr("stroke-width", 0.5)
        .on("mouseover", function(event, d: any) {
          const country = geoData.find(c => c.id === d.id);
          d3.select(this)
            .attr("stroke", "#C026D3")
            .attr("stroke-width", 1.5);
          
          // Simple tooltip
          const tooltip = d3.select("#map-tooltip");
          tooltip.transition().duration(200).style("opacity", .9);
          tooltip.html(`${d.properties.name}<br/>${country ? country.value.toLocaleString() + ' streams' : 'No data'}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("stroke", theme === 'dark' ? "#18181b" : "#ffffff")
            .attr("stroke-width", 0.5);
          d3.select("#map-tooltip").transition().duration(500).style("opacity", 0);
        });
    });
  }, [theme]);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(',')
    ).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToImage = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;
    setIsExporting(true);
    try {
      // Small delay to ensure any hover states or transitions are settled
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(element, { 
        backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
        style: {
          borderRadius: '16px'
        }
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const stats = useMemo(() => {
    const multipliers: Record<string, number> = {
      '7D': 1,
      '28D': 4.2,
      '90D': 13.5,
      '1Y': 52,
    };
    const m = multipliers[selectedPeriod];
    
    return [
      { label: 'Total Streams', value: selectedPeriod === '1Y' ? '1.2M' : (12400 * m).toLocaleString(), trend: '+12.5%', icon: Play, color: 'text-brand-purple' },
      { label: 'Monthly Listeners', value: selectedPeriod === '1Y' ? '450K' : (8200 * m).toLocaleString(), trend: '+8.2%', icon: Users, color: 'text-blue-500' },
      { label: 'Saves', value: selectedPeriod === '1Y' ? '84.2K' : (1200 * m).toLocaleString(), trend: '+15.4%', icon: Heart, color: 'text-rose-500' },
      { label: 'Shares', value: selectedPeriod === '1Y' ? '12.8K' : (450 * m).toLocaleString(), trend: '+5.1%', icon: Share2, color: 'text-emerald-500' },
    ];
  }, [selectedPeriod]);

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white">Audience Overview</h1>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1">Deep dive into your listener demographics and streaming behavior.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex gap-1 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex-1 sm:flex-none overflow-x-auto">
            {['7D', '28D', '90D', '1Y'].map((period) => (
              <button 
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap",
                  selectedPeriod === period 
                    ? "bg-brand-gradient text-white shadow-lg shadow-brand-purple/20" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <button 
            onClick={() => exportToCSV(currentStreamData, `analytics_data_${selectedPeriod}`)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm flex-1 sm:flex-none"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl group hover:border-brand-purple/50 transition-all shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                {stat.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1 tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div id="streaming-chart" className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Streaming & Listener Growth</h3>
            <button 
              onClick={() => exportToImage('streaming-chart', 'streaming_growth')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentStreamData}>
                <defs>
                  <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C026D3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C026D3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#27272a" : "#e4e4e7"} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#18181b'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#18181b' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="streams" 
                  stroke="#C026D3" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorStreams)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="listeners" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div id="countries-chart" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Top Countries</h3>
            <button 
              onClick={() => exportToImage('countries-chart', 'top_countries')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {countryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                      border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#ffffff' : '#18181b'
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#fff' : '#18181b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {countryData.map((country) => (
                <div key={country.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: country.color }} />
                    <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">{country.name}</span>
                  </div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{country.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demographics & Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="age-chart" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Listener Age Groups</h3>
            <button 
              onClick={() => exportToImage('age-chart', 'age_demographics')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-6">
            {ageData.map((item) => (
              <div key={item.range} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 dark:text-zinc-400 font-bold">{item.range}</span>
                  <span className="text-zinc-900 dark:text-white font-bold">{item.percentage}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-gradient rounded-full transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="sources-chart" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Streaming Sources</h3>
            <button 
              onClick={() => exportToImage('sources-chart', 'streaming_sources')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#27272a" : "#e4e4e7"} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke={theme === 'dark' ? "#71717a" : "#a1a1aa"} 
                  fontSize={12} 
                  width={120} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff', 
                    border: theme === 'dark' ? '1px solid #27272a' : '1px solid #e4e4e7',
                    borderRadius: '8px',
                    color: theme === 'dark' ? '#ffffff' : '#18181b'
                  }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#18181b' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Device Breakdown */}
      <div id="devices-chart" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Device & Platform</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => exportToImage('devices-chart', 'device_breakdown')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button className="text-xs font-bold text-brand-purple hover:text-brand-purple/80 flex items-center gap-1">
              <span className="hidden sm:inline">View Full Report</span> <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {[
            { label: 'Mobile', value: '78%', icon: Smartphone, color: 'bg-brand-purple/10 text-brand-purple' },
            { label: 'Desktop', value: '15%', icon: Monitor, color: 'bg-blue-500/10 text-blue-500' },
            { label: 'Tablet', value: '7%', icon: Tablet, color: 'bg-emerald-500/10 text-emerald-500' },
          ].map((device, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
              <div className={`p-3 rounded-xl ${device.color}`}>
                <device.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider">{device.label}</p>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{device.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streaming Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div id="heatmap-section" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Streaming Activity Heatmap</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Identify peak listening hours across the week.</p>
            </div>
            <button 
              onClick={() => exportToImage('heatmap-section', 'streaming_heatmap')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="min-w-[400px]">
                {/* Hours Header */}
                <div className="flex mb-2">
                  <div className="w-10 flex-shrink-0" />
                  <div className="flex-1 flex justify-between px-2">
                    {['12A', '6A', '12P', '6P'].map((label, i) => (
                      <span key={i} className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="space-y-1">
                  {heatmapData.map((row) => (
                    <div key={row.day} className="flex items-center gap-2">
                      <span className="w-10 text-[8px] font-black text-zinc-500 uppercase tracking-tighter">{row.day}</span>
                      <div className="flex-1 flex gap-0.5">
                        {row.data.map((value, i) => {
                          const max = 520;
                          const intensity = value / max;
                          return (
                            <div 
                              key={i}
                              className="flex-1 aspect-square rounded-[1px] transition-all hover:scale-110 hover:z-10 cursor-pointer group relative"
                              style={{ 
                                backgroundColor: `rgba(192, 38, 211, ${Math.max(0.05, intensity)})`,
                              }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-900 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                                {row.day}, {hours[i]}
                                <br />
                                <span className="font-bold text-brand-purple">{value.toLocaleString()} streams</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-2">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Low</span>
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((op, i) => (
                  <div 
                    key={i} 
                    className="w-3 h-3 rounded-[1px]" 
                    style={{ backgroundColor: `rgba(192, 38, 211, ${op})` }} 
                  />
                ))}
              </div>
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Peak</span>
            </div>
          </div>
        </div>

        {/* Geographic Heatmap */}
        <div id="geo-heatmap-section" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-8 rounded-2xl shadow-sm overflow-hidden relative">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Geographic Heatmap</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Global distribution of your streaming audience.</p>
            </div>
            <button 
              onClick={() => exportToImage('geo-heatmap-section', 'geographic_heatmap')}
              disabled={isExporting}
              className="p-2 text-zinc-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
              title="Export as Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-full overflow-hidden flex justify-center items-center h-[300px]">
            <svg 
              ref={mapRef} 
              viewBox="0 0 800 400" 
              className="w-full h-full max-w-full"
            />
            <div 
              id="map-tooltip" 
              className="absolute pointer-events-none opacity-0 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded shadow-xl z-50 transition-opacity"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">0 Streams</span>
            <div className="h-2 w-24 bg-gradient-to-r from-zinc-100 to-brand-purple dark:from-zinc-800 dark:to-brand-purple rounded-full" />
            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">500k+ Streams</span>
          </div>
        </div>
      </div>
    </div>
  );
}
