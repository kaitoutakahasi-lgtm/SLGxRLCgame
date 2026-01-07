import { LessonAction, RestAction, BusinessAction, Audition } from '../types';

// ===========================
// レッスン行動
// ===========================

export const LESSON_ACTIONS: LessonAction[] = [
  // 基本レッスン
  {
    type: 'lesson',
    id: 'dance_lesson',
    name: 'ダンスレッスン',
    targetStyle: 'cool',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
  },
  {
    type: 'lesson',
    id: 'vocal_lesson',
    name: 'ボーカルレッスン',
    targetStyle: 'elegant',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
  },
  {
    type: 'lesson',
    id: 'expression_lesson',
    name: '表情レッスン',
    targetStyle: 'cute',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
  },
  {
    type: 'lesson',
    id: 'study_lesson',
    name: '座学',
    targetStyle: 'clever',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
  },
  {
    type: 'lesson',
    id: 'physical_training',
    name: '体力トレーニング',
    targetStyle: 'passion',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
  },
  {
    type: 'lesson',
    id: 'general_lesson',
    name: '総合レッスン',
    targetStyle: 'all',
    baseEffect: { min: 15, max: 30 },
    baseFatigue: 15,
  },

  // 上級レッスン
  {
    type: 'lesson',
    id: 'advanced_dance',
    name: '上級ダンス',
    targetStyle: 'cool',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_vocal',
    name: '上級ボーカル',
    targetStyle: 'elegant',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_expression',
    name: '上級表情',
    targetStyle: 'cute',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_study',
    name: '上級座学',
    targetStyle: 'clever',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_physical',
    name: '上級トレーニング',
    targetStyle: 'passion',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    unlockCondition: { type: 'facility_total', value: 10 },
  },

  // 特訓
  {
    type: 'lesson',
    id: 'special_training_cool',
    name: 'クール特訓',
    targetStyle: 'cool',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_elegant',
    name: 'エレガント特訓',
    targetStyle: 'elegant',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_cute',
    name: 'キュート特訓',
    targetStyle: 'cute',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_clever',
    name: 'クレバー特訓',
    targetStyle: 'clever',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_passion',
    name: 'パッション特訓',
    targetStyle: 'passion',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    unlockCondition: { type: 'facility_total', value: 20 },
  },

  // 限界突破
  {
    type: 'lesson',
    id: 'limit_break_cool',
    name: 'クール限界突破',
    targetStyle: 'cool',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_elegant',
    name: 'エレガント限界突破',
    targetStyle: 'elegant',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_cute',
    name: 'キュート限界突破',
    targetStyle: 'cute',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_clever',
    name: 'クレバー限界突破',
    targetStyle: 'clever',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_passion',
    name: 'パッション限界突破',
    targetStyle: 'passion',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
];

// ===========================
// 休息行動
// ===========================

export const REST_ACTIONS: RestAction[] = [
  {
    type: 'rest',
    id: 'rest',
    name: '休養',
    fatigueRecovery: { min: 30, max: 50 },
    healthRecovery: 10,
    hasRandomEvent: false,
  },
  {
    type: 'rest',
    id: 'travel',
    name: '旅行',
    fatigueRecovery: { min: 40, max: 60 },
    healthRecovery: 5,
    hasRandomEvent: true,
  },
];

// ===========================
// 営業行動
// ===========================

export const BUSINESS_ACTIONS: BusinessAction[] = [
  {
    type: 'business',
    id: 'handshake_event',
    name: '握手会',
    goldReward: { min: 100, max: 300 },
    fameReward: 10,
    motivationReward: 10,
  },
  {
    type: 'business',
    id: 'magazine_interview',
    name: '雑誌取材',
    goldReward: { min: 200, max: 500 },
    fameReward: 30,
    motivationReward: 5,
    unlockCondition: { type: 'fame', value: 100 },
  },
  {
    type: 'business',
    id: 'tv_appearance',
    name: 'TV出演',
    goldReward: { min: 500, max: 1000 },
    fameReward: 50,
    motivationReward: 10,
    unlockCondition: { type: 'fame', value: 300 },
  },
  {
    type: 'business',
    id: 'cm_shooting',
    name: 'CM撮影',
    goldReward: { min: 1000, max: 2000 },
    fameReward: 80,
    motivationReward: 15,
    unlockCondition: { type: 'fame', value: 500 },
  },
  {
    type: 'business',
    id: 'overseas_performance',
    name: '海外公演',
    goldReward: { min: 2000, max: 5000 },
    fameReward: 150,
    motivationReward: 20,
    unlockCondition: { type: 'fame', value: 1000 },
  },
];

// ===========================
// オーディション
// ===========================

export const AUDITIONS: Audition[] = [
  {
    id: 'rookie_audition',
    name: '新人オーディション',
    week: 12,
    difficulty: 'beginner',
    goldReward: 500,
    fameReward: 50,
    rivalLevel: 1,
  },
  {
    id: 'summer_festival',
    name: 'サマーフェス予選',
    week: 24,
    difficulty: 'intermediate',
    goldReward: 1500,
    fameReward: 100,
    rivalLevel: 2,
  },
  {
    id: 'autumn_grandprix',
    name: '秋季グランプリ',
    week: 36,
    difficulty: 'advanced',
    goldReward: 3000,
    fameReward: 200,
    rivalLevel: 3,
  },
  {
    id: 'dream_stage',
    name: 'ドリームステージ',
    week: 48,
    difficulty: 'master',
    goldReward: 10000,
    fameReward: 500,
    rivalLevel: 4,
  },
];

// ===========================
// ヘルパー関数
// ===========================

export const getLessonById = (id: string): LessonAction | undefined => {
  return LESSON_ACTIONS.find((l) => l.id === id);
};

export const getAvailableLessons = (facilityTotalLevel: number): LessonAction[] => {
  return LESSON_ACTIONS.filter((lesson) => {
    if (!lesson.unlockCondition) return true;
    return facilityTotalLevel >= lesson.unlockCondition.value;
  });
};

export const getAvailableBusinessActions = (fame: number): BusinessAction[] => {
  return BUSINESS_ACTIONS.filter((action) => {
    if (!action.unlockCondition) return true;
    return fame >= action.unlockCondition.value;
  });
};

export const getAuditionByWeek = (week: number): Audition | undefined => {
  return AUDITIONS.find((a) => a.week === week);
};
