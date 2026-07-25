import React from 'react';
import { Page } from '../../types';
import { Sparkles, Zap, ShieldCheck, Clock, Layers, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-12 px-4 md:px-8 max-w-6xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-6 pb-12">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/80 dark:border-teal-800 text-teal-700 dark:text-teal-300 px-4 py-1.5 rounded-full text-xs font-semibold shadow-xs mb-8">
          <Zap className="w-3.5 h-3.5 fill-teal-500 text-teal-500" />
          <span>AI-Powered Writing Assistant</span>
        </div>

        {/* Main Display Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Write Professional Emails with AI
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-slate-600 dark:text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Generate polished emails for university, internships, jobs, business and personal communication in seconds. Elevate your professional presence effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('generate')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Email</span>
          </button>

          <button
            onClick={() => onNavigate('saved')}
            className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-base px-8 py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            View Samples
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 pt-12 border-t border-slate-200/70 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Powerful Features for Busy People
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to communicate effectively and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Context-Aware AI</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Provides tailored email drafts matched specifically to your recipient, purpose, and selected tone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instant Saving</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Store and organize generated drafts in real-time Firestore database for quick retrieval anytime.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Custom Signatures</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Set default sign-offs and preferred tones in settings to auto-append to every generated email.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
