import {
  FixedCharacter,
  BondEventSet,
  Card,
  Style,
  SupportBonus,
} from '../types';

// ===========================
// 固有キャラクター用の専用カード
// ===========================

const SPECIAL_CARDS: Record<string, Card> = {
  hikari_special: {
    id: 'hikari_special',
    name: '輝きのセンターステージ',
    description: '絆の力で最高のパフォーマンス',
    category: 'appeal',
    style: 'passion',
    cost: 3,
    requiredRank: 'A',
    effects: [
      { type: 'appeal', value: 6, target: 'self' },
      { type: 'voltage', value: 2, target: 'self' },
    ],
    isSpecial: true,
    sourceCharacterId: 'hikari',
  },
  rei_special: {
    id: 'rei_special',
    name: '静寂のパフォーマンス',
    description: '冷静な判断で相手を圧倒',
    category: 'appeal',
    style: 'cool',
    cost: 2,
    requiredRank: 'A',
    effects: [
      { type: 'appeal', value: 4, target: 'self' },
      { type: 'appeal', value: -2, target: 'opponent' },
    ],
    isSpecial: true,
    sourceCharacterId: 'rei',
  },
  mio_special: {
    id: 'mio_special',
    name: 'ふわふわスマイル',
    description: '天然の魅力で観客を虜に',
    category: 'appeal',
    style: 'cute',
    cost: 2,
    requiredRank: 'A',
    effects: [
      { type: 'appeal', value: 3, target: 'self' },
      { type: 'draw', value: 1, target: 'self' },
      { type: 'stamina', value: 1, target: 'self' },
    ],
    isSpecial: true,
    sourceCharacterId: 'mio',
  },
  yuki_special: {
    id: 'yuki_special',
    name: '知略のハーモニー',
    description: '計算された完璧なパフォーマンス',
    category: 'conditional',
    style: 'clever',
    cost: 2,
    requiredRank: 'A',
    effects: [
      { type: 'appeal', value: 3, target: 'self' },
      { type: 'appeal', value: 3, target: 'self', condition: { type: 'trend_match' } },
    ],
    isSpecial: true,
    sourceCharacterId: 'yuki',
  },
  kanade_special: {
    id: 'kanade_special',
    name: '優雅なる旋律',
    description: '気品溢れるパフォーマンス',
    category: 'appeal',
    style: 'elegant',
    cost: 3,
    requiredRank: 'A',
    effects: [
      { type: 'appeal', value: 5, target: 'self' },
      { type: 'nullify', value: 1, target: 'self' },
    ],
    isSpecial: true,
    sourceCharacterId: 'kanade',
  },
};

// ===========================
// キズナイベントセット生成
// ===========================

const createBondEventSet = (
  characterId: string,
  characterName: string,
  style: Style
): BondEventSet => ({
  event1: {
    id: `${characterId}_bond_1`,
    type: 'bond_up',
    name: `${characterName}との出会い`,
    description: `${characterName}と親しくなるチャンス`,
    dialogue: [
      `「あ、プロデューサーさん！」`,
      `${characterName}が駆け寄ってきた。`,
      `「今日の練習、どうでしたか？」`,
    ],
    choices: [
      {
        id: 'praise',
        text: '素晴らしかったよ',
        effects: [
          { type: 'bond', characterId, value: 10 },
          { type: 'condition', target: 'motivation', value: 10 },
        ],
      },
      {
        id: 'advice',
        text: 'ここを改善しよう',
        effects: [
          { type: 'bond', characterId, value: 5 },
          { type: 'stats', target: style, value: 10 },
        ],
      },
    ],
    rewards: { bondUp: 10 },
  },
  event2: {
    id: `${characterId}_bond_2`,
    type: 'stat_up',
    name: `${characterName}の悩み`,
    description: `${characterName}が悩みを打ち明けてきた`,
    dialogue: [
      `「プロデューサーさん、相談があるんです…」`,
      `${characterName}は少し不安そうな表情で話し始めた。`,
      `「最近、自分のパフォーマンスに自信が持てなくて…」`,
    ],
    choices: [
      {
        id: 'encourage',
        text: '君なら大丈夫だよ',
        effects: [
          { type: 'bond', characterId, value: 15 },
          { type: 'condition', target: 'mental', value: 20 },
          { type: 'stats', target: style, value: 20 },
        ],
      },
      {
        id: 'train_together',
        text: '一緒に特訓しよう',
        effects: [
          { type: 'bond', characterId, value: 10 },
          { type: 'stats', target: style, value: 30 },
          { type: 'condition', target: 'fatigue', value: 10 },
        ],
      },
      {
        id: 'analyze',
        text: '課題を分析しよう',
        effects: [
          { type: 'bond', characterId, value: 10 },
          { type: 'stats', target: 'clever', value: 15 },
          { type: 'stats', target: style, value: 15 },
        ],
      },
    ],
    rewards: { statUp: { [style]: 30 } },
  },
  event3: {
    id: `${characterId}_bond_3`,
    type: 'card_gauge_up',
    name: `${characterName}との絆`,
    description: `${characterName}との絆が最高潮に`,
    dialogue: [
      `「プロデューサーさん…」`,
      `${characterName}が真剣な表情で語りかけてきた。`,
      `「私、あなたと出会えて本当によかった」`,
      `「これからも、ずっと一緒に頑張りたいです」`,
    ],
    choices: [
      {
        id: 'promise',
        text: '約束だよ',
        effects: [
          { type: 'bond', characterId, value: 20 },
          { type: 'card_gauge', value: 30 },
          { type: 'condition', target: 'motivation', value: 30 },
        ],
      },
    ],
    rewards: { cardGaugeUp: 50 },
  },
  specialCard: SPECIAL_CARDS[`${characterId}_special`],
});

// ===========================
// デフォルトサポートボーナス生成
// ===========================

const createDefaultBonus = (
  specialtyStyle: Style,
  overrides: Partial<SupportBonus> = {}
): SupportBonus => ({
  lessonBonus: { [specialtyStyle]: 15 },
  initialStats: { [specialtyStyle]: 20 },
  specialtyStyle,
  specialtyRate: 50,
  trainingEffectUp: 10,
  friendshipBonus: 20,
  friendshipThreshold: 40,
  motivationEffectUp: 10,
  fatigueReduction: 5,
  conditionUp: 5,
  eventEffectUp: 10,
  cardGaugeBonus: 5,
  hintRate: 20,
  hintEffectUp: 10,
  goldBonus: 0,
  fameBonus: 0,
  contestBonus: 5,
  initialBond: 5,
  facilityBonus: [],
  ...overrides,
});

// ===========================
// 固有キャラクター定義
// ===========================

export const FIXED_CHARACTERS: FixedCharacter[] = [
  {
    id: 'hikari',
    type: 'fixed',
    name: '星野ひかり',
    gender: 'female',
    age: 16,
    agency: 'スターライトプロダクション',
    appearance: {
      hairStyle: 1,
      hairColor: '#FFD700',
      eyeStyle: 1,
      eyeColor: '#FF6B6B',
      outfit: 1,
      accessory: 1,
    },
    personality: 'hotblooded',
    speechStyle: {
      firstPerson: '私',
      secondPerson: 'あなた',
      template: 'female_energetic',
    },
    uniqueSkill: {
      type: 'live_a',
      name: '情熱の輝き',
      description: 'スタミナMAX時アピール+2',
    },
    defaultStats: { cool: 30, elegant: 20, cute: 40, clever: 20, passion: 50 },
    storyEvents: ['hikari_intro', 'hikari_growth', 'hikari_climax'],
    specialCards: [SPECIAL_CARDS.hikari_special],
    bondEvents: createBondEventSet('hikari', '星野ひかり', 'passion'),
  },
  {
    id: 'rei',
    type: 'fixed',
    name: '氷室れい',
    gender: 'female',
    age: 17,
    agency: 'スターライトプロダクション',
    appearance: {
      hairStyle: 2,
      hairColor: '#4A90D9',
      eyeStyle: 2,
      eyeColor: '#1E3A5F',
      outfit: 2,
      accessory: 0,
    },
    personality: 'cool',
    speechStyle: {
      firstPerson: '私',
      secondPerson: 'あなた',
      template: 'female_quiet',
    },
    uniqueSkill: {
      type: 'live_a',
      name: '氷の視線',
      description: '先行時、相手のアピール-1',
    },
    defaultStats: { cool: 50, elegant: 40, cute: 15, clever: 35, passion: 20 },
    storyEvents: ['rei_intro', 'rei_growth', 'rei_climax'],
    specialCards: [SPECIAL_CARDS.rei_special],
    bondEvents: createBondEventSet('rei', '氷室れい', 'cool'),
  },
  {
    id: 'mio',
    type: 'fixed',
    name: '花園みお',
    gender: 'female',
    age: 15,
    agency: 'スターライトプロダクション',
    appearance: {
      hairStyle: 3,
      hairColor: '#FFB6C1',
      eyeStyle: 3,
      eyeColor: '#90EE90',
      outfit: 3,
      accessory: 2,
    },
    personality: 'natural',
    speechStyle: {
      firstPerson: 'みお',
      secondPerson: 'あなた',
      template: 'female_casual',
    },
    uniqueSkill: {
      type: 'event_a',
      name: 'ふしぎな魅力',
      description: 'ラッキーイベント発生率UP',
    },
    defaultStats: { cool: 15, elegant: 25, cute: 50, clever: 20, passion: 30 },
    storyEvents: ['mio_intro', 'mio_growth', 'mio_climax'],
    specialCards: [SPECIAL_CARDS.mio_special],
    bondEvents: createBondEventSet('mio', '花園みお', 'cute'),
  },
  {
    id: 'yuki',
    type: 'fixed',
    name: '白銀ゆき',
    gender: 'female',
    age: 18,
    agency: 'スターライトプロダクション',
    appearance: {
      hairStyle: 4,
      hairColor: '#E8E8E8',
      eyeStyle: 4,
      eyeColor: '#9370DB',
      outfit: 4,
      accessory: 3,
    },
    personality: 'perfectionist',
    speechStyle: {
      firstPerson: '私',
      secondPerson: 'あなた',
      template: 'female_polite',
    },
    uniqueSkill: {
      type: 'growth_style_a',
      name: '完璧な計画',
      description: 'クレバー成長率+20%',
      targetStyle: 'clever',
    },
    defaultStats: { cool: 35, elegant: 30, cute: 20, clever: 50, passion: 25 },
    storyEvents: ['yuki_intro', 'yuki_growth', 'yuki_climax'],
    specialCards: [SPECIAL_CARDS.yuki_special],
    bondEvents: createBondEventSet('yuki', '白銀ゆき', 'clever'),
  },
  {
    id: 'kanade',
    type: 'fixed',
    name: '紫苑かなで',
    gender: 'female',
    age: 19,
    agency: 'スターライトプロダクション',
    appearance: {
      hairStyle: 5,
      hairColor: '#8B008B',
      eyeStyle: 5,
      eyeColor: '#FFD700',
      outfit: 5,
      accessory: 4,
    },
    personality: 'moodmaker',
    speechStyle: {
      firstPerson: '私',
      secondPerson: 'あなた',
      template: 'female_ojou',
    },
    uniqueSkill: {
      type: 'live_b',
      name: '優雅なる采配',
      description: 'ボルテージ効率+30%',
    },
    defaultStats: { cool: 25, elegant: 50, cute: 30, clever: 30, passion: 25 },
    storyEvents: ['kanade_intro', 'kanade_growth', 'kanade_climax'],
    specialCards: [SPECIAL_CARDS.kanade_special],
    bondEvents: createBondEventSet('kanade', '紫苑かなで', 'elegant'),
  },
];

// ===========================
// 固有キャラ用サポートボーナス
// ===========================

export const FIXED_CHARACTER_BONUSES: Record<string, SupportBonus> = {
  hikari: createDefaultBonus('passion', {
    friendshipBonus: 30,
    motivationEffectUp: 20,
    contestBonus: 10,
  }),
  rei: createDefaultBonus('cool', {
    trainingEffectUp: 15,
    fatigueReduction: 10,
    hintRate: 25,
  }),
  mio: createDefaultBonus('cute', {
    eventEffectUp: 20,
    cardGaugeBonus: 10,
  }),
  yuki: createDefaultBonus('clever', {
    trainingEffectUp: 20,
    hintEffectUp: 20,
    lessonBonus: { clever: 20 },
  }),
  kanade: createDefaultBonus('elegant', {
    goldBonus: 15,
    fameBonus: 10,
    initialBond: 10,
  }),
};

// ===========================
// ヘルパー関数
// ===========================

export const getFixedCharacterById = (id: string): FixedCharacter | undefined => {
  return FIXED_CHARACTERS.find((c) => c.id === id);
};

export const getFixedCharacterBonus = (id: string): SupportBonus | undefined => {
  return FIXED_CHARACTER_BONUSES[id];
};

export const getAllFixedCharacters = (): FixedCharacter[] => {
  return FIXED_CHARACTERS;
};
