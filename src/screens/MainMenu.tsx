import React from 'react';
import { Button, Card } from '../components/ui';
import { useGameStore } from '../store';
import './MainMenu.css';

interface MainMenuProps {
  onCreateCharacter: () => void;
  onStartTraining: (characterId: string) => void;
  onViewCharacter: (characterId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onCreateCharacter,
  onStartTraining,
  onViewCharacter,
}) => {
  const editCharacters = useGameStore((state) => state.editCharacters);
  const trainedCharacters = useGameStore((state) => state.trainedCharacters);
  const totalTrainingCount = useGameStore((state) => state.totalTrainingCount);

  return (
    <div className="main-menu">
      <div className="main-menu__header">
        <h1>メインメニュー</h1>
        <div className="main-menu__stats">
          <span>総育成回数: {totalTrainingCount}</span>
          <span>育成済みキャラ: {trainedCharacters.length}</span>
        </div>
      </div>

      <div className="main-menu__content">
        <div className="main-menu__section">
          <div className="main-menu__section-header">
            <h2>育成を始める</h2>
            <Button size="small" onClick={onCreateCharacter}>
              新規キャラ作成
            </Button>
          </div>

          {editCharacters.length === 0 ? (
            <Card>
              <div className="main-menu__empty">
                <p>キャラクターがいません</p>
                <p>「新規キャラ作成」からオリジナルキャラクターを作成しましょう</p>
              </div>
            </Card>
          ) : (
            <div className="main-menu__character-list">
              {editCharacters.map((character) => (
                <Card key={character.id}>
                  <div className="main-menu__character">
                    <div className="main-menu__character-info">
                      <strong>{character.name}</strong>
                      <span>
                        {character.age}歳 /{' '}
                        {character.gender === 'female'
                          ? '女性'
                          : character.gender === 'male'
                          ? '男性'
                          : 'その他'}
                      </span>
                      <span>{character.agency || '無所属'}</span>
                    </div>
                    <div className="main-menu__character-actions">
                      <Button
                        size="small"
                        onClick={() => onStartTraining(character.id)}
                      >
                        育成開始
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="main-menu__section">
          <h2>育成済みキャラクター</h2>

          {trainedCharacters.length === 0 ? (
            <Card>
              <div className="main-menu__empty">
                <p>育成済みキャラクターがいません</p>
                <p>育成を完了するとここに表示されます</p>
              </div>
            </Card>
          ) : (
            <div className="main-menu__character-list">
              {trainedCharacters.map((character) => (
                <Card
                  key={character.id}
                  onClick={() => onViewCharacter(character.id)}
                >
                  <div className="main-menu__character">
                    <div className="main-menu__character-info">
                      <div className="main-menu__character-name-row">
                        <strong>{character.name}</strong>
                        <span
                          className="main-menu__character-rank"
                          data-rank={character.finalRank}
                        >
                          {character.finalRank}
                        </span>
                      </div>
                      <span>得意: {character.bestStyle}</span>
                      <span>
                        育成日:{' '}
                        {new Date(character.trainedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
