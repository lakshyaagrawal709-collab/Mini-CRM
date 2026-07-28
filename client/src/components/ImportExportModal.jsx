import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';

const ImportExportModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [parsedData, setParsedData] = useState([]);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('CSV Parsing Error. Please check file formatting.');
          return;
        }

        // Map and validate columns
        const formatted = results.data.map(row => ({
          name: row.name || row.Name || row['Full Name'] || '',
          email: row.email || row.Email || '',
          phone: row.phone || row.Phone || '',
          company: row.company || row.Company || 'N/A',
          status: row.status || row.Status || 'New',
          priority: row.priority || row.Priority || 'Medium',
          source: row.source || row.Source || 'Other',
          estimatedValue: row.estimatedValue || row['Estimated Value'] || 0
        })).filter(item => item.name && item.email);

        if (formatted.length === 0) {
          toast.error('No valid leads found in CSV. Required headers: name, email');
          return;
        }

        setParsedData(formatted);
        toast.success(`Successfully parsed ${formatted.length} leads from CSV!`);
      }
    });
  };

  const handleConfirmImport = async () => {
    if (parsedData.length === 0) return;
    setIsUploading(true);
    try {
      await onImportSuccess(parsedData);
      setParsedData([]);
      setFileName('');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#121927] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Import Leads via CSV
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bulk upload prospective leads from spreadsheet files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-500 rounded-2xl p-6 text-center transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              id="csv-upload-input"
              className="hidden"
            />
            <label htmlFor="csv-upload-input" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-brand-500 mb-2 animate-bounce" />
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {fileName ? fileName : 'Click to select CSV File'}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                CSV headers required: <code className="text-brand-600">name</code>, <code className="text-brand-600">email</code> (optional: phone, company, status)
              </span>
            </label>
          </div>

          {/* Preview list if data parsed */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Ready to import {parsedData.length} leads
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {parsedData.slice(0, 5).map((row, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{row.name}</p>
                      <p className="text-slate-400">{row.email}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                      {row.company}
                    </span>
                  </div>
                ))}
                {parsedData.length > 5 && (
                  <div className="p-2 text-center text-slate-400 italic">
                    ...and {parsedData.length - 5} more records
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parsedData.length === 0 || isUploading}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {isUploading ? 'Importing Leads...' : `Import ${parsedData.length} Leads`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
