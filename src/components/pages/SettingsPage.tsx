import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { saveUserSettings, DEFAULT_USER_SETTINGS } from '../../lib/firebase';
import { Moon, Sparkles, Star, Check, RefreshCw } from 'lucide-react';

interface SettingsPageProps {
  settings: UserSettings;
  onSettingsUpdated: (newSettings: UserSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSettingsUpdated
}) => {
  const [defaultTone, setDefaultTone] = useState(settings.defaultTone || 'Professional & Direct');
  const [defaultSignature, setDefaultSignature] = useState(settings.defaultSignature || '');
  const [darkMode, setDarkMode] = useState(settings.darkMode || false);

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const tones = [
    'Professional & Direct',
    'Friendly Professional',
    'High Tone Confidence',
    'Concise',
    'Formal',
    'Persuasive',
    'Apologetic'
  ];

  const handleSave = async () => {
    setIsSaving(true);
    const newSettings: UserSettings = {
      defaultTone,
      defaultSignature,
      darkMode
    };

    try {
      await saveUserSettings(newSettings);
      onSettingsUpdated(newSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setDefaultTone(DEFAULT_USER_SETTINGS.defaultTone);
    setDefaultSignature(DEFAULT_USER_SETTINGS.defaultSignature);
    setDarkMode(DEFAULT_USER_SETTINGS.darkMode);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Configure your AI preferences and account behaviors.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* Card 1: Dark Mode Toggle */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Dark Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adjust system interface appearance
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              darkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Card 2: AI Writing Preferences */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              AI Writing Preferences
            </h3>
          </div>

          {/* Default Tone Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              DEFAULT TONE
            </label>
            <select
              value={defaultTone}
              onChange={(e) => setDefaultTone(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Default Signature Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              DEFAULT SIGNATURE
            </label>
            <textarea
              rows={4}
              value={defaultSignature}
              onChange={(e) => setDefaultSignature(e.target.value)}
              placeholder="Enter your default email sign-off..."
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              This will be automatically appended to generated drafts.
            </p>
          </div>
        </div>

        {/* Card 3: Pro Plan Active */}
        <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm">
                Pro Plan Active
              </h4>
              <p className="text-xs text-blue-700/80 dark:text-blue-400">
                Next billing date: Jan 12, 2025
              </p>
            </div>
          </div>

          <button className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:underline tracking-wider uppercase cursor-pointer">
            MANAGE
          </button>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-1 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm cursor-pointer transition-colors"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved!</span>
            </>
          ) : (
            <span>Save Settings</span>
          )}
        </button>
      </div>

    </div>
  );
};
