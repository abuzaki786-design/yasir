export interface LanguageOption {
  code: string;
  nameUrdu: string;
  nameEn: string;
  flag: string;
  sampleText: string;
  accents: AccentOption[];
}

export interface AccentOption {
  id: string;
  nameUrdu: string;
  nameEn: string;
  promptDescription: string;
}

export interface VoiceCharacterOption {
  id: string;
  nameUrdu: string;
  nameEn: string;
  gender: 'Female' | 'Male';
  roleUrdu: string;
  roleEn: string;
  bestForUrdu: string;
  pitch: string;
  tone: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'ur',
    nameUrdu: 'اردو (Urdu)',
    nameEn: 'Urdu',
    flag: '🇵🇰',
    sampleText: 'محبت اور محنت کا جذبہ انسان کو کامیابی کے بلند ترین مقام پر پہنچا دیتا ہے۔',
    accents: [
      {
        id: 'ur-literary',
        nameUrdu: 'شستہ و ادبی (دہلوی و لکھنوی)',
        nameEn: 'Literary & Classical Urdu',
        promptDescription: 'High classical literary Urdu with pristine poetic diction and measured pauses',
      },
      {
        id: 'ur-radio',
        nameUrdu: 'ریڈیو و ٹی وی براڈکاسٹ (پاکستانی)',
        nameEn: 'Pakistani Broadcast Media',
        promptDescription: 'Professional Pakistani radio and news broadcaster Urdu, authoritative and crisp',
      },
      {
        id: 'ur-urban',
        nameUrdu: 'عام بول چال (شہری لاہوری و کراچی)',
        nameEn: 'Contemporary Urban Pakistani',
        promptDescription: 'Modern natural urban Urdu spoken in Lahore and Karachi, fluid and friendly',
      },
      {
        id: 'ur-hyderabadi',
        nameUrdu: 'دکنی و حیدرآبادی لہجہ',
        nameEn: 'Deccani & Hyderabadi',
        promptDescription: 'Charming Deccani and Hyderabadi Urdu melodic cadence and warmth',
      },
    ],
  },
  {
    code: 'en',
    nameUrdu: 'English (انگریزی)',
    nameEn: 'English',
    flag: '🇬🇧',
    sampleText: 'Welcome to the next generation of voice synthesis, bringing your stories to life.',
    accents: [
      {
        id: 'en-uk',
        nameUrdu: 'برطانوی شائستہ (British RP)',
        nameEn: 'British Received Pronunciation',
        promptDescription: 'Refined British Received Pronunciation, articulate, polished and scholarly',
      },
      {
        id: 'en-us',
        nameUrdu: 'امریکی معیاری (American General)',
        nameEn: 'General American',
        promptDescription: 'Standard General American accent, clear, crisp and relatable',
      },
      {
        id: 'en-pk',
        nameUrdu: 'پاکستانی / جنوبی ایشیائی انگریزی',
        nameEn: 'Pakistani / South Asian English',
        promptDescription: 'Educated Pakistani South Asian English accent, polite, formal and clear',
      },
      {
        id: 'en-au',
        nameUrdu: 'آسٹریلوی (Australian)',
        nameEn: 'Australian',
        promptDescription: 'Natural Australian accent, warm, easygoing and vibrant',
      },
    ],
  },
  {
    code: 'ar',
    nameUrdu: 'العربية (عربی)',
    nameEn: 'Arabic',
    flag: '🇸🇦',
    sampleText: 'إن العلم نور يبدد ظلمات الجهل، ومفتاح لبناء حضارات شامخة ترتقي بها الأمم.',
    accents: [
      {
        id: 'ar-fusha',
        nameUrdu: 'عربی فصیح (Modern Standard Arabic)',
        nameEn: 'Classical Modern Standard Arabic (الفصحى)',
        promptDescription: 'Flawless classical Modern Standard Arabic (الفصحى) with complete harakat and majestic resonance',
      },
      {
        id: 'ar-gulf',
        nameUrdu: 'لہجہ خلیجی (Gulf / Khaleeji)',
        nameEn: 'Gulf Arabic (Saudi/UAE)',
        promptDescription: 'Warm Gulf Arabic (اللهجة الخليجية) intonation, friendly and polite',
      },
      {
        id: 'ar-levantine',
        nameUrdu: 'لہجہ شامی (Levantine)',
        nameEn: 'Levantine Arabic (الشامي)',
        promptDescription: 'Musical Levantine Arabic accent, expressive and heartfelt',
      },
      {
        id: 'ar-egyptian',
        nameUrdu: 'لہجہ مصری (Egyptian)',
        nameEn: 'Egyptian Arabic (المصري)',
        promptDescription: 'Lively Egyptian Arabic cadence, conversational and popular',
      },
    ],
  },
  {
    code: 'pa',
    nameUrdu: 'پنجابی (Punjabi - شاہ مکھی)',
    nameEn: 'Punjabi',
    flag: '🌾',
    sampleText: 'دل سچا ہووے تے رستے اپنے آپ کھُل جاندے نیں، ہمت کدی نہ ہارو۔',
    accents: [
      {
        id: 'pa-majhi',
        nameUrdu: 'ماجھی لہجہ (مرکزی پنجاب)',
        nameEn: 'Majhi Central Punjabi',
        promptDescription: 'Rich authentic Majhi Punjabi accent, warm, melodious and vibrant',
      },
      {
        id: 'pa-saraiki',
        nameUrdu: 'سرائیکی لہجہ (جنوبی پنجاب)',
        nameEn: 'Saraiki Southern Punjabi',
        promptDescription: 'Sweet and gentle Saraiki accent with melodic sweetness and depth',
      },
      {
        id: 'pa-pothohari',
        nameUrdu: 'پوٹھوہاری و راولپنڈی لہجہ',
        nameEn: 'Pothohari Dialect',
        promptDescription: 'Distinct northern Pothohari Punjabi dialect with rustic charm',
      },
    ],
  },
  {
    code: 'ps',
    nameUrdu: 'پشتو (Pashto)',
    nameEn: 'Pashto',
    flag: '🏔️',
    sampleText: 'ژوند یو سفر دی، او په‌ دې سفر کې یوازې نېک عملونه او ښه اخلاق تلپاتې پاتې کېږي۔',
    accents: [
      {
        id: 'ps-yousafzai',
        nameUrdu: 'یوسفزئی لہجہ (پشاور و مردان)',
        nameEn: 'Yousafzai Peshawar Dialect',
        promptDescription: 'Authentic Yousafzai Northern Pashto pronunciation, dignified and expressive',
      },
      {
        id: 'ps-kandahari',
        nameUrdu: 'قندھاری نرم لہجہ (جنوبی)',
        nameEn: 'Southern Kandahari Soft Pashto',
        promptDescription: 'Melodious Southern soft Pashto dialect, warm and lyrical',
      },
    ],
  },
  {
    code: 'sd',
    nameUrdu: 'سنڌي (Sindhi)',
    nameEn: 'Sindhi',
    flag: '🌊',
    sampleText: 'محبت ۽ امن جي ڌرتيءَ تي علم ۽ دانائي هميشه سڀ کان وڏي روشني رهي آهي۔',
    accents: [
      {
        id: 'sd-standard',
        nameUrdu: 'معیاری وچولی سنڌي',
        nameEn: 'Standard Vicholi Sindhi',
        promptDescription: 'Classical standard Vicholi Sindhi pronunciation with sweet musical cadence',
      },
    ],
  },
  {
    code: 'hi',
    nameUrdu: 'हिन्दी (ہندی)',
    nameEn: 'Hindi',
    flag: '🇮🇳',
    sampleText: 'सफलता का रहस्य निरंतर प्रयास और अपने सपनों पर अटूट विश्वास में छिपा है।',
    accents: [
      {
        id: 'hi-standard',
        nameUrdu: 'معیاری کھڑی بولی (Standard Hindi)',
        nameEn: 'Standard Modern Hindi',
        promptDescription: 'Pure standard Hindi, crisp enunciation and clear formal articulation',
      },
      {
        id: 'hi-filmi',
        nameUrdu: 'فلمی و ہندستانی (Cinematic Hindustani)',
        nameEn: 'Cinematic Hindustani',
        promptDescription: 'Conversational Hindustani with natural cinematic flair and emotion',
      },
    ],
  },
  {
    code: 'fa',
    nameUrdu: 'فارسی (Persian / Farsi)',
    nameEn: 'Persian',
    flag: '🇮🇷',
    sampleText: 'زندگی زیباست ای زیبا پسند، زنده اندیشان به زیبایی رسند۔',
    accents: [
      {
        id: 'fa-tehran',
        nameUrdu: 'تہرانی معیاری (Tehrani Farsi)',
        nameEn: 'Standard Tehrani Persian',
        promptDescription: 'Elegant contemporary Tehrani Persian, smooth and poetic',
      },
      {
        id: 'fa-dari',
        nameUrdu: 'دری افغانی (Afghan Dari)',
        nameEn: 'Afghan Dari',
        promptDescription: 'Classical Afghan Dari Persian with archaic grandeur and clarity',
      },
    ],
  },
  {
    code: 'tr',
    nameUrdu: 'Türkçe (ترکی)',
    nameEn: 'Turkish',
    flag: '🇹🇷',
    sampleText: 'Hayat, cesaretle atılan adımların ve gerçeğe dönüşen hayallerin hikayesidir.',
    accents: [
      {
        id: 'tr-istanbul',
        nameUrdu: 'استنبول معیاری (Istanbul Turkish)',
        nameEn: 'Standard Istanbul Turkish',
        promptDescription: 'Standard Istanbul Turkish, clear vowels and smooth harmonic rhythm',
      },
    ],
  },
  {
    code: 'fr',
    nameUrdu: 'Français (فرانسیسی)',
    nameEn: 'French',
    flag: '🇫🇷',
    sampleText: 'Le courage n\'est pas l\'absence de peur, mais la capacité de la vaincre.',
    accents: [
      {
        id: 'fr-paris',
        nameUrdu: 'پیرس معیاری (Parisian French)',
        nameEn: 'Standard Metropolitan French',
        promptDescription: 'Standard Parisian French, elegant intonation and natural cadence',
      },
    ],
  },
  {
    code: 'es',
    nameUrdu: 'Español (ہسپانوی)',
    nameEn: 'Spanish',
    flag: '🇪🇸',
    sampleText: 'Cada día es una nueva oportunidad para transformar tus sueños en realidad.',
    accents: [
      {
        id: 'es-castilian',
        nameUrdu: 'ہسپانیہ کاسٹیلین (Castilian)',
        nameEn: 'Castilian Spanish',
        promptDescription: 'European Castilian Spanish, clear distinction and rhythmic vitality',
      },
      {
        id: 'es-latam',
        nameUrdu: 'لاطینی امریکی (Latin American)',
        nameEn: 'Neutral Latin American Spanish',
        promptDescription: 'Neutral Latin American Spanish, warm, clear and friendly',
      },
    ],
  },
];

export const VOICE_CHARACTERS: VoiceCharacterOption[] = [
  {
    id: 'Kore',
    nameUrdu: 'کوری (Kore)',
    nameEn: 'Kore',
    gender: 'Female',
    roleUrdu: 'دھیمی، خوش الحان اور روح پرور آواز',
    roleEn: 'Soothing, melodious & gentle female voice',
    bestForUrdu: 'شاعری، کہانیاں، آڈیو بکس، مدھر گیت اور روحانی کلام',
    pitch: 'میڈیم نرم (Medium Soft)',
    tone: 'Purified, soulful, reassuring and intimate',
  },
  {
    id: 'Puck',
    nameUrdu: 'پک (Puck)',
    nameEn: 'Puck',
    gender: 'Male',
    roleUrdu: 'پُرجوش، متحرک اور دوستانہ مردانہ آواز',
    roleEn: 'Enthusiastic, energetic & warm male voice',
    bestForUrdu: 'پوڈکاسٹ، یوٹیوب ویڈیوز، اشتہارات، اور عام دوستانہ گفتگو',
    pitch: 'متوازن پرجوش (Balanced Dynamic)',
    tone: 'Charismatic, lively, relatable and spirited',
  },
  {
    id: 'Zephyr',
    nameUrdu: 'زیفر (Zephyr)',
    nameEn: 'Zephyr',
    gender: 'Female',
    roleUrdu: 'شستہ، شائستہ اور پیشہ ورانہ خاتون',
    roleEn: 'Articulate, professional & elegant female voice',
    bestForUrdu: 'نیوز بلیٹن، پریزنٹیشنز، ڈاکومینٹری، اور کارپوریٹ اعلانات',
    pitch: 'شائستہ واضح (Refined Clear)',
    tone: 'Sophisticated, pleasant, articulate and modern',
  },
  {
    id: 'Fenrir',
    nameUrdu: 'فینریر (Fenrir)',
    nameEn: 'Fenrir',
    gender: 'Male',
    roleUrdu: 'مضبوط، گرجدار اور ڈرامائی مردانہ آواز',
    roleEn: 'Deep, resonant & dramatic male voice',
    bestForUrdu: 'داستان گوئی، سنسنی خیز کہانیاں، موٹیویشنل تقریر، اور ٹریلر',
    pitch: 'گہرا بھاری (Deep Bass)',
    tone: 'Powerful, thunderous, cinematic and bold',
  },
  {
    id: 'Charon',
    nameUrdu: 'کیرون (Charon)',
    nameEn: 'Charon',
    gender: 'Male',
    roleUrdu: 'سنجیدہ، پروقار اور مدلل نیوز اینکر',
    roleEn: 'Authoritative, grave & serious male voice',
    bestForUrdu: 'سرکاری بیانات، تاریخ، معلوماتی مضامین، اور سنجیدہ خبریں',
    pitch: 'پروقار گہرا (Authoritative Resonant)',
    tone: 'Dignified, serious, steady and trustworthy',
  },
];

export const EMOTION_TONES = [
  { id: 'emotional', labelUrdu: 'جذباتی و درد بھرا', labelEn: 'Emotional & Heartfelt', prompt: 'Deeply emotional, heartfelt, expressive with soulful pauses' },
  { id: 'formal', labelUrdu: 'سنجیدہ و باوقار', labelEn: 'Formal & Dignified', prompt: 'Authoritative, dignified, formal and articulate broadcaster style' },
  { id: 'cheerful', labelUrdu: 'خوش مزاج و مسکراتی آواز', labelEn: 'Cheerful & Upbeat', prompt: 'Smiling, cheerful, pleasant, lighthearted and joyful delivery' },
  { id: 'energetic', labelUrdu: 'پرجوش و موٹیویشنل', labelEn: 'Energetic & Inspiring', prompt: 'High-energy, passionate, inspiring motivational orator' },
  { id: 'whisper', labelUrdu: 'سرگوشی و دھیما مراقبہ', labelEn: 'Whisper / Meditative', prompt: 'Intimate soft whisper tone, peaceful, meditative and relaxing' },
  { id: 'suspense', labelUrdu: 'پراسرار و سنسنی خیز', labelEn: 'Dramatic & Suspenseful', prompt: 'Thrilling, suspenseful, cinematic dramatic storytelling tone' },
  { id: 'conversational', labelUrdu: 'روزمرہ فطری گفتگو', labelEn: 'Natural Conversational', prompt: 'Natural colloquial rhythm, warm, casual and effortlessly spoken' },
];

export const SPEECH_PACING = [
  { id: 'slow', labelUrdu: 'دھیمی رفتار (Slow & Measured)', labelEn: 'Slow & Measured', prompt: 'Deliberate, unhurried, slow pace with clear pauses' },
  { id: 'normal', labelUrdu: 'معمول کی رفتار (Normal Pace)', labelEn: 'Normal Pace', prompt: 'Natural, steady standard conversational cadence' },
  { id: 'fast', labelUrdu: 'تیز رفتار (Brisk & Dynamic)', labelEn: 'Brisk & Dynamic', prompt: 'Brisk, fast-paced, high tempo delivery' },
];
