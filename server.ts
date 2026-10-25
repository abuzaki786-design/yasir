import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Available voices
const VOICES = [
  { id: 'Kore', nameUrdu: 'کوری (خاتون)', descUrdu: 'دھیمی، واضح اور نرم آواز', nameEn: 'Kore (Female)', gender: 'Female', tone: 'Calm, soothing, clear' },
  { id: 'Puck', nameUrdu: 'پک (مرد)', descUrdu: 'پُرجوش، دوستانہ اور قدرتی آواز', nameEn: 'Puck (Male)', gender: 'Male', tone: 'Enthusiastic, friendly, warm' },
  { id: 'Zephyr', nameUrdu: 'زیفر (خاتون)', descUrdu: 'پیشہ ورانہ، شستہ اور شائستہ آواز', nameEn: 'Zephyr (Female)', gender: 'Female', tone: 'Gentle, articulate, pleasant' },
  { id: 'Fenrir', nameUrdu: 'فینریر (مرد)', descUrdu: 'مضبوط، پر اعتماد اور گرجدار آواز', nameEn: 'Fenrir (Male)', gender: 'Male', tone: 'Deep, confident, dramatic' },
  { id: 'Charon', nameUrdu: 'کیرون (مرد)', descUrdu: 'سنجیدہ، وقار اور معلوماتی انداز', nameEn: 'Charon (Male)', gender: 'Male', tone: 'Authoritative, resonant, serious' },
];

// Endpoint: list voices
app.get('/api/tts/voices', (req, res) => {
  res.json({ voices: VOICES });
});

// Endpoint: generate single or multi-speaker voice
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      voiceName = 'Kore',
      style = 'Clear, expressive, natural speaker',
      language = 'ur',
      accentDescription = '',
      emotionTone = '',
      pacing = '',
      isMultiSpeaker = false,
      speakers = [], // for multi-speaker: [{ speaker: 'Speaker 1', text: '...', voice: 'Kore', style: '...' }]
      modelType = 'gemini-3.8-flash-lite-tts' // or 'gemini-3.8-flash-tts'
    } = req.body;

    if (!text && (!speakers || speakers.length === 0)) {
      return res.status(400).json({ error: 'براہ کرم آڈیو تیار کرنے کے لیے متن درج کریں (Please provide text to generate voice)' });
    }

    if (isMultiSpeaker && speakers && speakers.length === 2) {
      // Dual-speaker generation using gemini-3.8-flash-tts
      const speaker1 = speakers[0];
      const speaker2 = speakers[1];

      const parts = [];
      if (speaker1.text?.trim()) {
        parts.push({
          text: `${speaker1.name}: ${speaker1.text}`,
          speechMetadata: {
            speaker: speaker1.name,
            style: speaker1.style || 'Clear and natural',
          },
        });
      }
      if (speaker2.text?.trim()) {
        parts.push({
          text: `${speaker2.name}: ${speaker2.text}`,
          speechMetadata: {
            speaker: speaker2.name,
            style: speaker2.style || 'Engaging and conversational',
          },
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: parts,
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: speaker1.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker1.voice || 'Puck' },
                  },
                },
                {
                  speaker: speaker2.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker2.voice || 'Kore' },
                  },
                },
              ],
            },
          },
        },
      });

      const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!audioBase64) {
        throw new Error('ماڈل سے آڈیو ڈیٹا موصول نہیں ہوا (Failed to receive audio data from model)');
      }

      return res.json({
        success: true,
        audioBase64,
        mimeType: 'audio/wav',
        model: 'gemini-3.8-flash-tts',
      });
    }

    // Single Speaker TTS - assemble composite style instruction
    const styleSegments = [];
    if (language) {
      styleSegments.push(`Language context: ${language}`);
    }
    if (accentDescription) {
      styleSegments.push(`Accent & Dialect: ${accentDescription}`);
    }
    if (emotionTone) {
      styleSegments.push(`Tone & Emotion: ${emotionTone}`);
    }
    if (pacing) {
      styleSegments.push(`Pacing: ${pacing}`);
    }
    if (style && style.trim()) {
      styleSegments.push(`Style nuances: ${style.trim()}`);
    }

    const synthesizedStyle = styleSegments.join('. ') || 'Clear, natural, articulate pronunciation';
    const chosenModel = modelType === 'gemini-3.8-flash-tts' ? 'gemini-3.8-flash-tts' : 'gemini-3.8-flash-lite-tts';

    const response = await ai.models.generateContent({
      model: chosenModel,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: synthesizedStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioBase64) {
      throw new Error('ماڈل سے آڈیو ڈیٹا موصول نہیں ہوا (Failed to receive audio data from model)');
    }

    return res.json({
      success: true,
      audioBase64,
      mimeType: 'audio/wav',
      voiceName,
      model: chosenModel,
      synthesizedStyle,
    });
  } catch (err: any) {
    console.error('Error generating voice audio:', err);
    res.status(500).json({
      error: err?.message || 'آڈیو وائس جنریٹ کرنے میں خرابی پیش آگئی (Error generating voice audio)',
    });
  }
});

// Endpoint: AI Script / Text Enhancement Helper (translates, polishes, or formats scripts)
app.post('/api/ai/enhance-text', async (req, res) => {
  try {
    const { prompt, mode = 'urdu_poetic', targetLanguage = 'Urdu', targetAccent = '' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Text prompt is required' });
    }

    let systemInstruction = 'You are an expert multilingual voice-over script writer and translator. Output ONLY the refined text script with natural punctuation suitable for high-quality speech generation. Do NOT include markdown headers, quotes, or commentary.';

    if (mode === 'translate_and_adapt') {
      systemInstruction += ` Translate and naturally adapt this text into ${targetLanguage} (${targetAccent || 'native cadence'}). Make it sound exceptionally natural for an audio voice-over actor, keeping the exact meaning and emotional weight intact.`;
    } else if (mode === 'urdu_story') {
      systemInstruction += ' Craft an engaging, captivating Urdu story narration with dramatic pauses and emotional depth.';
    } else if (mode === 'urdu_news') {
      systemInstruction += ' Format as a formal, crisp Urdu news broadcast bulletin headline and reporting.';
    } else if (mode === 'urdu_quote') {
      systemInstruction += ' Formulate an inspiring motivational and wisdom quote in refined Urdu.';
    } else if (mode === 'urdu_conversation') {
      systemInstruction += ' Write a natural spoken Urdu dialogue with conversational flow.';
    } else if (mode === 'vocal_bursts') {
      systemInstruction += ' Add expressive TTS burst tags where appropriate, such as <breath>, <laugh>, <gasp> or |yeah|, |mhm| for realistic dialogue.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    res.json({
      success: true,
      result: response.text?.trim() || prompt,
    });
  } catch (err: any) {
    console.error('Script enhancement error:', err);
    res.status(500).json({ error: err?.message || 'Failed to enhance script' });
  }
});

// Mount Vite or static build
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Voice Studio server running on port ${port}`);
});
