import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'highlight' | 'dark';
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  onClick,
  selected = false,
}) => {
  return (
    <div
      className={`card card--${variant} ${onClick ? 'card--clickable' : ''} ${selected ? 'card--selected' : ''}`}
      onClick={onClick}
    >
      {title && <div className="card__title">{title}</div>}
      <div className="card__content">{children}</div>
    </div>
  );
};
