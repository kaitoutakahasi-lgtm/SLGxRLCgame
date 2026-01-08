import React, { useState, useEffect } from 'react';
import { Button, Card, ProgressBar, StatDisplay, Modal } from '../ui';
import { EventDialog } from '../event';
import { BondTrainingEffect } from './BondTrainingEffect';
import { useGameStore } from '../../store';
import {
  LESSON_ACTIONS,
  REST_ACTIONS,
  BUSINESS_ACTIONS,
  getAvailableLessons,
  getAvailableBusinessActions,
  getAuditionByWeek,
  getAvailableBondLessons,
  getStyleName,
  generateCardChoices,
  calculateInjuryRate,
  getInjuryRateColor,
  calculateTagBonus,
} from '../../data';
import { FACILITIES, calculateFacilityUpgradeCost } from '../../data/facilities';
import { determineEndingType } from '../../data/scenarios';
import {
  Style,
  LessonAction,
  RestAction,
  BusinessAction,
  BondLessonAction,
  EventChoice,
  BOND_THRESHOLDS,
  Card as CardType,
  CharacterStats,
  INJURY_TYPES,
  TrainingPositions,
} from '../../types';
import './TrainingScreen.css';

interface TrainingScreenProps {
  onBattle: () => void;
  onComplete: () => void;
}

type ActionTab = 'lesson' | 'bond' | 'rest' | 'business' | 'facility';

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  onBattle,
  onComplete,
}) => {
  const session = useGameStore((state) => state.currentSession);
  const performLesson = useGameStore((state) => state.performLesson);
  const performBondLesson = useGameStore((state) => state.performBondLesson);
  const performRest = useGameStore((state) => state.performRest);
  const performBusiness = useGameStore((state) => state.performBusiness);
  const advanceWeek = useGameStore((state) => state.advanceWeek);
  const purchaseFacility = useGameStore((state) => state.purchaseFacility);
  const upgradeFacility = useGameStore((state) => state.upgradeFacility);
  const getTotalFacilityLevel = useGameStore((state) => state.getTotalFacilityLevel);
  const endTraining = useGameStore((state) => state.endTraining);
  const triggerBondEvent = useGameStore((state) => state.triggerBondEvent);
  const completeBondEvent = useGameStore((state) => state.completeBondEvent);
  const processEventChoice = useGameStore((state) => state.processEventChoice);
  const setCurrentEvent = useGameStore((state) => state.setCurrentEvent);
  const addCard = useGameStore((state) => state.addCard);
  const checkScenarioEvent = useGameStore((state) => state.checkScenarioEvent);
  const setScenarioFlag = useGameStore((state) => state.setScenarioFlag);
  const checkRareSkillAcquisition = useGameStore((state) => state.checkRareSkillAcquisition);
  const acquireRareSkill = useGameStore((state) => state.acquireRareSkill);

  const [activeTab, setActiveTab] = useState<ActionTab>('lesson');
  const [rareSkillAcquired, setRareSkillAcquired] = useState<CardType | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showCardGaugeModal, setShowCardGaugeModal] = useState(false);
  const [cardChoices, setCardChoices] = useState<CardType[]>([]);
  const [bondEffectData, setBondEffectData] = useState<{
    characterName: string;
    statGain: number;
    styleName: string;
    bondGain: number;
  } | null>(null);

  if (!session) {
    return <div>育成セッションがありません</div>;
  }

  const {
    character,
    currentWeek,
    maxWeeks,
    gold,
    fame,
    facilities,
    supportDeck,
    cardGauge,
    trainingParticipants,
    trainingPositions,
    currentInjury,
    currentEvent,
  } = session;

  const totalFacilityLevel = getTotalFacilityLevel();

  // オーディションチェック
  const currentAudition = getAuditionByWeek(currentWeek);

  // 利用可能なアクション
  const availableLessons = getAvailableLessons(totalFacilityLevel);
  const availableBusinesses = getAvailableBusinessActions(fame);
  const availableBondLessons = getAvailableBondLessons(supportDeck, trainingParticipants);

  // カードゲージ満タンチェック
  useEffect(() => {
    if (cardGauge.current >= cardGauge.max && !showCardGaugeModal) {
      const choices = generateCardChoices(character.rank, 3);
      setCardChoices(choices);
      setShowCardGaugeModal(true);
    }
  }, [cardGauge.current, cardGauge.max]);

  // シナリオイベントチェック（週の開始時）
  useEffect(() => {
    if (currentEvent) return;

    const scenarioEvent = checkScenarioEvent();
    if (scenarioEvent) {
      setCurrentEvent(scenarioEvent);
    }
  }, [currentWeek]);

  // キズナイベントトリガーチェック
  useEffect(() => {
    if (currentEvent) return;

    supportDeck.forEach((support) => {
      if (!support.bondEvents) return;

      if (support.bondLevel >= BOND_THRESHOLDS.EVENT_3 && !support.bondProgress.event3Cleared) {
        triggerBondEvent(support.character.id, 3);
      } else if (support.bondLevel >= BOND_THRESHOLDS.EVENT_2 && !support.bondProgress.event2Cleared) {
        triggerBondEvent(support.character.id, 2);
      } else if (support.bondLevel >= BOND_THRESHOLDS.EVENT_1 && !support.bondProgress.event1Cleared) {
        triggerBondEvent(support.character.id, 1);
      }
    });
  }, [supportDeck]);

  // レアスキル獲得チェック（絆100到達時）
  useEffect(() => {
    if (currentEvent || rareSkillAcquired) return;

    const availableSkills = checkRareSkillAcquisition();
    if (availableSkills.length > 0) {
      // 最初の獲得可能なスキルを取得
      const acquired = acquireRareSkill(availableSkills[0].characterId);
      if (acquired) {
        setRareSkillAcquired(acquired);
      }
    }
  }, [supportDeck, currentEvent, rareSkillAcquired]);

  const handleLessonAction = (lesson: LessonAction) => {
    const baseEffect = Math.floor(
      Math.random() * (lesson.baseEffect.max - lesson.baseEffect.min + 1) +
        lesson.baseEffect.min
    );
    // この練習に配置されているサポートを取得
    const lessonPositions = trainingPositions?.[lesson.id as keyof TrainingPositions] || [];
    const participatingSupports = supportDeck
      .filter(s => lessonPositions.includes(s.character.id))
      .map(s => s.character.id);

    performLesson(
      lesson.targetStyle as Style | 'all',
      baseEffect,
      lesson.baseFatigue,
      participatingSupports,
      lesson.id,
      lesson.baseInjuryRate
    );
    advanceWeek();
    setSelectedAction(null);
  };

  // 絆練習エフェクト完了時の処理
  const [pendingBondLesson, setPendingBondLesson] = useState<{
    bondLesson: BondLessonAction;
    baseEffect: number;
  } | null>(null);

  const handleBondLessonAction = (bondLesson: BondLessonAction) => {
    const baseEffect = Math.floor(
      Math.random() * (bondLesson.baseEffect.max - bondLesson.baseEffect.min + 1) +
        bondLesson.baseEffect.min
    );

    // Find the support character to get the name
    const support = supportDeck.find(s => s.character.id === bondLesson.supportCharacterId);
    const characterName = support?.character.name || 'キャラクター';

    // Store pending lesson and show effect
    setPendingBondLesson({ bondLesson, baseEffect });
    setBondEffectData({
      characterName,
      statGain: baseEffect,
      styleName: getStyleName(bondLesson.targetStyle),
      bondGain: bondLesson.bondBonus,
    });
  };

  const handleBondEffectComplete = () => {
    if (pendingBondLesson) {
      const { bondLesson, baseEffect } = pendingBondLesson;
      performBondLesson(
        bondLesson.supportCharacterId,
        bondLesson.targetStyle,
        baseEffect,
        bondLesson.bondBonus,
        bondLesson.baseFatigue
      );
      advanceWeek();
      setSelectedAction(null);
      setPendingBondLesson(null);
    }
    setBondEffectData(null);
  };

  const handleRestAction = (rest: RestAction) => {
    const fatigueRecovery = Math.floor(
      Math.random() * (rest.fatigueRecovery.max - rest.fatigueRecovery.min + 1) +
        rest.fatigueRecovery.min
    );
    performRest(fatigueRecovery, rest.healthRecovery);
    advanceWeek();
    setSelectedAction(null);
  };

  const handleBusinessAction = (business: BusinessAction) => {
    const goldReward = Math.floor(
      Math.random() * (business.goldReward.max - business.goldReward.min + 1) +
        business.goldReward.min
    );
    performBusiness(goldReward, business.fameReward, business.motivationReward);
    advanceWeek();
    setSelectedAction(null);
  };

  const handleFacilityAction = (facilityId: string, action: 'buy' | 'upgrade') => {
    if (action === 'buy') {
      purchaseFacility(facilityId);
    } else {
      upgradeFacility(facilityId);
    }
  };

  const handleEventChoice = (choice: EventChoice) => {
    if (!currentEvent) return;

    // 絆イベントの場合
    const bondEventMatch = currentEvent.id.match(/^(.+)_bond_(\d)$/);
    if (bondEventMatch) {
      const [, characterId, eventIndexStr] = bondEventMatch;
      const eventIndex = parseInt(eventIndexStr, 10);
      completeBondEvent(characterId, eventIndex, choice.id);
    } else {
      // シナリオイベントの場合はunlockFlagをセット
      if (currentEvent.eventType === 'scenario') {
        const scenarioEvent = currentEvent as typeof currentEvent & { unlockFlag?: string };
        if (scenarioEvent.unlockFlag) {
          setScenarioFlag(scenarioEvent.unlockFlag, true);
        }
      }
      processEventChoice(choice);
    }
  };

  const handleCardSelect = (card: CardType) => {
    addCard(card);
    setShowCardGaugeModal(false);
    // カードゲージをリセット（ストア側で処理）
    useGameStore.setState((state) => ({
      currentSession: state.currentSession ? {
        ...state.currentSession,
        cardGauge: {
          current: 0,
          max: state.currentSession.cardGauge.max,
          pendingCards: [],
        },
      } : null,
    }));
  };

  const handleEndTraining = () => {
    endTraining();
    onComplete();
  };

  // 育成終了チェック
  if (currentWeek > maxWeeks) {
    // エンディングタイプを判定
    const endingType = determineEndingType(
      character.rank,
      session.scenario.flags,
      fame
    );

    // 最も高いスタイルを取得
    const getBestStyle = (stats: CharacterStats): Style => {
      const styles: Style[] = ['cool', 'elegant', 'cute', 'clever', 'passion'];
      return styles.reduce((best, style) =>
        stats[style] > stats[best] ? style : best
      );
    };
    const bestStyle = getBestStyle(character.stats);

    // エンディングメッセージ
    const endingMessages: Record<string, { title: string; message: string; color: string }> = {
      true: {
        title: 'TRUE END - 頂点のステージ',
        message: '全ての努力が実を結び、最高のアイドルが誕生した！',
        color: '#fbbf24',
      },
      good: {
        title: 'GOOD END - 輝くステージ',
        message: '素晴らしいアイドルに成長した！これからも更なる高みを目指そう。',
        color: '#4ade80',
      },
      normal: {
        title: 'NORMAL END - 新たな一歩',
        message: 'アイドルとしての道を歩み始めた。まだまだこれからだ！',
        color: '#60a5fa',
      },
      bad: {
        title: 'BAD END - 再挑戦',
        message: '今回は上手くいかなかったが、諦めなければ道は開ける。',
        color: '#94a3b8',
      },
    };
    const ending = endingMessages[endingType];

    // 総合ステータス
    const totalStats = Object.values(character.stats).reduce((a, b) => a + b, 0);

    return (
      <div className="training-complete">
        <div className="training-complete__ending" style={{ borderColor: ending.color }}>
          <h2 style={{ color: ending.color }}>{ending.title}</h2>
          <p className="training-complete__message">{ending.message}</p>
        </div>

        <div className="training-complete__character">
          <h3>{character.name}</h3>
          <div className="training-complete__rank" data-rank={character.rank}>
            {character.rank}
          </div>
        </div>

        <div className="training-complete__stats-summary">
          <div className="training-complete__stats-grid">
            <StatDisplay stats={character.stats} rank={character.rank} />
          </div>
          <div className="training-complete__stats-info">
            <div className="training-complete__stat-item">
              <span className="label">総合ステータス</span>
              <span className="value">{totalStats}</span>
            </div>
            <div className="training-complete__stat-item">
              <span className="label">得意スタイル</span>
              <span className="value">{getStyleName(bestStyle)}</span>
            </div>
            <div className="training-complete__stat-item">
              <span className="label">獲得名声</span>
              <span className="value">{fame}</span>
            </div>
            <div className="training-complete__stat-item">
              <span className="label">取得カード</span>
              <span className="value">{character.cards.length}枚</span>
            </div>
          </div>
        </div>

        <div className="training-complete__actions">
          <Button onClick={handleEndTraining}>結果を保存してホームへ</Button>
        </div>
      </div>
    );
  }

  // イベント発生中
  if (currentEvent) {
    return (
      <EventDialog
        event={currentEvent}
        onChoiceSelect={handleEventChoice}
      />
    );
  }

  // オーディション発生
  if (currentAudition) {
    return (
      <div className="training-audition">
        <h2>{currentAudition.name}</h2>
        <p>第{currentWeek}週 - オーディションに挑戦！</p>
        <div className="training-audition__info">
          <p>難易度: {currentAudition.difficulty}</p>
          <p>賞金: {currentAudition.goldReward}G</p>
        </div>
        <Button onClick={onBattle}>挑戦する</Button>
      </div>
    );
  }

  // 設備による怪我率軽減を取得
  const getInjuryReduction = () => {
    const medicalRoom = facilities.find((f) => f.facilityId === 'medical_room');
    if (!medicalRoom) return 0;
    const facility = FACILITIES.find((f) => f.id === 'medical_room');
    const effect = facility?.effects.find((e) => e.type === 'injury_reduction');
    return effect ? effect.valuePerLevel * medicalRoom.level : 0;
  };

  const renderLessonTab = () => (
    <div className="training-actions__grid">
      {availableLessons.map((lesson) => {
        // この練習に配置されているサポートを取得
        const lessonPositions = trainingPositions?.[lesson.id as keyof TrainingPositions] || [];
        const participatingSupports = supportDeck.filter(
          s => lessonPositions.includes(s.character.id)
        );

        // タッグボーナスを計算
        const { bonus: tagBonus } = trainingPositions
          ? calculateTagBonus(lesson.id, trainingPositions, supportDeck)
          : { bonus: 0 };

        // 怪我率を計算
        const injuryRate = calculateInjuryRate(
          lesson.baseInjuryRate,
          character.condition.fatigue,
          getInjuryReduction()
        );
        const injuryColor = getInjuryRateColor(injuryRate);

        return (
          <Card
            key={lesson.id}
            onClick={() => setSelectedAction(lesson.id)}
            selected={selectedAction === lesson.id}
          >
            <div className="training-action">
              <div className="training-action__header-row">
                <strong>{lesson.name}</strong>
                {tagBonus > 0 && (
                  <span className="training-action__tag-bonus">タッグ+{tagBonus}%</span>
                )}
              </div>
              <span className="training-action__style">
                {lesson.targetStyle === 'all' ? '全スタイル' : getStyleName(lesson.targetStyle as Style)}
              </span>
              <span className="training-action__effect">
                効果: {lesson.baseEffect.min}〜{lesson.baseEffect.max}
              </span>
              <div className="training-action__row">
                <span className="training-action__fatigue">
                  疲労: +{lesson.baseFatigue}
                </span>
                <span
                  className="training-action__injury"
                  style={{ color: injuryColor }}
                  title={`基礎${lesson.baseInjuryRate}% + 疲労補正`}
                >
                  怪我率: {injuryRate}%
                </span>
              </div>
              {participatingSupports.length > 0 && (
                <div className="training-action__supports">
                  {participatingSupports.map(s => (
                    <span
                      key={s.character.id}
                      className={`support-icon ${s.bondLevel >= (s.bonus.friendshipThreshold || BOND_THRESHOLDS.FRIENDSHIP) ? 'friendship' : ''}`}
                      title={`${s.character.name} (絆${s.bondLevel})`}
                    >
                      {s.character.name.charAt(0)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderBondTab = () => (
    <div className="training-actions__grid">
      {availableBondLessons.length === 0 ? (
        <div className="training-actions__empty">
          <p>キズナ練習はまだ利用できません</p>
          <p className="training-actions__hint">
            サポートキャラの絆レベルを{BOND_THRESHOLDS.FRIENDSHIP}以上にすると解禁されます
          </p>
        </div>
      ) : (
        availableBondLessons.map((bondLesson) => {
          const support = supportDeck.find(s => s.character.id === bondLesson.supportCharacterId);
          if (!support) return null;

          return (
            <Card
              key={bondLesson.id}
              onClick={() => setSelectedAction(bondLesson.id)}
              selected={selectedAction === bondLesson.id}
            >
              <div className="training-action training-action--bond">
                <div className="training-action__header">
                  <span className="support-icon large">{support.character.name.charAt(0)}</span>
                  <strong>{bondLesson.name}</strong>
                </div>
                <span className="training-action__style bond">
                  {getStyleName(bondLesson.targetStyle)} (友情)
                </span>
                <span className="training-action__effect">
                  効果: {bondLesson.baseEffect.min}〜{bondLesson.baseEffect.max} (x{bondLesson.friendshipMultiplier})
                </span>
                <span className="training-action__bond-bonus">
                  絆: +{bondLesson.bondBonus}
                </span>
                <span className="training-action__fatigue">
                  疲労: +{bondLesson.baseFatigue}
                </span>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );

  const renderRestTab = () => (
    <div className="training-actions__grid">
      {REST_ACTIONS.map((rest) => (
        <Card
          key={rest.id}
          onClick={() => setSelectedAction(rest.id)}
          selected={selectedAction === rest.id}
        >
          <div className="training-action">
            <strong>{rest.name}</strong>
            <span className="training-action__effect">
              疲労回復: {rest.fatigueRecovery.min}〜{rest.fatigueRecovery.max}
            </span>
            <span className="training-action__health">
              体調: +{rest.healthRecovery}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderBusinessTab = () => (
    <div className="training-actions__grid">
      {availableBusinesses.map((business) => (
        <Card
          key={business.id}
          onClick={() => setSelectedAction(business.id)}
          selected={selectedAction === business.id}
        >
          <div className="training-action">
            <strong>{business.name}</strong>
            <span className="training-action__gold">
              収入: {business.goldReward.min}〜{business.goldReward.max}G
            </span>
            <span className="training-action__fame">
              知名度: +{business.fameReward}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderFacilityTab = () => (
    <div className="training-actions__grid">
      {FACILITIES.map((facility) => {
        const owned = facilities.find((f) => f.facilityId === facility.id);
        const currentLevel = owned?.level || 0;
        const upgradeCost =
          currentLevel < facility.maxLevel
            ? calculateFacilityUpgradeCost(facility, currentLevel)
            : -1;
        const canAfford = upgradeCost > 0 && gold >= upgradeCost;

        return (
          <Card key={facility.id}>
            <div className="training-facility">
              <div className="training-facility__header">
                <strong>{facility.name}</strong>
                <span className="training-facility__level">
                  Lv.{currentLevel}/{facility.maxLevel}
                </span>
              </div>
              <p className="training-facility__desc">{facility.description}</p>
              {currentLevel < facility.maxLevel ? (
                <Button
                  size="small"
                  onClick={() =>
                    handleFacilityAction(
                      facility.id,
                      currentLevel === 0 ? 'buy' : 'upgrade'
                    )
                  }
                  disabled={!canAfford}
                >
                  {currentLevel === 0 ? '購入' : '強化'} ({upgradeCost}G)
                </Button>
              ) : (
                <span className="training-facility__max">MAX</span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );

  const executeSelectedAction = () => {
    if (!selectedAction) return;

    // キズナ練習
    const bondLesson = availableBondLessons.find((bl) => bl.id === selectedAction);
    if (bondLesson) {
      handleBondLessonAction(bondLesson);
      return;
    }

    const lesson = LESSON_ACTIONS.find((l) => l.id === selectedAction);
    if (lesson) {
      handleLessonAction(lesson);
      return;
    }

    const rest = REST_ACTIONS.find((r) => r.id === selectedAction);
    if (rest) {
      handleRestAction(rest);
      return;
    }

    const business = BUSINESS_ACTIONS.find((b) => b.id === selectedAction);
    if (business) {
      handleBusinessAction(business);
      return;
    }
  };

  return (
    <div className="training-screen">
      {/* 絆練習エフェクト */}
      {bondEffectData && (
        <BondTrainingEffect
          characterName={bondEffectData.characterName}
          statGain={bondEffectData.statGain}
          styleName={bondEffectData.styleName}
          bondGain={bondEffectData.bondGain}
          onComplete={handleBondEffectComplete}
        />
      )}

      {/* カードゲージ満タンモーダル */}
      {showCardGaugeModal && (
        <Modal isOpen={showCardGaugeModal} onClose={() => {}}>
          <div className="card-gauge-modal">
            <h2>カード獲得！</h2>
            <p>ゲージが満タンになりました。1枚選んでください。</p>
            <div className="card-gauge-modal__choices">
              {cardChoices.map((card, index) => (
                <div
                  key={index}
                  className="card-choice"
                  onClick={() => handleCardSelect(card)}
                >
                  <div className={`card-choice__style ${card.style}`}>
                    {getStyleName(card.style)}
                  </div>
                  <h3>{card.name}</h3>
                  <p>{card.description}</p>
                  <div className="card-choice__stats">
                    <span>コスト: {card.cost}</span>
                    <span>必要ランク: {card.requiredRank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* レアスキル（金特）獲得モーダル */}
      {rareSkillAcquired && (
        <Modal isOpen={!!rareSkillAcquired} onClose={() => setRareSkillAcquired(null)}>
          <div className="rare-skill-modal">
            <div className="rare-skill-modal__icon">
              <span>金</span>
            </div>
            <h2>レアスキル獲得！</h2>
            <div className="rare-skill-modal__card">
              <div className={`card-choice__style ${rareSkillAcquired.style}`}>
                {getStyleName(rareSkillAcquired.style)}
              </div>
              <h3>{rareSkillAcquired.name}</h3>
              <p>{rareSkillAcquired.description}</p>
              <div className="card-choice__stats">
                <span>コスト: {rareSkillAcquired.cost}</span>
                <span>必要ランク: {rareSkillAcquired.requiredRank}</span>
              </div>
            </div>
            <Button onClick={() => setRareSkillAcquired(null)}>OK</Button>
          </div>
        </Modal>
      )}

      <div className="training-screen__header">
        <div className="training-screen__week">
          第{currentWeek}週 / {maxWeeks}週
        </div>
        <div className="training-screen__resources">
          <span className="training-screen__gold">{gold}G</span>
          <span className="training-screen__fame">知名度: {fame}</span>
        </div>
      </div>

      <div className="training-screen__main">
        <div className="training-screen__left">
          {/* ステータス */}
          <div className="training-screen__status">
            <Card title={character.name}>
              <StatDisplay stats={character.stats} rank={character.rank} />
            </Card>

            <Card title="コンディション">
              <div className="training-condition">
                <ProgressBar
                  label="体調"
                  value={character.condition.health}
                  max={100}
                  color="green"
                />
                <ProgressBar
                  label="疲労"
                  value={character.condition.fatigue}
                  max={100}
                  color="red"
                />
                <ProgressBar
                  label="やる気"
                  value={character.condition.motivation}
                  max={100}
                  color="yellow"
                />
                <ProgressBar
                  label="メンタル"
                  value={character.condition.mental}
                  max={100}
                  color="purple"
                />
                {currentInjury && (
                  <div className="training-injury-status">
                    <span className="injury-icon">🩹</span>
                    <span className="injury-name">{INJURY_TYPES[currentInjury.type].name}</span>
                    <span className="injury-remaining">残り{currentInjury.remainingWeeks}週</span>
                  </div>
                )}
              </div>
            </Card>

            {/* カードゲージ */}
            <Card title="カードゲージ">
              <ProgressBar
                label="ゲージ"
                value={cardGauge.current}
                max={cardGauge.max}
                color="cyan"
              />
              <p className="card-gauge-hint">
                {cardGauge.current >= cardGauge.max
                  ? '満タン！カードを獲得できます'
                  : `あと${cardGauge.max - cardGauge.current}で獲得`}
              </p>
            </Card>
          </div>

          {/* サポートデッキ */}
          <Card title="サポート">
            <div className="support-deck-panel">
              {supportDeck.map((support) => {
                const isInTraining = trainingParticipants.includes(support.character.id);
                const canBondLesson = support.bondLevel >= (support.bonus.friendshipThreshold || BOND_THRESHOLDS.FRIENDSHIP);

                return (
                  <div
                    key={support.character.id}
                    className={`support-card ${isInTraining ? 'active' : ''} ${canBondLesson ? 'friendship' : ''}`}
                  >
                    <div className="support-card__icon">
                      {support.character.name.charAt(0)}
                    </div>
                    <div className="support-card__info">
                      <span className="support-card__name">{support.character.name}</span>
                      <ProgressBar
                        value={support.bondLevel}
                        max={100}
                        color="pink"
                        showValue={false}
                      />
                      <span className="support-card__bond">絆: {support.bondLevel}</span>
                    </div>
                    <div className="support-card__style">
                      {getStyleName(support.bonus.specialtyStyle)}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="training-screen__actions">
          <div className="training-tabs">
            <button
              className={`training-tab ${activeTab === 'lesson' ? 'active' : ''}`}
              onClick={() => setActiveTab('lesson')}
            >
              レッスン
            </button>
            <button
              className={`training-tab ${activeTab === 'bond' ? 'active' : ''} ${availableBondLessons.length > 0 ? 'highlight' : ''}`}
              onClick={() => setActiveTab('bond')}
            >
              キズナ練習
              {availableBondLessons.length > 0 && (
                <span className="tab-badge">{availableBondLessons.length}</span>
              )}
            </button>
            <button
              className={`training-tab ${activeTab === 'rest' ? 'active' : ''}`}
              onClick={() => setActiveTab('rest')}
            >
              休息
            </button>
            <button
              className={`training-tab ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              営業
            </button>
            <button
              className={`training-tab ${activeTab === 'facility' ? 'active' : ''}`}
              onClick={() => setActiveTab('facility')}
            >
              設備
            </button>
          </div>

          <div className="training-actions__content">
            {activeTab === 'lesson' && renderLessonTab()}
            {activeTab === 'bond' && renderBondTab()}
            {activeTab === 'rest' && renderRestTab()}
            {activeTab === 'business' && renderBusinessTab()}
            {activeTab === 'facility' && renderFacilityTab()}
          </div>

          {activeTab !== 'facility' && selectedAction && (
            <div className="training-actions__execute">
              <Button onClick={executeSelectedAction} fullWidth>
                実行する
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
