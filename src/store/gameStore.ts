import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  EditCharacter,
  TrainedCharacter,
  TrainingCharacter,
  TrainingSession,
  BattleState,
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
} from '../types';
import { getStarterDeck } from '../data/cards';
import { getTotalLessonBonus, FACILITIES } from '../data/facilities';

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
    fatigue: number
  ) => void;
  performRest: (fatigueRecovery: number, healthRecovery: number) => void;
  performBusiness: (gold: number, fame: number, motivation: number) => void;
  advanceWeek: () => void;

  // 設備
  purchaseFacility: (facilityId: string) => boolean;
  upgradeFacility: (facilityId: string) => boolean;
  getTotalFacilityLevel: () => number;

  // カード
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;

  // コンディション
  updateCondition: (updates: Partial<CharacterCondition>) => void;
  updateStats: (style: Style, amount: number) => void;

  // 資金
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // ライブバトル
  startBattle: (opponentLevel: number) => void;
  selectCards: (cardIndices: number[]) => void;
  resolveCards: () => void;
  nextTurn: () => void;
  endBattle: () => BattleResult;

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

        // サポートボーナス適用
        supportDeck.forEach((support) => {
          if (support.bonus.initialStats) {
            Object.entries(support.bonus.initialStats).forEach(([style, value]) => {
              if (value) {
                trainingCharacter.stats[style as Style] += value;
              }
            });
          }
        });

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
      performLesson: (style, baseEffect, fatigue) => {
        const session = get().currentSession;
        if (!session) return;

        const facilityBonus = style === 'all'
          ? 0
          : getTotalLessonBonus(session.facilities, style);
        const motivationBonus = session.character.condition.motivation >= 80 ? 0.5 : 0;
        const fatigueEfficiency = session.character.condition.fatigue <= 30
          ? 1.0
          : session.character.condition.fatigue <= 60
          ? 0.8
          : session.character.condition.fatigue <= 80
          ? 0.6
          : 0.4;

        const finalEffect = Math.floor(
          baseEffect * (1 + facilityBonus / 100 + motivationBonus) * fatigueEfficiency
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

        const updatedCondition = {
          ...session.character.condition,
          fatigue: clamp(session.character.condition.fatigue + fatigue, 0, 100),
        };

        set({
          currentSession: {
            ...session,
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

        set({
          currentSession: {
            ...session,
            gold: session.gold + gold,
            fame: session.fame + fame,
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

        set({
          currentSession: {
            ...session,
            currentWeek: session.currentWeek + 1,
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

      // === ライブバトル ===
      startBattle: (opponentLevel) => {
        const session = get().currentSession;
        if (!session) return;

        // デッキからランダムに10枚選択（重複なし）
        const availableCards = [...session.character.cards];
        const deck: Card[] = [];
        for (let i = 0; i < 10 && availableCards.length > 0; i++) {
          const index = Math.floor(Math.random() * availableCards.length);
          deck.push(availableCards.splice(index, 1)[0]);
        }

        // 初期手札4枚
        const hand = deck.splice(0, 4);

        // 相手のデッキ生成（簡易版）
        const opponentDeck = getStarterDeck();
        const opponentHand = opponentDeck.splice(0, 4);

        const battleState: BattleState = {
          turn: 1,
          maxTurns: 5,
          trend: getRandomStyle(),
          playerState: {
            deck,
            hand,
            discard: [],
            stamina: 6,
            maxStamina: 6,
            stars: 0,
            actionSpeed: session.character.actionSpeed,
            selectedCards: [],
            fullRecoveryUsed: false,
          },
          opponentState: {
            deck: opponentDeck,
            hand: opponentHand,
            discard: [],
            stamina: 6,
            maxStamina: 6,
            stars: 0,
            actionSpeed: 5 + opponentLevel,
            selectedCards: [],
            fullRecoveryUsed: false,
          },
          voltageMax: 10,
          voltageClaimed: false,
        };

        set({ currentBattle: battleState });
      },

      selectCards: (cardIndices) => {
        const battle = get().currentBattle;
        if (!battle) return;

        const selectedCards = cardIndices.map((i) => battle.playerState.hand[i]);
        const totalCost = selectedCards.reduce((sum, card) => sum + card.cost, 0);

        if (totalCost > battle.playerState.stamina) return;

        set({
          currentBattle: {
            ...battle,
            playerState: {
              ...battle.playerState,
              selectedCards,
            },
          },
        });
      },

      resolveCards: () => {
        const battle = get().currentBattle;
        if (!battle) return;

        // 簡易版：スター計算
        let playerStars = 0;
        let opponentStars = 0;

        battle.playerState.selectedCards.forEach((card) => {
          card.effects.forEach((effect) => {
            if (effect.type === 'appeal' && effect.target === 'self') {
              playerStars += effect.value;
            }
          });
          // トレンドボーナス
          if (card.style === battle.trend) {
            playerStars += 1;
          }
        });

        // 相手AI（ランダム選択）
        const opponentCards = battle.opponentState.hand.slice(0, 2);
        opponentCards.forEach((card) => {
          card.effects.forEach((effect) => {
            if (effect.type === 'appeal' && effect.target === 'self') {
              opponentStars += effect.value;
            }
          });
          if (card.style === battle.trend) {
            opponentStars += 1;
          }
        });

        // スタミナ消費
        const playerCost = battle.playerState.selectedCards.reduce(
          (sum, card) => sum + card.cost,
          0
        );
        const opponentCost = opponentCards.reduce((sum, card) => sum + card.cost, 0);

        // カードを捨て札へ
        const newPlayerHand = battle.playerState.hand.filter(
          (card) => !battle.playerState.selectedCards.includes(card)
        );
        const newOpponentHand = battle.opponentState.hand.filter(
          (card) => !opponentCards.includes(card)
        );

        set({
          currentBattle: {
            ...battle,
            playerState: {
              ...battle.playerState,
              hand: newPlayerHand,
              discard: [...battle.playerState.discard, ...battle.playerState.selectedCards],
              stamina: battle.playerState.stamina - playerCost,
              stars: battle.playerState.stars + playerStars,
              selectedCards: [],
            },
            opponentState: {
              ...battle.opponentState,
              hand: newOpponentHand,
              discard: [...battle.opponentState.discard, ...opponentCards],
              stamina: battle.opponentState.stamina - opponentCost,
              stars: battle.opponentState.stars + opponentStars,
            },
          },
        });
      },

      nextTurn: () => {
        const battle = get().currentBattle;
        if (!battle) return;

        // ターン開始処理
        const newTurn = battle.turn + 1;
        const newTrend = getRandomStyle();

        // スタミナ+1、2枚ドロー
        let playerHand = [...battle.playerState.hand];
        let playerDeck = [...battle.playerState.deck];
        for (let i = 0; i < 2 && playerDeck.length > 0; i++) {
          playerHand.push(playerDeck.shift()!);
        }
        if (playerHand.length > 7) {
          playerHand = playerHand.slice(0, 7);
        }

        let opponentHand = [...battle.opponentState.hand];
        let opponentDeck = [...battle.opponentState.deck];
        for (let i = 0; i < 2 && opponentDeck.length > 0; i++) {
          opponentHand.push(opponentDeck.shift()!);
        }
        if (opponentHand.length > 7) {
          opponentHand = opponentHand.slice(0, 7);
        }

        set({
          currentBattle: {
            ...battle,
            turn: newTurn,
            trend: newTrend,
            playerState: {
              ...battle.playerState,
              deck: playerDeck,
              hand: playerHand,
              stamina: Math.min(
                battle.playerState.stamina + 1,
                battle.playerState.maxStamina
              ),
            },
            opponentState: {
              ...battle.opponentState,
              deck: opponentDeck,
              hand: opponentHand,
              stamina: Math.min(
                battle.opponentState.stamina + 1,
                battle.opponentState.maxStamina
              ),
            },
          },
        });
      },

      endBattle: () => {
        const battle = get().currentBattle;
        const session = get().currentSession;

        const result: BattleResult = {
          winner:
            !battle
              ? 'draw'
              : battle.playerState.stars > battle.opponentState.stars
              ? 'player'
              : battle.playerState.stars < battle.opponentState.stars
              ? 'opponent'
              : 'draw',
          playerStars: battle?.playerState.stars || 0,
          opponentStars: battle?.opponentState.stars || 0,
          rewards: {
            gold: battle?.playerState.stars || 0 > (battle?.opponentState.stars || 0) ? 500 : 100,
            fame: battle?.playerState.stars || 0 > (battle?.opponentState.stars || 0) ? 50 : 10,
            cards: [],
          },
        };

        if (session) {
          set({
            currentSession: {
              ...session,
              gold: session.gold + result.rewards.gold,
              fame: session.fame + result.rewards.fame,
            },
            currentBattle: null,
          });
        } else {
          set({ currentBattle: null });
        }

        return result;
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
