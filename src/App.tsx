import React, { useState, useEffect } from 'react';
import { Page, UserSettings } from './types';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/pages/HomePage';
import { GeneratePage } from './components/pages/GeneratePage';
import { SavedPage } from './components/pages/SavedPage';
import { AboutPage } from './components/pages/AboutPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { initAnonymousAuth, loadUserSettings, DEFAULT_USER_SETTINGS } from './lib/firebase';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [userInitials, setUserInitials] = useState('JD');

  useEffect(() => {
    // 1. Initialize Firebase Anonymous Auth
    initAnonymousAuth().then((user) => {
      if (user) {
        if (user.uid) {
          setUserInitials(user.uid.substring(0, 2).toUpperCase());
        }
      }
    });

    // 2. Load User Settings
    loadUserSettings().then((settings) => {
      setUserSettings(settings);
    });
  }, []);

  // Sync Dark Mode class with root document
  useEffect(() => {
    if (userSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.darkMode]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Header & Mobile Drawer Navigation */}
      <Navigation
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        userInitials={userInitials}
      />

      {/* Main Content Pages */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={(page) => setCurrentPage(page)} />
        )}

        {currentPage === 'generate' && (
          <GeneratePage 
            userSettings={userSettings} 
            onEmailSaved={() => {
              // Optional callback on email saved
            }}
          />
        )}

        {currentPage === 'saved' && (
          <SavedPage />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            settings={userSettings}
            onSettingsUpdated={(newSettings) => setUserSettings(newSettings)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} SmartMail AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <button onClick={() => setCurrentPage('about')} className="hover:underline cursor-pointer">About</button>
            <button onClick={() => setCurrentPage('settings')} className="hover:underline cursor-pointer">Settings</button>
            <button onClick={() => setCurrentPage('generate')} className="hover:underline cursor-pointer">Generate</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
