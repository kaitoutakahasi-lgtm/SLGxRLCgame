import React, { useState } from 'react';
import { Button, Card, Modal } from '../ui';
import { useGameStore } from '../../store';
import { getStyleName } from '../../data';
import { Card as CardType, Style, SupportCharacter, TrainedCharacter } from '../../types';
import './DeckEditor.css';

interface DeckEditorProps {
  onClose: () => void;
}

interface SavedDeck {
  id: string;
  name: string;
  supportIds: string[];
  createdAt: number;
}

const STYLE_COLORS: Record<Style, string> = {
  cool: '#3b82f6',
  elegant: '#a855f7',
  cute: '#ec4899',
  clever: '#22c55e',
  passion: '#f97316',
};

export const DeckEditor: React.FC<DeckEditorProps> = ({ onClose }) => {
  const trainedCharacters = useGameStore((state) => state.trainedCharacters);

  // ローカルストレージからデッキを読み込み
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => {
    const saved = localStorage.getItem('idol-game-decks');
    return saved ? JSON.parse(saved) : [];
  });

  const [editingDeck, setEditingDeck] = useState<SavedDeck | null>(null);
  const [deckName, setDeckName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // デッキを保存
  const saveDeck = (deck: SavedDeck) => {
    const updatedDecks = savedDecks.some((d) => d.id === deck.id)
      ? savedDecks.map((d) => (d.id === deck.id ? deck : d))
      : [...savedDecks, deck];
    setSavedDecks(updatedDecks);
    localStorage.setItem('idol-game-decks', JSON.stringify(updatedDecks));
  };

  // デッキを削除
  const deleteDeck = (deckId: string) => {
    const updatedDecks = savedDecks.filter((d) => d.id !== deckId);
    setSavedDecks(updatedDecks);
    localStorage.setItem('idol-game-decks', JSON.stringify(updatedDecks));
    setShowDeleteConfirm(null);
  };

  // 新規デッキ作成開始
  const startNewDeck = () => {
    setEditingDeck({
      id: `deck_${Date.now()}`,
      name: '',
      supportIds: [],
      createdAt: Date.now(),
    });
    setDeckName('');
    setSelectedIds([]);
  };

  // 既存デッキ編集開始
  const startEditDeck = (deck: SavedDeck) => {
    setEditingDeck(deck);
    setDeckName(deck.name);
    setSelectedIds([...deck.supportIds]);
  };

  // キャラクター選択/解除
  const toggleCharacter = (characterId: string) => {
    if (selectedIds.includes(characterId)) {
      setSelectedIds(selectedIds.filter((id) => id !== characterId));
    } else if (selectedIds.length < 6) {
      setSelectedIds([...selectedIds, characterId]);
    }
  };

  // デッキ保存
  const handleSaveDeck = () => {
    if (!editingDeck || !deckName.trim() || selectedIds.length === 0) return;

    saveDeck({
      ...editingDeck,
      name: deckName.trim(),
      supportIds: selectedIds,
    });
    setEditingDeck(null);
    setDeckName('');
    setSelectedIds([]);
  };

  // 編集キャンセル
  const handleCancel = () => {
    setEditingDeck(null);
    setDeckName('');
    setSelectedIds([]);
  };

  // キャラクター名取得
  const getCharacterName = (characterId: string): string => {
    const character = trainedCharacters.find((c) => c.id === characterId);
    return character?.name || 'Unknown';
  };

  // 編集モード
  if (editingDeck) {
    return (
      <div className="deck-editor">
        <div className="deck-editor__header">
          <h2>{editingDeck.createdAt === Date.now() ? '新規デッキ作成' : 'デッキ編集'}</h2>
          <Button variant="secondary" size="small" onClick={handleCancel}>
            キャンセル
          </Button>
        </div>

        <div className="deck-editor__name">
          <label>デッキ名</label>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="デッキ名を入力..."
            maxLength={20}
          />
        </div>

        <div className="deck-editor__selection">
          <h3>サポートキャラ選択 ({selectedIds.length}/6)</h3>
          <div className="deck-editor__selected">
            {Array.from({ length: 6 }).map((_, index) => {
              const characterId = selectedIds[index];
              const character = characterId
                ? trainedCharacters.find((c) => c.id === characterId)
                : null;

              return (
                <div
                  key={index}
                  className={`deck-editor__slot ${character ? 'filled' : ''}`}
                  onClick={() => character && toggleCharacter(character.id)}
                >
                  {character ? (
                    <div className="deck-editor__slot-content">
                      <span
                        className="deck-editor__slot-icon"
                        style={{ backgroundColor: STYLE_COLORS[character.bestStyle] }}
                      >
                        {character.name.charAt(0)}
                      </span>
                      <span className="deck-editor__slot-name">{character.name}</span>
                      <span className="deck-editor__slot-rank">{character.finalRank}</span>
                    </div>
                  ) : (
                    <span className="deck-editor__slot-empty">空きスロット</span>
                  )}
                </div>
              );
            })}
          </div>

          <h3>育成済みキャラクター</h3>
          {trainedCharacters.length === 0 ? (
            <div className="deck-editor__empty">
              <p>育成済みのキャラクターがいません</p>
              <p>育成を完了するとここに表示されます</p>
            </div>
          ) : (
            <div className="deck-editor__characters">
              {trainedCharacters.map((character) => {
                const isSelected = selectedIds.includes(character.id);
                const canSelect = !isSelected && selectedIds.length < 6;

                return (
                  <Card
                    key={character.id}
                    onClick={() => (isSelected || canSelect) && toggleCharacter(character.id)}
                    selected={isSelected}
                  >
                    <div className="deck-editor__character">
                      <div
                        className="deck-editor__character-icon"
                        style={{ backgroundColor: STYLE_COLORS[character.bestStyle] }}
                      >
                        {character.name.charAt(0)}
                      </div>
                      <div className="deck-editor__character-info">
                        <strong>{character.name}</strong>
                        <div className="deck-editor__character-stats">
                          <span>ランク: {character.finalRank}</span>
                          <span>得意: {getStyleName(character.bestStyle)}</span>
                        </div>
                      </div>
                      {isSelected && <span className="deck-editor__check"></span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="deck-editor__actions">
          <Button onClick={handleSaveDeck} disabled={!deckName.trim() || selectedIds.length === 0}>
            保存
          </Button>
        </div>
      </div>
    );
  }

  // デッキ一覧モード
  return (
    <div className="deck-editor">
      <div className="deck-editor__header">
        <h2>デッキ管理</h2>
        <Button variant="secondary" size="small" onClick={onClose}>
          閉じる
        </Button>
      </div>

      <div className="deck-editor__list">
        <Button onClick={startNewDeck} fullWidth>
          + 新規デッキ作成
        </Button>

        {savedDecks.length === 0 ? (
          <div className="deck-editor__empty">
            <p>保存されたデッキがありません</p>
            <p>新規デッキを作成してください</p>
          </div>
        ) : (
          <div className="deck-editor__decks">
            {savedDecks.map((deck) => (
              <Card key={deck.id}>
                <div className="deck-editor__deck-item">
                  <div className="deck-editor__deck-header">
                    <strong>{deck.name}</strong>
                    <span className="deck-editor__deck-count">{deck.supportIds.length}キャラ</span>
                  </div>
                  <div className="deck-editor__deck-members">
                    {deck.supportIds.map((id) => {
                      const character = trainedCharacters.find((c) => c.id === id);
                      if (!character) return null;
                      return (
                        <span
                          key={id}
                          className="deck-editor__deck-member"
                          style={{ backgroundColor: STYLE_COLORS[character.bestStyle] }}
                          title={character.name}
                        >
                          {character.name.charAt(0)}
                        </span>
                      );
                    })}
                  </div>
                  <div className="deck-editor__deck-actions">
                    <Button size="small" onClick={() => startEditDeck(deck)}>
                      編集
                    </Button>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => setShowDeleteConfirm(deck.id)}
                    >
                      削除
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)}>
          <div className="deck-editor__confirm">
            <h3>デッキを削除しますか？</h3>
            <p>この操作は取り消せません。</p>
            <div className="deck-editor__confirm-actions">
              <Button variant="secondary" onClick={() => setShowDeleteConfirm(null)}>
                キャンセル
              </Button>
              <Button onClick={() => deleteDeck(showDeleteConfirm)}>削除</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
