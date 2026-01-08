import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card } from '../ui';
import { useGameStore } from '../../store';
import { Card as GameCard, Style, BattleParticipant, BattlePhase } from '../../types';
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
  const setBattlePhase = useGameStore((state) => state.setBattlePhase);
  const resolveNextParticipant = useGameStore((state) => state.resolveNextParticipant);
  const nextTurn = useGameStore((state) => state.nextTurn);
  const endBattle = useGameStore((state) => state.endBattle);
  const advanceWeek = useGameStore((state) => state.advanceWeek);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [battleResult, setBattleResult] = useState<ReturnType<typeof endBattle> | null>(null);
  const [resolvingParticipant, setResolvingParticipant] = useState<BattleParticipant | null>(null);
  const [showStarGain, setShowStarGain] = useState<{ id: string; stars: number } | null>(null);
  const [roundStartAnim, setRoundStartAnim] = useState(false);

  // カード解決アニメーション
  const runResolveAnimation = useCallback(async () => {
    if (!battle) return;

    // ラウンド開始演出
    setRoundStartAnim(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRoundStartAnim(false);

    setBattlePhase('card_resolve');

    // 速度順に1人ずつ解決
    for (let i = 0; i < battle.participants.length; i++) {
      const participant = battle.participants[i];
      setResolvingParticipant(participant);

      // カード使用アニメーション
      await new Promise((r) => setTimeout(r, 800));

      // スター獲得を計算
      let earnedStars = 0;
      participant.selectedCards.forEach((card) => {
        card.effects.forEach((effect) => {
          if (effect.type === 'appeal' && effect.target === 'self') {
            earnedStars += effect.value;
          }
        });
        if (card.style === battle.trend) {
          earnedStars += 1;
        }
      });

      // スター獲得エフェクト
      if (earnedStars > 0) {
        setShowStarGain({ id: participant.id, stars: earnedStars });
        await new Promise((r) => setTimeout(r, 600));
        setShowStarGain(null);
      }

      // 実際に解決
      resolveNextParticipant();

      await new Promise((r) => setTimeout(r, 400));
    }

    setResolvingParticipant(null);

    // ターン終了演出
    setBattlePhase('turn_end');
    await new Promise((r) => setTimeout(r, 800));

    // 最終ターンかチェック
    if (battle.turn >= battle.maxTurns) {
      const result = endBattle();
      setBattleResult(result);
      setBattlePhase('result');
      advanceWeek();
    } else {
      nextTurn();
      setSelectedIndices([]);
    }
  }, [battle, setBattlePhase, resolveNextParticipant, nextTurn, endBattle, advanceWeek]);

  if (!battle) {
    return <div className="battle-screen">バトルがありません</div>;
  }

  const player = battle.participants.find((p) => p.isPlayer);
  if (!player) {
    return <div className="battle-screen">プレイヤーが見つかりません</div>;
  }

  const handleCardSelect = (index: number) => {
    if (battle.phase !== 'card_select') return;

    const newSelected = selectedIndices.includes(index)
      ? selectedIndices.filter((i) => i !== index)
      : [...selectedIndices, index];

    // コスト計算
    const totalCost = newSelected.reduce(
      (sum, i) => sum + player.hand[i].cost,
      0
    );

    if (totalCost <= player.stamina) {
      setSelectedIndices(newSelected);
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === 0) return;

    selectCards(selectedIndices);
    runResolveAnimation();
  };

  const handleEndBattle = () => {
    onComplete();
  };

  const selectedCost = selectedIndices.reduce(
    (sum, i) => sum + player.hand[i].cost,
    0
  );

  // 結果画面
  if (battle.phase === 'result' && battleResult) {
    const playerRank = battleResult.playerRank;
    const resultClass =
      playerRank === 1
        ? 'battle-result--win'
        : playerRank <= 2
        ? 'battle-result--good'
        : 'battle-result--lose';

    return (
      <div className={`battle-result ${resultClass}`}>
        <div className="battle-result__title-container">
          <h2 className="battle-result__title">
            {playerRank === 1
              ? '🏆 1st Place!'
              : playerRank === 2
              ? '🥈 2nd Place!'
              : playerRank === 3
              ? '🥉 3rd Place!'
              : '4th Place...'}
          </h2>
        </div>

        <div className="battle-result__rankings">
          {battleResult.rankings.map((r, i) => (
            <div
              key={r.participantId}
              className={`battle-result__rank-item ${r.isPlayer ? 'is-player' : ''}`}
            >
              <span className="battle-result__rank-number">{i + 1}</span>
              <span className="battle-result__rank-name">{r.name}</span>
              <span className="battle-result__rank-stars">★{r.stars}</span>
            </div>
          ))}
        </div>

        <div className="battle-result__rewards">
          <h3>獲得報酬</h3>
          <div className="battle-result__reward-list">
            <p>
              ゴールド: <strong>+{battleResult.rewards.gold}G</strong>
            </p>
            <p>
              知名度: <strong>+{battleResult.rewards.fame}</strong>
            </p>
          </div>
        </div>

        <div className="battle-result__actions">
          <Button onClick={handleEndBattle}>続ける</Button>
        </div>
      </div>
    );
  }

  // ソート済み参加者リスト（速度順）
  const sortedParticipants = [...battle.participants].sort(
    (a, b) => b.actionSpeed - a.actionSpeed
  );

  return (
    <div className="battle-screen">
      {/* ラウンド開始演出 */}
      {roundStartAnim && (
        <div className="battle-round-start">
          <div className="battle-round-start__text">
            ROUND {battle.turn} START!
          </div>
        </div>
      )}

      {/* ヘッダー */}
      <div className="battle-header">
        <div className="battle-header__turn">
          ターン {battle.turn}/{battle.maxTurns}
        </div>
        <div
          className="battle-header__trend"
          style={{ backgroundColor: STYLE_COLORS[battle.trend] }}
        >
          トレンド: {STYLE_LABELS[battle.trend]}
        </div>
        <div className="battle-header__voltage">
          <span>ボルテージ</span>
          <div className="battle-header__voltage-bar">
            <div
              className="battle-header__voltage-fill"
              style={{ width: `${(battle.voltage / battle.voltageMax) * 100}%` }}
            />
          </div>
          <span>{battle.voltage}/{battle.voltageMax}</span>
        </div>
      </div>

      <div className="battle-main">
        {/* 左: 参加者リスト（速度順） */}
        <div className="battle-participants">
          <div className="battle-participants__title">行動順</div>
          {sortedParticipants.map((p, index) => (
            <div
              key={p.id}
              className={`battle-participant ${p.isPlayer ? 'is-player' : ''} ${
                resolvingParticipant?.id === p.id ? 'is-resolving' : ''
              }`}
            >
              <div className="battle-participant__order">{index + 1}</div>
              <div
                className="battle-participant__avatar"
                style={{ backgroundColor: p.avatarColor }}
              >
                {p.name.charAt(0)}
              </div>
              <div className="battle-participant__info">
                <div className="battle-participant__name">{p.name}</div>
                <div className="battle-participant__stats">
                  <span className="battle-participant__speed">
                    速度: {p.actionSpeed}
                  </span>
                  <span className="battle-participant__stars">
                    ★{p.stars}
                  </span>
                </div>
                <div className="battle-participant__stamina">
                  <div
                    className="battle-participant__stamina-fill"
                    style={{ width: `${(p.stamina / p.maxStamina) * 100}%` }}
                  />
                </div>
              </div>
              {/* スター獲得エフェクト */}
              {showStarGain?.id === p.id && (
                <div className="battle-star-gain">+{showStarGain.stars}★</div>
              )}
              {/* カード使用中表示 */}
              {resolvingParticipant?.id === p.id && (
                <div className="battle-participant__cards-used">
                  {p.selectedCards.map((card, i) => (
                    <div
                      key={i}
                      className="battle-participant__card-mini"
                      style={{ borderColor: STYLE_COLORS[card.style] }}
                    >
                      {card.name.substring(0, 2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 中央: バトルフィールド */}
        <div className="battle-field">
          {battle.phase === 'card_resolve' && resolvingParticipant && (
            <div className="battle-resolve-display">
              <div className="battle-resolve-display__name">
                {resolvingParticipant.name}の行動!
              </div>
              <div className="battle-resolve-display__cards">
                {resolvingParticipant.selectedCards.map((card, i) => (
                  <div
                    key={i}
                    className="battle-resolve-card"
                    style={{ borderColor: STYLE_COLORS[card.style] }}
                  >
                    <div
                      className="battle-resolve-card__style"
                      style={{ backgroundColor: STYLE_COLORS[card.style] }}
                    >
                      {STYLE_LABELS[card.style]}
                    </div>
                    <div className="battle-resolve-card__name">{card.name}</div>
                    {card.style === battle.trend && (
                      <div className="battle-resolve-card__trend">トレンド!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {battle.phase === 'turn_end' && (
            <div className="battle-turn-end">
              <div className="battle-turn-end__text">ターン終了</div>
            </div>
          )}

          {battle.phase === 'card_select' && (
            <div className="battle-select-prompt">
              <p>カードを選択してください</p>
            </div>
          )}
        </div>
      </div>

      {/* プレイヤー手札 */}
      <div className="battle-player-area">
        <div className="battle-player-info">
          <div
            className="battle-player-info__avatar"
            style={{ backgroundColor: player.avatarColor }}
          >
            {player.name.charAt(0)}
          </div>
          <div className="battle-player-info__details">
            <div className="battle-player-info__name">{player.name}</div>
            <div className="battle-player-info__stats">
              <span>★{player.stars}</span>
              <span>スタミナ: {player.stamina}/{player.maxStamina}</span>
              <span>デッキ: {player.deck.length}枚</span>
            </div>
          </div>
        </div>

        <div className="battle-player-hand">
          {player.hand.map((card, i) => (
            <div
              key={i}
              className={`battle-card ${selectedIndices.includes(i) ? 'selected' : ''} ${
                battle.phase !== 'card_select' ? 'disabled' : ''
              }`}
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
              {card.style === battle.trend && (
                <div className="battle-card__trend">トレンド!</div>
              )}
            </div>
          ))}
        </div>

        <div className="battle-actions">
          <div className="battle-actions__info">
            <span>
              選択コスト: {selectedCost} / {player.stamina}
            </span>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={battle.phase !== 'card_select' || selectedIndices.length === 0}
          >
            決定
          </Button>
        </div>
      </div>
    </div>
  );
};
