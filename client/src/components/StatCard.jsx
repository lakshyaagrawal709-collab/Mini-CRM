import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'brand' }) => {
  const colorMap = {
    brand: {
      bg: 'from-indigo-500/10 to-brand-500/5',
      iconBg: 'bg-brand-600 text-white shadow-brand-500/20',
      border: 'border-indigo-100 dark:border-indigo-900/30'
    },
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-500/20',
      border: 'border-emerald-100 dark:border-emerald-900/30'
    },
    rose: {
      bg: 'from-rose-500/10 to-pink-500/5',
      iconBg: 'bg-rose-600 text-white shadow-rose-500/20',
      border: 'border-rose-100 dark:border-rose-900/30'
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      iconBg: 'bg-amber-500 text-white shadow-amber-500/20',
      border: 'border-amber-100 dark:border-amber-900/30'
    },
    purple: {
      bg: 'from-purple-500/10 to-violet-500/5',
      iconBg: 'bg-purple-600 text-white shadow-purple-500/20',
      border: 'border-purple-100 dark:border-purple-900/30'
    }
  };

  const currentTheme = colorMap[color] || colorMap.brand;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#121927] p-5 border ${currentTheme.border} shadow-sm hover:shadow-md transition-all duration-200 group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bg} opacity-50`} />
      
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {title}
          </p>
          <h3 className="mt-1.5 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>

          <div className="mt-2 flex items-center space-x-2">
            {trend && (
              <span
                className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
                  trend === 'up'
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60'
                }`}
              >
                {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {trendValue}
              </span>
            )}
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-2xl ${currentTheme.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
