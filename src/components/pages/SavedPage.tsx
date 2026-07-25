import React, { useState, useEffect } from 'react';
import { SavedEmail } from '../../types';
import { subscribeToSavedEmails, deleteEmailFromFirestore } from '../../lib/firebase';
import { 
  Search, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Bookmark, 
  Copy, 
  Check, 
  X, 
  Send 
} from 'lucide-react';

export const SavedPage: React.FC = () => {
  const [emails, setEmails] = useState<SavedEmail[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedEmailModal, setSelectedEmailModal] = useState<SavedEmail | null>(null);
  const [copiedModal, setCopiedModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSavedEmails((data) => {
      setEmails(data);
    });
    return () => unsubscribe();
  }, []);

  const filterChips = ['All', 'Personal', 'Job Apps', 'Follow-ups', 'Pitch'];

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this saved email?')) {
      await deleteEmailFromFirestore(id);
      if (selectedEmailModal?.id === id) {
        setSelectedEmailModal(null);
      }
    }
  };

  const handleCopyModal = () => {
    if (!selectedEmailModal) return;
    navigator.clipboard.writeText(selectedEmailModal.fullEmailText);
    setCopiedModal(true);
    setTimeout(() => setCopiedModal(false), 2500);
  };

  // Filter logic
  const filteredEmails = emails.filter((item) => {
    const matchesSearch = 
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.emailBody.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Personal') return item.emailType.toLowerCase().includes('general') || item.emailType.toLowerCase().includes('thank');
    if (selectedFilter === 'Job Apps') return item.emailType.toLowerCase().includes('job') || item.emailType.toLowerCase().includes('resignation');
    if (selectedFilter === 'Follow-ups') return item.emailType.toLowerCase().includes('follow') || item.emailType.toLowerCase().includes('meeting');
    if (selectedFilter === 'Pitch') return item.emailType.toLowerCase().includes('pitch') || item.emailType.toLowerCase().includes('sales') || item.emailType.toLowerCase().includes('networking');

    return true;
  });

  const getBadgeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('job')) return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200/60 dark:border-teal-800';
    if (t.includes('network') || t.includes('sales') || t.includes('pitch')) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800';
    if (t.includes('follow')) return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800';
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Saved Emails
        </h1>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved emails..."
            className="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs transition-shadow"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterChips.map((chip) => {
            const isActive = selectedFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setSelectedFilter(chip)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-teal-50/80 dark:bg-slate-800 text-teal-700 dark:text-slate-300 border border-teal-100 dark:border-slate-700 hover:bg-teal-100 dark:hover:bg-slate-700'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Emails List */}
      <div className="space-y-4 pt-2">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700">
            <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No saved emails found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Generate emails and click "Save Email" to keep them organized here.
            </p>
          </div>
        ) : (
          filteredEmails.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedEmailModal(item)}
              className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              {/* Card Top: Tag + Date */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getBadgeColor(item.emailType)}`}>
                  {item.emailType}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {item.dateCreated}
                </span>
              </div>

              {/* Subject Title */}
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.subject}
              </h3>

              {/* Excerpt Body */}
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                {item.greeting ? `${item.greeting} ` : ''}{item.emailBody}
              </p>

              {/* Card Bottom Row: Tone + Action buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{item.tone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Delete Email"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEmailModal(item);
                    }}
                    className="bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal Dialog for Full Email Viewing */}
      {selectedEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-5 max-h-[90vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeColor(selectedEmailModal.emailType)}`}>
                    {selectedEmailModal.emailType}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedEmailModal.dateCreated}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white pt-1">
                  {selectedEmailModal.subject}
                </h2>
              </div>

              <button
                onClick={() => setSelectedEmailModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto space-y-4 text-sm text-slate-800 dark:text-slate-200 leading-relaxed pr-2 my-2">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl text-xs space-y-1 border border-slate-100 dark:border-slate-700">
                <p><span className="font-bold text-slate-500">To:</span> {selectedEmailModal.recipient} {selectedEmailModal.recipientEmail ? `<${selectedEmailModal.recipientEmail}>` : ''}</p>
                <p><span className="font-bold text-slate-500">Tone:</span> {selectedEmailModal.tone}</p>
              </div>

              <div className="whitespace-pre-wrap font-sans text-sm space-y-3">
                {selectedEmailModal.fullEmailText}
              </div>
            </div>

            {/* Modal Footer Toolbar */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={(e) => handleDelete(e, selectedEmailModal.id)}
                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyModal}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedModal ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${selectedEmailModal.recipientEmail || ''}?subject=${encodeURIComponent(selectedEmailModal.subject)}&body=${encodeURIComponent(selectedEmailModal.fullEmailText)}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
