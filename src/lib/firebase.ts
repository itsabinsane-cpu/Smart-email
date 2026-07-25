/// <reference types="vite/client" />
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
  Unsubscribe
} from 'firebase/firestore';
import { SavedEmail, UserSettings } from '../types';

// Default web config fallback (works with emulator/demo or standard injected config)
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForSmartMailAI12345",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "smartmail-ai.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "smartmail-ai",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "smartmail-ai.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// In-memory + localStorage fallback helper for uninterrupted offline & initial experience
const LOCAL_SAVED_EMAILS_KEY = 'smartmail_ai_saved_emails';
const LOCAL_SETTINGS_KEY = 'smartmail_ai_settings';

const initialMockSavedEmails: SavedEmail[] = [
  {
    id: 'mock-1',
    subject: 'Frontend Engineer Proposal - TechFlow',
    recipient: 'Hiring Manager',
    recipientEmail: 'careers@techflow.io',
    emailType: 'Job Application',
    tone: 'High Tone Confidence',
    greeting: 'Dear Hiring Manager,',
    emailBody: 'I am writing to express my strong interest in the Frontend Engineer position at TechFlow. With over 5 years of experience building modern React applications and scalable UI design systems, I am confident in my ability to contribute immediately to your team\'s goals.',
    closing: 'Best regards,\nJohn Doe',
    fullEmailText: 'Subject: Frontend Engineer Proposal - TechFlow\n\nDear Hiring Manager,\n\nI am writing to express my strong interest in the Frontend Engineer position at TechFlow. With over 5 years of experience building modern React applications and scalable UI design systems, I am confident in my ability to contribute immediately to your team\'s goals.\n\nBest regards,\nJohn Doe',
    dateCreated: 'Oct 24, 2024',
    createdAtTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'mock-2',
    subject: 'Coffee Chat Request - Sarah Jenkins',
    recipient: 'Sarah Jenkins',
    recipientEmail: 'sarah.j@designco.com',
    emailType: 'Networking',
    tone: 'Friendly Professional',
    greeting: 'Hi Sarah,',
    emailBody: 'I\'ve been following your work on minimalist UI design systems and would love to learn more about your process at DesignCo. If you have 15 minutes available next week, I would be honored to grab a virtual coffee chat.',
    closing: 'Warmly,\nJohn Doe',
    fullEmailText: 'Subject: Coffee Chat Request - Sarah Jenkins\n\nHi Sarah,\n\nI\'ve been following your work on minimalist UI design systems and would love to learn more about your process at DesignCo. If you have 15 minutes available next week, I would be honored to grab a virtual coffee chat.\n\nWarmly,\nJohn Doe',
    dateCreated: 'Oct 22, 2024',
    createdAtTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 4
  },
  {
    id: 'mock-3',
    subject: 'Regarding Project X - Q3 Deliverables',
    recipient: 'Project Team',
    recipientEmail: 'team@company.com',
    emailType: 'Follow-up',
    tone: 'Concise',
    greeting: 'Hi Team,',
    emailBody: 'Just following up on our meeting from Tuesday. I\'ve attached the latest drafts for the project roadmap and deliverables schedule. Please review and send your feedback by Thursday EOD.',
    closing: 'Thanks,\nJohn Doe',
    fullEmailText: 'Subject: Regarding Project X - Q3 Deliverables\n\nHi Team,\n\nJust following up on our meeting from Tuesday. I\'ve attached the latest drafts for the project roadmap and deliverables schedule. Please review and send your feedback by Thursday EOD.\n\nThanks,\nJohn Doe',
    dateCreated: 'Oct 19, 2024',
    createdAtTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 7
  },
  {
    id: 'mock-4',
    subject: 'Revolutionizing your workflow with AI',
    recipient: 'Prospect',
    recipientEmail: 'lead@enterprise.com',
    emailType: 'Sales Pitch',
    tone: 'Persuasive',
    greeting: 'Hello,',
    emailBody: 'I\'ve noticed your team is spending a lot of time on manual correspondence. What if you could automate 80% of repetitive drafting while increasing response rates? I\'d love to show you a 2-minute demo of SmartMail AI.',
    closing: 'Sincerely,\nJohn Doe',
    fullEmailText: 'Subject: Revolutionizing your workflow with AI\n\nHello,\n\nI\'ve noticed your team is spending a lot of time on manual correspondence. What if you could automate 80% of repetitive drafting while increasing response rates? I\'d love to show you a 2-minute demo of SmartMail AI.\n\nSincerely,\nJohn Doe',
    dateCreated: 'Oct 15, 2024',
    createdAtTimestamp: Date.now() - 1000 * 60 * 60 * 24 * 11
  }
];

function getLocalSavedEmails(): SavedEmail[] {
  try {
    const data = localStorage.getItem(LOCAL_SAVED_EMAILS_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_SAVED_EMAILS_KEY, JSON.stringify(initialMockSavedEmails));
      return initialMockSavedEmails;
    }
    return JSON.parse(data);
  } catch (e) {
    return initialMockSavedEmails;
  }
}

function saveLocalSavedEmails(emails: SavedEmail[]) {
  try {
    localStorage.setItem(LOCAL_SAVED_EMAILS_KEY, JSON.stringify(emails));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

// Ensure user is signed in anonymously
export async function initAnonymousAuth(): Promise<User | null> {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const userCredential = await signInAnonymously(auth);
          resolve(userCredential.user);
        } catch (error) {
          console.warn('Anonymous auth failed or running in preview mode:', error);
          resolve(null);
        }
      }
    });
  });
}

// Realtime listener for saved emails (Combines Firestore with LocalStorage state)
export function subscribeToSavedEmails(
  callback: (emails: SavedEmail[]) => void
): Unsubscribe {
  const currentUser = auth.currentUser;
  
  if (currentUser && db) {
    try {
      const q = query(
        collection(db, 'saved_emails'),
        where('uid', '==', currentUser.uid),
        orderBy('createdAtTimestamp', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteEmails: SavedEmail[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            remoteEmails.push({
              id: docSnap.id,
              uid: data.uid,
              subject: data.subject || '',
              recipient: data.recipient || 'N/A',
              recipientEmail: data.recipientEmail || '',
              emailType: data.emailType || 'General',
              tone: data.tone || 'Professional',
              greeting: data.greeting || '',
              emailBody: data.emailBody || '',
              closing: data.closing || '',
              fullEmailText: data.fullEmailText || '',
              dateCreated: data.dateCreated || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              createdAtTimestamp: data.createdAtTimestamp || Date.now()
            });
          });

          // Merge local & remote for optimal experience
          const local = getLocalSavedEmails();
          const combined = [...remoteEmails];
          local.forEach(item => {
            if (!combined.some(r => r.id === item.id)) {
              combined.push(item);
            }
          });
          combined.sort((a, b) => b.createdAtTimestamp - a.createdAtTimestamp);
          callback(combined);
        },
        (error) => {
          console.warn('Firestore subscription notice (using local storage fallback):', error.message);
          callback(getLocalSavedEmails());
        }
      );

      return unsubscribe;
    } catch (e) {
      console.warn('Firestore query error fallback:', e);
    }
  }

  // Fallback if auth/db not ready yet
  callback(getLocalSavedEmails());
  
  // Custom event listener for local updates
  const handleStorageChange = () => {
    callback(getLocalSavedEmails());
  };
  window.addEventListener('smartmail_emails_updated', handleStorageChange);
  return () => {
    window.removeEventListener('smartmail_emails_updated', handleStorageChange);
  };
}

// Save email to Firestore + LocalStorage
export async function saveEmailToFirestore(emailData: Omit<SavedEmail, 'id' | 'createdAtTimestamp'>): Promise<string> {
  const createdAtTimestamp = Date.now();
  const currentUser = auth.currentUser;
  
  const newEmail: SavedEmail = {
    ...emailData,
    id: 'email-' + createdAtTimestamp,
    uid: currentUser ? currentUser.uid : 'anon-user',
    createdAtTimestamp
  };

  // 1. Save to localStorage first for instant UI response
  const localEmails = getLocalSavedEmails();
  const updatedLocal = [newEmail, ...localEmails];
  saveLocalSavedEmails(updatedLocal);
  window.dispatchEvent(new Event('smartmail_emails_updated'));

  // 2. Persist to Firestore if available
  if (currentUser && db) {
    try {
      const docRef = await addDoc(collection(db, 'saved_emails'), {
        ...newEmail,
        uid: currentUser.uid
      });
      return docRef.id;
    } catch (error) {
      console.warn('Firestore write fallback used:', error);
    }
  }

  return newEmail.id;
}

// Delete email from Firestore + LocalStorage
export async function deleteEmailFromFirestore(id: string): Promise<void> {
  // 1. Delete from localStorage
  const localEmails = getLocalSavedEmails();
  const filtered = localEmails.filter(e => e.id !== id);
  saveLocalSavedEmails(filtered);
  window.dispatchEvent(new Event('smartmail_emails_updated'));

  // 2. Delete from Firestore if doc exists
  if (db && !id.startsWith('mock-') && !id.startsWith('email-')) {
    try {
      await deleteDoc(doc(db, 'saved_emails', id));
    } catch (error) {
      console.warn('Firestore delete fallback:', error);
    }
  }
}

// User Settings Persistence
export const DEFAULT_USER_SETTINGS: UserSettings = {
  defaultTone: 'Professional & Direct',
  defaultSignature: '',
  darkMode: false
};

export function getLocalSettings(): UserSettings {
  try {
    const data = localStorage.getItem(LOCAL_SETTINGS_KEY);
    if (!data) return DEFAULT_USER_SETTINGS;
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_USER_SETTINGS;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  try {
    localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings locally:', e);
  }

  const currentUser = auth.currentUser;
  if (currentUser && db) {
    try {
      await setDoc(doc(db, 'user_settings', currentUser.uid), settings);
    } catch (e) {
      console.warn('Firestore settings save fallback:', e);
    }
  }
}

export async function loadUserSettings(): Promise<UserSettings> {
  const local = getLocalSettings();
  const currentUser = auth.currentUser;
  if (currentUser && db) {
    try {
      const docSnap = await getDoc(doc(db, 'user_settings', currentUser.uid));
      if (docSnap.exists()) {
        const data = docSnap.data() as UserSettings;
        localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('Firestore settings load fallback:', e);
    }
  }
  return local;
}
