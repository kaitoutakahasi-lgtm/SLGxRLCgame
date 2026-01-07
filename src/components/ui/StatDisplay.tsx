import React from 'react';
import { Style, Rank } from '../../types';
import './StatDisplay.css';

interface StatDisplayProps {
  stats: Record<Style, number>;
  rank: Rank;
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

export const StatDisplay: React.FC<StatDisplayProps> = ({ stats, rank }) => {
  const total = Object.values(stats).reduce((sum, val) => sum + val, 0);
  const maxStat = Math.max(...Object.values(stats));

  return (
    <div className="stat-display">
      <div className="stat-display__header">
        <span className="stat-display__rank" data-rank={rank}>
          {rank}
        </span>
        <span className="stat-display__total">Total: {total}</span>
      </div>
      <div className="stat-display__stats">
        {(Object.keys(stats) as Style[]).map((style) => (
          <div key={style} className="stat-display__stat">
            <div className="stat-display__stat-label">
              <span
                className="stat-display__stat-dot"
                style={{ backgroundColor: STYLE_COLORS[style] }}
              />
              {STYLE_LABELS[style]}
            </div>
            <div className="stat-display__stat-bar">
              <div
                className="stat-display__stat-fill"
                style={{
                  width: `${(stats[style] / Math.max(maxStat, 100)) * 100}%`,
                  backgroundColor: STYLE_COLORS[style],
                }}
              />
            </div>
            <div className="stat-display__stat-value">{stats[style]}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
