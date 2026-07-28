import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  User,
  DollarSign,
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { leadService } from '../services/leadService';
import {
  formatDate,
  formatCurrency,
  getStatusBadgeStyle,
  getPriorityBadgeStyle
} from '../utils/formatters';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Converted', 'Lost'];

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    setLoading(true);
    try {
      const res = await leadService.getLeadById(id);
      if (res.success) {
        setLead(res.data);
      }
    } catch (err) {
      toast.error('Lead not found');
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await leadService.updateLeadStatus(id, newStatus);
      if (res.success) {
        toast.success(`Status updated to ${newStatus}`);
        setLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsAddingNote(true);
    try {
      const res = await leadService.addLeadNote(id, noteText);
      if (res.success) {
        toast.success('Note added to timeline');
        setNoteText('');
        fetchLeadDetails();
      }
    } catch (err) {
      toast.error('Failed to add note');
    } finally {
      setIsAddingNote(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/leads')}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Leads Directory</span>
      </button>

      {/* Main Profile Header Banner */}
      <div className="bg-white dark:bg-[#121927] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 text-white font-black flex items-center justify-center text-2xl shadow-lg shadow-brand-500/20 flex-shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {lead.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getPriorityBadgeStyle(lead.priority)}`}>
                {lead.priority} Priority
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1" />
              {lead.company || 'No Company'} &bull; Source: <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">{lead.source}</span>
            </p>
          </div>
        </div>

        {/* Quick Status Selector Buttons */}
        <div className="flex flex-col space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Current Status
          </span>
          <select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 ${getStatusBadgeStyle(lead.status)}`}
          >
            {STATUS_OPTIONS.map(st => (
              <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Details & Notes Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Detailed Information */}
        <div className="space-y-6">
          {/* Contact & Deal Overview Card */}
          <div className="bg-white dark:bg-[#121927] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
              Lead Overview
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="flex items-center text-slate-500">
                  <Mail className="w-4 h-4 mr-2 text-brand-500" />
                  Email:
                </span>
                <a href={`mailto:${lead.email}`} className="font-bold text-slate-900 dark:text-white hover:underline truncate max-w-[180px]">
                  {lead.email}
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="flex items-center text-slate-500">
                  <Phone className="w-4 h-4 mr-2 text-brand-500" />
                  Phone:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lead.phone || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="flex items-center text-slate-500">
                  <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                  Est. Contract Value:
                </span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatCurrency(lead.estimatedValue)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="flex items-center text-slate-500">
                  <User className="w-4 h-4 mr-2 text-brand-500" />
                  Assigned Rep:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lead.assignedTo || 'Sales Team'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60">
                <span className="flex items-center text-slate-500">
                  <Calendar className="w-4 h-4 mr-2 text-amber-500" />
                  Next Follow-Up:
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {formatDate(lead.followUpDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes Feed & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Note Form Card */}
          <div className="bg-white dark:bg-[#121927] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-brand-500" />
              Add Timeline Note / Activity
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows="3"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log call summary, client feedback, or proposal follow-up details..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!noteText.trim() || isAddingNote}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAddingNote ? 'Saving...' : 'Post Note'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Notes History List */}
          <div className="bg-white dark:bg-[#121927] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Interaction Notes ({lead.notes?.length || 0})
            </h3>

            <div className="space-y-4">
              {lead.notes && lead.notes.length > 0 ? (
                lead.notes.map((n, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 space-y-2">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                      "{n.text}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                      <span className="font-bold text-brand-600 dark:text-brand-400">{n.author}</span>
                      <span>{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center italic">No interaction notes recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
