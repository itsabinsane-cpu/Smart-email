import React from 'react';
import { 
  Sparkles, 
  FileEdit, 
  Clock, 
  SlidersHorizontal, 
  ShieldCheck, 
  Cpu, 
  Code 
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header & Mission */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-xs font-semibold">
          OUR MISSION
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reimagining Communication with Intelligence
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
          SmartMail AI was founded on a simple premise: email should be a tool for productivity, not a source of stress. We leverage state-of-the-art artificial intelligence to help you draft perfect, context-aware emails in seconds.
        </p>
      </div>

      {/* Hero Visual Card / Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 shadow-sm bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 md:p-12">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
            <Cpu className="w-4 h-4" />
            <span>Smart Workspace Technology</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Intelligent Email Assistant, Reimagined.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Eliminating anxiety and friction from professional correspondence through artificial intelligence, custom tone control, and persistent document storage.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-12 top-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* The Challenges We Solve Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          The Challenges We Solve
        </h2>

        <div className="space-y-4">
          {/* Item 1 */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Writer's Block
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Staring at a blank cursor is a thing of the past. Start with a prompt and get a draft immediately.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Hours Wasted
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Reduce the time spent on repetitive email drafting by up to 80% with smart automation.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Tone Mismatch
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Adjust your tone from 'Formal' to 'Casual' with a single click, ensuring your message lands correctly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gemini AI Banner */}
      <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-100">
            <Sparkles className="w-4 h-4 fill-white" />
            <span>POWERED BY GOOGLE GEMINI</span>
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">
            Intelligence at Heart
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl leading-relaxed">
            Built using the Google Gemini 2.5 AI model for lightning-fast, high-accuracy natural language email synthesis and tone adaptation.
          </p>
        </div>

        <div className="shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
            <Code className="w-4 h-4" />
            <span>React + Firebase + Express</span>
          </div>
        </div>
      </div>

    </div>
  );
};
