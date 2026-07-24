import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { motion } from 'framer-motion';
import {
  BookOpen, Brain, FileText, Users, BarChart2,
  ArrowRight, Zap, Sparkles, Star, TrendingUp, Clock
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Home = () => {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-indigo-900 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Organize your study materials with intelligent note-taking and folder management. Supports full Markdown.',
      link: '/notes',
      gradient: 'from-indigo-500 to-indigo-600',
      glow: 'hover:shadow-indigo-500/20',
      badge: 'Markdown',
      badgeClass: 'badge-indigo',
    },
    {
      icon: Brain,
      title: 'AI Actions',
      description: 'Transform your notes into interactive flashcards, study questions, and AI-powered summaries.',
      link: '/ai',
      gradient: 'from-purple-500 to-purple-700',
      glow: 'hover:shadow-purple-500/20',
      badge: 'Gemini AI',
      badgeClass: 'badge-purple',
    },
    {
      icon: FileText,
      title: 'PDF Chat',
      description: 'Upload any PDF and have intelligent conversations about its content using LangChain AI.',
      link: '/chat',
      gradient: 'from-cyan-500 to-cyan-700',
      glow: 'hover:shadow-cyan-500/20',
      badge: 'LangChain',
      badgeClass: 'badge-cyan',
    },
    {
      icon: Users,
      title: 'Study Rooms',
      description: 'Join collaborative real-time study sessions with AI tutor assistance powered by Socket.io.',
      link: '/study-rooms',
      gradient: 'from-emerald-500 to-emerald-700',
      glow: 'hover:shadow-emerald-500/20',
      badge: 'Real-time',
      badgeClass: 'badge-emerald',
    },
    {
      icon: BarChart2,
      title: 'Analytics',
      description: 'Track your study progress with detailed charts. Visualize your productivity over time.',
      link: '/profile',
      gradient: 'from-violet-500 to-violet-700',
      glow: 'hover:shadow-violet-500/20',
      badge: 'Insights',
      badgeClass: 'badge-purple',
    },
  ];

  const stats = [
    { label: 'AI Powered', value: '100%', icon: Brain, color: 'text-indigo-400' },
    { label: 'Available', value: '24/7', icon: Clock, color: 'text-cyan-400' },
    { label: 'Features', value: '5+', icon: Star, color: 'text-purple-400' },
    { label: 'Smarter', value: '2×', icon: TrendingUp, color: 'text-emerald-400' },
  ];

  const howItWorks = [
    { step: '01', title: 'Create Notes', desc: 'Write and organize your study materials in smart folders', color: 'text-indigo-400 border-indigo-500/30' },
    { step: '02', title: 'Activate AI', desc: 'Generate flashcards, summaries, and questions automatically', color: 'text-purple-400 border-purple-500/30' },
    { step: '03', title: 'Study Smarter', desc: 'Chat with PDFs, join study rooms, and track progress', color: 'text-cyan-400 border-cyan-500/30' },
  ];

  return (
    <div className="min-h-screen bg-[#050816] pt-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-900/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-[80px]" />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 badge badge-indigo mb-6 py-1.5 px-4"
            >
              <Sparkles size={12} />
              Powered by Google Gemini AI
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Study Smarter with
              <br />
              <span className="gradient-text">StudyNest AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Your intelligent study companion that transforms how you learn, organize, and master any subject using the power of artificial intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/notes"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl btn-primary text-white font-semibold text-base shadow-xl"
                  style={{ boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}
                >
                  Start Studying
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/ai"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl btn-secondary text-base font-semibold"
                >
                  <Zap size={16} />
                  Try AI Features
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="glass rounded-2xl p-5 text-center border border-white/5 hover:border-indigo-500/20 transition-all hover:-translate-y-1 duration-300">
                  <stat.icon size={20} className={`${stat.color} mx-auto mb-2`} />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-slate-500 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 badge badge-purple mb-4">
              <Zap size={11} />
              All Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From AI-powered summaries to real-time collaboration, StudyNest AI has all the tools to supercharge your learning.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Link to={feature.link} className="block group">
                  <div className={`glass rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${feature.glow}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                        <feature.icon size={22} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                            {feature.title}
                          </h3>
                          <span className={`badge ${feature.badgeClass} text-xs`}>{feature.badge}</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                        <div className="flex items-center gap-1 mt-3 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Open {feature.title}</span>
                          <ArrowRight size={13} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">Get started in 3 simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 border border-white/5 text-center relative"
              >
                <div className={`text-4xl font-bold mb-3 ${step.color.split(' ')[0]}`}>{step.step}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight size={16} className="text-slate-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass rounded-3xl p-10 border border-indigo-500/15 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(168,85,247,0.08) 100%)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl gradient-indigo-purple flex items-center justify-center mx-auto mb-6 shadow-xl"
                style={{ boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Study Smarter?
              </h2>
              <p className="text-slate-400 mb-8 text-lg">
                Join students who are already using StudyNest AI to ace their studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/notes"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl btn-primary text-white font-semibold text-base"
                    style={{ boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}
                  >
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl btn-secondary text-base font-semibold"
                  >
                    <BarChart2 size={16} />
                    View Analytics
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg gradient-indigo-purple flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-sm font-semibold gradient-text">StudyNest AI</span>
          </div>
          <p className="text-slate-600 text-xs">
            Built with ❤️ using React, Node.js, LangChain & Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;