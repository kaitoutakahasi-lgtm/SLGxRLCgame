import { GameEvent, EventChoice, Style, Rank, RANK_ORDER } from '../types';

// ===========================
// シナリオ分岐条件
// ===========================

export interface ScenarioBranchCondition {
  type: 'week' | 'stat' | 'bond' | 'rank' | 'flag' | 'fame';
  style?: Style;
  value?: number;
  flag?: string;
  rank?: Rank;
  characterId?: string;
  comparison?: 'gte' | 'lte' | 'eq';
}

export interface ScenarioEvent extends GameEvent {
  scenarioId: string;
  phase: number;
  branchConditions: ScenarioBranchCondition[];
  nextBranches?: { conditionMet: string; conditionNotMet: string };
  unlockFlag?: string;
}

// ===========================
// メインシナリオイベント
// ===========================

export const MAIN_SCENARIO_EVENTS: ScenarioEvent[] = [
  // フェーズ1: 序章（Week 1-4）
  {
    id: 'scenario_prologue',
    scenarioId: 'main',
    phase: 1,
    name: 'アイドルへの第一歩',
    description: 'トレーニング開始',
    branchConditions: [{ type: 'week', value: 1, comparison: 'eq' }],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 100,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「今日から本格的なトレーニングが始まる」',
      'プロデューサーとして、このアイドルを導いていく。',
      '目指すは頂点のステージ。',
      '「さあ、始めようか」',
    ],
    choices: [
      {
        id: 'prologue_passionate',
        text: '情熱的に始めよう',
        effects: [
          { type: 'condition', target: 'motivation', value: 20 },
          { type: 'stats', target: 'passion', value: 10 },
        ],
      },
      {
        id: 'prologue_careful',
        text: '慎重に進めよう',
        effects: [
          { type: 'stats', target: 'clever', value: 15 },
          { type: 'condition', target: 'mental', value: 10 },
        ],
      },
    ],
    unlockFlag: 'prologue_completed',
  },

  // フェーズ2: 成長期（Week 5-12）
  {
    id: 'scenario_first_hurdle',
    scenarioId: 'main',
    phase: 2,
    name: '最初の壁',
    description: 'スランプの兆候',
    branchConditions: [
      { type: 'week', value: 5, comparison: 'gte' },
      { type: 'flag', flag: 'prologue_completed' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 90,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「最近、成長が止まってる気がする…」',
      'アイドルの表情に不安が浮かんでいる。',
      '「私、このままで大丈夫かな？」',
    ],
    choices: [
      {
        id: 'hurdle_push',
        text: '今こそ追い込み時だ',
        effects: [
          { type: 'stats', target: 'passion', value: 25 },
          { type: 'condition', target: 'fatigue', value: 15 },
          { type: 'flag', flagName: 'chose_push', value: 1 },
        ],
      },
      {
        id: 'hurdle_rest',
        text: '少し休もう',
        effects: [
          { type: 'condition', target: 'fatigue', value: -20 },
          { type: 'condition', target: 'mental', value: 15 },
          { type: 'flag', flagName: 'chose_rest', value: 1 },
        ],
      },
      {
        id: 'hurdle_analyze',
        text: '原因を分析しよう',
        effects: [
          { type: 'stats', target: 'clever', value: 20 },
          { type: 'condition', target: 'motivation', value: 10 },
          { type: 'flag', flagName: 'chose_analyze', value: 1 },
        ],
      },
    ],
    unlockFlag: 'first_hurdle_completed',
    nextBranches: {
      conditionMet: 'scenario_breakthrough',
      conditionNotMet: 'scenario_struggle',
    },
  },

  // フェーズ2分岐A: ブレイクスルー（良い選択をした場合）
  {
    id: 'scenario_breakthrough',
    scenarioId: 'main',
    phase: 2,
    name: '壁を超えて',
    description: '成長の実感',
    branchConditions: [
      { type: 'week', value: 8, comparison: 'gte' },
      { type: 'flag', flag: 'first_hurdle_completed' },
      { type: 'stat', style: 'passion', value: 100, comparison: 'gte' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 85,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「プロデューサーさん、見てください！」',
      'アイドルの動きが以前とは見違えるようだ。',
      '「壁を超えた…この感覚、忘れません！」',
      '成長の喜びに目を輝かせている。',
    ],
    choices: [
      {
        id: 'breakthrough_celebrate',
        text: '今の調子を維持しよう',
        effects: [
          { type: 'condition', target: 'motivation', value: 30 },
          { type: 'stats', target: 'passion', value: 15 },
          { type: 'stats', target: 'cool', value: 10 },
        ],
      },
    ],
    unlockFlag: 'breakthrough_completed',
  },

  // フェーズ2分岐B: 苦闘（成長が足りない場合）
  {
    id: 'scenario_struggle',
    scenarioId: 'main',
    phase: 2,
    name: '迷いの中で',
    description: '自信喪失',
    branchConditions: [
      { type: 'week', value: 8, comparison: 'gte' },
      { type: 'flag', flag: 'first_hurdle_completed' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 80,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「私、本当にアイドルになれるのかな…」',
      'うつむいた表情に迷いが見える。',
      '「みんなについていけてない気がする」',
    ],
    choices: [
      {
        id: 'struggle_encourage',
        text: '君の良さを伝える',
        effects: [
          { type: 'condition', target: 'mental', value: 25 },
          { type: 'condition', target: 'motivation', value: 15 },
          { type: 'stats', target: 'elegant', value: 10 },
        ],
      },
      {
        id: 'struggle_challenge',
        text: '奮起を促す',
        effects: [
          { type: 'condition', target: 'motivation', value: 30 },
          { type: 'stats', target: 'passion', value: 20 },
          { type: 'condition', target: 'fatigue', value: 10 },
        ],
      },
    ],
    unlockFlag: 'struggle_completed',
  },

  // フェーズ3: 中盤戦（Week 13-20）
  {
    id: 'scenario_rival_appears',
    scenarioId: 'main',
    phase: 3,
    name: 'ライバル登場',
    description: '新たな刺激',
    branchConditions: [
      { type: 'week', value: 13, comparison: 'gte' },
      { type: 'rank', rank: 'C', comparison: 'gte' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 75,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「あの子、すごく上手い…」',
      '新しいライバルの存在を意識し始めた。',
      '「負けたくない。絶対に負けたくない！」',
      '目に闘志が宿る。',
    ],
    choices: [
      {
        id: 'rival_compete',
        text: 'いいライバルだ',
        effects: [
          { type: 'condition', target: 'motivation', value: 25 },
          { type: 'stats', target: 'passion', value: 15 },
          { type: 'flag', flagName: 'rival_friendly', value: 1 },
        ],
      },
      {
        id: 'rival_own_pace',
        text: '自分のペースで行こう',
        effects: [
          { type: 'condition', target: 'mental', value: 20 },
          { type: 'stats', target: 'elegant', value: 15 },
          { type: 'stats', target: 'cool', value: 10 },
          { type: 'flag', flagName: 'rival_ignore', value: 1 },
        ],
      },
    ],
    unlockFlag: 'rival_appeared',
  },

  // フェーズ4: 終盤（Week 21-26）
  {
    id: 'scenario_final_challenge',
    scenarioId: 'main',
    phase: 4,
    name: '最後の挑戦',
    description: '集大成へ',
    branchConditions: [
      { type: 'week', value: 21, comparison: 'gte' },
      { type: 'rank', rank: 'B', comparison: 'gte' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 95,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「いよいよ最終ステージが近づいてきた」',
      '積み重ねてきた全てを出し切る時。',
      '「プロデューサーさん、ここまで来れたのはあなたのおかげです」',
      '「最後まで、一緒に頑張りましょう！」',
    ],
    choices: [
      {
        id: 'final_all_out',
        text: '全力で駆け抜けよう',
        effects: [
          { type: 'condition', target: 'motivation', value: 40 },
          { type: 'stats', target: 'passion', value: 20 },
          { type: 'stats', target: 'cool', value: 20 },
          { type: 'flag', flagName: 'final_push', value: 1 },
        ],
      },
      {
        id: 'final_balanced',
        text: 'バランス良く仕上げよう',
        effects: [
          { type: 'stats', target: 'cool', value: 15 },
          { type: 'stats', target: 'elegant', value: 15 },
          { type: 'stats', target: 'cute', value: 15 },
          { type: 'stats', target: 'clever', value: 15 },
          { type: 'stats', target: 'passion', value: 15 },
        ],
      },
    ],
    unlockFlag: 'final_challenge_completed',
  },

  // エンディング分岐イベント（Week 26前後）
  {
    id: 'scenario_ending_check',
    scenarioId: 'main',
    phase: 5,
    name: '最終審査前夜',
    description: '全ての決着',
    branchConditions: [
      { type: 'week', value: 25, comparison: 'gte' },
      { type: 'flag', flag: 'final_challenge_completed' },
    ],
    eventType: 'scenario',
    isRepeatable: false,
    priority: 100,
    triggerCondition: { type: 'scenario' },
    dialogue: [
      '「明日で全てが決まる…」',
      '緊張した面持ちで、最後の夜を過ごす。',
      '「プロデューサーさん、私…頑張れるかな」',
    ],
    choices: [
      {
        id: 'ending_confident',
        text: '君なら必ずやれる',
        effects: [
          { type: 'condition', target: 'motivation', value: 50 },
          { type: 'condition', target: 'mental', value: 30 },
        ],
      },
      {
        id: 'ending_together',
        text: '一緒に最後まで',
        effects: [
          { type: 'condition', target: 'mental', value: 50 },
          { type: 'condition', target: 'motivation', value: 30 },
        ],
      },
    ],
    unlockFlag: 'ending_ready',
  },
];

// ===========================
// ヘルパー関数
// ===========================

/**
 * 条件をチェックしてマッチするシナリオイベントを返す
 */
export const checkScenarioConditions = (
  currentWeek: number,
  stats: Record<Style, number>,
  flags: Record<string, boolean>,
  currentRank: Rank,
  fame: number,
  supportBonds: Record<string, number>
): ScenarioEvent | null => {
  // 未完了のシナリオイベントをフィルター
  const availableEvents = MAIN_SCENARIO_EVENTS.filter((event) => {
    // 既に完了したイベントはスキップ
    if (event.unlockFlag && flags[event.unlockFlag]) {
      return false;
    }

    // 全ての条件をチェック
    return event.branchConditions.every((condition) => {
      switch (condition.type) {
        case 'week':
          return checkComparison(currentWeek, condition.value!, condition.comparison || 'gte');
        case 'stat':
          return checkComparison(
            stats[condition.style!] || 0,
            condition.value!,
            condition.comparison || 'gte'
          );
        case 'rank':
          return checkRankComparison(currentRank, condition.rank!, condition.comparison || 'gte');
        case 'flag':
          return flags[condition.flag!] === true;
        case 'fame':
          return checkComparison(fame, condition.value!, condition.comparison || 'gte');
        case 'bond':
          const bondValue = supportBonds[condition.characterId!] || 0;
          return checkComparison(bondValue, condition.value!, condition.comparison || 'gte');
        default:
          return true;
      }
    });
  });

  // 優先度順でソートし、最も優先度の高いイベントを返す
  if (availableEvents.length > 0) {
    availableEvents.sort((a, b) => b.priority - a.priority);
    return availableEvents[0];
  }

  return null;
};

const checkComparison = (
  actual: number,
  target: number,
  comparison: 'gte' | 'lte' | 'eq'
): boolean => {
  switch (comparison) {
    case 'gte':
      return actual >= target;
    case 'lte':
      return actual <= target;
    case 'eq':
      return actual === target;
    default:
      return false;
  }
};

const checkRankComparison = (
  actual: Rank,
  target: Rank,
  comparison: 'gte' | 'lte' | 'eq'
): boolean => {
  const actualIndex = RANK_ORDER.indexOf(actual);
  const targetIndex = RANK_ORDER.indexOf(target);

  switch (comparison) {
    case 'gte':
      return actualIndex >= targetIndex;
    case 'lte':
      return actualIndex <= targetIndex;
    case 'eq':
      return actualIndex === targetIndex;
    default:
      return false;
  }
};

/**
 * エンディングタイプを判定
 */
export const determineEndingType = (
  finalRank: Rank,
  flags: Record<string, boolean>,
  fame: number
): 'normal' | 'good' | 'true' | 'bad' => {
  const rankIndex = RANK_ORDER.indexOf(finalRank);

  // トゥルーエンド条件
  if (
    rankIndex >= RANK_ORDER.indexOf('S') &&
    flags['breakthrough_completed'] &&
    flags['rival_friendly'] &&
    fame >= 500
  ) {
    return 'true';
  }

  // グッドエンド条件
  if (rankIndex >= RANK_ORDER.indexOf('A') && fame >= 300) {
    return 'good';
  }

  // バッドエンド条件
  if (rankIndex <= RANK_ORDER.indexOf('D')) {
    return 'bad';
  }

  // ノーマルエンド
  return 'normal';
};

/**
 * 次のシナリオフェーズを取得
 */
export const getNextScenarioPhase = (currentPhase: number): number => {
  return Math.min(currentPhase + 1, 5);
};
