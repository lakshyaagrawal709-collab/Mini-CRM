import React from 'react';

const LoadingSkeleton = ({ type = 'cards' }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse p-5 flex justify-between items-center">
            <div className="space-y-3 flex-1 pr-4">
              <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
              <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-300 dark:bg-slate-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center px-6 justify-between">
            <div className="flex items-center space-x-4 w-1/3">
              <div className="w-10 h-10 rounded-xl bg-slate-300 dark:bg-slate-700"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
                <div className="h-2 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-6 w-16 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
  );
};

export default LoadingSkeleton;
