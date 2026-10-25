import { ScriptTemplate } from '../types.ts';

export const SAMPLE_TEMPLATES: ScriptTemplate[] = [
  {
    id: 'urdu-poetry',
    titleUrdu: 'شاعری و غزل',
    titleEn: 'Poetry & Ghazal',
    category: 'ادب و شاعری',
    suggestedVoice: 'Kore',
    suggestedStyle: 'Poetic, soulful, deep emotional pauses, melodic Urdu',
    text: 'ستاروں سے آگے جہاں اور بھی ہیں،\nابھی عشق کے امتحان اور بھی ہیں۔\nاسی روز و شب میں الجھ کر نہ رہ جا،\nکہ تیرے زمان و مکاں اور بھی ہیں۔',
  },
  {
    id: 'urdu-news',
    titleUrdu: 'خبرنامہ و بلیٹن',
    titleEn: 'News Broadcast',
    category: 'خبریں',
    suggestedVoice: 'Charon',
    suggestedStyle: 'Authoritative, clear, formal Urdu news anchor with crisp diction',
    text: 'خواتین و حضرات، اہم خبر کے ساتھ حاضر ہیں۔ ملک بھر میں جدید ٹیکنالوجی کے فروغ کے لیے نئے منصوبوں کا آغاز کر دیا گیا ہے۔ ماہرین کے مطابق یہ اقدام ملکی معیشت اور نوجوانوں کے مستقبل کے لیے سنگ میل ثابت ہوگا۔',
  },
  {
    id: 'urdu-story',
    titleUrdu: 'داستان و کہانی',
    titleEn: 'Story Narration',
    category: 'کہانیاں',
    suggestedVoice: 'Fenrir',
    suggestedStyle: 'Dramatic, suspenseful, deep voice, narrative bedtime story tone',
    text: 'رات کے اندھیرے میں جب کہکشاں چمک رہی تھی، پرانے قلعے کی اونچی فصیلوں پر ایک پراسرار پرندہ آ کر بیٹھا۔ اس کی آنکھوں میں صدیوں کی خاموشی اور اَن کہی کہانیاں تھیں۔ پورا جنگل جیسے دم سادھے منتظر تھا۔',
  },
  {
    id: 'urdu-motivation',
    titleUrdu: 'حوصلہ افزائی و موٹیویشن',
    titleEn: 'Motivational Speech',
    category: 'موٹیویشن',
    suggestedVoice: 'Puck',
    suggestedStyle: 'Inspiring, energetic, uplifting, passionate motivational speaker',
    text: 'زندگی میں ہار اور جیت کا فیصلہ صرف آپ کے ارادے کرتے ہیں۔ اگر راستے کٹھن ہیں تو منزل بھی شاندار ہوگی۔ اپنے خوابوں کو حقیقت میں بدلنے کے لیے آج ہی اٹھیں اور اپنی ہمت کو پہچانیں!',
  },
  {
    id: 'urdu-commercial',
    titleUrdu: 'کمرشل و اشتہار',
    titleEn: 'Commercial Promo',
    category: 'اشتہارات',
    suggestedVoice: 'Zephyr',
    suggestedStyle: 'Upbeat, charming, vibrant, convincing radio commercial presenter',
    text: 'کیا آپ اپنی آواز کو دینا چاہتے ہیں ایک نیا انداز؟ اب مصنوعی ذہانت کے ذریعے چند لمحوں میں تیار کریں انتہائی معیاری اور قدرتی صوتی پیغامات۔ بہترین معیار، بے مثال رفتار!',
  },
  {
    id: 'urdu-podcast-duo',
    titleUrdu: 'پوڈکاسٹ مکالمہ',
    titleEn: 'Podcast Dialogue',
    category: 'مکالمہ',
    suggestedVoice: 'Puck',
    suggestedStyle: 'Friendly conversational dialogue with laughs and natural breaths',
    text: 'احمد: السلام علیکم دوستو! <breath> آج کے پوڈکاسٹ میں ہم بات کریں گے مستقبل کی دنیا کے بارے میں۔\nسارہ: وعلیکم السلام احمد! |yeah| یہ واقعی بہت دلچسپ موضوع ہے۔ <laugh> مجھے تو لگتا ہے کہ اگلے چند سالوں میں سب کچھ بدل جائے گا۔',
  },
];

export const STYLE_PRESETS = [
  { id: 'natural', labelUrdu: 'قدرتی اور عام گفتگو', labelEn: 'Natural & Conversational', prompt: 'Natural conversational tone, warm and clear pronunciation' },
  { id: 'professional', labelUrdu: 'سنجیدہ اور باوقار', labelEn: 'Formal & Professional', prompt: 'Clear, authoritative, professional Urdu news or documentary presenter' },
  { id: 'poetic', labelUrdu: 'جذباتی اور شاعرانہ', labelEn: 'Poetic & Emotional', prompt: 'Deep emotional expression, thoughtful pauses, heartfelt and lyrical' },
  { id: 'energetic', labelUrdu: 'پرجوش اور متحرک', labelEn: 'Energetic & Uplifting', prompt: 'Enthusiastic, energetic, lively commercial and motivational tone' },
  { id: 'calm', labelUrdu: 'دھیما اور پرسکون', labelEn: 'Soft & Soothing', prompt: 'Very soft, whisper-like, relaxing and soothing meditative voice' },
];

export const VOCAL_BURSTS = [
  { tag: '<breath>', labelUrdu: 'سانس کا وقفہ', labelEn: 'Breath', icon: '💨' },
  { tag: '<laugh>', labelUrdu: 'ہنسی کی آواز', labelEn: 'Laugh', icon: '😄' },
  { tag: '<gasp>', labelUrdu: 'حیرت کی سانس', labelEn: 'Gasp', icon: '😮' },
  { tag: '|yeah|', labelUrdu: 'ہاں (تائید)', labelEn: 'Yeah', icon: '👍' },
  { tag: '|mhm|', labelUrdu: 'ہمم (توجہ)', labelEn: 'Mhm', icon: '🤔' },
];
