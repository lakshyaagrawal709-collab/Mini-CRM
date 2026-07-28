import React from 'react';
import { SearchX, UserPlus } from 'lucide-react';

const EmptyState = ({ title = "No leads found", message = "Try adjusting your search criteria or add a new lead to get started.", onAction, actionLabel = "Add New Lead" }) => {
  return (
    <div className="py-12 px-4 text-center max-w-sm mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/40">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-white">
        {title}
      </h3>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        {message}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
