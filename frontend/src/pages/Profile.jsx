import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios.js';
import { useAuthStore } from '../store/auth.store.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Brain, TrendingUp, Target, User, BarChart2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass border border-indigo-500/20 rounded-xl px-4 py-3 text-sm shadow-xl">
        <p className="text-slate-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProfilePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get('/api/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Notes Created',
      value: stats?.notesCount || 0,
      icon: BookOpen,
      gradient: 'from-indigo-500 to-indigo-700',
      change: '+0 this week',
      badgeClass: 'badge-indigo',
    },
    {
      title: 'PDFs Uploaded',
      value: stats?.pdfCount || 0,
      icon: FileText,
      gradient: 'from-cyan-500 to-cyan-700',
      change: '+0 this week',
      badgeClass: 'badge-cyan',
    },
    {
      title: 'AI Queries',
      value: stats?.aiQueries || 0,
      icon: Brain,
      gradient: 'from-purple-500 to-purple-700',
      change: 'Total interactions',
      badgeClass: 'badge-purple',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-white/5 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl" />
          </div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-2xl gradient-indigo-purple flex items-center justify-center text-white text-2xl font-bold shadow-xl flex-shrink-0"
              style={{ boxShadow: '0 0 30px rgba(99,102,241,0.3)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                <span className="badge badge-indigo text-xs">Student</span>
              </div>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <p className="text-slate-600 text-xs mt-0.5">Member of StudyNest AI</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
        >
          {statCards.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="glass rounded-2xl p-6 border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1 duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <span className={`badge ${stat.badgeClass} text-xs`}>{stat.change}</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl border border-white/5 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Study Activity</h2>
            </div>
            <span className="text-slate-600 text-xs">Last 30 days</span>
          </div>

          {stats?.chartData && stats.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#475569', fontSize: 11 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                />
                <Line
                  type="monotone"
                  dataKey="notes"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  name="Notes"
                  dot={{ fill: '#6366f1', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#6366f1' }}
                />
                <Line
                  type="monotone"
                  dataKey="pdfs"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  name="PDFs"
                  dot={{ fill: '#06b6d4', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#06b6d4' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <TrendingUp size={40} className="text-slate-700 mb-3" />
              <p className="text-slate-500 text-sm">No activity data yet</p>
              <p className="text-slate-600 text-xs mt-1">Start creating notes and uploading PDFs to see your chart!</p>
            </div>
          )}
        </motion.div>

        {/* Study Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl border border-white/5 p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target size={18} className="text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Study Goals</h2>
          </div>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">Notes this week</span>
                <span className="text-indigo-400 font-semibold">0 / 10</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full gradient-indigo-purple" style={{ width: '0%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">PDFs analyzed</span>
                <span className="text-cyan-400 font-semibold">{Math.min(stats?.pdfCount || 0, 5)} / 5</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all duration-700"
                  style={{ width: `${Math.min(((stats?.pdfCount || 0) / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300 font-medium">AI interactions</span>
                <span className="text-purple-400 font-semibold">{Math.min(stats?.aiQueries || 0, 20)} / 20</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-700"
                  style={{ width: `${Math.min(((stats?.aiQueries || 0) / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
