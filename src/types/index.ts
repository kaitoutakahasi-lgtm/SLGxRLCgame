// ===========================
// アイドル育成デッキ構築ゲーム - 型定義 v2
// ===========================

// ===========================
// 基本列挙型
// ===========================

/** 5つのスタイル */
export type Style = 'cool' | 'elegant' | 'cute' | 'clever' | 'passion';

/** ランク */
export type Rank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

/** 性格タイプ */
export type PersonalityType =
  | 'hotblooded'  // 熱血
  | 'cool'        // クール
  | 'natural'     // 天然
  | 'hardworker'  // 努力家
  | 'competitive' // 負けず嫌い
  | 'spoiled'     // 甘えん坊
  | 'perfectionist' // 完璧主義
  | 'moodmaker';  // ムードメーカー

/** 性別 */
export type Gender = 'male' | 'female' | 'other';

/** カードカテゴリ */
export type CardCategory = 'appeal' | 'sabotage' | 'defense' | 'manipulation' | 'conditional';

/** カードレアリティ */
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** キャラクタータイプ */
export type CharacterType = 'training' | 'support' | 'fixed' | 'trained' | 'edit';

// ===========================
// 口調・語尾システム
// ===========================

export interface SpeechStyle {
  firstPerson: string;
  secondPerson: string;
  template: SpeechTemplate;
  customEnding?: string;
}

export type SpeechTemplate =
  | 'female_polite' | 'female_casual' | 'female_ojou' | 'female_gyaru'
  | 'female_quiet' | 'female_energetic' | 'female_tsundere' | 'female_dialect_a'
  | 'male_polite' | 'male_casual' | 'male_hotblooded' | 'male_cool'
  | 'male_prince' | 'male_rough' | 'male_quiet' | 'male_dialect_b'
  | 'neutral_polite' | 'neutral_casual' | 'robot' | 'custom';

export const SPEECH_TEMPLATE_ENDINGS: Record<SpeechTemplate, { positive: string; negative: string; question: string }> = {
  female_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  female_casual: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  female_ojou: { positive: 'ですわ', negative: 'ませんわ', question: 'ですの' },
  female_gyaru: { positive: 'っしょ', negative: 'ないし', question: 'じゃん' },
  female_quiet: { positive: '…', negative: '…ない', question: '…?' },
  female_energetic: { positive: 'だよっ！', negative: 'ないよっ！', question: 'かなっ！' },
  female_tsundere: { positive: 'んだから', negative: 'ないんだから', question: 'なのよ' },
  female_dialect_a: { positive: 'ばい', negative: 'なかばい', question: 'ね' },
  male_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  male_casual: { positive: 'だ', negative: 'ない', question: 'か' },
  male_hotblooded: { positive: 'ぜ！', negative: 'ないぜ！', question: 'か！' },
  male_cool: { positive: 'さ', negative: 'ないさ', question: 'かな' },
  male_prince: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  male_rough: { positive: 'んだよ', negative: 'ねぇよ', question: 'だろ' },
  male_quiet: { positive: '…', negative: '…ない', question: '…?' },
  male_dialect_b: { positive: 'のじゃ', negative: 'ないのじゃ', question: 'かのう' },
  neutral_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  neutral_casual: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  robot: { positive: 'デス', negative: 'マセン', question: 'デスカ' },
  custom: { positive: '', negative: '', question: '' },
};

// ===========================
// 固有スキル
// ===========================

export type UniqueSkillType =
  | 'growth_style_a' | 'growth_style_b' | 'condition_a' | 'condition_b'
  | 'event_a' | 'event_b' | 'live_a' | 'live_b' | 'money' | 'bond';

export interface UniqueSkill {
  type: UniqueSkillType;
  name: string;
  description: string;
  targetStyle?: Style;
}

// ===========================
// キャラクターデータ
// ===========================

export interface CharacterStats {
  cool: number;
  elegant: number;
  cute: number;
  clever: number;
  passion: number;
}

export interface CharacterCondition {
  health: number;
  fatigue: number;
  motivation: number;
  mental: number;
}

export interface CharacterAppearance {
  hairStyle: number;
  hairColor: string;
  eyeStyle: number;
  eyeColor: string;
  outfit: number;
  accessory: number;
}

export interface BaseCharacter {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  agency: string;
  appearance: CharacterAppearance;
  personality: PersonalityType;
  speechStyle: SpeechStyle;
  uniqueSkill: UniqueSkill;
}

export interface EditCharacter extends BaseCharacter {
  type: 'edit';
  createdAt: number;
}

export interface TrainingCharacter extends BaseCharacter {
  type: 'training';
  stats: CharacterStats;
  condition: CharacterCondition;
  rank: Rank;
  cards: Card[];
  actionSpeed: number;
}

export interface TrainedCharacter extends BaseCharacter {
  type: 'trained';
  finalStats: CharacterStats;
  finalRank: Rank;
  acquiredCards: Card[];
  trainedAt: number;
  bestStyle: Style;
}

export interface FixedCharacter extends BaseCharacter {
  type: 'fixed';
  defaultStats: CharacterStats;
  storyEvents: string[];
  specialCards: Card[];
  bondEvents: BondEventSet;
}

export type Character = EditCharacter | TrainingCharacter | TrainedCharacter | FixedCharacter;

// ===========================
// キズナ（絆）システム
// ===========================

/** キズナイベントの種類 */
export type BondEventType = 'bond_up' | 'stat_up' | 'card_gauge_up';

/** キズナイベント */
export interface BondEvent {
  id: string;
  type: BondEventType;
  name: string;
  description: string;
  dialogue: string[];
  choices: EventChoice[];
  rewards: {
    bondUp?: number;
    statUp?: Partial<CharacterStats>;
    cardGaugeUp?: number;
  };
}

/** サポートキャラのキズナイベントセット */
export interface BondEventSet {
  event1: BondEvent;  // キズナアップイベント（絆20で発生）
  event2: BondEvent;  // ステータスアップイベント（絆50で発生）
  event3: BondEvent;  // カードゲージイベント（絆80で発生）→完了で専用カード
  specialCard: Card;  // 3つ目クリアで獲得
}

/** サポートキャラの絆進行状態 */
export interface SupportBondProgress {
  event1Cleared: boolean;
  event2Cleared: boolean;
  event3Cleared: boolean;
}

// ===========================
// サポートキャラクター（拡張版）
// ===========================

/** サポートボーナステーブル（パワプロ・ウマ娘風） */
export interface SupportBonus {
  // 基本ボーナス
  lessonBonus: Partial<Record<Style, number>>;
  initialStats: Partial<CharacterStats>;

  // 得意練習系
  specialtyStyle: Style;          // 得意スタイル
  specialtyRate: number;          // 得意練習発生率 (0-100)
  trainingEffectUp: number;       // トレーニング効果UP %

  // キズナ練習系
  friendshipBonus: number;        // 友情トレーニング効果UP %
  friendshipThreshold: number;    // 友情トレーニング解禁絆レベル

  // やる気・コンディション系
  motivationEffectUp: number;     // やる気効果UP %
  fatigueReduction: number;       // 疲労軽減 %
  conditionUp: number;            // 体調回復量UP

  // イベント系
  eventEffectUp: number;          // イベント効果UP %

  // カード・スキル系
  cardGaugeBonus: number;         // カード獲得ゲージボーナス
  hintRate: number;               // スキルヒント発生率 %
  hintEffectUp: number;           // ヒント効果UP %

  // 資金・知名度系
  goldBonus: number;              // 収入UP %
  fameBonus: number;              // 知名度UP %

  // コンテスト系
  contestBonus: number;           // コンテストボーナス %

  // 初期系
  initialBond: number;            // 初期絆レベル

  // 設備系
  facilityBonus: { facilityId: string; effectBonus?: number; costDiscount?: number }[];
}

/** サポートキャラクター（拡張版） */
export interface SupportCharacter {
  character: TrainedCharacter | FixedCharacter | EditCharacter;
  bondLevel: number;
  bonus: SupportBonus;
  bondProgress: SupportBondProgress;
  bondEvents?: BondEventSet;
  isInTraining: boolean;  // 今回の練習に参加しているか
}

// ===========================
// カード獲得ゲージシステム
// ===========================

export interface CardAcquisitionGauge {
  current: number;      // 現在値 0-100
  max: number;          // 最大値（通常100）
  pendingCards: Card[]; // 獲得予定のカード候補
}

/** スキルヒント */
export interface SkillHint {
  supportCharacterId: string;
  card: Card;
  hintLevel: number;  // 1-5、高いほど獲得しやすい
}

// ===========================
// カードシステム
// ===========================

export interface CardEffect {
  type: 'appeal' | 'stamina' | 'voltage' | 'draw' | 'discard' | 'nullify' | 'trend_change' | 'action_speed';
  value: number;
  target: 'self' | 'opponent' | 'both';
  condition?: CardCondition;
}

export interface CardCondition {
  type: 'trend_match' | 'stamina_above' | 'stamina_below' | 'voltage_above' | 'leading' | 'losing' | 'first_turn' | 'last_turn';
  value?: number;
  style?: Style;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  category?: CardCategory;
  style: Style;
  cost: number;
  rarity?: CardRarity;  // カードレアリティ
  requiredRank: Rank;
  effects: CardEffect[];
  flavorText?: string;
  isSpecial?: boolean;  // 専用カードかどうか
  sourceCharacterId?: string;  // どのサポートキャラから獲得したか
}

// ===========================
// 設備システム
// ===========================

export type FacilityCategory = 'practice' | 'support' | 'special';

export interface Facility {
  id: string;
  name: string;
  category: FacilityCategory;
  description: string;
  maxLevel: number;
  baseCost: number;
  effects: FacilityEffect[];
  unlockCondition?: UnlockCondition;
}

export interface FacilityEffect {
  type: 'lesson_bonus' | 'rest_bonus' | 'health_recovery' | 'fatigue_reduction' | 'injury_reduction' | 'mental_recovery' | 'unlock_lesson' | 'unlock_business' | 'unlock_event';
  style?: Style;
  valuePerLevel: number;
}

export interface UnlockCondition {
  type: 'facility_total' | 'rank' | 'fame' | 'bond' | 'scenario';
  value: number;
  scenarioFlag?: string;
}

export interface OwnedFacility {
  facilityId: string;
  level: number;
}

// ===========================
// 週間行動システム（拡張版）
// ===========================

export type ActionType = 'lesson' | 'rest' | 'business' | 'bond_lesson' | 'special';

export interface LessonAction {
  type: 'lesson';
  id: string;
  name: string;
  targetStyle: Style | 'all';
  baseEffect: { min: number; max: number };
  baseFatigue: number;
  baseInjuryRate: number; // 怪我基礎確率 (0-100)
  unlockCondition?: UnlockCondition;
}

/** キズナ練習 */
export interface BondLessonAction {
  type: 'bond_lesson';
  id: string;
  name: string;
  supportCharacterId: string;
  targetStyle: Style;
  baseEffect: { min: number; max: number };
  bondBonus: number;           // 絆上昇量
  friendshipMultiplier: number; // 効果倍率（通常練習より高い）
  baseFatigue: number;
  unlockBondLevel: number;     // 解禁に必要な絆レベル
}

export interface RestAction {
  type: 'rest';
  id: string;
  name: string;
  fatigueRecovery: { min: number; max: number };
  healthRecovery: number;
  hasRandomEvent: boolean;
}

export interface BusinessAction {
  type: 'business';
  id: string;
  name: string;
  goldReward: { min: number; max: number };
  fameReward: number;
  motivationReward: number;
  unlockCondition?: UnlockCondition;
}

export type WeeklyAction = LessonAction | BondLessonAction | RestAction | BusinessAction;

// ===========================
// イベントシステム（パワプロ風）
// ===========================

export interface EventChoice {
  id: string;
  text: string;
  effects: EventEffect[];
  nextEventId?: string;      // 分岐先のイベントID
  condition?: EventCondition; // 選択肢の表示条件
}

export interface EventCondition {
  type: 'stat' | 'bond' | 'flag' | 'random';
  statRequirement?: { style: Style; minValue: number };
  bondRequirement?: { characterId: string; minLevel: number };
  flagRequirement?: string;
  probability?: number;
}

export interface EventEffect {
  type: 'stats' | 'condition' | 'gold' | 'card' | 'bond' | 'fame' | 'card_gauge' | 'flag' | 'scenario';
  target?: Style | keyof CharacterCondition | string;
  value: number;
  cardId?: string;
  characterId?: string;
  flagName?: string;
  scenarioId?: string;
}

/** イベントセリフ（掛け合い対応） */
export interface EventDialogue {
  speaker: 'player' | 'producer' | 'narrator' | string;  // キャラIDまたは役割
  speakerName?: string;  // 表示名（キャラIDの場合は自動取得）
  text: string;
  emotion?: 'normal' | 'happy' | 'sad' | 'angry' | 'surprised' | 'shy';
}

/** キャラクターイベントタイプ */
export type CharacterEventType = 'self_intro' | 'bond_1' | 'bond_2' | 'bond_3' | 'independent';

/** イベントカテゴリ */
export type EventCategory = 'scenario' | 'generic' | 'character';

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  eventType: 'random' | 'bond' | 'story' | 'scenario' | 'weekly' | 'self_intro' | 'generic';
  category?: EventCategory;  // オプショナル（後方互換）
  dialogue: string[];  // 旧形式（後方互換）
  dialogues?: EventDialogue[];  // 新形式（掛け合い対応）
  participantCharacterIds?: string[];  // 参加キャラクターID
  triggerCondition: EventTrigger;
  choices: EventChoice[];
  isRepeatable: boolean;
  priority: number;  // 高いほど優先的に発生（自己紹介は最優先）
}

/** キャラクター専用イベントセット */
export interface CharacterEventSet {
  characterId: string;
  selfIntroEvent: GameEvent;       // 自己紹介イベント（1個、最優先）
  bondEvents: GameEvent[];         // 絆イベント（3個）
  independentEvents: GameEvent[];  // 独立イベント（1-2個）
}

export interface EventTrigger {
  type: 'week' | 'stat' | 'bond' | 'facility' | 'random' | 'flag' | 'scenario';
  week?: number;
  stat?: { style: Style; minValue: number };
  bondLevel?: number;
  characterId?: string;
  facilityId?: string;
  facilityLevel?: number;
  probability?: number;
  requiredFlag?: string;
  scenarioPhase?: number;
}

// ===========================
// シナリオ分岐システム
// ===========================

export interface ScenarioBranch {
  id: string;
  name: string;
  description: string;
  unlockCondition: {
    type: 'choice' | 'stat' | 'bond' | 'event';
    eventId?: string;
    choiceId?: string;
    statRequirement?: { style: Style; minValue: number };
    bondRequirement?: { characterId: string; minLevel: number };
  };
  events: string[];      // このルートで発生するイベントID
  bonuses: Partial<CharacterStats>;
  specialCards: string[];
  endingType: 'normal' | 'good' | 'true' | 'bad';
}

export interface ScenarioProgress {
  currentPhase: number;
  activeScenarioId: string | null;
  completedBranches: string[];
  flags: Record<string, boolean>;
}

// ===========================
// オーディション
// ===========================

export interface Audition {
  id: string;
  name: string;
  week: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  goldReward: number;
  fameReward: number;
  rivalLevel: number;
}

// ===========================
// ライブバトルシステム（4人バトロワ版）
// ===========================

/** バトル参加者（プレイヤーまたはAI） */
export interface BattleParticipant {
  id: string;
  name: string;
  isPlayer: boolean;
  style: Style; // キャラの得意スタイル
  deck: Card[];
  hand: Card[];
  discard: Card[];
  stamina: number;
  maxStamina: number;
  stars: number;
  actionSpeed: number;
  selectedCards: Card[];
  fullRecoveryUsed: boolean;
  avatarColor: string; // キャラクターの色
  avatarImage?: string; // キャラクター画像URL（png/gif対応）
}

/** バトルフェーズ */
export type BattlePhase =
  | 'card_select'       // カード選択中
  | 'round_start'       // ラウンド開始演出
  | 'card_resolve'      // カード解決（速度順）
  | 'effect_display'    // エフェクト表示中
  | 'turn_end'          // ターン終了演出
  | 'result';           // 結果表示

/** カード解決アニメーション状態 */
export interface CardResolveAnimation {
  participantId: string;
  cardIndex: number;
  card: Card;
  effects: {
    type: 'voltage_up' | 'star_gain' | 'damage' | 'heal' | 'buff' | 'debuff';
    value: number;
    targetId?: string;
  }[];
}

export interface BattleState {
  turn: number;
  maxTurns: number;
  trend: Style;
  participants: BattleParticipant[]; // 4人の参加者（速度順にソート済み）
  voltage: number;
  voltageMax: number;
  voltageClaimed: boolean;
  phase: BattlePhase;
  currentResolveIndex: number; // 現在解決中の参加者インデックス
  resolveAnimations: CardResolveAnimation[]; // アニメーションキュー
  turnOrder: string[]; // 今のターンの行動順（速度順のID配列）
}

export interface PlayerBattleState {
  deck: Card[];
  hand: Card[];
  discard: Card[];
  stamina: number;
  maxStamina: number;
  stars: number;
  actionSpeed: number;
  selectedCards: Card[];
  fullRecoveryUsed: boolean;
}

export interface BattleResult {
  rankings: { participantId: string; name: string; stars: number; isPlayer: boolean }[];
  playerRank: number; // 1-4
  rewards: {
    gold: number;
    fame: number;
    cards: Card[];
    cardGauge: number;
  };
}

// ===========================
// 育成セッション（拡張版）
// ===========================

export interface TrainingSession {
  character: TrainingCharacter;
  supportDeck: SupportCharacter[];
  currentWeek: number;
  maxWeeks: number;
  gold: number;
  fame: number;
  facilities: OwnedFacility[];
  completedEvents: string[];
  auditionResults: { auditionId: string; result: BattleResult }[];

  // カード獲得ゲージ
  cardGauge: CardAcquisitionGauge;

  // スキルヒント
  skillHints: SkillHint[];

  // シナリオ進行
  scenario: ScenarioProgress;

  // 現在発生中のイベント
  currentEvent: GameEvent | null;

  // 練習参加サポート（今週の練習にいるサポート）
  trainingParticipants: string[];

  // 練習ごとのサポート配置（タッグ練習用）
  trainingPositions: TrainingPositions;

  // 現在の怪我状態
  currentInjury: { type: InjuryType; remainingWeeks: number } | null;

  // 獲得済みレアスキル
  acquiredRareSkills: string[];
}

// ===========================
// ゲーム全体の状態
// ===========================

export interface GameState {
  editCharacters: EditCharacter[];
  trainedCharacters: TrainedCharacter[];
  currentSession: TrainingSession | null;
  currentBattle: BattleState | null;
  unlockedFixedCharacters: string[];
  totalTrainingCount: number;
  settings: GameSettings;
}

export interface GameSettings {
  bgmVolume: number;
  seVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast';
  autoSave: boolean;
  effectLevel: 'low' | 'medium' | 'high';
}

// ===========================
// 定数
// ===========================

export const RANK_THRESHOLDS: Record<Rank, number> = {
  E: 0, D: 50, C: 150, B: 350, A: 700, S: 1200, SS: 1900, SSS: 2800,
};

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

export const BOND_THRESHOLDS = {
  EVENT_1: 20,   // キズナイベント1解禁
  EVENT_2: 50,   // キズナイベント2解禁
  EVENT_3: 80,   // キズナイベント3解禁
  FRIENDSHIP: 40, // 友情トレーニング解禁（デフォルト）
};

export const CARD_GAUGE_MAX = 100;
export const CARD_GAUGE_PER_LESSON = 5;
export const CARD_GAUGE_PER_BOND_LESSON = 10;
export const CARD_GAUGE_PER_HINT = 15;

export const PERSONALITY_PASSIVES: Record<PersonalityType, { description: string; condition: string }> = {
  hotblooded: { description: 'アピール+1', condition: 'スタミナ4以上' },
  cool: { description: 'アピール+1', condition: '先行時' },
  natural: { description: 'トレンドボーナス+1', condition: 'トレンド一致時' },
  hardworker: { description: 'スタミナ回復+1', condition: '毎ターン' },
  competitive: { description: 'アピール+1', condition: 'スコア負け時' },
  spoiled: { description: '妨害1回無効', condition: '後攻時' },
  perfectionist: { description: 'アピール+1', condition: '妨害未受時' },
  moodmaker: { description: 'ボルテージ獲得+1', condition: '常時' },
};

// ===========================
// 練習配置システム
// ===========================

/** 練習ごとのサポート配置 */
export interface TrainingPositions {
  dance_lesson: string[];
  vocal_lesson: string[];
  expression_lesson: string[];
  study_lesson: string[];
  physical_training: string[];
  general_lesson: string[];
}

// ===========================
// 怪我システム
// ===========================

/** 怪我の種類 */
export type InjuryType = 'light' | 'medium' | 'heavy';

/** 怪我の効果 */
export interface InjuryEffect {
  type: InjuryType;
  name: string;
  duration: number; // 週数
  fatigueIncrease: number;
  statPenalty: number; // 練習効果減少%
  description: string;
}

export const INJURY_TYPES: Record<InjuryType, InjuryEffect> = {
  light: {
    type: 'light',
    name: '軽い怪我',
    duration: 1,
    fatigueIncrease: 20,
    statPenalty: 0,
    description: '疲労が増加した',
  },
  medium: {
    type: 'medium',
    name: '怪我',
    duration: 2,
    fatigueIncrease: 30,
    statPenalty: 30,
    description: '練習効果が下がった',
  },
  heavy: {
    type: 'heavy',
    name: '重傷',
    duration: 3,
    fatigueIncrease: 50,
    statPenalty: 50,
    description: '練習効果が大きく下がった',
  },
};

// ===========================
// レアスキル（金特）システム
// ===========================

/** レアスキル */
export interface RareSkill {
  id: string;
  name: string;
  description: string;
  effect: CardEffect[];
  requiredBond: number; // 必要絆レベル（通常100）
  sourceCharacterId: string;
}

/** サポートキャラのレアスキル設定 */
export interface SupportRareSkill {
  rareSkill: RareSkill;
  hintLevel: number; // ヒントで獲得しやすさ (1-5)
  alternativeSkills?: RareSkill[]; // 代替で獲得できるスキル
}
