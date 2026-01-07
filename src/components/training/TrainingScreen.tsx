import React, { useState } from 'react';
import { Button, Card, ProgressBar, StatDisplay, Modal } from '../ui';
import { useGameStore } from '../../store';
import {
  LESSON_ACTIONS,
  REST_ACTIONS,
  BUSINESS_ACTIONS,
  getAvailableLessons,
  getAvailableBusinessActions,
  getAuditionByWeek,
} from '../../data';
import { FACILITIES, calculateFacilityUpgradeCost, getFacilityById } from '../../data/facilities';
import { Style, LessonAction, RestAction, BusinessAction } from '../../types';
import './TrainingScreen.css';

interface TrainingScreenProps {
  onBattle: () => void;
  onComplete: () => void;
}

type ActionTab = 'lesson' | 'rest' | 'business' | 'facility';

export const TrainingScreen: React.FC<TrainingScreenProps> = ({
  onBattle,
  onComplete,
}) => {
  const session = useGameStore((state) => state.currentSession);
  const performLesson = useGameStore((state) => state.performLesson);
  const performRest = useGameStore((state) => state.performRest);
  const performBusiness = useGameStore((state) => state.performBusiness);
  const advanceWeek = useGameStore((state) => state.advanceWeek);
  const purchaseFacility = useGameStore((state) => state.purchaseFacility);
  const upgradeFacility = useGameStore((state) => state.upgradeFacility);
  const getTotalFacilityLevel = useGameStore((state) => state.getTotalFacilityLevel);
  const endTraining = useGameStore((state) => state.endTraining);

  const [activeTab, setActiveTab] = useState<ActionTab>('lesson');
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  if (!session) {
    return <div>育成セッションがありません</div>;
  }

  const { character, currentWeek, maxWeeks, gold, fame, facilities } = session;
  const totalFacilityLevel = getTotalFacilityLevel();

  // オーディションチェック
  const currentAudition = getAuditionByWeek(currentWeek);

  // 利用可能なアクション
  const availableLessons = getAvailableLessons(totalFacilityLevel);
  const availableBusinesses = getAvailableBusinessActions(fame);

  const handleLessonAction = (lesson: LessonAction) => {
    const baseEffect = Math.floor(
      Math.random() * (lesson.baseEffect.max - lesson.baseEffect.min + 1) +
        lesson.baseEffect.min
    );
    performLesson(lesson.targetStyle as Style | 'all', baseEffect, lesson.baseFatigue);
    advanceWeek();
    setSelectedAction(null);
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

  const handleEndTraining = () => {
    endTraining();
    onComplete();
  };

  // 育成終了チェック
  if (currentWeek > maxWeeks) {
    return (
      <div className="training-complete">
        <h2>育成完了！</h2>
        <StatDisplay stats={character.stats} rank={character.rank} />
        <Button onClick={handleEndTraining}>結果を保存</Button>
      </div>
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

  const renderLessonTab = () => (
    <div className="training-actions__grid">
      {availableLessons.map((lesson) => (
        <Card
          key={lesson.id}
          onClick={() => setSelectedAction(lesson.id)}
          selected={selectedAction === lesson.id}
        >
          <div className="training-action">
            <strong>{lesson.name}</strong>
            <span className="training-action__style">
              {lesson.targetStyle === 'all' ? '全スタイル' : lesson.targetStyle}
            </span>
            <span className="training-action__effect">
              効果: {lesson.baseEffect.min}〜{lesson.baseEffect.max}
            </span>
            <span className="training-action__fatigue">
              疲労: +{lesson.baseFatigue}
            </span>
          </div>
        </Card>
      ))}
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
