import React, { useState } from 'react';
import { GeneratedEmail, SavedEmail, UserSettings } from '../../types';
import { saveEmailToFirestore } from '../../lib/firebase';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  Send, 
  Lightbulb, 
  Loader2, 
  Mail,
  RefreshCw
} from 'lucide-react';

interface GeneratePageProps {
  userSettings: UserSettings;
  onEmailSaved?: () => void;
}

export const GeneratePage: React.FC<GeneratePageProps> = ({ userSettings, onEmailSaved }) => {
  const [emailType, setEmailType] = useState('Job Application');
  const [tone, setTone] = useState(userSettings.defaultTone || 'Professional');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subjectPurpose, setSubjectPurpose] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmail | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const emailTypes = [
    'Job Application',
    'Networking',
    'Follow-up',
    'Sales Pitch',
    'Resignation',
    'Meeting Request',
    'Thank You',
    'Complaint / Feedback',
    'General Inquiry'
  ];

  const tones = [
    'Professional & Direct',
    'Friendly Professional',
    'High Tone Confidence',
    'Concise',
    'Formal',
    'Persuasive',
    'Apologetic'
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectPurpose.trim()) {
      setErrorMsg('Please enter a subject or purpose for the email.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setCopied(false);
    setSaved(false);

    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType,
          recipientName,
          recipientEmail,
          subjectPurpose,
          tone,
          additionalDetails,
          defaultSignature: userSettings.defaultSignature
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Server error generating email');
      }

      const data: GeneratedEmail = await res.json();
      setGeneratedEmail(data);
    } catch (err: any) {
      console.error('Error generating email:', err);
      setErrorMsg(err.message || 'Failed to generate email. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    navigator.clipboard.writeText(generatedEmail.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    if (!generatedEmail) return;
    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      await saveEmailToFirestore({
        subject: generatedEmail.subject,
        recipient: recipientName || 'Recipient',
        recipientEmail: recipientEmail || '',
        emailType: emailType,
        tone: tone,
        greeting: generatedEmail.greeting,
        emailBody: generatedEmail.body,
        closing: generatedEmail.closing,
        fullEmailText: generatedEmail.fullText,
        dateCreated: dateStr
      });

      setSaved(true);
      if (onEmailSaved) onEmailSaved();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving email:', err);
      alert('Failed to save email to database.');
    }
  };

  const handleSendMailto = () => {
    if (!generatedEmail) return;
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.fullText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Section */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Craft Your Perfect Message
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Let AI handle the wording while you focus on the intent.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-5">
            
            {/* Row 1: Email Type & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  EMAIL TYPE
                </label>
                <select
                  value={emailType}
                  onChange={(e) => setEmailType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {emailTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  TONE
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {tones.map((tn) => (
                    <option key={tn} value={tn}>{tn}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Recipient Name & Recipient Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  RECIPIENT NAME
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  RECIPIENT EMAIL (OPTIONAL)
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="e.g. sarah@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Subject / Purpose */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                SUBJECT / PURPOSE
              </label>
              <input
                type="text"
                required
                value={subjectPurpose}
                onChange={(e) => setSubjectPurpose(e.target.value)}
                placeholder="Briefly state why you're writing"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                ADDITIONAL DETAILS & CONTEXT
              </label>
              <textarea
                rows={4}
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Mention key points, specific dates, or special requirements you want the AI to include..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Professional Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Email</span>
                </>
              )}
            </button>
          </form>

          {/* Pro Tip Box */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 p-4 rounded-xl flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong className="font-semibold">Pro Tip:</strong> Be as specific as possible in the context section for a more tailored output.
            </p>
          </div>
        </div>

        {/* Right Column: Generated Output */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Generated Email
          </h2>

          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-6 min-h-[460px] flex flex-col justify-between shadow-xs transition-all">
            {!generatedEmail ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                  Fill out the form and click generate to see your professional email.
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Generated Content Body */}
                <div className="space-y-4 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                  
                  {/* Subject Header Banner */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Subject
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {generatedEmail.subject}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3 whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300 pt-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">{generatedEmail.greeting}</p>
                    <p className="leading-relaxed">{generatedEmail.body}</p>
                    <p className="pt-2 font-medium">{generatedEmail.closing}</p>
                  </div>
                </div>

                {/* Toolbar Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Copy Button */}
                    <button
                      onClick={handleCopy}
                      className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>

                    {/* Save Button */}
                    <button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      {saved ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Saved to Database!</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Mailto & Regenerate Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSendMailto}
                      className="flex-1 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-medium py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-teal-200/60 dark:border-teal-800/60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send in Email Client</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
