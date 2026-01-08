import { RareSkill, SupportRareSkill, Card, Style, CardEffect } from '../types';

// ===========================
// レアスキル（金特）データ
// ===========================

/** レアスキル定義 */
export const RARE_SKILLS: RareSkill[] = [
  // クール系レアスキル
  {
    id: 'rs_ice_queen',
    name: '氷の女王',
    description: 'クールアピール時、追加でスター+2獲得',
    effect: [
      { type: 'appeal', value: 4, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: 'hinata',
  },
  {
    id: 'rs_perfect_freeze',
    name: 'パーフェクトフリーズ',
    description: '相手のアピールを1ターン封じる',
    effect: [
      { type: 'nullify', value: 1, target: 'opponent' },
      { type: 'appeal', value: 2, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
  {
    id: 'rs_cool_burst',
    name: 'クールバースト',
    description: 'トレンドがクール時、アピール効果2倍',
    effect: [
      { type: 'appeal', value: 6, target: 'self', condition: { type: 'trend_match', style: 'cool' } },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },

  // エレガント系レアスキル
  {
    id: 'rs_grand_finale',
    name: 'グランドフィナーレ',
    description: '最終ターンでアピール大幅アップ',
    effect: [
      { type: 'appeal', value: 8, target: 'self', condition: { type: 'last_turn' } },
    ],
    requiredBond: 100,
    sourceCharacterId: 'sakura',
  },
  {
    id: 'rs_graceful_step',
    name: 'グレイスフルステップ',
    description: 'スタミナ消費-1、アピール+2',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'stamina', value: -1, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
  {
    id: 'rs_noble_aura',
    name: 'ノーブルオーラ',
    description: '相手のスタミナを1削る',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'stamina', value: -1, target: 'opponent' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },

  // キュート系レアスキル
  {
    id: 'rs_healing_smile',
    name: 'ヒーリングスマイル',
    description: 'スタミナを2回復しつつアピール',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'stamina', value: 2, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: 'yuki',
  },
  {
    id: 'rs_miracle_charm',
    name: 'ミラクルチャーム',
    description: '相手の妨害を無効化してアピール',
    effect: [
      { type: 'appeal', value: 3, target: 'self' },
      { type: 'nullify', value: 1, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
  {
    id: 'rs_angel_voice',
    name: 'エンジェルボイス',
    description: 'ボルテージを3獲得しつつアピール',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'voltage', value: 3, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },

  // クレバー系レアスキル
  {
    id: 'rs_genius_strategy',
    name: '天才的戦略',
    description: 'カードを2枚ドローしてアピール',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'draw', value: 2, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: 'rei',
  },
  {
    id: 'rs_mind_reader',
    name: 'マインドリーダー',
    description: '相手の手札を1枚捨てさせる',
    effect: [
      { type: 'appeal', value: 2, target: 'self' },
      { type: 'discard', value: 1, target: 'opponent' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
  {
    id: 'rs_perfect_analysis',
    name: 'パーフェクト分析',
    description: 'トレンドを有利なものに変更',
    effect: [
      { type: 'trend_change', value: 1, target: 'self' },
      { type: 'appeal', value: 2, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },

  // パッション系レアスキル
  {
    id: 'rs_burning_soul',
    name: 'バーニングソウル',
    description: 'スタミナ消費無視で大アピール',
    effect: [
      { type: 'appeal', value: 7, target: 'self' },
    ],
    requiredBond: 100,
    sourceCharacterId: 'kaito',
  },
  {
    id: 'rs_passionate_heart',
    name: 'パッショネイトハート',
    description: 'スタミナが少ないほどアピール増加',
    effect: [
      { type: 'appeal', value: 5, target: 'self', condition: { type: 'stamina_below', value: 3 } },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
  {
    id: 'rs_final_burst',
    name: 'ファイナルバースト',
    description: '劣勢時にアピール効果3倍',
    effect: [
      { type: 'appeal', value: 9, target: 'self', condition: { type: 'losing' } },
    ],
    requiredBond: 100,
    sourceCharacterId: '',
  },
];

// ===========================
// 固有キャラクターのレアスキル設定
// ===========================

/** 固有キャラとレアスキルの紐付け */
export const CHARACTER_RARE_SKILLS: Record<string, SupportRareSkill> = {
  hinata: {
    rareSkill: RARE_SKILLS.find(rs => rs.id === 'rs_ice_queen')!,
    hintLevel: 3,
    alternativeSkills: [
      RARE_SKILLS.find(rs => rs.id === 'rs_cool_burst')!,
    ],
  },
  sakura: {
    rareSkill: RARE_SKILLS.find(rs => rs.id === 'rs_grand_finale')!,
    hintLevel: 3,
    alternativeSkills: [
      RARE_SKILLS.find(rs => rs.id === 'rs_graceful_step')!,
    ],
  },
  yuki: {
    rareSkill: RARE_SKILLS.find(rs => rs.id === 'rs_healing_smile')!,
    hintLevel: 3,
    alternativeSkills: [
      RARE_SKILLS.find(rs => rs.id === 'rs_miracle_charm')!,
    ],
  },
  rei: {
    rareSkill: RARE_SKILLS.find(rs => rs.id === 'rs_genius_strategy')!,
    hintLevel: 3,
    alternativeSkills: [
      RARE_SKILLS.find(rs => rs.id === 'rs_mind_reader')!,
    ],
  },
  kaito: {
    rareSkill: RARE_SKILLS.find(rs => rs.id === 'rs_burning_soul')!,
    hintLevel: 3,
    alternativeSkills: [
      RARE_SKILLS.find(rs => rs.id === 'rs_passionate_heart')!,
    ],
  },
};

// ===========================
// レアスキルをカードに変換
// ===========================

const STYLE_FROM_SKILL: Record<string, Style> = {
  rs_ice_queen: 'cool',
  rs_perfect_freeze: 'cool',
  rs_cool_burst: 'cool',
  rs_grand_finale: 'elegant',
  rs_graceful_step: 'elegant',
  rs_noble_aura: 'elegant',
  rs_healing_smile: 'cute',
  rs_miracle_charm: 'cute',
  rs_angel_voice: 'cute',
  rs_genius_strategy: 'clever',
  rs_mind_reader: 'clever',
  rs_perfect_analysis: 'clever',
  rs_burning_soul: 'passion',
  rs_passionate_heart: 'passion',
  rs_final_burst: 'passion',
};

/** レアスキルをカードとして生成 */
export const createRareSkillCard = (rareSkill: RareSkill): Card => {
  const style = STYLE_FROM_SKILL[rareSkill.id] || 'cool';

  return {
    id: `card_${rareSkill.id}`,
    name: rareSkill.name,
    description: rareSkill.description,
    category: 'appeal',
    style,
    cost: 3,
    requiredRank: 'A',
    effects: rareSkill.effect,
    isSpecial: true,
    sourceCharacterId: rareSkill.sourceCharacterId,
    flavorText: '金特スキル',
  };
};

// ===========================
// ヘルパー関数
// ===========================

/** キャラクターIDからレアスキルを取得 */
export const getRareSkillByCharacterId = (characterId: string): SupportRareSkill | undefined => {
  return CHARACTER_RARE_SKILLS[characterId];
};

/** レアスキルIDからスキルを取得 */
export const getRareSkillById = (id: string): RareSkill | undefined => {
  return RARE_SKILLS.find(rs => rs.id === id);
};

/** 絆レベル100で獲得可能なレアスキルがあるかチェック */
export const canAcquireRareSkill = (
  characterId: string,
  bondLevel: number,
  acquiredSkills: string[]
): boolean => {
  const rareSkillConfig = CHARACTER_RARE_SKILLS[characterId];
  if (!rareSkillConfig) return false;
  if (bondLevel < rareSkillConfig.rareSkill.requiredBond) return false;
  if (acquiredSkills.includes(rareSkillConfig.rareSkill.id)) return false;
  return true;
};

/** レアスキル獲得イベントを生成 */
export const createRareSkillEvent = (characterId: string, characterName: string) => {
  const rareSkillConfig = CHARACTER_RARE_SKILLS[characterId];
  if (!rareSkillConfig) return null;

  return {
    id: `rare_skill_${characterId}`,
    name: `${characterName}の秘伝`,
    description: 'レアスキルを伝授！',
    eventType: 'bond' as const,
    dialogue: [
      `「${characterName}との絆が最高潮に達した！」`,
      '「これは私の全て...受け取ってください」',
      `レアスキル「${rareSkillConfig.rareSkill.name}」を習得！`,
    ],
    triggerCondition: { type: 'bond' as const, bondLevel: 100, characterId },
    choices: [
      {
        id: 'accept_rare_skill',
        text: 'ありがとう！',
        effects: [
          { type: 'card' as const, cardId: rareSkillConfig.rareSkill.id, value: 1 },
        ],
      },
    ],
    isRepeatable: false,
    priority: 200,
  };
};
