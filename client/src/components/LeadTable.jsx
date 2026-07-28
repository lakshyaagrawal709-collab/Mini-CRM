import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Building,
  Calendar,
  MoreVertical
} from 'lucide-react';
import {
  formatDate,
  formatCurrency,
  getStatusBadgeStyle,
  getPriorityBadgeStyle
} from '../utils/formatters';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];

const LeadTable = ({
  leads = [],
  onEdit,
  onDelete,
  onStatusChange,
  isLoading = false
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="inline-block w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Loading leads data...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <th className="py-3.5 px-4 sm:px-6">Lead / Company</th>
            <th className="py-3.5 px-4">Contact Info</th>
            <th className="py-3.5 px-4">Source</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Est. Value</th>
            <th className="py-3.5 px-4">Created Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
              onClick={() => navigate(`/leads/${lead._id}`)}
            >
              {/* Name & Company */}
              <td className="py-4 px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {lead.name}
                    </p>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{lead.company || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </td>

              {/* Contact Info */}
              <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                    <a href={`mailto:${lead.email}`} className="hover:underline truncate">
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
              </td>

              {/* Source */}
              <td className="py-4 px-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {lead.source || 'Website'}
                </span>
              </td>

              {/* Status Select */}
              <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                <select
                  value={lead.status}
                  onChange={(e) => onStatusChange(lead._id, e.target.value)}
                  className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${getStatusBadgeStyle(
                    lead.status
                  )}`}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </td>

              {/* Priority Badge */}
              <td className="py-4 px-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getPriorityBadgeStyle(
                    lead.priority
                  )}`}
                >
                  {lead.priority}
                </span>
              </td>

              {/* Est Value */}
              <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                {formatCurrency(lead.estimatedValue)}
              </td>

              {/* Created Date */}
              <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {formatDate(lead.createdAt)}
                </div>
              </td>

              {/* Actions */}
              <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end space-x-1">
                  <button
                    onClick={() => navigate(`/leads/${lead._id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Lead"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(lead._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
