'use client';

import React from 'react';

export interface StatItem {
  label: React.ReactNode;
  value: React.ReactNode;
  valueClass?: string;
  valueStyle?: React.CSSProperties;
  show?: boolean;
}

export interface StatsCardProps {
  icon: string;
  title: string;
  items: StatItem[];
  colSpan?: number;
}

export const StatsCard: React.FC<StatsCardProps> = React.memo(({
  icon,
  title,
  items,
  colSpan,
}) => {
  const visibleItems = items.filter(item => item.show !== false);

  return (
    <div className="stats-card" style={colSpan ? { gridColumn: `span ${colSpan}` } : undefined}>
      <div className="stats-card-header">
        <span className="stats-card-icon">{icon}</span>
        <span className="stats-card-title">{title}</span>
      </div>
      <div className="stats-card-rows">
        {visibleItems.map((item, idx) => (
          <div className="stats-row" key={idx}>
            <span className="stats-label">{item.label}:</span>
            <span className={`stats-value ${item.valueClass || ''}`.trim()} style={item.valueStyle}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

StatsCard.displayName = 'StatsCard';
