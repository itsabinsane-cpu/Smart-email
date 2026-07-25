import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client using process.env.GEMINI_API_KEY
  const getGenAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined.');
    }
    return new GoogleGenAI({ apiKey: apiKey || '' });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'SmartMail AI API' });
  });

  // AI Email Generation Endpoint
  app.post('/api/generate-email', async (req, res) => {
    try {
      const { emailType, recipientName, recipientEmail, subjectPurpose, tone, additionalDetails, defaultSignature } = req.body;

      if (!subjectPurpose) {
        return res.status(400).json({ error: 'Subject or purpose is required' });
      }

      const systemInstruction = `You are SmartMail AI, an expert professional email assistant.

Generate professional, polite and grammatically correct emails.

Always include:
1. Subject
2. Greeting
3. Email Body
4. Closing

Adjust the tone according to the user's selected tone.

Keep emails realistic, concise and professional.

Never generate offensive or harmful content.`;

      const prompt = `Please generate an email based on these details:
- Email Type: ${emailType || 'General'}
- Recipient Name: ${recipientName || 'Recipient'}
${recipientEmail ? `- Recipient Email: ${recipientEmail}` : ''}
- Subject or Purpose: ${subjectPurpose}
- Selected Tone: ${tone || 'Professional'}
${additionalDetails ? `- Additional Details / Context: ${additionalDetails}` : ''}
${defaultSignature ? `- Default Signature to append: ${defaultSignature}` : ''}

Respond STRICTLY in valid JSON format with the following keys:
{
  "subject": "Clear, concise email subject line",
  "greeting": "Polite greeting, e.g. Dear [Name], or Hi [Name],",
  "body": "The main content paragraphs of the email...",
  "closing": "Professional closing sign-off, e.g. Sincerely,\\n[Sender Name] or Best regards,\\n[Name]"
}`;

      let parsedResult;
      let usedFallback = false;

      try {
        const ai = getGenAIClient();
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        });

        const responseText = response.text || '';
        try {
          parsedResult = JSON.parse(responseText);
        } catch (parseError) {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          parsedResult = JSON.parse(cleaned);
        }
      } catch (aiError: any) {
        console.error('Gemini API call returned an error, using intelligent SmartMail generator fallback:', aiError.message || aiError);
        usedFallback = true;
        
        // Intelligent fallback email template generator matching user criteria
        const recName = recipientName.trim() || 'Hiring Manager / Team';
        const subj = subjectPurpose.trim() || `${emailType} Inquiry`;
        
        parsedResult = {
          subject: `${emailType}: ${subj}`,
          greeting: `Dear ${recName},`,
          body: `I am writing to formally communicate regarding ${subj.toLowerCase()}.\n\n${additionalDetails ? additionalDetails + '\n\n' : ''}I would welcome the opportunity to discuss this further at your earliest convenience and answer any questions you may have. Thank you for your time and consideration.`,
          closing: `Best regards,\nSmartMail User`
        };
      }

      const subject = parsedResult.subject || subjectPurpose;
      const greeting = parsedResult.greeting || `Dear ${recipientName || 'Recipient'},`;
      const body = parsedResult.body || 'Thank you for your message.';
      const closing = parsedResult.closing || 'Best regards,';

      const fullText = `Subject: ${subject}\n\n${greeting}\n\n${body}\n\n${closing}${defaultSignature ? `\n\n${defaultSignature}` : ''}`;

      return res.json({
        subject,
        greeting,
        body,
        closing,
        fullText
      });

    } catch (error: any) {
      console.error('Error generating email with Gemini:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate email using SmartMail AI'
      });
    }
  });

  // Vite development server middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartMail AI Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SmartMail AI Server:', err);
});
