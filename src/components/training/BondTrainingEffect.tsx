import React, { useEffect, useState, useCallback, useRef } from 'react';
import './BondTrainingEffect.css';

interface BondTrainingEffectProps {
  characterName: string;
  statGain: number;
  styleName: string;
  bondGain: number;
  onComplete: () => void;
}

export const BondTrainingEffect: React.FC<BondTrainingEffectProps> = ({
  characterName,
  statGain,
  styleName,
  bondGain,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'burst' | 'result' | 'fadeout'>('burst');
  const isCompletedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (!isCompletedRef.current) {
      isCompletedRef.current = true;
      onComplete();
    }
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    setPhase('fadeout');
    setTimeout(handleComplete, 300);
  }, [handleComplete]);

  useEffect(() => {
    // Phase 1: Burst animation (0.8s)
    const burstTimer = setTimeout(() => {
      setPhase('result');
    }, 800);

    // Phase 2: Result display (2s)
    const resultTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 2800);

    // Phase 3: Fadeout and cleanup (0.5s)
    const completeTimer = setTimeout(() => {
      handleComplete();
    }, 3300);

    return () => {
      clearTimeout(burstTimer);
      clearTimeout(resultTimer);
      clearTimeout(completeTimer);
    };
  }, [handleComplete]);

  // Generate particles for burst effect
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360;
    const distance = 100 + Math.random() * 150;
    const size = 8 + Math.random() * 12;
    const delay = Math.random() * 0.3;
    const hue = 320 + Math.random() * 40; // Pink to purple range

    return (
      <div
        key={i}
        className="bond-effect__particle"
        style={{
          '--angle': `${angle}deg`,
          '--distance': `${distance}px`,
          '--size': `${size}px`,
          '--delay': `${delay}s`,
          '--hue': hue,
        } as React.CSSProperties}
      />
    );
  });

  // Generate sparkles
  const sparkles = Array.from({ length: 20 }, (_, i) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 1.5;
    const scale = 0.5 + Math.random() * 1;

    return (
      <div
        key={i}
        className="bond-effect__sparkle"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          '--delay': `${delay}s`,
          '--scale': scale,
        } as React.CSSProperties}
      />
    );
  });

  // Generate rings
  const rings = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className="bond-effect__ring"
      style={{
        '--delay': `${i * 0.2}s`,
      } as React.CSSProperties}
    />
  ));

  return (
    <div className={`bond-effect bond-effect--${phase}`} onClick={handleSkip}>
      <div className="bond-effect__overlay" />

      {/* Background particles */}
      <div className="bond-effect__particles">
        {particles}
      </div>

      {/* Sparkles */}
      <div className="bond-effect__sparkles">
        {sparkles}
      </div>

      {/* Central burst */}
      <div className="bond-effect__center">
        {/* Expanding rings */}
        <div className="bond-effect__rings">
          {rings}
        </div>

        {/* Central glow */}
        <div className="bond-effect__glow" />

        {/* Heart icon */}
        <div className="bond-effect__heart">
          <span>💖</span>
        </div>

        {/* Main text */}
        <div className="bond-effect__text">
          <div className="bond-effect__title">絆練習</div>
          <div className="bond-effect__subtitle">BOND TRAINING</div>
        </div>

        {/* Character name */}
        <div className="bond-effect__character">
          {characterName}
        </div>

        {/* Results */}
        <div className="bond-effect__results">
          <div className="bond-effect__stat">
            <span className="bond-effect__stat-label">{styleName}</span>
            <span className="bond-effect__stat-value">+{statGain}</span>
          </div>
          <div className="bond-effect__bond">
            <span className="bond-effect__bond-label">絆</span>
            <span className="bond-effect__bond-value">+{bondGain}</span>
          </div>
        </div>
      </div>

      {/* Skip hint */}
      <div className="bond-effect__skip">
        タップでスキップ
      </div>
    </div>
  );
};
