export interface Voice {
  id: string;
  nameUrdu: string;
  descUrdu: string;
  nameEn: string;
  gender: 'Female' | 'Male';
  tone: string;
}

export interface GenerationHistoryItem {
  id: string;
  text: string;
  audioBase64: string;
  voiceName: string;
  model: string;
  createdAt: string;
  isMultiSpeaker?: boolean;
  style?: string;
  language?: string;
  accent?: string;
  emotionTone?: string;
  speaker1?: string;
  speaker2?: string;
}

export interface ScriptTemplate {
  id: string;
  titleUrdu: string;
  titleEn: string;
  category: string;
  text: string;
  suggestedVoice: string;
  suggestedStyle: string;
}
