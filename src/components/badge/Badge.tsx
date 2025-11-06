import React from 'react';
import styles from './badge.module.css';

interface BadgeProps {
  text: string;
  color?: 'pink' | 'blue' | 'green' | 'gray' | 'default';
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'pink' }) => {
  const colorClass = styles[color] || styles.default;

  return (
    <span className={`${styles.badge} ${colorClass}`}>
      {text}
    </span>
  );
};