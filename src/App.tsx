import React, { useState } from 'react';
import { TitleScreen, MainMenu } from './screens';
import { CharacterCreation } from './components/character';
import { DeckSelection } from './components/deck';
import { TrainingScreen } from './components/training';
import { BattleScreen } from './components/battle';
import { useGameStore } from './store';
import { EditCharacter, SupportCharacter } from './types';
import './App.css';

type GameScreen =
  | 'title'
  | 'menu'
  | 'character_creation'
  | 'deck_selection'
  | 'training'
  | 'battle';

function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('title');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  const editCharacters = useGameStore((state) => state.editCharacters);
  const startTraining = useGameStore((state) => state.startTraining);
  const currentSession = useGameStore((state) => state.currentSession);
  const startBattle = useGameStore((state) => state.startBattle);

  const handleStartGame = () => {
    setCurrentScreen('menu');
  };

  const handleCreateCharacter = () => {
    setCurrentScreen('character_creation');
  };

  const handleCharacterCreationComplete = () => {
    setCurrentScreen('menu');
  };

  const handleStartTraining = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setCurrentScreen('deck_selection');
  };

  const handleDeckSelectionConfirm = (supportDeck: SupportCharacter[]) => {
    const character = editCharacters.find((c) => c.id === selectedCharacterId);
    if (character) {
      startTraining(character, supportDeck);
      setCurrentScreen('training');
    }
  };

  const handleBattle = () => {
    // オーディションレベルに基づいてバトル開始
    const auditionLevel = currentSession
      ? Math.ceil(currentSession.currentWeek / 12)
      : 1;
    startBattle(auditionLevel);
    setCurrentScreen('battle');
  };

  const handleBattleComplete = () => {
    setCurrentScreen('training');
  };

  const handleTrainingComplete = () => {
    setSelectedCharacterId(null);
    setCurrentScreen('menu');
  };

  const handleViewCharacter = (characterId: string) => {
    // 将来的に詳細画面を実装
    console.log('View character:', characterId);
  };

  return (
    <div className="app">
      {currentScreen === 'title' && (
        <TitleScreen onStart={handleStartGame} />
      )}

      {currentScreen === 'menu' && (
        <MainMenu
          onCreateCharacter={handleCreateCharacter}
          onStartTraining={handleStartTraining}
          onViewCharacter={handleViewCharacter}
        />
      )}

      {currentScreen === 'character_creation' && (
        <CharacterCreation
          onComplete={handleCharacterCreationComplete}
          onCancel={() => setCurrentScreen('menu')}
        />
      )}

      {currentScreen === 'deck_selection' && selectedCharacterId && (
        <DeckSelection
          selectedCharacter={
            editCharacters.find((c) => c.id === selectedCharacterId)!
          }
          onConfirm={handleDeckSelectionConfirm}
          onCancel={() => setCurrentScreen('menu')}
        />
      )}

      {currentScreen === 'training' && (
        <TrainingScreen
          onBattle={handleBattle}
          onComplete={handleTrainingComplete}
        />
      )}

      {currentScreen === 'battle' && (
        <BattleScreen onComplete={handleBattleComplete} />
      )}
    </div>
  );
}

export default App;
