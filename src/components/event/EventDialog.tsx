import React, { useState } from 'react';
import { Button, Card, Modal } from '../ui';
import { GameEvent, EventChoice } from '../../types';
import './EventDialog.css';

interface EventDialogProps {
  event: GameEvent;
  onChoiceSelect: (choice: EventChoice) => void;
  onClose?: () => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({
  event,
  onChoiceSelect,
  onClose,
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [showChoices, setShowChoices] = useState(false);

  const handleAdvanceDialogue = () => {
    if (currentDialogueIndex < event.dialogue.length - 1) {
      setCurrentDialogueIndex(currentDialogueIndex + 1);
    } else {
      setShowChoices(true);
    }
  };

  const handleChoiceClick = (choice: EventChoice) => {
    onChoiceSelect(choice);
  };

  const renderEffectPreview = (choice: EventChoice) => {
    return choice.effects.map((effect, index) => {
      let text = '';
      let colorClass = '';

      switch (effect.type) {
        case 'stats':
          text = `${effect.target} ${effect.value > 0 ? '+' : ''}${effect.value}`;
          colorClass = effect.value > 0 ? 'positive' : 'negative';
          break;
        case 'condition':
          const conditionNames: Record<string, string> = {
            motivation: 'やる気',
            fatigue: '疲労',
            health: '体調',
            mental: 'メンタル',
          };
          text = `${conditionNames[effect.target || ''] || effect.target} ${effect.value > 0 ? '+' : ''}${effect.value}`;
          colorClass = effect.target === 'fatigue'
            ? (effect.value > 0 ? 'negative' : 'positive')
            : (effect.value > 0 ? 'positive' : 'negative');
          break;
        case 'bond':
          text = `絆 +${effect.value}`;
          colorClass = 'positive';
          break;
        case 'gold':
          text = `${effect.value}G`;
          colorClass = effect.value > 0 ? 'positive' : 'negative';
          break;
        case 'card_gauge':
          text = `カードゲージ +${effect.value}`;
          colorClass = 'positive';
          break;
        default:
          return null;
      }

      return (
        <span key={index} className={`event-effect ${colorClass}`}>
          {text}
        </span>
      );
    });
  };

  return (
    <div className="event-dialog-overlay">
      <div className="event-dialog">
        <div className="event-dialog__header">
          <span className="event-dialog__type">
            {event.eventType === 'bond' ? 'キズナイベント' :
             event.eventType === 'story' ? 'ストーリー' :
             event.eventType === 'scenario' ? 'シナリオ' : 'イベント'}
          </span>
          <h2 className="event-dialog__title">{event.name}</h2>
        </div>

        <div className="event-dialog__content">
          {!showChoices ? (
            <div
              className="event-dialog__dialogue"
              onClick={handleAdvanceDialogue}
            >
              <div className="event-dialogue__text">
                {event.dialogue[currentDialogueIndex]}
              </div>
              <div className="event-dialogue__indicator">
                {currentDialogueIndex < event.dialogue.length - 1
                  ? 'クリックで続く...'
                  : 'クリックで選択肢へ'}
              </div>
              <div className="event-dialogue__progress">
                {currentDialogueIndex + 1} / {event.dialogue.length}
              </div>
            </div>
          ) : (
            <div className="event-dialog__choices">
              <p className="event-choices__prompt">どうする？</p>
              {event.choices.map((choice) => (
                <button
                  key={choice.id}
                  className="event-choice"
                  onClick={() => handleChoiceClick(choice)}
                >
                  <span className="event-choice__text">{choice.text}</span>
                  <div className="event-choice__effects">
                    {renderEffectPreview(choice)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {onClose && (
          <button className="event-dialog__close" onClick={onClose}>
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
