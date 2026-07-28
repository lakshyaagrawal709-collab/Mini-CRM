import React from 'react';
import {
  MessageSquare,
  UserCheck,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Trash2,
  Clock
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

const ActivityTimeline = ({ activities = [] }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATED':
        return { icon: PlusCircle, color: 'bg-blue-500 text-white' };
      case 'STATUS_CHANGE':
        return { icon: RefreshCw, color: 'bg-purple-500 text-white' };
      case 'NOTE_ADDED':
        return { icon: MessageSquare, color: 'bg-emerald-500 text-white' };
      case 'UPDATED':
        return { icon: UserCheck, color: 'bg-amber-500 text-white' };
      case 'BULK_IMPORT':
        return { icon: FileSpreadsheet, color: 'bg-indigo-500 text-white' };
      case 'DELETED':
        return { icon: Trash2, color: 'bg-rose-500 text-white' };
      default:
        return { icon: Clock, color: 'bg-slate-500 text-white' };
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="py-6 text-center text-xs text-slate-400">
        No recent activity logged yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {activities.map((act, index) => {
        const { icon: Icon, color } = getActionIcon(act.action);
        return (
          <div key={act._id || index} className="relative group">
            {/* Timeline Dot Icon */}
            <div className={`absolute -left-6 top-0 w-5 h-5 rounded-full ${color} flex items-center justify-center text-[10px] shadow-sm ring-4 ring-white dark:ring-[#121927]`}>
              <Icon className="w-3 h-3" />
            </div>

            {/* Content */}
            <div className="bg-slate-50/60 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
              <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                {act.details}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>By: {act.performedBy || 'Admin'}</span>
                <span>{formatDate(act.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
