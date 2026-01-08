import React, { useState } from 'react';
import { Button, Card } from '../ui';
import { useGameStore } from '../../store';
import {
  EditCharacter,
  TrainedCharacter,
  SupportCharacter,
  SupportBonus,
  Style,
  FixedCharacter,
  BOND_THRESHOLDS,
} from '../../types';
import {
  FIXED_CHARACTERS,
  FIXED_CHARACTER_BONUSES,
} from '../../data/fixedCharacters';
import './DeckSelection.css';

interface DeckSelectionProps {
  selectedCharacter: EditCharacter;
  onConfirm: (supportDeck: SupportCharacter[]) => void;
  onCancel: () => void;
}

const MAX_SUPPORT = 6;

const createSupportBonus = (
  character: TrainedCharacter | EditCharacter
): SupportBonus => {
  // 育成済みキャラの場合は最終ステータスに応じたボーナス
  if ('finalStats' in character && character.type === 'trained') {
    const trained = character as TrainedCharacter;
    const bestStyle = trained.bestStyle;
    const bonusPercent =
      trained.finalRank === 'SSS'
        ? 20
        : trained.finalRank === 'SS'
        ? 15
        : trained.finalRank === 'S'
        ? 10
        : 5;

    return {
      lessonBonus: { [bestStyle]: bonusPercent },
      initialStats:
        trained.finalRank === 'SSS' || trained.finalRank === 'SS'
          ? { [bestStyle]: trained.finalRank === 'SSS' ? 100 : 50 }
          : {},
      specialtyStyle: bestStyle,
      specialtyRate: 30 + bonusPercent,
      trainingEffectUp: bonusPercent,
      friendshipBonus: bonusPercent,
      friendshipThreshold: BOND_THRESHOLDS.FRIENDSHIP,
      motivationEffectUp: 5,
      fatigueReduction: 5,
      conditionUp: 5,
      eventEffectUp: 10,
      cardGaugeBonus: 5,
      hintRate: 20,
      hintEffectUp: 10,
      goldBonus: 0,
      fameBonus: 0,
      contestBonus: 5,
      initialBond: 5,
      facilityBonus: [],
    };
  }

  // エディットキャラの場合はデフォルトボーナス
  const defaultStyle: Style = 'passion';
  return {
    lessonBonus: {},
    initialStats: {},
    specialtyStyle: defaultStyle,
    specialtyRate: 20,
    trainingEffectUp: 5,
    friendshipBonus: 10,
    friendshipThreshold: BOND_THRESHOLDS.FRIENDSHIP,
    motivationEffectUp: 5,
    fatigueReduction: 5,
    conditionUp: 5,
    eventEffectUp: 5,
    cardGaugeBonus: 3,
    hintRate: 10,
    hintEffectUp: 5,
    goldBonus: 0,
    fameBonus: 0,
    contestBonus: 3,
    initialBond: 0,
    facilityBonus: [],
  };
};

export const DeckSelection: React.FC<DeckSelectionProps> = ({
  selectedCharacter,
  onConfirm,
  onCancel,
}) => {
  const editCharacters = useGameStore((state) => state.editCharacters);
  const trainedCharacters = useGameStore((state) => state.trainedCharacters);

  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);

  // 育成対象以外のキャラクターをリストアップ（固有キャラ含む）
  type AvailableCharacter = EditCharacter | TrainedCharacter | FixedCharacter;
  const availableCharacters: AvailableCharacter[] = [
    ...FIXED_CHARACTERS,
    ...editCharacters.filter((c) => c.id !== selectedCharacter.id),
    ...trainedCharacters,
  ];

  const handleSelectSupport = (characterId: string) => {
    if (selectedSupports.includes(characterId)) {
      setSelectedSupports(selectedSupports.filter((id) => id !== characterId));
    } else if (selectedSupports.length < MAX_SUPPORT) {
      setSelectedSupports([...selectedSupports, characterId]);
    }
  };

  const handleConfirm = () => {
    const supportDeck: SupportCharacter[] = selectedSupports.map((id) => {
      const character = availableCharacters.find((c) => c.id === id)!;

      // 固有キャラの場合は専用ボーナスとキズナイベントを使用
      if (character.type === 'fixed') {
        const fixedChar = character as FixedCharacter;
        const bonus = FIXED_CHARACTER_BONUSES[fixedChar.id];
        return {
          character: fixedChar,
          bondLevel: bonus.initialBond,
          bonus,
          bondProgress: {
            event1Cleared: false,
            event2Cleared: false,
            event3Cleared: false,
          },
          bondEvents: fixedChar.bondEvents,
          isInTraining: false,
        };
      }

      // 育成済み・オリジナルキャラ
      const bonus = createSupportBonus(character as EditCharacter | TrainedCharacter);
      return {
        character: character as EditCharacter | TrainedCharacter,
        bondLevel: bonus.initialBond,
        bonus,
        bondProgress: {
          event1Cleared: false,
          event2Cleared: false,
          event3Cleared: false,
        },
        isInTraining: false,
      };
    });

    onConfirm(supportDeck);
  };

  return (
    <div className="deck-selection">
      <div className="deck-selection__header">
        <h2>サポートデッキ編成</h2>
        <p>
          育成をサポートするキャラクターを最大{MAX_SUPPORT}人選択してください
        </p>
        <div className="deck-selection__count">
          選択中: {selectedSupports.length} / {MAX_SUPPORT}
        </div>
      </div>

      <div className="deck-selection__selected">
        <h3>選択したサポート</h3>
        <div className="deck-selection__slots">
          {Array.from({ length: MAX_SUPPORT }).map((_, i) => {
            const selectedId = selectedSupports[i];
            const character = selectedId
              ? availableCharacters.find((c) => c.id === selectedId)
              : null;

            return (
              <div
                key={i}
                className={`deck-selection__slot ${character ? 'filled' : ''}`}
                onClick={() => character && handleSelectSupport(character.id)}
              >
                {character ? (
                  <div className="deck-selection__slot-content">
                    <span className="deck-selection__slot-name">
                      {character.name}
                    </span>
                    <span className="deck-selection__slot-type">
                      {character.type === 'fixed'
                        ? '固有'
                        : character.type === 'trained'
                        ? '育成済み'
                        : 'オリジナル'}
                    </span>
                  </div>
                ) : (
                  <span className="deck-selection__slot-empty">空き</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="deck-selection__available">
        <h3>利用可能なキャラクター</h3>
        {availableCharacters.length === 0 ? (
          <div className="deck-selection__empty">
            <p>利用可能なキャラクターがいません</p>
            <p>育成を完了するか、新しいキャラクターを作成してください</p>
          </div>
        ) : (
          <div className="deck-selection__grid">
            {availableCharacters.map((character) => {
              const isSelected = selectedSupports.includes(character.id);
              const isTrained = character.type === 'trained';
              const isFixed = character.type === 'fixed';

              // 固有キャラの得意スタイル名を日本語化
              const getStyleName = (style: Style): string => {
                const names: Record<Style, string> = {
                  cool: 'クール',
                  elegant: 'エレガント',
                  cute: 'キュート',
                  clever: 'クレバー',
                  passion: 'パッション',
                };
                return names[style];
              };

              return (
                <Card
                  key={character.id}
                  onClick={() => handleSelectSupport(character.id)}
                  selected={isSelected}
                >
                  <div className="deck-selection__character">
                    <div className="deck-selection__character-header">
                      <strong>{character.name}</strong>
                      <span
                        className={`deck-selection__character-type ${
                          isFixed ? 'fixed' : isTrained ? 'trained' : 'edit'
                        }`}
                      >
                        {isFixed ? '固有' : isTrained ? '育成済み' : 'オリジナル'}
                      </span>
                    </div>
                    {isFixed && (
                      <div className="deck-selection__character-stats">
                        <span>
                          得意:{' '}
                          {getStyleName(
                            FIXED_CHARACTER_BONUSES[(character as FixedCharacter).id]
                              ?.specialtyStyle || 'passion'
                          )}
                        </span>
                        <span>キズナイベント有</span>
                      </div>
                    )}
                    {isTrained && (
                      <div className="deck-selection__character-stats">
                        <span>
                          ランク: {(character as TrainedCharacter).finalRank}
                        </span>
                        <span>
                          得意:{' '}
                          {(character as TrainedCharacter).bestStyle}
                        </span>
                      </div>
                    )}
                    <div className="deck-selection__character-bonus">
                      {isFixed ? (
                        <span>
                          レッスン+15% / 絆+20%
                        </span>
                      ) : isTrained ? (
                        <span>
                          レッスン+
                          {(character as TrainedCharacter).finalRank === 'SSS'
                            ? '20'
                            : (character as TrainedCharacter).finalRank === 'SS'
                            ? '15'
                            : (character as TrainedCharacter).finalRank === 'S'
                            ? '10'
                            : '5'}
                          %
                        </span>
                      ) : (
                        <span>イベント+5%</span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div className="deck-selection__actions">
        <Button variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button onClick={handleConfirm}>育成を開始</Button>
      </div>
    </div>
  );
};
