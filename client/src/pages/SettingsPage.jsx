import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Sun, Moon, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const { user, updatePassword, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!currentPassword) errs.currentPassword = 'Current password is required';
    if (!newPassword || newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters long';
    }
    if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsUpdating(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#121927] p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-black flex items-center justify-center text-xl shadow-lg shadow-brand-500/20">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {user?.name || 'Administrator'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">{user?.email}</p>
            <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              <span>Super Administrator</span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Two Column Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security / Password Change */}
        <div className="bg-white dark:bg-[#121927] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Security & Password
            </h3>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-rose-500 text-[11px]">{errors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.newPassword && (
                <p className="mt-1 text-rose-500 text-[11px]">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-rose-500 text-[11px]">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {isUpdating ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Preferences / Theme */}
        <div className="bg-white dark:bg-[#121927] p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Interface Preferences
            </h3>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-indigo-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-white">
                    Dark Mode Theme
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {isDarkMode ? 'Currently using Dark visual theme' : 'Currently using Light visual theme'}
                  </p>
                </div>
              </div>

              <button
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow"
              >
                Toggle Theme
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-700 dark:text-slate-300">System Info</p>
            <p>Version: 1.0.0 (Production Build)</p>
            <p>Framework: React 18 + Vite + Tailwind CSS</p>
            <p>API Endpoint: Express + MongoDB Atlas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
