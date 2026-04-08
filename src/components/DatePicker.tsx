import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  parseISO,
  isValid
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';

interface DatePickerProps {
  value: string; // ISO format or empty
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({ value, onChange, placeholder = "Select date", className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const selectedDate = value ? parseISO(value) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setView('days');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  });

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
    setView('days');
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentMonth.getFullYear(), monthIndex, 1);
    setCurrentMonth(newDate);
    setView('days');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, currentMonth.getMonth(), 1);
    setCurrentMonth(newDate);
    setView('months');
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2 text-sm transition-all text-left shadow-sm",
          isOpen ? "border-brand-purple ring-1 ring-brand-purple/20" : "hover:border-zinc-300 dark:hover:border-zinc-700",
          !value ? "text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-white"
        )}
      >
        <CalendarIcon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
        <span className="flex-1 truncate">
          {selectedDate && isValid(selectedDate) ? format(selectedDate, 'PPP') : placeholder}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] mt-2 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button"
                onClick={() => setView(view === 'days' ? 'months' : view === 'months' ? 'years' : 'days')}
                className="text-sm font-bold text-zinc-900 dark:text-white hover:text-brand-purple transition-colors px-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {view === 'days' && format(currentMonth, 'MMMM yyyy')}
                {view === 'months' && format(currentMonth, 'yyyy')}
                {view === 'years' && 'Select Year'}
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (view === 'days') setCurrentMonth(subMonths(currentMonth, 1));
                    if (view === 'months') setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
                  }}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (view === 'days') setCurrentMonth(addMonths(currentMonth, 1));
                    if (view === 'months') setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
                  }}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {view === 'days' && (
              <>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 text-center uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isTodayDate = isToday(day);

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleDateSelect(day)}
                        className={cn(
                          "h-8 w-8 rounded-lg text-xs flex items-center justify-center transition-all",
                          !isCurrentMonth && "text-zinc-300 dark:text-zinc-700",
                          isCurrentMonth && !isSelected && "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white",
                          isSelected && "bg-brand-purple text-white font-bold shadow-lg shadow-brand-purple/20",
                          isTodayDate && !isSelected && "text-brand-purple font-bold"
                        )}
                      >
                        {format(day, 'd')}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {view === 'months' && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    onClick={() => handleMonthSelect(index)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium transition-all",
                      currentMonth.getMonth() === index 
                        ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}

            {view === 'years' && (
              <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleYearSelect(year)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-medium transition-all",
                      currentMonth.getFullYear() === year 
                        ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setCurrentMonth(new Date());
                  handleDateSelect(new Date());
                }}
                className="text-[10px] font-bold text-brand-purple uppercase tracking-wider hover:text-brand-purple/80"
              >
                Today
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setIsOpen(false); setView('days'); }}
                  className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider hover:text-zinc-600 dark:hover:text-zinc-400"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
