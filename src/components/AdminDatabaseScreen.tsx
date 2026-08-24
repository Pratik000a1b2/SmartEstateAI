import React, { useState, useEffect } from 'react';
import {
  Database,
  Users,
  Search,
  Download,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Server,
  Key,
  CheckCircle2,
  BrainCircuit,
  FileSpreadsheet,
  Cloud,
  HelpCircle,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  Activity,
  UserCheck,
  AlertTriangle,
  History,
} from 'lucide-react';
import { User, PredictionRecord } from '../types';
import {
  getLocalUsers,
  getLocalPredictions,
  deleteUserFromDatabase,
  deleteSinglePrediction,
  clearUserPredictions,
  fetchFirestoreUsers,
  fetchFirestorePredictions,
  syncAllDataToFirestore,
  StoredUserRecord,
  formatINR,
  formatDate,
} from '../lib/api';

import {
  saveCustomFirebaseConfig,
  resetToDefaultFirebaseConfig,
  getCurrentFirebaseProjectId,
} from '../lib/firebase';

interface AdminDatabaseScreenProps {
  user: User | null;
}

export const AdminDatabaseScreen: React.FC<AdminDatabaseScreenProps> = ({ user }) => {
  const [usersList, setUsersList] = useState<StoredUserRecord[]>([]);
  const [predictionsList, setPredictionsList] = useState<PredictionRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'predictions' | 'cloud_guide'>('users');
  const [message, setMessage] = useState<string | null>(null);
  const [loadingSync, setLoadingSync] = useState(false);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  const toggleShowPassword = (userId: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // Custom Firebase Config form state
  const [customApiKey, setCustomApiKey] = useState('');
  const [customProjectId, setCustomProjectId] = useState('');
  const [customAppId, setCustomAppId] = useState('');
  const [customAuthDomain, setCustomAuthDomain] = useState('');
  const [customConfigSuccess, setCustomConfigSuccess] = useState<string | null>(null);

  const currentProjectId = getCurrentFirebaseProjectId();

  const loadData = async () => {
    // Immediate local state
    const users = getLocalUsers();
    const preds = getLocalPredictions();
    setUsersList(users);
    setPredictionsList(preds);

    // Sync from Firebase Firestore
    setLoadingSync(true);
    try {
      const remoteUsers = await fetchFirestoreUsers();
      const remotePreds = await fetchFirestorePredictions();
      setUsersList(remoteUsers);
      setPredictionsList(remotePreds);
    } catch (e) {
      console.warn('Sync warning:', e);
    } finally {
      setLoadingSync(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [selectedUserForInspection, setSelectedUserForInspection] = useState<StoredUserRecord | null>(null);

  const handleDeleteUserPrediction = async (predictionId: string) => {
    await deleteSinglePrediction(predictionId);
    setPredictionsList((prev) => prev.filter((p) => p.id !== predictionId));
    setMessage('Calculation record deleted permanently from database & Firestore.');
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearAllUserPredictions = async (uId: string, uEmail: string) => {
    await clearUserPredictions(uId, uEmail);
    setPredictionsList((prev) =>
      prev.filter((p) => {
        const pUser = (p.userId || '').toLowerCase().trim();
        return pUser !== uId.toLowerCase().trim() && pUser !== uEmail.toLowerCase().trim();
      })
    );
    setMessage(`All activity history for ${uEmail} deleted permanently.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    await deleteUserFromDatabase(userId, email);
    setUsersList((prev) =>
      prev.filter((u) => u.id !== userId && u.email.toLowerCase().trim() !== email.toLowerCase().trim())
    );
    setPredictionsList((prev) =>
      prev.filter((p) => {
        const pUser = (p.userId || '').toLowerCase().trim();
        return pUser !== userId.toLowerCase().trim() && pUser !== email.toLowerCase().trim();
      })
    );
    if (selectedUserForInspection?.id === userId || selectedUserForInspection?.email.toLowerCase().trim() === email.toLowerCase().trim()) {
      setSelectedUserForInspection(null);
    }
    setMessage(`User ${email} and all associated data permanently removed from database.`);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportUsersCSV = () => {
    const headers = ['User ID', 'Full Name', 'Email Address', 'Role', 'Created At', 'Last Login At', 'Login Count'];
    const rows = usersList.map((u) => [
      u.id,
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.email}"`,
      u.role || 'user',
      u.createdAt || '',
      u.lastLoginAt || '',
      u.loginCount || 1,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartestate_users_database_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPredictionsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(predictionsList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smartestate_predictions_database_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPredictions = predictionsList.filter(
    (p) =>
      p.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.investmentAdvice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOwnerOrAdmin =
    user?.role === 'admin' ||
    user?.email?.toLowerCase().trim() === 'pratikpanzade000@gmail.com' ||
    user?.email?.toLowerCase().trim() === 'aiml43465@gmail.com';

  if (!user || !isOwnerOrAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800 shadow-xl">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Access Restricted to Software Owner Only
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Only the authorized software owner (<strong className="text-slate-900 dark:text-white">pratikpanzade000@gmail.com</strong>) with verified Gmail 6-digit OTP can access the Admin Database Console.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Owner & Admin Database Access Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              System Database & Registered Users
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              View all user registrations, full names, email addresses, login activity, and saved property valuation models in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={async () => {
                setLoadingSync(true);
                try {
                  const res = await syncAllDataToFirestore();
                  setMessage(`✅ Synced ${res.usersCount} users & ${res.predsCount} predictions to Firestore Cloud!`);
                  await loadData();
                } catch (e: any) {
                  setMessage(`⚠️ Sync error: ${e?.message || 'Check Firestore connection'}`);
                } finally {
                  setLoadingSync(false);
                  setTimeout(() => setMessage(null), 5000);
                }
              }}
              disabled={loadingSync}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
              title="Push all registered users and predictions directly into Firebase Firestore"
            >
              <Cloud className="w-4 h-4" />
              <span>{loadingSync ? 'Uploading...' : 'Push All To Firebase'}</span>
            </button>
            <button
              onClick={loadData}
              disabled={loadingSync}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingSync ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{loadingSync ? 'Syncing Cloud...' : 'Sync Firestore'}</span>
            </button>
            <button
              onClick={handleExportUsersCSV}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Database Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-medium mb-1">
              <Users className="w-4 h-4" />
              <span>Registered Accounts</span>
            </div>
            <div className="text-2xl font-black text-white">{usersList.length}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium mb-1">
              <BrainCircuit className="w-4 h-4" />
              <span>Total Calculations</span>
            </div>
            <div className="text-2xl font-black text-white">{predictionsList.length}</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-medium mb-1">
              <Server className="w-4 h-4" />
              <span>Database Engine</span>
            </div>
            <div className="text-sm font-bold text-white">SmartEstate Local & Server Sync</div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 text-blue-300 text-xs font-medium mb-1">
              <Key className="w-4 h-4" />
              <span>Logged Admin</span>
            </div>
            <div className="text-xs font-bold text-white truncate">{user?.email || 'admin@smartestate.ai'}</div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Tab Navigation & Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Users ({usersList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('predictions')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'predictions'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Calculations Log ({predictionsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('cloud_guide')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'cloud_guide'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cloud className="w-4 h-4 text-sky-500" />
              <span>Cloud Database Guide (Firebase/Supabase)</span>
            </button>
          </div>

          {activeTab !== 'cloud_guide' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search database records..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Tab 1: Users Table */}
        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Gmail / Email Address</th>
                  <th className="py-3 px-4">Password / Key</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Joined</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-center">Logins</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                      No matching user records found in database.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isVisible = showPasswordMap[u.id];
                    const pwdDisplay = u.passwordHash || 'N/A';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg w-max text-slate-800 dark:text-slate-200">
                            <span>{isVisible ? pwdDisplay : '••••••••'}</span>
                            <button
                              onClick={() => toggleShowPassword(u.id)}
                              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded transition-colors"
                              title={isVisible ? "Hide Password" : "Show Full Password"}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {u.createdAt ? formatDate(u.createdAt) : 'Initial User'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString() : 'Active now'}
                        </td>

                        <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                          {u.loginCount || 1}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedUserForInspection(u)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="Inspect user activity, view logs, & manage actions"
                            >
                              <Activity className="w-3.5 h-3.5" />
                              <span>Inspect Activity</span>
                            </button>
                            {u.email.toLowerCase().trim() !== 'pratikpanzade000@gmail.com' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                title="Delete user record & all data"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Predictions Table */}
        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-semibold text-slate-500">
                Showing all property valuations calculated across all user sessions
              </span>
              <button
                onClick={handleExportPredictionsJSON}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-500" />
                <span>Export JSON Log</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                    <th className="py-3 px-4">Valuation ID</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Property Specs</th>
                    <th className="py-3 px-4">Predicted Price</th>
                    <th className="py-3 px-4">AI Score</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredPredictions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                        No property calculation records stored in database yet.
                      </td>
                    </tr>
                  ) : (
                    filteredPredictions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">{p.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-indigo-600 dark:text-indigo-400">{p.userId}</td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {p.area} sqft • {p.bedrooms} BHK • {p.bathrooms} Bath • {p.furnishingstatus}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                          {formatINR(p.predictedPrice)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                            Score: {p.investmentScore}/100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">{formatDate(p.createdAt)}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUserPrediction(p.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete calculation record from database"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Cloud Database Integration Guide */}
        {activeTab === 'cloud_guide' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Google Firebase Console Connection Details (`pratikpanzade000@gmail.com`)</span>
              </div>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                जब आप <strong>console.firebase.google.com</strong> में अपने पर्सनल Gmail <strong>(pratikpanzade000@gmail.com)</strong> से लॉगिन करते हैं, तो आपका Firebase Project ID <code>smartestateai-97a8c</code> है।
              </p>
              <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                <strong>अपने खुद के Firebase Console में सभी Logins & Users देखने के 2 आसान तरीके:</strong>
              </p>
            </div>

            {/* Custom Firebase Form */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Cloud className="w-5 h-5 text-amber-500" />
                  <span>Connect Your Personal Firebase Console</span>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800">
                  Current Connected Project: {currentProjectId}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Step-by-step 2 Minutes Setup:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <li><a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center gap-1">console.firebase.google.com <ExternalLink className="w-3 h-3" /></a> पर <strong>pratikpanzade000@gmail.com</strong> से जाएँ।</li>
                  <li><strong>"+ Add project"</strong> पर क्लिक करके नया प्रोजेक्ट बनाएँ (उदा. <code>smart-estate</code>).</li>
                  <li>Left menu में <strong>Firestore Database</strong> &gt; <strong>Create Database</strong> करें (Start in Test mode).</li>
                  <li>Project Settings (⚙️ icon) &gt; General &gt; Niche Web App (<code>&lt;/&gt;</code>) icon पर क्लिक करें और Config details नीचे पेस्ट करें:</li>
                </ol>
              </div>

              {customConfigSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{customConfigSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Project ID</label>
                  <input
                    type="text"
                    placeholder="e.g. smart-estate-123"
                    value={customProjectId}
                    onChange={(e) => setCustomProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">API Key</label>
                  <input
                    type="text"
                    placeholder="AIzaSy..."
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">App ID</label>
                  <input
                    type="text"
                    placeholder="1:123456789:web:abcdef"
                    value={customAppId}
                    onChange={(e) => setCustomAppId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">Auth Domain (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. smart-estate-123.firebaseapp.com"
                    value={customAuthDomain}
                    onChange={(e) => setCustomAuthDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (!customProjectId || !customApiKey) {
                      alert('Please enter at least Project ID and API Key.');
                      return;
                    }
                    const cfg = {
                      apiKey: customApiKey.trim(),
                      projectId: customProjectId.trim(),
                      appId: customAppId.trim(),
                      authDomain: customAuthDomain.trim() || `${customProjectId.trim()}.firebaseapp.com`,
                    };
                    saveCustomFirebaseConfig(cfg);
                    setCustomConfigSuccess('Custom Firebase Connected! Reloading app...');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
                >
                  Save & Connect My Firebase Console
                </button>

                <button
                  onClick={() => {
                    resetToDefaultFirebaseConfig();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                >
                  Reset to Default Firebase
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* User Activity Inspector Modal */}
      {selectedUserForInspection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-lg shadow-indigo-600/30">
                  {selectedUserForInspection.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold">{selectedUserForInspection.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      {selectedUserForInspection.role || 'user'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">{selectedUserForInspection.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForInspection(null)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-900 dark:text-white">
              {/* User Account Quick Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">User Password</span>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{selectedUserForInspection.passwordHash || 'N/A'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Logins</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedUserForInspection.loginCount || 1} times</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Account Joined</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{selectedUserForInspection.createdAt ? formatDate(selectedUserForInspection.createdAt) : 'Initial'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Firebase Sync</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Live Cloud</span>
                  </span>
                </div>
              </div>

              {/* User Calculations & Activity Log */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-sm font-bold">User Activity & House Price Calculations ({
                      predictionsList.filter(p => {
                        const u = (p.userId || '').toLowerCase().trim();
                        return u === selectedUserForInspection.id.toLowerCase().trim() || u === selectedUserForInspection.email.toLowerCase().trim() || u === 'user_default';
                      }).length
                    })</h4>
                  </div>

                  <button
                    onClick={() => handleClearAllUserPredictions(selectedUserForInspection.id, selectedUserForInspection.email)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Activity Log</span>
                  </button>
                </div>

                {predictionsList.filter(p => {
                  const u = (p.userId || '').toLowerCase().trim();
                  return u === selectedUserForInspection.id.toLowerCase().trim() || u === selectedUserForInspection.email.toLowerCase().trim() || u === 'user_default';
                }).length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No calculation history found for this user.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {predictionsList.filter(p => {
                      const u = (p.userId || '').toLowerCase().trim();
                      return u === selectedUserForInspection.id.toLowerCase().trim() || u === selectedUserForInspection.email.toLowerCase().trim() || u === 'user_default';
                    }).map((p) => (
                      <div key={p.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400">{formatINR(p.predictedPrice)}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {p.confidence} AI Score
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {p.area} sq.ft • {p.bedrooms} Beds • {p.bathrooms} Baths • {p.parking} Parking • {p.furnishingstatus}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatDate(p.createdAt)} • ID: {p.id}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteUserPrediction(p.id)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shrink-0"
                          title="Delete this specific user calculation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Deletion Footer */}
              {selectedUserForInspection.email.toLowerCase().trim() !== 'pratikpanzade000@gmail.com' && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Permanent action: Removes account and Firestore DB entries.</span>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(selectedUserForInspection.id, selectedUserForInspection.email)}
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete User & All Account Data</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
