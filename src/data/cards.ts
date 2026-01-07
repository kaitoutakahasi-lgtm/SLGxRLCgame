import { Card } from '../types';

// ===========================
// 基本カードデータ
// ===========================

export const BASIC_CARDS: Card[] = [
  // === クール（Cool）カード ===
  {
    id: 'cool_basic_1',
    name: 'クールアピール',
    description: '基本的なクールアピール',
    category: 'appeal',
    style: 'cool',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'appeal', value: 2, target: 'self' }],
    flavorText: 'かっこよく決める、それが基本',
  },
  {
    id: 'cool_basic_2',
    name: 'スタイリッシュステップ',
    description: 'クールなステップでアピール',
    category: 'appeal',
    style: 'cool',
    cost: 2,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: 3, target: 'self' }],
  },
  {
    id: 'cool_combo_1',
    name: 'クールコンボ',
    description: 'トレンド一致時、追加アピール',
    category: 'conditional',
    style: 'cool',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'appeal', value: 2, target: 'self', condition: { type: 'trend_match', style: 'cool' } },
    ],
  },
  {
    id: 'cool_advanced_1',
    name: 'パーフェクトクール',
    description: '強力なクールアピール',
    category: 'appeal',
    style: 'cool',
    cost: 3,
    requiredRank: 'A',
    effects: [{ type: 'appeal', value: 5, target: 'self' }],
  },

  // === エレガント（Elegant）カード ===
  {
    id: 'elegant_basic_1',
    name: 'エレガントアピール',
    description: '基本的なエレガントアピール',
    category: 'appeal',
    style: 'elegant',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'appeal', value: 2, target: 'self' }],
    flavorText: '優雅さこそが美しさの証',
  },
  {
    id: 'elegant_basic_2',
    name: 'グレースフルターン',
    description: '優雅な動きでアピール',
    category: 'appeal',
    style: 'elegant',
    cost: 2,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: 3, target: 'self' }],
  },
  {
    id: 'elegant_recover_1',
    name: '気品のブレス',
    description: 'スタミナを回復しつつアピール',
    category: 'appeal',
    style: 'elegant',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'stamina', value: 1, target: 'self' },
    ],
  },
  {
    id: 'elegant_advanced_1',
    name: '至高のエレガンス',
    description: '強力なエレガントアピール',
    category: 'appeal',
    style: 'elegant',
    cost: 3,
    requiredRank: 'A',
    effects: [{ type: 'appeal', value: 5, target: 'self' }],
  },

  // === キュート（Cute）カード ===
  {
    id: 'cute_basic_1',
    name: 'キュートアピール',
    description: '基本的なキュートアピール',
    category: 'appeal',
    style: 'cute',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'appeal', value: 2, target: 'self' }],
    flavorText: 'かわいいは正義！',
  },
  {
    id: 'cute_basic_2',
    name: 'スマイルショット',
    description: '笑顔でアピール',
    category: 'appeal',
    style: 'cute',
    cost: 2,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: 3, target: 'self' }],
  },
  {
    id: 'cute_draw_1',
    name: 'ラッキーチャーム',
    description: 'カードを引きながらアピール',
    category: 'manipulation',
    style: 'cute',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'appeal', value: 1, target: 'self' },
      { type: 'draw', value: 1, target: 'self' },
    ],
  },
  {
    id: 'cute_advanced_1',
    name: 'ドリームキュート',
    description: '強力なキュートアピール',
    category: 'appeal',
    style: 'cute',
    cost: 3,
    requiredRank: 'A',
    effects: [{ type: 'appeal', value: 5, target: 'self' }],
  },

  // === クレバー（Clever）カード ===
  {
    id: 'clever_basic_1',
    name: 'クレバーアピール',
    description: '基本的なクレバーアピール',
    category: 'appeal',
    style: 'clever',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'appeal', value: 2, target: 'self' }],
    flavorText: '知性で魅せる',
  },
  {
    id: 'clever_basic_2',
    name: 'ストラテジックムーブ',
    description: '戦略的な動きでアピール',
    category: 'appeal',
    style: 'clever',
    cost: 2,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: 3, target: 'self' }],
  },
  {
    id: 'clever_sabotage_1',
    name: 'トリッキーフェイント',
    description: '相手を妨害しつつアピール',
    category: 'sabotage',
    style: 'clever',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'appeal', value: 1, target: 'self' },
      { type: 'appeal', value: -1, target: 'opponent' },
    ],
  },
  {
    id: 'clever_advanced_1',
    name: 'マスタープラン',
    description: '強力なクレバーアピール',
    category: 'appeal',
    style: 'clever',
    cost: 3,
    requiredRank: 'A',
    effects: [{ type: 'appeal', value: 5, target: 'self' }],
  },

  // === パッション（Passion）カード ===
  {
    id: 'passion_basic_1',
    name: 'パッションアピール',
    description: '基本的なパッションアピール',
    category: 'appeal',
    style: 'passion',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'appeal', value: 2, target: 'self' }],
    flavorText: '情熱で突き進む！',
  },
  {
    id: 'passion_basic_2',
    name: 'バーニングソウル',
    description: '燃える魂でアピール',
    category: 'appeal',
    style: 'passion',
    cost: 2,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: 3, target: 'self' }],
  },
  {
    id: 'passion_voltage_1',
    name: 'ヒートアップ',
    description: 'ボルテージを上げつつアピール',
    category: 'appeal',
    style: 'passion',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'voltage', value: 1, target: 'self' },
    ],
  },
  {
    id: 'passion_advanced_1',
    name: 'ソウルバースト',
    description: '強力なパッションアピール',
    category: 'appeal',
    style: 'passion',
    cost: 3,
    requiredRank: 'A',
    effects: [{ type: 'appeal', value: 5, target: 'self' }],
  },

  // === 防御カード ===
  {
    id: 'defense_basic_1',
    name: 'ガード',
    description: '妨害を1回無効化',
    category: 'defense',
    style: 'cool',
    cost: 1,
    requiredRank: 'E',
    effects: [{ type: 'nullify', value: 1, target: 'self' }],
  },
  {
    id: 'defense_counter_1',
    name: 'カウンター',
    description: '妨害を無効化し、少しアピール',
    category: 'defense',
    style: 'clever',
    cost: 2,
    requiredRank: 'C',
    effects: [
      { type: 'nullify', value: 1, target: 'self' },
      { type: 'appeal', value: 1, target: 'self' },
    ],
  },

  // === 操作カード ===
  {
    id: 'manipulation_draw_1',
    name: 'ドロー',
    description: 'カードを2枚引く',
    category: 'manipulation',
    style: 'clever',
    cost: 1,
    requiredRank: 'D',
    effects: [{ type: 'draw', value: 2, target: 'self' }],
  },
  {
    id: 'manipulation_trend_1',
    name: 'トレンドシフト',
    description: 'トレンドを変更する',
    category: 'manipulation',
    style: 'clever',
    cost: 2,
    requiredRank: 'B',
    effects: [{ type: 'trend_change', value: 1, target: 'self' }],
  },

  // === 妨害カード ===
  {
    id: 'sabotage_basic_1',
    name: 'プレッシャー',
    description: '相手のアピールを下げる',
    category: 'sabotage',
    style: 'cool',
    cost: 1,
    requiredRank: 'D',
    effects: [{ type: 'appeal', value: -2, target: 'opponent' }],
  },
  {
    id: 'sabotage_discard_1',
    name: 'ディスラプト',
    description: '相手の手札を1枚捨てさせる',
    category: 'sabotage',
    style: 'clever',
    cost: 2,
    requiredRank: 'B',
    effects: [{ type: 'discard', value: 1, target: 'opponent' }],
  },

  // === 上位カード ===
  {
    id: 'ultimate_appeal_1',
    name: 'センターステージ',
    description: '大アピール＋ボルテージ獲得',
    category: 'appeal',
    style: 'passion',
    cost: 3,
    requiredRank: 'S',
    effects: [
      { type: 'appeal', value: 6, target: 'self' },
      { type: 'voltage', value: 2, target: 'self' },
    ],
  },
  {
    id: 'ultimate_combo_1',
    name: 'パーフェクトハーモニー',
    description: '全スタイル対応の強力アピール',
    category: 'conditional',
    style: 'elegant',
    cost: 3,
    requiredRank: 'SS',
    effects: [
      { type: 'appeal', value: 4, target: 'self' },
      { type: 'appeal', value: 3, target: 'self', condition: { type: 'trend_match' } },
    ],
  },
  {
    id: 'legend_appeal_1',
    name: 'レジェンドパフォーマンス',
    description: '伝説級の圧倒的アピール',
    category: 'appeal',
    style: 'passion',
    cost: 3,
    requiredRank: 'SSS',
    effects: [
      { type: 'appeal', value: 8, target: 'self' },
      { type: 'voltage', value: 2, target: 'self' },
      { type: 'stamina', value: 1, target: 'self' },
    ],
  },
];

export const getCardById = (id: string): Card | undefined => {
  return BASIC_CARDS.find((card) => card.id === id);
};

export const getCardsByStyle = (style: string): Card[] => {
  return BASIC_CARDS.filter((card) => card.style === style);
};

export const getCardsByRank = (rank: string): Card[] => {
  return BASIC_CARDS.filter((card) => card.requiredRank === rank);
};

export const getStarterDeck = (): Card[] => {
  // 初期デッキ：各スタイルの基本カード2枚ずつ
  return [
    BASIC_CARDS.find((c) => c.id === 'cool_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'cool_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'elegant_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'elegant_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'cute_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'cute_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'clever_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'clever_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'passion_basic_1')!,
    BASIC_CARDS.find((c) => c.id === 'passion_basic_1')!,
  ];
};
