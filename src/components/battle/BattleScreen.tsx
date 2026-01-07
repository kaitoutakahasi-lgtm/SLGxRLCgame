import React, { useState, useEffect } from 'react';
import { Button, Card, ProgressBar } from '../ui';
import { useGameStore } from '../../store';
import { Card as GameCard, Style } from '../../types';
import './BattleScreen.css';

interface BattleScreenProps {
  onComplete: () => void;
}

const STYLE_LABELS: Record<Style, string> = {
  cool: 'クール',
  elegant: 'エレガント',
  cute: 'キュート',
  clever: 'クレバー',
  passion: 'パッション',
};

const STYLE_COLORS: Record<Style, string> = {
  cool: '#3b82f6',
  elegant: '#a855f7',
  cute: '#ec4899',
  clever: '#22c55e',
  passion: '#f97316',
};

export const BattleScreen: React.FC<BattleScreenProps> = ({ onComplete }) => {
  const battle = useGameStore((state) => state.currentBattle);
  const selectCards = useGameStore((state) => state.selectCards);
  const resolveCards = useGameStore((state) => state.resolveCards);
  const nextTurn = useGameStore((state) => state.nextTurn);
  const endBattle = useGameStore((state) => state.endBattle);
  const advanceWeek = useGameStore((state) => state.advanceWeek);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [phase, setPhase] = useState<'select' | 'resolve' | 'result'>('select');
  const [battleResult, setBattleResult] = useState<ReturnType<typeof endBattle> | null>(null);

  if (!battle) {
    return <div>バトルがありません</div>;
  }

  const { turn, maxTurns, trend, playerState, opponentState } = battle;

  const handleCardSelect = (index: number) => {
    if (phase !== 'select') return;

    const newSelected = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];

    // コスト計算
    const totalCost = newSelected.reduce(
      (sum, i) => sum + playerState.hand[i].cost,
      0
    );

    if (totalCost <= playerState.stamina) {
      setSelectedIndices(newSelected);
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === 0) return;

    selectCards(selectedIndices);
    setPhase('resolve');

    // カード解決（簡易アニメーション）
    setTimeout(() => {
      resolveCards();
      setSelectedIndices([]);

      // 最終ターンかチェック
      if (turn >= maxTurns) {
        const result = endBattle();
        setBattleResult(result);
        setPhase('result');
        advanceWeek();
      } else {
        nextTurn();
        setPhase('select');
      }
    }, 1500);
  };

  const handleEndBattle = () => {
    onComplete();
  };

  const selectedCost = selectedIndices.reduce(
    (sum, i) => sum + playerState.hand[i].cost,
    0
  );

  if (phase === 'result' && battleResult) {
    return (
      <div className="battle-result">
        <h2>
          {battleResult.winner === 'player'
            ? '勝利！'
            : battleResult.winner === 'opponent'
            ? '敗北...'
            : '引き分け'}
        </h2>
        <div className="battle-result__score">
          <div className="battle-result__player">
            <span>あなた</span>
            <strong>{battleResult.playerStars}</strong>
          </div>
          <span className="battle-result__vs">VS</span>
          <div className="battle-result__opponent">
            <span>相手</span>
            <strong>{battleResult.opponentStars}</strong>
          </div>
        </div>
        <div className="battle-result__rewards">
          <h3>報酬</h3>
          <p>ゴールド: +{battleResult.rewards.gold}G</p>
          <p>知名度: +{battleResult.rewards.fame}</p>
        </div>
        <Button onClick={handleEndBattle}>続ける</Button>
      </div>
    );
  }

  return (
    <div className="battle-screen">
      <div className="battle-header">
        <div className="battle-header__turn">
          ターン {turn}/{maxTurns}
        </div>
        <div
          className="battle-header__trend"
          style={{ backgroundColor: STYLE_COLORS[trend] }}
        >
          トレンド: {STYLE_LABELS[trend]}
        </div>
      </div>

      <div className="battle-field">
        <div className="battle-player battle-player--opponent">
          <div className="battle-player__info">
            <span>相手</span>
            <div className="battle-player__stats">
              <span>スター: {opponentState.stars}</span>
              <span>スタミナ: {opponentState.stamina}/{opponentState.maxStamina}</span>
              <span>手札: {opponentState.hand.length}枚</span>
            </div>
          </div>
          <div className="battle-player__hand battle-player__hand--hidden">
            {opponentState.hand.map((_, i) => (
              <div key={i} className="battle-card battle-card--back" />
            ))}
          </div>
        </div>

        <div className="battle-center">
          {phase === 'resolve' && (
            <div className="battle-resolve">
              <p>カード解決中...</p>
            </div>
          )}
        </div>

        <div className="battle-player battle-player--self">
          <div className="battle-player__hand">
            {playerState.hand.map((card, i) => (
              <div
                key={i}
                className={`battle-card ${selectedIndices.includes(i) ? 'selected' : ''}`}
                onClick={() => handleCardSelect(i)}
                style={{ borderColor: STYLE_COLORS[card.style] }}
              >
                <div className="battle-card__header">
                  <span
                    className="battle-card__style"
                    style={{ backgroundColor: STYLE_COLORS[card.style] }}
                  >
                    {STYLE_LABELS[card.style]}
                  </span>
                  <span className="battle-card__cost">{card.cost}</span>
                </div>
                <div className="battle-card__name">{card.name}</div>
                <div className="battle-card__desc">{card.description}</div>
                {card.style === trend && (
                  <div className="battle-card__trend">トレンド!</div>
                )}
              </div>
            ))}
          </div>
          <div className="battle-player__info">
            <span>あなた</span>
            <div className="battle-player__stats">
              <span>スター: {playerState.stars}</span>
              <span>
                スタミナ: {playerState.stamina}/{playerState.maxStamina}
              </span>
              <span>デッキ: {playerState.deck.length}枚</span>
            </div>
          </div>
        </div>
      </div>

      <div className="battle-actions">
        <div className="battle-actions__info">
          <span>
            選択コスト: {selectedCost} / {playerState.stamina}
          </span>
        </div>
        <Button
          onClick={handleConfirm}
          disabled={phase !== 'select' || selectedIndices.length === 0}
        >
          決定
        </Button>
      </div>
    </div>
  );
};
