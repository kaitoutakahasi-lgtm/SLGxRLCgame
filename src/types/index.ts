// ===========================
// アイドル育成デッキ構築ゲーム - 型定義
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

/** キャラクタータイプ */
export type CharacterType = 'training' | 'support' | 'fixed' | 'trained' | 'edit';

// ===========================
// 口調・語尾システム
// ===========================

export interface SpeechStyle {
  firstPerson: string;      // 一人称
  secondPerson: string;     // 二人称
  template: SpeechTemplate; // 語尾テンプレート
  customEnding?: string;    // カスタム語尾
}

export type SpeechTemplate =
  // 女性向け
  | 'female_polite'      // 標準敬語
  | 'female_casual'      // 標準タメ
  | 'female_ojou'        // お嬢様
  | 'female_gyaru'       // ギャル
  | 'female_quiet'       // 無口
  | 'female_energetic'   // 元気
  | 'female_tsundere'    // ツンデレ
  | 'female_dialect_a'   // 方言A
  // 男性向け
  | 'male_polite'        // 標準敬語
  | 'male_casual'        // 標準タメ
  | 'male_hotblooded'    // 熱血
  | 'male_cool'          // クール
  | 'male_prince'        // 王子様
  | 'male_rough'         // オラオラ
  | 'male_quiet'         // 無口
  | 'male_dialect_b'     // 方言B
  // 共通
  | 'neutral_polite'     // 中性敬語
  | 'neutral_casual'     // 中性タメ
  | 'robot'              // ロボット
  | 'custom';            // カスタム

export const SPEECH_TEMPLATE_ENDINGS: Record<SpeechTemplate, { positive: string; negative: string; question: string }> = {
  // 女性向け
  female_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  female_casual: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  female_ojou: { positive: 'ですわ', negative: 'ませんわ', question: 'ですの' },
  female_gyaru: { positive: 'っしょ', negative: 'ないし', question: 'じゃん' },
  female_quiet: { positive: '…', negative: '…ない', question: '…?' },
  female_energetic: { positive: 'だよっ！', negative: 'ないよっ！', question: 'かなっ！' },
  female_tsundere: { positive: 'んだから', negative: 'ないんだから', question: 'なのよ' },
  female_dialect_a: { positive: 'ばい', negative: 'なかばい', question: 'ね' },
  // 男性向け
  male_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  male_casual: { positive: 'だ', negative: 'ない', question: 'か' },
  male_hotblooded: { positive: 'ぜ！', negative: 'ないぜ！', question: 'か！' },
  male_cool: { positive: 'さ', negative: 'ないさ', question: 'かな' },
  male_prince: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  male_rough: { positive: 'んだよ', negative: 'ねぇよ', question: 'だろ' },
  male_quiet: { positive: '…', negative: '…ない', question: '…?' },
  male_dialect_b: { positive: 'のじゃ', negative: 'ないのじゃ', question: 'かのう' },
  // 共通
  neutral_polite: { positive: 'です', negative: 'ません', question: 'ですか' },
  neutral_casual: { positive: 'だよ', negative: 'ないよ', question: 'かな' },
  robot: { positive: 'デス', negative: 'マセン', question: 'デスカ' },
  custom: { positive: '', negative: '', question: '' },
};

// ===========================
// 固有スキル
// ===========================

export type UniqueSkillType =
  | 'growth_style_a'    // 特定スタイル成長率UP
  | 'growth_style_b'    // 全スタイル成長率微UP
  | 'condition_a'       // 疲労軽減
  | 'condition_b'       // 体調維持
  | 'event_a'           // 特定イベント発生率UP
  | 'event_b'           // イベント報酬UP
  | 'live_a'            // 特定条件でアピールUP
  | 'live_b'            // リソース効率UP
  | 'money'             // 収入UP
  | 'bond';             // 絆上昇率UP

export interface UniqueSkill {
  type: UniqueSkillType;
  name: string;
  description: string;
  targetStyle?: Style; // growth_style_aなど特定スタイル対象の場合
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
  health: number;    // 体調 0-100
  fatigue: number;   // 疲労 0-100
  motivation: number; // やる気 0-100
  mental: number;    // メンタル 0-100
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

/** エディットキャラ（作成したオリジナルキャラ） */
export interface EditCharacter extends BaseCharacter {
  type: 'edit';
  createdAt: number;
}

/** 育成中キャラクター */
export interface TrainingCharacter extends BaseCharacter {
  type: 'training';
  stats: CharacterStats;
  condition: CharacterCondition;
  rank: Rank;
  cards: Card[];
  actionSpeed: number; // 行動順 1-10
}

/** 育成済みキャラクター */
export interface TrainedCharacter extends BaseCharacter {
  type: 'trained';
  finalStats: CharacterStats;
  finalRank: Rank;
  acquiredCards: Card[];
  trainedAt: number;
  bestStyle: Style;
}

/** 固有キャラ（ゲーム側が用意） */
export interface FixedCharacter extends BaseCharacter {
  type: 'fixed';
  defaultStats: CharacterStats;
  storyEvents: string[];
  specialCards: Card[];
}

export type Character = EditCharacter | TrainingCharacter | TrainedCharacter | FixedCharacter;

// ===========================
// サポートキャラクター
// ===========================

export interface SupportBonus {
  lessonBonus: Partial<Record<Style, number>>; // スタイル別レッスン効果+%
  eventBonus: number;     // イベント発生率・効果+%
  cardBonus: number;      // カード獲得率+%
  initialStats: Partial<CharacterStats>; // 初期ステータス+
  facilityBonus: { facilityId: string; effectBonus?: number; costDiscount?: number }[];
}

export interface SupportCharacter {
  character: TrainedCharacter | FixedCharacter | EditCharacter;
  bondLevel: number; // 絆レベル 0-100
  bonus: SupportBonus;
  bondSkillCard?: Card; // 絆スキルで獲得できるカード
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
  category: CardCategory;
  style: Style;
  cost: number; // 1-3
  requiredRank: Rank;
  effects: CardEffect[];
  flavorText?: string;
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
  type: 'facility_total' | 'rank' | 'fame';
  value: number;
}

export interface OwnedFacility {
  facilityId: string;
  level: number;
}

// ===========================
// 週間行動システム
// ===========================

export type ActionType = 'lesson' | 'rest' | 'business' | 'special';

export interface LessonAction {
  type: 'lesson';
  id: string;
  name: string;
  targetStyle: Style | 'all';
  baseEffect: { min: number; max: number };
  baseFatigue: number;
  unlockCondition?: UnlockCondition;
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

export type WeeklyAction = LessonAction | RestAction | BusinessAction;

// ===========================
// オーディション（定期イベント）
// ===========================

export interface Audition {
  id: string;
  name: string;
  week: number; // 発生週
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'master';
  goldReward: number;
  fameReward: number;
  rivalLevel: number; // AIライバルの強さ
}

// ===========================
// イベントシステム
// ===========================

export interface EventChoice {
  text: string;
  effects: EventEffect[];
}

export interface EventEffect {
  type: 'stats' | 'condition' | 'gold' | 'card' | 'bond' | 'fame';
  target?: Style | keyof CharacterCondition;
  value: number;
  cardId?: string;
}

export interface GameEvent {
  id: string;
  name: string;
  description: string;
  dialogue: string[]; // 変数含むテンプレート
  triggerCondition: EventTrigger;
  choices: EventChoice[];
}

export interface EventTrigger {
  type: 'week' | 'stat' | 'bond' | 'facility' | 'random';
  week?: number;
  stat?: { style: Style; minValue: number };
  bondLevel?: number;
  facilityId?: string;
  facilityLevel?: number;
  probability?: number;
}

// ===========================
// ライブバトルシステム
// ===========================

export interface BattleState {
  turn: number;
  maxTurns: number;
  trend: Style;
  playerState: PlayerBattleState;
  opponentState: PlayerBattleState;
  voltageMax: number;
  voltageClaimed: boolean; // MAX到達ボーナス獲得済みか
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
  winner: 'player' | 'opponent' | 'draw';
  playerStars: number;
  opponentStars: number;
  rewards: {
    gold: number;
    fame: number;
    cards: Card[];
  };
}

// ===========================
// 育成セッション
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
}

// ===========================
// ゲーム全体の状態
// ===========================

export interface GameState {
  // プレイヤーデータ
  editCharacters: EditCharacter[];
  trainedCharacters: TrainedCharacter[];

  // 現在の育成セッション（育成中のみ）
  currentSession: TrainingSession | null;

  // ライブバトル中の状態
  currentBattle: BattleState | null;

  // ゲーム進行フラグ
  unlockedFixedCharacters: string[];
  totalTrainingCount: number;

  // 設定
  settings: GameSettings;
}

export interface GameSettings {
  bgmVolume: number;
  seVolume: number;
  textSpeed: 'slow' | 'normal' | 'fast';
  autoSave: boolean;
}

// ===========================
// ランクシステム
// ===========================

export const RANK_THRESHOLDS: Record<Rank, number> = {
  E: 0,
  D: 50,
  C: 150,
  B: 350,
  A: 700,
  S: 1200,
  SS: 1900,
  SSS: 2800,
};

export const RANK_ORDER: Rank[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

// ===========================
// 性格パッシブ効果
// ===========================

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
