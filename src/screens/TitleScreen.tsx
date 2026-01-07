import React from 'react';
import { Button } from '../components/ui';
import './TitleScreen.css';

interface TitleScreenProps {
  onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="title-screen">
      <div className="title-screen__content">
        <h1 className="title-screen__title">
          <span className="title-screen__title-main">アイドル育成</span>
          <span className="title-screen__title-sub">デッキ構築ゲーム</span>
        </h1>
        <p className="title-screen__description">
          オリジナルアイドルを育成し、ライブバトルで頂点を目指せ！
        </p>
        <div className="title-screen__actions">
          <Button size="large" onClick={onStart}>
            ゲームスタート
          </Button>
        </div>
        <div className="title-screen__version">Version 0.1.0 (Prototype)</div>
      </div>
      <div className="title-screen__background">
        <div className="title-screen__star star-1" />
        <div className="title-screen__star star-2" />
        <div className="title-screen__star star-3" />
        <div className="title-screen__star star-4" />
        <div className="title-screen__star star-5" />
      </div>
    </div>
  );
};
