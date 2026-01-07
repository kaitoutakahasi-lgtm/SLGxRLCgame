import { Facility } from '../types';

// ===========================
// 設備データ
// ===========================

export const FACILITIES: Facility[] = [
  // === 練習施設 ===
  {
    id: 'dance_studio',
    name: 'ダンススタジオ',
    category: 'practice',
    description: 'クールレッスンの効果を上げる施設',
    maxLevel: 5,
    baseCost: 500,
    effects: [
      { type: 'lesson_bonus', style: 'cool', valuePerLevel: 10 },
    ],
  },
  {
    id: 'vocal_room',
    name: 'ボーカルルーム',
    category: 'practice',
    description: 'エレガントレッスンの効果を上げる施設',
    maxLevel: 5,
    baseCost: 500,
    effects: [
      { type: 'lesson_bonus', style: 'elegant', valuePerLevel: 10 },
    ],
  },
  {
    id: 'expression_room',
    name: '表情練習室',
    category: 'practice',
    description: 'キュートレッスンの効果を上げる施設',
    maxLevel: 5,
    baseCost: 500,
    effects: [
      { type: 'lesson_bonus', style: 'cute', valuePerLevel: 10 },
    ],
  },
  {
    id: 'study_room',
    name: '座学教室',
    category: 'practice',
    description: 'クレバーレッスンの効果を上げる施設',
    maxLevel: 5,
    baseCost: 500,
    effects: [
      { type: 'lesson_bonus', style: 'clever', valuePerLevel: 10 },
    ],
  },
  {
    id: 'training_gym',
    name: 'トレーニングジム',
    category: 'practice',
    description: 'パッションレッスンの効果を上げる施設',
    maxLevel: 5,
    baseCost: 500,
    effects: [
      { type: 'lesson_bonus', style: 'passion', valuePerLevel: 10 },
    ],
  },
  {
    id: 'general_studio',
    name: '総合練習場',
    category: 'practice',
    description: '全レッスンの効果を少しずつ上げる施設',
    maxLevel: 5,
    baseCost: 1000,
    effects: [
      { type: 'lesson_bonus', style: 'cool', valuePerLevel: 5 },
      { type: 'lesson_bonus', style: 'elegant', valuePerLevel: 5 },
      { type: 'lesson_bonus', style: 'cute', valuePerLevel: 5 },
      { type: 'lesson_bonus', style: 'clever', valuePerLevel: 5 },
      { type: 'lesson_bonus', style: 'passion', valuePerLevel: 5 },
    ],
  },

  // === サポート施設 ===
  {
    id: 'rest_room',
    name: '休憩室',
    category: 'support',
    description: '休養効果を上げる施設',
    maxLevel: 3,
    baseCost: 300,
    effects: [
      { type: 'rest_bonus', valuePerLevel: 20 },
    ],
  },
  {
    id: 'medical_room',
    name: '医務室',
    category: 'support',
    description: '体調回復を早め、怪我率を下げる施設',
    maxLevel: 3,
    baseCost: 500,
    effects: [
      { type: 'health_recovery', valuePerLevel: 10 },
      { type: 'injury_reduction', valuePerLevel: 10 },
    ],
  },
  {
    id: 'mental_care_room',
    name: 'メンタルケア室',
    category: 'support',
    description: 'メンタル回復を早める施設',
    maxLevel: 3,
    baseCost: 500,
    effects: [
      { type: 'mental_recovery', valuePerLevel: 20 },
    ],
  },
  {
    id: 'cafeteria',
    name: '食堂',
    category: 'support',
    description: '毎週自動で疲労を回復する施設',
    maxLevel: 3,
    baseCost: 400,
    effects: [
      { type: 'fatigue_reduction', valuePerLevel: 10 },
    ],
  },

  // === 特殊施設 ===
  {
    id: 'advanced_studio',
    name: '上級スタジオ',
    category: 'special',
    description: '上級レッスンを解禁する施設',
    maxLevel: 1,
    baseCost: 2000,
    effects: [
      { type: 'unlock_lesson', valuePerLevel: 1 },
    ],
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    id: 'special_training',
    name: '特訓場',
    category: 'special',
    description: '特訓を解禁する施設',
    maxLevel: 1,
    baseCost: 5000,
    effects: [
      { type: 'unlock_lesson', valuePerLevel: 2 },
    ],
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    id: 'limit_break_facility',
    name: '限界突破施設',
    category: 'special',
    description: '限界突破を解禁する施設',
    maxLevel: 1,
    baseCost: 10000,
    effects: [
      { type: 'unlock_lesson', valuePerLevel: 3 },
    ],
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    id: 'vip_lounge',
    name: 'VIPラウンジ',
    category: 'special',
    description: '高額営業を解禁する施設',
    maxLevel: 1,
    baseCost: 3000,
    effects: [
      { type: 'unlock_business', valuePerLevel: 1 },
    ],
    unlockCondition: { type: 'fame', value: 500 },
  },
  {
    id: 'overseas_base',
    name: '海外拠点',
    category: 'special',
    description: '海外イベントを解禁する施設',
    maxLevel: 1,
    baseCost: 8000,
    effects: [
      { type: 'unlock_event', valuePerLevel: 1 },
    ],
    unlockCondition: { type: 'fame', value: 1000 },
  },
];

// 設備レベルアップコスト計算
const LEVEL_COST_MULTIPLIERS = [1.0, 1.5, 2.5, 4.0, 6.0];

export const calculateFacilityUpgradeCost = (
  facility: Facility,
  currentLevel: number
): number => {
  if (currentLevel >= facility.maxLevel) return -1;
  return Math.floor(facility.baseCost * LEVEL_COST_MULTIPLIERS[currentLevel]);
};

export const calculateTotalFacilityCost = (
  facility: Facility,
  targetLevel: number
): number => {
  let total = 0;
  for (let i = 0; i < targetLevel; i++) {
    total += Math.floor(facility.baseCost * LEVEL_COST_MULTIPLIERS[i]);
  }
  return total;
};

export const getFacilityById = (id: string): Facility | undefined => {
  return FACILITIES.find((f) => f.id === id);
};

export const getFacilityBonus = (
  facilityId: string,
  level: number,
  effectType: string,
  style?: string
): number => {
  const facility = getFacilityById(facilityId);
  if (!facility || level === 0) return 0;

  const effect = facility.effects.find(
    (e) => e.type === effectType && (!style || e.style === style)
  );
  return effect ? effect.valuePerLevel * level : 0;
};

export const getTotalLessonBonus = (
  ownedFacilities: { facilityId: string; level: number }[],
  style: string
): number => {
  return ownedFacilities.reduce((total, owned) => {
    return total + getFacilityBonus(owned.facilityId, owned.level, 'lesson_bonus', style);
  }, 0);
};
