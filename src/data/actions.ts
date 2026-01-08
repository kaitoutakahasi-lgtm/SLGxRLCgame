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
    baseInjuryRate: 3,
  },
  {
    type: 'lesson',
    id: 'vocal_lesson',
    name: 'ボーカルレッスン',
    targetStyle: 'elegant',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
    baseInjuryRate: 2,
  },
  {
    type: 'lesson',
    id: 'expression_lesson',
    name: '表情レッスン',
    targetStyle: 'cute',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
    baseInjuryRate: 1,
  },
  {
    type: 'lesson',
    id: 'study_lesson',
    name: '座学',
    targetStyle: 'clever',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
    baseInjuryRate: 0,
  },
  {
    type: 'lesson',
    id: 'physical_training',
    name: '体力トレーニング',
    targetStyle: 'passion',
    baseEffect: { min: 20, max: 40 },
    baseFatigue: 10,
    baseInjuryRate: 5,
  },
  {
    type: 'lesson',
    id: 'general_lesson',
    name: '総合レッスン',
    targetStyle: 'all',
    baseEffect: { min: 15, max: 30 },
    baseFatigue: 15,
    baseInjuryRate: 2,
  },

  // 上級レッスン
  {
    type: 'lesson',
    id: 'advanced_dance',
    name: '上級ダンス',
    targetStyle: 'cool',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    baseInjuryRate: 5,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_vocal',
    name: '上級ボーカル',
    targetStyle: 'elegant',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    baseInjuryRate: 4,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_expression',
    name: '上級表情',
    targetStyle: 'cute',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    baseInjuryRate: 2,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_study',
    name: '上級座学',
    targetStyle: 'clever',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    baseInjuryRate: 0,
    unlockCondition: { type: 'facility_total', value: 10 },
  },
  {
    type: 'lesson',
    id: 'advanced_physical',
    name: '上級トレーニング',
    targetStyle: 'passion',
    baseEffect: { min: 40, max: 70 },
    baseFatigue: 15,
    baseInjuryRate: 8,
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
    baseInjuryRate: 10,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_elegant',
    name: 'エレガント特訓',
    targetStyle: 'elegant',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    baseInjuryRate: 8,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_cute',
    name: 'キュート特訓',
    targetStyle: 'cute',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    baseInjuryRate: 5,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_clever',
    name: 'クレバー特訓',
    targetStyle: 'clever',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    baseInjuryRate: 2,
    unlockCondition: { type: 'facility_total', value: 20 },
  },
  {
    type: 'lesson',
    id: 'special_training_passion',
    name: 'パッション特訓',
    targetStyle: 'passion',
    baseEffect: { min: 70, max: 120 },
    baseFatigue: 25,
    baseInjuryRate: 15,
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
    baseInjuryRate: 18,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_elegant',
    name: 'エレガント限界突破',
    targetStyle: 'elegant',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    baseInjuryRate: 15,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_cute',
    name: 'キュート限界突破',
    targetStyle: 'cute',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    baseInjuryRate: 10,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_clever',
    name: 'クレバー限界突破',
    targetStyle: 'clever',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    baseInjuryRate: 5,
    unlockCondition: { type: 'facility_total', value: 30 },
  },
  {
    type: 'lesson',
    id: 'limit_break_passion',
    name: 'パッション限界突破',
    targetStyle: 'passion',
    baseEffect: { min: 120, max: 200 },
    baseFatigue: 40,
    baseInjuryRate: 25,
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

// ===========================
// キズナ練習データ
// ===========================

import { BondLessonAction, Style, SupportCharacter, BOND_THRESHOLDS } from '../types';

/** キズナ練習のベース効果を生成 */
export const createBondLessonAction = (
  support: SupportCharacter
): BondLessonAction => {
  const style = support.bonus.specialtyStyle;
  const characterName = support.character.name;

  return {
    type: 'bond_lesson',
    id: `bond_lesson_${support.character.id}`,
    name: `${characterName}とキズナ練習`,
    supportCharacterId: support.character.id,
    targetStyle: style,
    baseEffect: { min: 35, max: 55 },
    bondBonus: 8,
    friendshipMultiplier: 1.5,
    baseFatigue: 12,
    unlockBondLevel: support.bonus.friendshipThreshold || BOND_THRESHOLDS.FRIENDSHIP,
  };
};

/** 利用可能なキズナ練習を取得 */
export const getAvailableBondLessons = (
  supportDeck: SupportCharacter[],
  trainingParticipants: string[]
): BondLessonAction[] => {
  return supportDeck
    .filter((support) => {
      const threshold = support.bonus.friendshipThreshold || BOND_THRESHOLDS.FRIENDSHIP;
      return (
        support.bondLevel >= threshold &&
        trainingParticipants.includes(support.character.id)
      );
    })
    .map(createBondLessonAction);
};

// ===========================
// スタイル名の日本語マッピング
// ===========================

export const STYLE_NAMES: Record<Style, string> = {
  cool: 'クール',
  elegant: 'エレガント',
  cute: 'キュート',
  clever: 'クレバー',
  passion: 'パッション',
};

export const getStyleName = (style: Style): string => {
  return STYLE_NAMES[style];
};

// ===========================
// 怪我率計算
// ===========================

import { InjuryType, TrainingPositions, LessonAction as LessonActionType } from '../types';

/**
 * 怪我率を計算
 * @param baseRate 基礎怪我率
 * @param fatigue 現在の疲労度
 * @param facilityReduction 設備による軽減%
 * @returns 最終怪我率 (0-100)
 */
export const calculateInjuryRate = (
  baseRate: number,
  fatigue: number,
  facilityReduction: number = 0
): number => {
  // 疲労による怪我率増加: 疲労50以上で増加開始
  let fatigueModifier = 0;
  if (fatigue >= 80) {
    fatigueModifier = 30; // 疲労80以上: +30%
  } else if (fatigue >= 60) {
    fatigueModifier = 15; // 疲労60以上: +15%
  } else if (fatigue >= 50) {
    fatigueModifier = 5; // 疲労50以上: +5%
  }

  const rate = (baseRate + fatigueModifier) * (1 - facilityReduction / 100);
  return Math.max(0, Math.min(100, Math.round(rate)));
};

/**
 * 怪我判定を行う
 * @param injuryRate 怪我率
 * @returns 怪我の種類（怪我しない場合はnull）
 */
export const checkInjury = (injuryRate: number): InjuryType | null => {
  const roll = Math.random() * 100;
  if (roll >= injuryRate) {
    return null; // 怪我なし
  }

  // 怪我の種類を決定
  const severityRoll = Math.random() * 100;
  if (severityRoll < 70) {
    return 'light'; // 70%で軽い怪我
  } else if (severityRoll < 95) {
    return 'medium'; // 25%で怪我
  } else {
    return 'heavy'; // 5%で重傷
  }
};

/**
 * 怪我率の色を取得
 */
export const getInjuryRateColor = (rate: number): string => {
  if (rate === 0) return '#4ade80'; // 緑（安全）
  if (rate <= 5) return '#a3e635'; // 黄緑
  if (rate <= 15) return '#fbbf24'; // 黄色
  if (rate <= 30) return '#f97316'; // オレンジ
  return '#ef4444'; // 赤（危険）
};

// ===========================
// 練習配置システム
// ===========================

const BASIC_LESSON_IDS = [
  'dance_lesson',
  'vocal_lesson',
  'expression_lesson',
  'study_lesson',
  'physical_training',
  'general_lesson',
];

const STYLE_TO_LESSON: Record<Style, string> = {
  cool: 'dance_lesson',
  elegant: 'vocal_lesson',
  cute: 'expression_lesson',
  clever: 'study_lesson',
  passion: 'physical_training',
};

/**
 * サポートキャラを各練習に配置する
 * 得意スタイルの練習に配置されやすい
 */
export const assignTrainingPositions = (
  supportDeck: SupportCharacter[]
): TrainingPositions => {
  const positions: TrainingPositions = {
    dance_lesson: [],
    vocal_lesson: [],
    expression_lesson: [],
    study_lesson: [],
    physical_training: [],
    general_lesson: [],
  };

  supportDeck.forEach((support) => {
    // 得意スタイルに基づく配置確率
    const specialtyLesson = STYLE_TO_LESSON[support.bonus.specialtyStyle];
    const specialtyRate = support.bonus.specialtyRate || 50;

    // 配置先を決定
    const roll = Math.random() * 100;
    let assignedLesson: string;

    if (roll < specialtyRate) {
      // 得意練習に配置
      assignedLesson = specialtyLesson;
    } else if (roll < specialtyRate + 10) {
      // 総合レッスンに配置
      assignedLesson = 'general_lesson';
    } else {
      // ランダムに配置
      const otherLessons = BASIC_LESSON_IDS.filter(l => l !== specialtyLesson);
      assignedLesson = otherLessons[Math.floor(Math.random() * otherLessons.length)];
    }

    positions[assignedLesson as keyof TrainingPositions].push(support.character.id);
  });

  return positions;
};

/**
 * タッグ練習ボーナスを計算
 * 同じ練習に複数のサポートがいる場合ボーナス
 */
export const calculateTagBonus = (
  lessonId: string,
  positions: TrainingPositions,
  supportDeck: SupportCharacter[]
): { bonus: number; participants: SupportCharacter[] } => {
  const participantIds = positions[lessonId as keyof TrainingPositions] || [];
  const participants = supportDeck.filter(s => participantIds.includes(s.character.id));

  let bonus = 0;
  if (participants.length >= 2) {
    // 2人以上でタッグボーナス発動
    bonus = 10 * (participants.length - 1); // 1人追加ごとに+10%
  }

  return { bonus, participants };
};
