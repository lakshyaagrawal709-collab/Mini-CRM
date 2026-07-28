import React, { useState, useEffect } from 'react';
import LeadTable from '../components/LeadTable';
import LeadFilterBar from '../components/LeadFilterBar';
import LeadModal from '../components/LeadModal';
import ConfirmModal from '../components/ConfirmModal';
import ImportExportModal from '../components/ImportExportModal';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { leadService } from '../services/leadService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

const LeadManagementPage = () => {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [source, setSource] = useState('All');
  const [sort, setSort] = useState('newest');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isImportOpen, setIsImportOpen] = useState(false);

  // Fetch leads on filter change
  useEffect(() => {
    fetchLeads(1);
  }, [search, status, priority, source, sort]);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    try {
      const res = await leadService.getLeads({
        search,
        status,
        priority,
        source,
        sort,
        page,
        limit: 10
      });
      if (res.success) {
        setLeads(res.data);
        setPagination(res.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setSource('All');
    setSort('newest');
  };

  // Add or Edit Lead Submit
  const handleLeadSubmit = async (formData) => {
    setIsSubmittingLead(true);
    try {
      if (selectedLead) {
        const res = await leadService.updateLead(selectedLead._id, formData);
        if (res.success) {
          toast.success('Lead updated successfully!');
          fetchLeads(pagination.page);
        }
      } else {
        const res = await leadService.createLead(formData);
        if (res.success) {
          toast.success('Lead created successfully!');
          fetchLeads(1);
        }
      }
      setIsModalOpen(false);
      setSelectedLead(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error saving lead';
      toast.error(msg);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Inline Quick Status Change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await leadService.updateLeadStatus(id, newStatus);
      if (res.success) {
        toast.success(`Status changed to ${newStatus}`);
        setLeads(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Delete Lead Handler
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await leadService.deleteLead(deleteId);
      if (res.success) {
        toast.success('Lead deleted successfully');
        fetchLeads(pagination.page);
      }
    } catch (err) {
      toast.error('Failed to delete lead');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setDeleteId(null);
    }
  };

  // Export CSV function
  const handleExportCSV = async () => {
    try {
      const res = await leadService.exportLeadsCSV({ search, status, priority, source, sort });
      if (res.success && res.data) {
        const exportFields = res.data.map(lead => ({
          Name: lead.name,
          Email: lead.email,
          Phone: lead.phone,
          Company: lead.company,
          Source: lead.source,
          Status: lead.status,
          Priority: lead.priority,
          EstimatedValue: lead.estimatedValue,
          AssignedTo: lead.assignedTo,
          CreatedAt: new Date(lead.createdAt).toISOString().split('T')[0]
        }));

        const csv = Papa.unparse(exportFields);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV Export downloaded successfully');
      }
    } catch (err) {
      toast.error('Failed to export leads');
    }
  };

  // Bulk Import CSV Handler
  const handleBulkImport = async (importedLeads) => {
    try {
      const res = await leadService.importLeadsCSV(importedLeads);
      if (res.success) {
        toast.success(res.message);
        fetchLeads(1);
      }
    } catch (err) {
      toast.error('CSV import failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <LeadFilterBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        priority={priority}
        setPriority={setPriority}
        source={source}
        setSource={setSource}
        sort={sort}
        setSort={setSort}
        onResetFilters={handleResetFilters}
        onAddLead={() => {
          setSelectedLead(null);
          setIsModalOpen(true);
        }}
        onExportCSV={handleExportCSV}
        onOpenImport={() => setIsImportOpen(true)}
      />

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#121927] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6">
            <LoadingSkeleton type="table" />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No matching leads"
            message="No client leads match your selected search filters."
            onAction={() => {
              setSelectedLead(null);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={(lead) => {
                setSelectedLead(lead);
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setIsConfirmOpen(true);
              }}
              onStatusChange={handleStatusChange}
            />

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing <span className="font-bold text-slate-800 dark:text-slate-200">{leads.length}</span> of{' '}
                <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.total}</span> total leads
              </div>

              <div className="flex items-center space-x-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchLeads(pagination.page - 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchLeads(pagination.page + 1)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLeadSubmit}
        lead={selectedLead}
        isSubmitting={isSubmittingLead}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Import CSV Modal */}
      <ImportExportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleBulkImport}
      />
    </div>
  );
};

export default LeadManagementPage;
