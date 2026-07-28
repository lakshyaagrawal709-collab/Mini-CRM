import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  ArrowRight,
  Plus,
  Phone,
  Building
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import StatCard from '../components/StatCard';
import ActivityTimeline from '../components/ActivityTimeline';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { dashboardService } from '../services/dashboardService';
import { formatCurrency, formatDate, getStatusBadgeStyle } from '../utils/formatters';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingSkeleton type="chart" />
          </div>
          <div>
            <LoadingSkeleton type="chart" />
          </div>
        </div>
      </div>
    );
  }

  const { summary, statusDistribution, monthlyLeads, recentLeads, upcomingFollowUps, recentActivities } = stats || {};

  return (
    <div className="space-y-6">
      {/* Top Header Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-brand-500/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Pipeline Analytics & Control Center
          </h2>
          <p className="text-xs text-brand-100 mt-1">
            Real-time metric monitoring, conversion rates, and action tracking
          </p>
        </div>
        <button
          onClick={() => navigate('/leads')}
          className="self-start sm:self-auto flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white text-brand-700 font-extrabold text-xs shadow-lg hover:bg-slate-100 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Manage Directory</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Leads"
          value={summary?.totalLeads || 0}
          subtitle="Lifetime CRM entries"
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="brand"
        />
        <StatCard
          title="Converted Leads"
          value={summary?.convertedLeads || 0}
          subtitle={`Conversion Rate: ${summary?.conversionRate || 0}%`}
          icon={CheckCircle}
          trend="up"
          trendValue={`${summary?.conversionRate || 0}%`}
          color="emerald"
        />
        <StatCard
          title="Est. Revenue"
          value={formatCurrency(summary?.totalRevenue || 0)}
          subtitle="Closed won contracts"
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          title="Lost Leads"
          value={summary?.lostLeads || 0}
          subtitle="Closed lost leads"
          icon={XCircle}
          trend="down"
          trendValue="Archived"
          color="rose"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#121927] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Monthly Lead Growth
              </h3>
              <p className="text-xs text-slate-400">Total vs Converted leads over past 6 months</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-brand-600 dark:bg-indigo-950/60 dark:text-brand-400">
              6-Month View
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyLeads} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="total" name="Total Leads" fill="#6366f1" radius={[6, 6, 0, 0]} />
                <Bar dataKey="converted" name="Converted" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white dark:bg-[#121927] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Lead Status Breakdown
            </h3>
            <p className="text-xs text-slate-400">Pipeline distribution</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="count"
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{summary?.totalLeads || 0}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Leads</span>
            </div>
          </div>

          {/* Custom Pie Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            {statusDistribution?.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Upcoming Follow-ups & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Follow-ups */}
        <div className="bg-white dark:bg-[#121927] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Upcoming Follow-ups
              </h3>
            </div>
            <button
              onClick={() => navigate('/leads')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {upcomingFollowUps && upcomingFollowUps.length > 0 ? (
              upcomingFollowUps.map((lead) => (
                <div
                  key={lead._id}
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-brand-500 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white">
                      {lead.name}
                    </p>
                    <div className="flex items-center text-[11px] text-slate-400 space-x-2">
                      <span className="flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {lead.company}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800/40">
                      {formatDate(lead.followUpDate)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No immediate follow-ups scheduled.</p>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-[#121927] p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Recent System Activity
            </h3>
          </div>

          <div className="max-h-72 overflow-y-auto pr-1">
            <ActivityTimeline activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
