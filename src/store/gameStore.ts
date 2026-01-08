import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  EditCharacter,
  TrainedCharacter,
  TrainingCharacter,
  TrainingSession,
  BattleState,
  BattleParticipant,
  BattlePhase,
  SupportCharacter,
  OwnedFacility,
  Card,
  CharacterStats,
  CharacterCondition,
  Style,
  Rank,
  RANK_THRESHOLDS,
  RANK_ORDER,
  BattleResult,
  GameEvent,
  EventChoice,
  BOND_THRESHOLDS,
  CARD_GAUGE_MAX,
  CARD_GAUGE_PER_LESSON,
  CARD_GAUGE_PER_BOND_LESSON,
  CardAcquisitionGauge,
  SkillHint,
  ScenarioProgress,
  TrainingPositions,
  InjuryType,
  INJURY_TYPES,
  CardRarity,
} from '../types';
import { getStarterDeck } from '../data/cards';
import { getTotalLessonBonus, FACILITIES } from '../data/facilities';
import { SCENARIO_EVENTS } from '../data/events';
import { assignTrainingPositions, checkInjury, calculateTagBonus } from '../data/actions';
import { canAcquireRareSkill, createRareSkillCard, getRareSkillByCharacterId } from '../data/rareSkills';

// ===========================
// ユーティリティ関数
// ===========================

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

const calculateRank = (stats: CharacterStats): Rank => {
  const total = stats.cool + stats.elegant + stats.cute + stats.clever + stats.passion;
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    if (total >= RANK_THRESHOLDS[RANK_ORDER[i]]) {
      return RANK_ORDER[i];
    }
  }
  return 'E';
};

const getBestStyle = (stats: CharacterStats): Style => {
  const entries = Object.entries(stats) as [Style, number][];
  return entries.reduce((best, current) =>
    current[1] > best[1] ? current : best
  )[0];
};

const getRandomStyle = (): Style => {
  const styles: Style[] = ['cool', 'elegant', 'cute', 'clever', 'passion'];
  return styles[Math.floor(Math.random() * styles.length)];
};

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// 初期カードゲージ
const createInitialCardGauge = (): CardAcquisitionGauge => ({
  current: 0,
  max: CARD_GAUGE_MAX,
  pendingCards: [],
});

// 初期シナリオ進行
const createInitialScenarioProgress = (): ScenarioProgress => ({
  currentPhase: 1,
  activeScenarioId: null,
  completedBranches: [],
  completedEventIds: [],
  flags: {},
});

// 初期練習配置
const createInitialTrainingPositions = (): TrainingPositions => ({
  dance_lesson: [],
  vocal_lesson: [],
  expression_lesson: [],
  study_lesson: [],
  physical_training: [],
  general_lesson: [],
});

// サポートキャラ配置決定（後方互換のためtrainingParticipantsも更新）
const getTrainingParticipants = (positions: TrainingPositions): string[] => {
  return [
    ...positions.dance_lesson,
    ...positions.vocal_lesson,
    ...positions.expression_lesson,
    ...positions.study_lesson,
    ...positions.physical_training,
    ...positions.general_lesson,
  ];
};

// ===========================
// 初期状態
// ===========================

const initialState: GameState = {
  editCharacters: [],
  trainedCharacters: [],
  currentSession: null,
  currentBattle: null,
  unlockedFixedCharacters: [],
  totalTrainingCount: 0,
  settings: {
    bgmVolume: 0.7,
    seVolume: 0.8,
    textSpeed: 'normal',
    autoSave: true,
    effectLevel: 'medium',
  },
};

// ===========================
// ストアインターフェース
// ===========================

interface GameStore extends GameState {
  // キャラクター管理
  createEditCharacter: (character: Omit<EditCharacter, 'id' | 'type' | 'createdAt'>) => EditCharacter;
  deleteEditCharacter: (id: string) => void;
  updateEditCharacter: (id: string, updates: Partial<EditCharacter>) => void;

  // 育成セッション
  startTraining: (
    baseCharacter: EditCharacter,
    supportDeck: SupportCharacter[]
  ) => void;
  endTraining: () => TrainedCharacter | null;
  abandonTraining: () => void;

  // 週間行動
  performLesson: (
    style: Style | 'all',
    baseEffect: number,
    fatigue: number,
    participantIds?: string[],
    lessonId?: string,
    baseInjuryRate?: number
  ) => void;
  performBondLesson: (
    supportCharacterId: string,
    style: Style,
    baseEffect: number,
    bondBonus: number,
    fatigue: number
  ) => void;
  performRest: (fatigueRecovery: number, healthRecovery: number) => void;
  performBusiness: (gold: number, fame: number, motivation: number) => void;
  advanceWeek: () => void;

  // キズナシステム
  addBond: (characterId: string, amount: number) => void;
  triggerBondEvent: (characterId: string, eventIndex: number) => GameEvent | null;
  completeBondEvent: (characterId: string, eventIndex: number, choiceId: string) => void;
  getSupportByCharacterId: (characterId: string) => SupportCharacter | undefined;
  getAvailableBondLessons: () => { supportId: string; style: Style }[];

  // カードゲージシステム
  addCardGauge: (amount: number) => void;
  checkCardGaugeFull: () => boolean;
  claimCardFromGauge: (cardIndex: number) => Card | null;
  addPendingCard: (card: Card) => void;

  // イベントシステム
  setCurrentEvent: (event: GameEvent | null) => void;
  processEventChoice: (choice: EventChoice) => void;
  setScenarioFlag: (flagName: string, value: boolean) => void;
  checkScenarioEvent: () => GameEvent | null;

  // 設備
  purchaseFacility: (facilityId: string) => boolean;
  upgradeFacility: (facilityId: string) => boolean;
  getTotalFacilityLevel: () => number;

  // カード
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;

  // レアスキル
  checkRareSkillAcquisition: () => { characterId: string; skillId: string }[];
  acquireRareSkill: (characterId: string) => Card | null;

  // スキルヒントシステム
  checkSkillHint: (participantIds: string[]) => SkillHint | null;
  applySkillHint: (hint: SkillHint) => Card | null;

  // コンディション
  updateCondition: (updates: Partial<CharacterCondition>) => void;
  updateStats: (style: Style, amount: number) => void;

  // 資金
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // ライブバトル（4人バトロワ版）
  startBattle: (opponentLevel: number) => void;
  selectCards: (cardIndices: number[]) => void;
  setBattlePhase: (phase: BattlePhase) => void;
  resolveNextParticipant: () => boolean; // 次の参加者を解決、全員終了したらfalse
  nextTurn: () => void;
  endBattle: () => BattleResult;
  getPlayerParticipant: () => BattleParticipant | null;
  getTurnOrder: () => BattleParticipant[];

  // 設定
  updateSettings: (updates: Partial<GameState['settings']>) => void;

  // リセット
  resetGame: () => void;
}

// ===========================
// ストア実装
// ===========================

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // === キャラクター管理 ===
      createEditCharacter: (characterData) => {
        const newCharacter: EditCharacter = {
          ...characterData,
          id: generateId(),
          type: 'edit',
          createdAt: Date.now(),
        };
        set((state) => ({
          editCharacters: [...state.editCharacters, newCharacter],
        }));
        return newCharacter;
      },

      deleteEditCharacter: (id) => {
        set((state) => ({
          editCharacters: state.editCharacters.filter((c) => c.id !== id),
        }));
      },

      updateEditCharacter: (id, updates) => {
        set((state) => ({
          editCharacters: state.editCharacters.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      // === 育成セッション ===
      startTraining: (baseCharacter, supportDeck) => {
        const trainingCharacter: TrainingCharacter = {
          ...baseCharacter,
          type: 'training',
          stats: { cool: 10, elegant: 10, cute: 10, clever: 10, passion: 10 },
          condition: { health: 100, fatigue: 0, motivation: 50, mental: 100 },
          rank: 'E',
          cards: getStarterDeck(),
          actionSpeed: 5,
        };

        // サポートボーナス適用（初期ステータス）
        supportDeck.forEach((support) => {
          if (support.bonus.initialStats) {
            Object.entries(support.bonus.initialStats).forEach(([style, value]) => {
              if (value) {
                trainingCharacter.stats[style as Style] += value;
              }
            });
          }
          // 初期絆レベル適用
          support.bondLevel = support.bonus.initialBond || 0;
        });

        // 初期配置を計算
        const initialPositions = assignTrainingPositions(supportDeck);
        const initialParticipants = getTrainingParticipants(initialPositions);

        const session: TrainingSession = {
          character: trainingCharacter,
          supportDeck,
          currentWeek: 1,
          maxWeeks: 48,
          gold: 1000,
          fame: 0,
          facilities: [],
          completedEvents: [],
          auditionResults: [],
          cardGauge: createInitialCardGauge(),
          skillHints: [],
          scenario: createInitialScenarioProgress(),
          currentEvent: null,
          trainingParticipants: initialParticipants,
          trainingPositions: initialPositions,
          currentInjury: null,
          acquiredRareSkills: [],
        };

        set({
          currentSession: session,
          totalTrainingCount: get().totalTrainingCount + 1,
        });
      },

      endTraining: () => {
        const session = get().currentSession;
        if (!session) return null;

        const trainedCharacter: TrainedCharacter = {
          ...session.character,
          type: 'trained',
          finalStats: { ...session.character.stats },
          finalRank: calculateRank(session.character.stats),
          acquiredCards: [...session.character.cards],
          trainedAt: Date.now(),
          bestStyle: getBestStyle(session.character.stats),
        };

        set((state) => ({
          trainedCharacters: [...state.trainedCharacters, trainedCharacter],
          currentSession: null,
        }));

        return trainedCharacter;
      },

      abandonTraining: () => {
        set({ currentSession: null });
      },

      // === 週間行動 ===
      performLesson: (style, baseEffect, fatigue, participantIds = [], lessonId?: string, baseInjuryRate: number = 0) => {
        const session = get().currentSession;
        if (!session) return;

        // 怪我中は効果減少
        const injuryPenalty = session.currentInjury
          ? INJURY_TYPES[session.currentInjury.type].statPenalty / 100
          : 0;

        const facilityBonus = style === 'all'
          ? 0
          : getTotalLessonBonus(session.facilities, style);

        // ===== サポートボーナス集計 =====
        let supportTrainingBonus = 0;   // トレーニング効果UP
        let supportMotivationBonus = 0; // やる気効果UP
        let supportFatigueReduction = 0; // 疲労軽減
        let supportInjuryReduction = 0;  // 怪我率ダウン

        const updatedSupportDeck = session.supportDeck.map((support) => {
          if (participantIds.includes(support.character.id)) {
            // 得意スタイル一致でボーナス
            if (style !== 'all' && support.bonus.specialtyStyle === style) {
              supportTrainingBonus += support.bonus.trainingEffectUp;
            }
            // やる気効果UP（参加サポート全員分）
            supportMotivationBonus += support.bonus.motivationEffectUp || 0;
            // 疲労軽減（参加サポート全員分）
            supportFatigueReduction += support.bonus.fatigueReduction || 0;
            // 怪我率ダウン（デッキ全体で常時）
            supportInjuryReduction += support.bonus.fatigueReduction || 0; // fatigueReduction兼用

            // 絆上昇
            const newBondLevel = clamp(support.bondLevel + 2, 0, 100);
            return { ...support, bondLevel: newBondLevel, isInTraining: true };
          }
          return { ...support, isInTraining: false };
        });

        // やる気ボーナス計算（サポートのmotivationEffectUpを加味）
        const baseMotivationBonus = session.character.condition.motivation >= 80 ? 0.5 : 0;
        const motivationBonus = baseMotivationBonus * (1 + supportMotivationBonus / 100);

        const fatigueEfficiency = session.character.condition.fatigue <= 30
          ? 1.0
          : session.character.condition.fatigue <= 60
          ? 0.8
          : session.character.condition.fatigue <= 80
          ? 0.6
          : 0.4;

        // タッグボーナス計算（同じ練習に複数サポートがいる場合）
        let tagBonus = 0;
        if (lessonId && session.trainingPositions) {
          const { bonus } = calculateTagBonus(lessonId, session.trainingPositions, session.supportDeck);
          tagBonus = bonus;
        }

        const finalEffect = Math.floor(
          baseEffect * (1 + facilityBonus / 100 + motivationBonus + supportTrainingBonus / 100 + tagBonus / 100) * fatigueEfficiency * (1 - injuryPenalty)
        );

        const updatedStats = { ...session.character.stats };
        if (style === 'all') {
          const perStyle = Math.floor(finalEffect / 5);
          updatedStats.cool += perStyle;
          updatedStats.elegant += perStyle;
          updatedStats.cute += perStyle;
          updatedStats.clever += perStyle;
          updatedStats.passion += perStyle;
        } else {
          updatedStats[style] += finalEffect;
        }

        // 怪我判定
        let newInjury = session.currentInjury;
        if (!session.currentInjury && baseInjuryRate > 0) {
          // 設備による怪我率軽減
          const injuryFacility = session.facilities.find((f) => f.facilityId === 'medical_room');
          const facilityReduction = injuryFacility
            ? FACILITIES.find((f) => f.id === 'medical_room')?.effects.find(e => e.type === 'injury_reduction')?.valuePerLevel || 0
            : 0;

          // デッキ全体のサポートボーナスによる怪我率軽減
          const totalSupportInjuryReduction = session.supportDeck.reduce(
            (sum, s) => sum + (s.bonus.fatigueReduction || 0), 0
          );

          // 疲労による怪我率増加を計算
          let finalInjuryRate = baseInjuryRate;
          const currentFatigue = session.character.condition.fatigue;
          if (currentFatigue >= 80) {
            finalInjuryRate += 30;
          } else if (currentFatigue >= 60) {
            finalInjuryRate += 15;
          } else if (currentFatigue >= 50) {
            finalInjuryRate += 5;
          }
          // 設備＋サポートの軽減を適用
          finalInjuryRate = finalInjuryRate * (1 - (facilityReduction + totalSupportInjuryReduction) / 100);
          finalInjuryRate = Math.max(0, finalInjuryRate);

          const injuryResult = checkInjury(finalInjuryRate);
          if (injuryResult) {
            newInjury = {
              type: injuryResult,
              remainingWeeks: INJURY_TYPES[injuryResult].duration,
            };
          }
        }

        // 怪我した場合の追加疲労
        let additionalFatigue = 0;
        if (newInjury && newInjury !== session.currentInjury) {
          additionalFatigue = INJURY_TYPES[newInjury.type].fatigueIncrease;
        }

        // 疲労計算（サポートの疲労軽減を適用）
        const actualFatigue = Math.max(0, Math.floor(fatigue * (1 - supportFatigueReduction / 100)));
        const updatedCondition = {
          ...session.character.condition,
          fatigue: clamp(session.character.condition.fatigue + actualFatigue + additionalFatigue, 0, 100),
        };

        // カードゲージ上昇
        const gaugeBonus = updatedSupportDeck.reduce((sum, s) =>
          s.isInTraining ? sum + s.bonus.cardGaugeBonus : sum, 0
        );
        const newGaugeCurrent = clamp(
          session.cardGauge.current + CARD_GAUGE_PER_LESSON + gaugeBonus,
          0,
          session.cardGauge.max
        );

        set({
          currentSession: {
            ...session,
            supportDeck: updatedSupportDeck,
            cardGauge: {
              ...session.cardGauge,
              current: newGaugeCurrent,
            },
            currentInjury: newInjury,
            character: {
              ...session.character,
              stats: updatedStats,
              condition: updatedCondition,
              rank: calculateRank(updatedStats),
            },
          },
        });
      },

      performBondLesson: (supportCharacterId, style, baseEffect, bondBonus, fatigue) => {
        const session = get().currentSession;
        if (!session) return;

        const supportIndex = session.supportDeck.findIndex(
          s => s.character.id === supportCharacterId
        );
        if (supportIndex === -1) return;

        const support = session.supportDeck[supportIndex];

        // 友情トレーニング効果
        const friendshipMultiplier = 1 + support.bonus.friendshipBonus / 100;
        const motivationBonus = session.character.condition.motivation >= 80 ? 0.5 : 0;
        const facilityBonus = getTotalLessonBonus(session.facilities, style);

        const finalEffect = Math.floor(
          baseEffect * friendshipMultiplier * (1 + facilityBonus / 100 + motivationBonus)
        );

        const updatedStats = { ...session.character.stats };
        updatedStats[style] += finalEffect;

        // 絆上昇（キズナ練習は通常より多い）
        const newBondLevel = clamp(support.bondLevel + bondBonus, 0, 100);

        const updatedSupportDeck = session.supportDeck.map((s, i) =>
          i === supportIndex
            ? { ...s, bondLevel: newBondLevel, isInTraining: true }
            : { ...s, isInTraining: false }
        );

        const updatedCondition = {
          ...session.character.condition,
          fatigue: clamp(session.character.condition.fatigue + fatigue, 0, 100),
        };

        // カードゲージ上昇（キズナ練習は多め）
        const newGaugeCurrent = clamp(
          session.cardGauge.current + CARD_GAUGE_PER_BOND_LESSON + support.bonus.cardGaugeBonus,
          0,
          session.cardGauge.max
        );

        set({
          currentSession: {
            ...session,
            supportDeck: updatedSupportDeck,
            cardGauge: {
              ...session.cardGauge,
              current: newGaugeCurrent,
            },
            character: {
              ...session.character,
              stats: updatedStats,
              condition: updatedCondition,
              rank: calculateRank(updatedStats),
            },
          },
        });
      },

      performRest: (fatigueRecovery, healthRecovery) => {
        const session = get().currentSession;
        if (!session) return;

        const restBonus = session.facilities.reduce((total, f) => {
          const facility = FACILITIES.find((fac) => fac.id === f.facilityId);
          if (!facility) return total;
          const effect = facility.effects.find((e) => e.type === 'rest_bonus');
          return total + (effect ? effect.valuePerLevel * f.level : 0);
        }, 0);

        const finalFatigueRecovery = Math.floor(fatigueRecovery * (1 + restBonus / 100));

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              condition: {
                ...session.character.condition,
                fatigue: clamp(
                  session.character.condition.fatigue - finalFatigueRecovery,
                  0,
                  100
                ),
                health: clamp(
                  session.character.condition.health + healthRecovery,
                  0,
                  100
                ),
              },
            },
          },
        });
      },

      performBusiness: (gold, fame, motivation) => {
        const session = get().currentSession;
        if (!session) return;

        // サポートボーナス
        const goldMultiplier = session.supportDeck.reduce(
          (sum, s) => sum + s.bonus.goldBonus, 0
        ) / 100 + 1;
        const fameMultiplier = session.supportDeck.reduce(
          (sum, s) => sum + s.bonus.fameBonus, 0
        ) / 100 + 1;

        set({
          currentSession: {
            ...session,
            gold: session.gold + Math.floor(gold * goldMultiplier),
            fame: session.fame + Math.floor(fame * fameMultiplier),
            character: {
              ...session.character,
              condition: {
                ...session.character.condition,
                motivation: clamp(
                  session.character.condition.motivation + motivation,
                  0,
                  100
                ),
              },
            },
          },
        });
      },

      advanceWeek: () => {
        const session = get().currentSession;
        if (!session) return;

        // 食堂による自動疲労回復
        const cafeteria = session.facilities.find((f) => f.facilityId === 'cafeteria');
        const autoFatigueRecovery = cafeteria
          ? FACILITIES.find((f) => f.id === 'cafeteria')!.effects[0].valuePerLevel *
            cafeteria.level
          : 0;

        // 次週の練習配置を決定
        const newPositions = assignTrainingPositions(session.supportDeck);
        const newParticipants = getTrainingParticipants(newPositions);

        // 怪我の回復チェック
        let updatedInjury = session.currentInjury;
        if (updatedInjury) {
          updatedInjury = {
            ...updatedInjury,
            remainingWeeks: updatedInjury.remainingWeeks - 1,
          };
          if (updatedInjury.remainingWeeks <= 0) {
            updatedInjury = null; // 怪我が完治
          }
        }

        // ===== イベント発生チェック =====
        // イベントは100%発生（利用可能なイベントがあれば必ず発生）
        // 優先順: シナリオ > 絆 > ランダム

        let randomEvent: GameEvent | null = null;

        // シナリオイベント（週固定）
        const scenarioEvent = get().checkScenarioEvent();
        if (scenarioEvent) {
          randomEvent = scenarioEvent;
        }

        // 絆イベント判定（未発生の場合、条件達成順にチェック）
        if (!randomEvent && !session.currentEvent) {
          for (const support of session.supportDeck) {
            if (!support.bondEvents) continue;

            // 未クリアのイベントをチェック（条件達成順）
            if (support.bondLevel >= BOND_THRESHOLDS.EVENT_3 && !support.bondProgress.event3Cleared) {
              randomEvent = get().triggerBondEvent(support.character.id, 3);
              break;
            } else if (support.bondLevel >= BOND_THRESHOLDS.EVENT_2 && !support.bondProgress.event2Cleared) {
              randomEvent = get().triggerBondEvent(support.character.id, 2);
              break;
            } else if (support.bondLevel >= BOND_THRESHOLDS.EVENT_1 && !support.bondProgress.event1Cleared) {
              randomEvent = get().triggerBondEvent(support.character.id, 1);
              break;
            }
          }
        }

        set({
          currentSession: {
            ...session,
            currentWeek: session.currentWeek + 1,
            trainingParticipants: newParticipants,
            trainingPositions: newPositions,
            currentInjury: updatedInjury,
            currentEvent: randomEvent,
            character: {
              ...session.character,
              condition: {
                ...session.character.condition,
                fatigue: clamp(
                  session.character.condition.fatigue - autoFatigueRecovery,
                  0,
                  100
                ),
              },
            },
          },
        });
      },

      // === キズナシステム ===
      addBond: (characterId, amount) => {
        const session = get().currentSession;
        if (!session) return;

        const updatedSupportDeck = session.supportDeck.map((support) => {
          if (support.character.id === characterId) {
            return {
              ...support,
              bondLevel: clamp(support.bondLevel + amount, 0, 100),
            };
          }
          return support;
        });

        set({
          currentSession: {
            ...session,
            supportDeck: updatedSupportDeck,
          },
        });
      },

      triggerBondEvent: (characterId, eventIndex) => {
        const session = get().currentSession;
        if (!session) return null;

        const support = session.supportDeck.find(s => s.character.id === characterId);
        if (!support || !support.bondEvents) return null;

        const bondEvents = support.bondEvents;
        let event: GameEvent | null = null;

        if (eventIndex === 1 && !support.bondProgress.event1Cleared) {
          const bondEvent = bondEvents.event1;
          event = {
            id: bondEvent.id,
            name: bondEvent.name,
            description: bondEvent.description,
            eventType: 'bond',
            dialogue: bondEvent.dialogue,
            triggerCondition: { type: 'bond', bondLevel: BOND_THRESHOLDS.EVENT_1, characterId },
            choices: bondEvent.choices,
            isRepeatable: false,
            priority: 100,
          };
        } else if (eventIndex === 2 && !support.bondProgress.event2Cleared) {
          const bondEvent = bondEvents.event2;
          event = {
            id: bondEvent.id,
            name: bondEvent.name,
            description: bondEvent.description,
            eventType: 'bond',
            dialogue: bondEvent.dialogue,
            triggerCondition: { type: 'bond', bondLevel: BOND_THRESHOLDS.EVENT_2, characterId },
            choices: bondEvent.choices,
            isRepeatable: false,
            priority: 100,
          };
        } else if (eventIndex === 3 && !support.bondProgress.event3Cleared) {
          const bondEvent = bondEvents.event3;
          event = {
            id: bondEvent.id,
            name: bondEvent.name,
            description: bondEvent.description,
            eventType: 'bond',
            dialogue: bondEvent.dialogue,
            triggerCondition: { type: 'bond', bondLevel: BOND_THRESHOLDS.EVENT_3, characterId },
            choices: bondEvent.choices,
            isRepeatable: false,
            priority: 100,
          };
        }

        if (event) {
          set({
            currentSession: {
              ...session,
              currentEvent: event,
            },
          });
        }

        return event;
      },

      completeBondEvent: (characterId, eventIndex, choiceId) => {
        const session = get().currentSession;
        if (!session) return;

        const supportIndex = session.supportDeck.findIndex(
          s => s.character.id === characterId
        );
        if (supportIndex === -1) return;

        const support = session.supportDeck[supportIndex];
        const updatedProgress = { ...support.bondProgress };

        if (eventIndex === 1) {
          updatedProgress.event1Cleared = true;
        } else if (eventIndex === 2) {
          updatedProgress.event2Cleared = true;
        } else if (eventIndex === 3) {
          updatedProgress.event3Cleared = true;
          // 専用カード獲得
          if (support.bondEvents?.specialCard) {
            get().addCard(support.bondEvents.specialCard);
          }
        }

        const updatedSupportDeck = session.supportDeck.map((s, i) =>
          i === supportIndex
            ? { ...s, bondProgress: updatedProgress }
            : s
        );

        set({
          currentSession: {
            ...session,
            supportDeck: updatedSupportDeck,
            currentEvent: null,
            completedEvents: [...session.completedEvents, `${characterId}_bond_${eventIndex}`],
          },
        });
      },

      getSupportByCharacterId: (characterId) => {
        const session = get().currentSession;
        if (!session) return undefined;
        return session.supportDeck.find(s => s.character.id === characterId);
      },

      getAvailableBondLessons: () => {
        const session = get().currentSession;
        if (!session) return [];

        return session.supportDeck
          .filter(support => {
            const threshold = support.bonus.friendshipThreshold || BOND_THRESHOLDS.FRIENDSHIP;
            return support.bondLevel >= threshold &&
                   session.trainingParticipants.includes(support.character.id);
          })
          .map(support => ({
            supportId: support.character.id,
            style: support.bonus.specialtyStyle,
          }));
      },

      // === カードゲージシステム ===
      addCardGauge: (amount) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            cardGauge: {
              ...session.cardGauge,
              current: clamp(session.cardGauge.current + amount, 0, session.cardGauge.max),
            },
          },
        });
      },

      checkCardGaugeFull: () => {
        const session = get().currentSession;
        if (!session) return false;
        return session.cardGauge.current >= session.cardGauge.max;
      },

      claimCardFromGauge: (cardIndex) => {
        const session = get().currentSession;
        if (!session || session.cardGauge.current < session.cardGauge.max) return null;
        if (cardIndex < 0 || cardIndex >= session.cardGauge.pendingCards.length) return null;

        const selectedCard = session.cardGauge.pendingCards[cardIndex];

        set({
          currentSession: {
            ...session,
            cardGauge: {
              current: 0,
              max: session.cardGauge.max,
              pendingCards: [],
            },
            character: {
              ...session.character,
              cards: [...session.character.cards, selectedCard],
            },
          },
        });

        return selectedCard;
      },

      addPendingCard: (card) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            cardGauge: {
              ...session.cardGauge,
              pendingCards: [...session.cardGauge.pendingCards, card],
            },
          },
        });
      },

      // === イベントシステム ===
      setCurrentEvent: (event) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            currentEvent: event,
          },
        });
      },

      processEventChoice: (choice) => {
        const session = get().currentSession;
        if (!session) return;

        let updatedStats = { ...session.character.stats };
        let updatedCondition = { ...session.character.condition };
        let updatedGold = session.gold;
        let updatedFame = session.fame;
        let updatedFlags = { ...session.scenario.flags };
        let updatedGaugeCurrent = session.cardGauge.current;
        const newCards: Card[] = [];

        choice.effects.forEach((effect) => {
          switch (effect.type) {
            case 'stats':
              if (effect.target && effect.target in updatedStats) {
                updatedStats[effect.target as Style] += effect.value;
              }
              break;
            case 'condition':
              if (effect.target && effect.target in updatedCondition) {
                const key = effect.target as keyof CharacterCondition;
                updatedCondition[key] = clamp(updatedCondition[key] + effect.value, 0, 100);
              }
              break;
            case 'gold':
              updatedGold += effect.value;
              break;
            case 'fame':
              updatedFame += effect.value;
              break;
            case 'card_gauge':
              updatedGaugeCurrent = clamp(updatedGaugeCurrent + effect.value, 0, session.cardGauge.max);
              break;
            case 'flag':
              if (effect.flagName) {
                updatedFlags[effect.flagName] = effect.value > 0;
              }
              break;
            case 'bond':
              if (effect.characterId) {
                get().addBond(effect.characterId, effect.value);
              }
              break;
          }
        });

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              stats: updatedStats,
              condition: updatedCondition,
              rank: calculateRank(updatedStats),
              cards: [...session.character.cards, ...newCards],
            },
            gold: updatedGold,
            fame: updatedFame,
            cardGauge: {
              ...session.cardGauge,
              current: updatedGaugeCurrent,
            },
            scenario: {
              ...session.scenario,
              flags: updatedFlags,
              completedEventIds: session.currentEvent?.eventType === 'scenario'
                ? [...(session.scenario.completedEventIds || []), session.currentEvent.id]
                : session.scenario.completedEventIds || [],
            },
            currentEvent: null,
          },
        });
      },

      setScenarioFlag: (flagName, value) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            scenario: {
              ...session.scenario,
              flags: {
                ...session.scenario.flags,
                [flagName]: value,
              },
            },
          },
        });
      },

      checkScenarioEvent: () => {
        const session = get().currentSession;
        if (!session) return null;

        const currentWeek = session.currentWeek;
        const completedEventIds = session.scenario.completedEventIds || [];

        // 週固定シナリオイベントをチェック
        const scenarioEvent = SCENARIO_EVENTS.find((event) => {
          // この週のイベントか確認
          if (event.triggerCondition?.week !== currentWeek) return false;
          // 未完了のイベントのみ
          if (completedEventIds.includes(event.id)) return false;
          return true;
        });

        return scenarioEvent || null;
      },

      // === 設備 ===
      purchaseFacility: (facilityId) => {
        const session = get().currentSession;
        if (!session) return false;

        const facility = FACILITIES.find((f) => f.id === facilityId);
        if (!facility) return false;

        const existing = session.facilities.find((f) => f.facilityId === facilityId);
        if (existing) return false;

        if (session.gold < facility.baseCost) return false;

        set({
          currentSession: {
            ...session,
            gold: session.gold - facility.baseCost,
            facilities: [...session.facilities, { facilityId, level: 1 }],
          },
        });
        return true;
      },

      upgradeFacility: (facilityId) => {
        const session = get().currentSession;
        if (!session) return false;

        const facility = FACILITIES.find((f) => f.id === facilityId);
        if (!facility) return false;

        const existingIndex = session.facilities.findIndex(
          (f) => f.facilityId === facilityId
        );
        if (existingIndex === -1) return false;

        const existing = session.facilities[existingIndex];
        if (existing.level >= facility.maxLevel) return false;

        const multipliers = [1.0, 1.5, 2.5, 4.0, 6.0];
        const cost = Math.floor(facility.baseCost * multipliers[existing.level]);

        if (session.gold < cost) return false;

        const updatedFacilities = [...session.facilities];
        updatedFacilities[existingIndex] = {
          ...existing,
          level: existing.level + 1,
        };

        set({
          currentSession: {
            ...session,
            gold: session.gold - cost,
            facilities: updatedFacilities,
          },
        });
        return true;
      },

      getTotalFacilityLevel: () => {
        const session = get().currentSession;
        if (!session) return 0;
        return session.facilities.reduce((total, f) => total + f.level, 0);
      },

      // === カード ===
      addCard: (card) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              cards: [...session.character.cards, card],
            },
          },
        });
      },

      removeCard: (cardId) => {
        const session = get().currentSession;
        if (!session) return;

        const index = session.character.cards.findIndex((c) => c.id === cardId);
        if (index === -1) return;

        const updatedCards = [...session.character.cards];
        updatedCards.splice(index, 1);

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              cards: updatedCards,
            },
          },
        });
      },

      // === レアスキル ===
      checkRareSkillAcquisition: () => {
        const session = get().currentSession;
        if (!session) return [];

        const available: { characterId: string; skillId: string }[] = [];
        session.supportDeck.forEach((support) => {
          if (canAcquireRareSkill(
            support.character.id,
            support.bondLevel,
            session.acquiredRareSkills
          )) {
            const rareSkillConfig = getRareSkillByCharacterId(support.character.id);
            if (rareSkillConfig) {
              available.push({
                characterId: support.character.id,
                skillId: rareSkillConfig.rareSkill.id,
              });
            }
          }
        });
        return available;
      },

      acquireRareSkill: (characterId) => {
        const session = get().currentSession;
        if (!session) return null;

        const rareSkillConfig = getRareSkillByCharacterId(characterId);
        if (!rareSkillConfig) return null;

        // 既に獲得済みかチェック
        if (session.acquiredRareSkills.includes(rareSkillConfig.rareSkill.id)) {
          return null;
        }

        // カードを生成
        const card = createRareSkillCard(rareSkillConfig.rareSkill);

        set({
          currentSession: {
            ...session,
            acquiredRareSkills: [...session.acquiredRareSkills, rareSkillConfig.rareSkill.id],
            character: {
              ...session.character,
              cards: [...session.character.cards, card],
            },
          },
        });

        return card;
      },

      // === スキルヒントシステム ===
      checkSkillHint: (participantIds) => {
        const session = get().currentSession;
        if (!session) return null;

        // 参加しているサポートのhintRateを合計
        const participatingSupports = session.supportDeck.filter(
          s => participantIds.includes(s.character.id)
        );

        // 基礎ヒント発生率15%
        const baseHintRate = 15;
        const totalHintBonus = participatingSupports.reduce(
          (sum, s) => sum + (s.bonus.hintRate || 0), 0
        );
        const finalHintRate = baseHintRate + totalHintBonus;

        // ヒント発生判定
        if (Math.random() * 100 >= finalHintRate) {
          return null;
        }

        // ランダムなサポートからヒントを生成
        const eligibleSupports = participatingSupports.filter(
          s => s.bondLevel >= 30 // 絆30以上でヒント可能
        );
        if (eligibleSupports.length === 0) return null;

        const support = eligibleSupports[Math.floor(Math.random() * eligibleSupports.length)];

        // ヒントレベルを計算（hintEffectUpで上昇）
        let hintLevel = 1 + Math.floor(Math.random() * 3); // 1-3
        const hintEffectBonus = support.bonus.hintEffectUp || 0;
        hintLevel = Math.min(5, hintLevel + Math.floor(hintEffectBonus / 20)); // 20%ごとに+1

        // ヒントカードを生成
        const styles: Style[] = ['cool', 'elegant', 'cute', 'clever', 'passion'];
        const hintCard: Card = {
          id: `hint_${Date.now()}`,
          name: `${support.character.name}のヒント`,
          description: `${support.character.name}から教わったテクニック`,
          style: support.bonus.specialtyStyle,
          cost: Math.max(1, 3 - Math.floor(hintLevel / 2)),
          rarity: (hintLevel >= 4 ? 'rare' : hintLevel >= 2 ? 'uncommon' : 'common') as CardRarity,
          requiredRank: 'E',
          effects: [
            { type: 'appeal', value: 2 + hintLevel, target: 'self' }
          ],
        };

        const hint: SkillHint = {
          supportCharacterId: support.character.id,
          card: hintCard,
          hintLevel,
        };

        return hint;
      },

      applySkillHint: (hint) => {
        const session = get().currentSession;
        if (!session) return null;

        // 既にあるヒントをチェック（重複回避）
        const existingHint = session.skillHints.find(
          h => h.supportCharacterId === hint.supportCharacterId
        );
        if (existingHint) {
          // より高いレベルのヒントに更新
          if (hint.hintLevel > existingHint.hintLevel) {
            set({
              currentSession: {
                ...session,
                skillHints: session.skillHints.map(h =>
                  h.supportCharacterId === hint.supportCharacterId ? hint : h
                ),
              },
            });
          }
          return null;
        }

        // 新規ヒントを追加
        set({
          currentSession: {
            ...session,
            skillHints: [...session.skillHints, hint],
          },
        });

        // ヒントレベル5ならカードを即獲得
        if (hint.hintLevel >= 5) {
          get().addCard(hint.card);
          return hint.card;
        }

        return null;
      },

      // === コンディション ===
      updateCondition: (updates) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              condition: {
                health: clamp(
                  updates.health ?? session.character.condition.health,
                  0,
                  100
                ),
                fatigue: clamp(
                  updates.fatigue ?? session.character.condition.fatigue,
                  0,
                  100
                ),
                motivation: clamp(
                  updates.motivation ?? session.character.condition.motivation,
                  0,
                  100
                ),
                mental: clamp(
                  updates.mental ?? session.character.condition.mental,
                  0,
                  100
                ),
              },
            },
          },
        });
      },

      updateStats: (style, amount) => {
        const session = get().currentSession;
        if (!session) return;

        const updatedStats = {
          ...session.character.stats,
          [style]: Math.max(0, session.character.stats[style] + amount),
        };

        set({
          currentSession: {
            ...session,
            character: {
              ...session.character,
              stats: updatedStats,
              rank: calculateRank(updatedStats),
            },
          },
        });
      },

      // === 資金 ===
      addGold: (amount) => {
        const session = get().currentSession;
        if (!session) return;

        set({
          currentSession: {
            ...session,
            gold: session.gold + amount,
          },
        });
      },

      spendGold: (amount) => {
        const session = get().currentSession;
        if (!session) return false;

        if (session.gold < amount) return false;

        set({
          currentSession: {
            ...session,
            gold: session.gold - amount,
          },
        });
        return true;
      },

      // === ライブバトル（4人バトロワ版）===
      startBattle: (opponentLevel) => {
        const session = get().currentSession;
        if (!session) return;

        // ライバル名とカラー
        const rivalNames = ['星野ミライ', '月宮カレン', '天城リオン'];
        const rivalColors = ['#f87171', '#a78bfa', '#4ade80'];
        const styles: Style[] = ['cool', 'elegant', 'cute', 'clever', 'passion'];

        // プレイヤーのデッキを準備
        const playerCards = [...session.character.cards];
        const playerDeck: Card[] = [];
        for (let i = 0; i < 10 && playerCards.length > 0; i++) {
          const index = Math.floor(Math.random() * playerCards.length);
          playerDeck.push(playerCards.splice(index, 1)[0]);
        }
        const playerHand = playerDeck.splice(0, 4);

        // プレイヤー参加者を作成
        const playerParticipant: BattleParticipant = {
          id: 'player',
          name: session.character.name,
          isPlayer: true,
          style: getBestStyle(session.character.stats),
          deck: playerDeck,
          hand: playerHand,
          discard: [],
          stamina: 6,
          maxStamina: 6,
          stars: 0,
          actionSpeed: session.character.actionSpeed,
          selectedCards: [],
          fullRecoveryUsed: false,
          avatarColor: '#60a5fa',
        };

        // AI参加者を3人作成
        const aiParticipants: BattleParticipant[] = rivalNames.map((name, i) => {
          const aiDeck = getStarterDeck();
          const aiHand = aiDeck.splice(0, 4);
          const baseSpeed = 3 + opponentLevel + Math.floor(Math.random() * 5);
          return {
            id: `ai_${i}`,
            name,
            isPlayer: false,
            style: styles[Math.floor(Math.random() * styles.length)],
            deck: aiDeck,
            hand: aiHand,
            discard: [],
            stamina: 6,
            maxStamina: 6,
            stars: 0,
            actionSpeed: baseSpeed,
            selectedCards: [],
            fullRecoveryUsed: false,
            avatarColor: rivalColors[i],
          };
        });

        // 全参加者を速度順にソート
        const allParticipants = [playerParticipant, ...aiParticipants];
        allParticipants.sort((a, b) => b.actionSpeed - a.actionSpeed);

        const battleState: BattleState = {
          turn: 1,
          maxTurns: 5,
          trend: getRandomStyle(),
          participants: allParticipants,
          voltage: 0,
          voltageMax: 10,
          voltageClaimed: false,
          phase: 'card_select',
          currentResolveIndex: 0,
          resolveAnimations: [],
          turnOrder: allParticipants.map(p => p.id),
        };

        set({ currentBattle: battleState });
      },

      selectCards: (cardIndices) => {
        const battle = get().currentBattle;
        if (!battle) return;

        const playerIndex = battle.participants.findIndex(p => p.isPlayer);
        if (playerIndex === -1) return;

        const player = battle.participants[playerIndex];
        const selectedCards = cardIndices.map((i) => player.hand[i]);
        const totalCost = selectedCards.reduce((sum, card) => sum + card.cost, 0);

        if (totalCost > player.stamina) return;

        const updatedParticipants = [...battle.participants];
        updatedParticipants[playerIndex] = {
          ...player,
          selectedCards,
        };

        // AIもカードを選択（簡易AI）
        updatedParticipants.forEach((p, i) => {
          if (!p.isPlayer && p.selectedCards.length === 0) {
            // スタミナ内で1-2枚選択
            const availableCards = p.hand.filter(c => c.cost <= p.stamina);
            if (availableCards.length > 0) {
              const numCards = Math.min(2, availableCards.length);
              const aiSelected: Card[] = [];
              let remainingStamina = p.stamina;
              for (let j = 0; j < numCards && availableCards.length > 0; j++) {
                const affordable = availableCards.filter(c => c.cost <= remainingStamina);
                if (affordable.length === 0) break;
                const card = affordable[Math.floor(Math.random() * affordable.length)];
                aiSelected.push(card);
                remainingStamina -= card.cost;
                availableCards.splice(availableCards.indexOf(card), 1);
              }
              updatedParticipants[i] = { ...p, selectedCards: aiSelected };
            }
          }
        });

        set({
          currentBattle: {
            ...battle,
            participants: updatedParticipants,
          },
        });
      },

      setBattlePhase: (phase) => {
        const battle = get().currentBattle;
        if (!battle) return;

        set({
          currentBattle: {
            ...battle,
            phase,
            currentResolveIndex: phase === 'card_resolve' ? 0 : battle.currentResolveIndex,
          },
        });
      },

      resolveNextParticipant: () => {
        const battle = get().currentBattle;
        const session = get().currentSession;
        if (!battle) return false;

        const { currentResolveIndex, participants, trend } = battle;
        if (currentResolveIndex >= participants.length) return false;

        const participant = participants[currentResolveIndex];
        let earnedStars = 0;
        let voltageGain = 0;

        // プレイヤーの場合、サポートのcontestBonusを適用
        let contestBonus = 0;
        if (participant.isPlayer && session) {
          contestBonus = session.supportDeck.reduce(
            (sum, s) => sum + (s.bonus.contestBonus || 0), 0
          );
        }

        // カード効果を計算
        participant.selectedCards.forEach((card) => {
          card.effects.forEach((effect) => {
            if (effect.type === 'appeal' && effect.target === 'self') {
              // contestBonusを適用（プレイヤーのみ）
              const baseValue = effect.value;
              earnedStars += Math.floor(baseValue * (1 + contestBonus / 100));
            }
            if (effect.type === 'voltage') {
              voltageGain += effect.value;
            }
          });
          // トレンドボーナス
          if (card.style === trend) {
            earnedStars += 1;
            voltageGain += 1;
          }
        });

        // スタミナ消費
        const cost = participant.selectedCards.reduce((sum, card) => sum + card.cost, 0);

        // 手札からカードを削除
        const newHand = participant.hand.filter(
          (card) => !participant.selectedCards.includes(card)
        );

        // 参加者を更新
        const updatedParticipants = [...participants];
        updatedParticipants[currentResolveIndex] = {
          ...participant,
          hand: newHand,
          discard: [...participant.discard, ...participant.selectedCards],
          stamina: participant.stamina - cost,
          stars: participant.stars + earnedStars,
          selectedCards: [],
        };

        // 次のインデックスへ
        const nextIndex = currentResolveIndex + 1;
        const hasMore = nextIndex < participants.length;

        set({
          currentBattle: {
            ...battle,
            participants: updatedParticipants,
            voltage: clamp(battle.voltage + voltageGain, 0, battle.voltageMax),
            currentResolveIndex: nextIndex,
          },
        });

        return hasMore;
      },

      nextTurn: () => {
        const battle = get().currentBattle;
        if (!battle) return;

        const newTurn = battle.turn + 1;
        const newTrend = getRandomStyle();

        // 全参加者の手札とスタミナを更新
        const updatedParticipants = battle.participants.map((p) => {
          let hand = [...p.hand];
          let deck = [...p.deck];

          // 2枚ドロー
          for (let i = 0; i < 2 && deck.length > 0; i++) {
            hand.push(deck.shift()!);
          }
          // 手札上限7枚
          if (hand.length > 7) {
            hand = hand.slice(0, 7);
          }

          return {
            ...p,
            deck,
            hand,
            stamina: Math.min(p.stamina + 1, p.maxStamina),
            selectedCards: [],
          };
        });

        // 速度順で並び替え
        updatedParticipants.sort((a, b) => b.actionSpeed - a.actionSpeed);

        set({
          currentBattle: {
            ...battle,
            turn: newTurn,
            trend: newTrend,
            participants: updatedParticipants,
            phase: 'card_select',
            currentResolveIndex: 0,
            turnOrder: updatedParticipants.map(p => p.id),
          },
        });
      },

      endBattle: () => {
        const battle = get().currentBattle;
        const session = get().currentSession;

        // ランキングを計算
        const rankings = battle
          ? [...battle.participants]
              .sort((a, b) => b.stars - a.stars)
              .map((p, i) => ({
                participantId: p.id,
                name: p.name,
                stars: p.stars,
                isPlayer: p.isPlayer,
              }))
          : [];

        const playerRank = rankings.findIndex(r => r.isPlayer) + 1;

        // 順位に応じた報酬
        const rewardsByRank = [
          { gold: 800, fame: 80, cardGauge: 30 }, // 1位
          { gold: 500, fame: 50, cardGauge: 20 }, // 2位
          { gold: 200, fame: 20, cardGauge: 10 }, // 3位
          { gold: 100, fame: 10, cardGauge: 5 },  // 4位
        ];

        const reward = rewardsByRank[playerRank - 1] || rewardsByRank[3];

        const result: BattleResult = {
          rankings,
          playerRank,
          rewards: {
            gold: reward.gold,
            fame: reward.fame,
            cards: [],
            cardGauge: reward.cardGauge,
          },
        };

        if (session) {
          set({
            currentSession: {
              ...session,
              gold: session.gold + result.rewards.gold,
              fame: session.fame + result.rewards.fame,
              cardGauge: {
                ...session.cardGauge,
                current: clamp(
                  session.cardGauge.current + result.rewards.cardGauge,
                  0,
                  session.cardGauge.max
                ),
              },
            },
            currentBattle: null,
          });
        } else {
          set({ currentBattle: null });
        }

        return result;
      },

      getPlayerParticipant: () => {
        const battle = get().currentBattle;
        if (!battle) return null;
        return battle.participants.find(p => p.isPlayer) || null;
      },

      getTurnOrder: () => {
        const battle = get().currentBattle;
        if (!battle) return [];
        return [...battle.participants].sort((a, b) => b.actionSpeed - a.actionSpeed);
      },

      // === 設定 ===
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // === リセット ===
      resetGame: () => {
        set(initialState);
      },
    }),
    {
      name: 'idol-training-game',
      partialize: (state) => ({
        editCharacters: state.editCharacters,
        trainedCharacters: state.trainedCharacters,
        unlockedFixedCharacters: state.unlockedFixedCharacters,
        totalTrainingCount: state.totalTrainingCount,
        settings: state.settings,
      }),
    }
  )
);
