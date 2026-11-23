import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, changePassword, logoutUser } from '../features/auth/authSlice';
import { toggleDarkMode } from '../features/ui/uiSlice';
import { addToast } from '../features/ui/uiSlice';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  User,
  Lock,
  Moon,
  Sun,
  ShieldCheck,
  Server,
  Database,
  Cpu,
  LogOut,
} from 'lucide-react';

export const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const darkMode = useSelector((state) => state.ui.darkMode);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [studyGoals, setStudyGoals] = useState(user?.studyGoals || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await dispatch(updateProfile({ name, bio, studyGoals }));
    setSavingProfile(false);
    if (!res.error) {
      dispatch(addToast({ message: 'Profile details saved!', type: 'success' }));
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to update profile.', type: 'error' }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      dispatch(addToast({ message: 'New password must be at least 6 characters.', type: 'error' }));
      return;
    }
    setSavingPassword(true);
    const res = await dispatch(changePassword({ currentPassword, newPassword }));
    setSavingPassword(false);
    if (!res.error) {
      dispatch(addToast({ message: 'Password updated successfully!', type: 'success' }));
      setCurrentPassword('');
      setNewPassword('');
    } else {
      dispatch(addToast({ message: res.payload || 'Failed to change password.', type: 'error' }));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Account Settings
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Manage your personal study profile, security credentials, and application preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Personal Profile</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Bio & Academic Focus
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 3rd year Computer Science major focusing on systems & AI"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm p-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Target Study Goals
              </label>
              <textarea
                rows={2}
                value={studyGoals}
                onChange={(e) => setStudyGoals(e.target.value)}
                placeholder="e.g. Master algorithms and achieve high retention for GRE"
                className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm p-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={savingProfile}
            >
              Save Profile
            </Button>
          </form>
        </div>

        {/* Security & Password Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Security & Password</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={savingPassword}
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>

      {/* Preferences & System Status Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-600" />
          <span>Platform Preferences & Integrations</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Interface Theme
              </p>
              <p className="text-[11px] text-neutral-400">
                {darkMode ? 'Dark Mode' : 'Light Mode'}
              </p>
            </div>
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-xl bg-white dark:bg-neutral-700 shadow-xs text-neutral-700 dark:text-neutral-200"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Gemini Generative AI
              </p>
              <p className="text-[11px] text-neutral-400">RAG & Chat Engine</p>
            </div>
            <Badge variant="success" size="xs">
              Connected
            </Badge>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Qdrant Cloud
              </p>
              <p className="text-[11px] text-neutral-400">Vector Embeddings</p>
            </div>
            <Badge variant="info" size="xs">
              Active
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Session Management</p>
            <p className="text-[11px] text-neutral-400">Sign out of your active workspace on this device</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="danger"
            size="sm"
            icon={LogOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};
