'use client';

import React, { useMemo } from 'react';
import { ActiveBuff, Branch, FloatingTextItem, GameEventItem, Language, SkinId } from '@/types/game';
import { getBranchColor } from '@/lib/treeGenerator';
import { stageName } from '@/constants/gameData';
import { fmtInt } from '@/lib/formatters';

interface StageCanvasProps {
  totalOwned: number;
  branches: Branch[];
  maxY: number;
  activeSkin: SkinId;
  activeBuff: ActiveBuff | null;
  activeLuckyBuff: ActiveBuff | null;
  activeEvents: GameEventItem[];
  floatingTexts: FloatingTextItem[];
  lang?: Language;
  onClaimEvent: (event: GameEventItem) => void;
}

interface RootTreeSvgProps {
  branches: Branch[];
  targetH: number;
  activeSkin: SkinId;
}

/**
 * Memoized SVG Tree with Path Batching:
 * Groups thousands of branch paths by (color + width + opacity) into a few batched paths.
 * Reduces SVG DOM elements from 2,000+ to ~15, boosting late-game GPU & CPU performance.
 */
const RootTreeSvg = React.memo<RootTreeSvgProps>(({ branches, targetH, activeSkin }) => {
  const batchedGroups = useMemo(() => {
    const map = new Map<string, { d: string; color: string; width: number; opacity: number }>();

    for (let i = 0; i < branches.length; i++) {
      const b = branches[i];
      const color = getBranchColor(branches, b, i, activeSkin);
      const opacity = Number((0.6 + Math.max(0, 4 - b.depth) * 0.08).toFixed(2));
      const key = `${color}_${b.width}_${opacity}`;

      const dSegment = `M ${b.x1} ${b.y1} L ${b.x2} ${b.y2} `;
      const existing = map.get(key);
      if (existing) {
        existing.d += dSegment;
      } else {
        map.set(key, { d: dSegment, color, width: b.width, opacity });
      }
    }
    return Array.from(map.values());
  }, [branches, activeSkin]);

  return (
    <svg
      id="rootCanvas"
      viewBox={`0 0 500 ${targetH}`}
      preserveAspectRatio="xMidYMin meet"
    >
      {batchedGroups.map((g, idx) => (
        <path
          key={idx}
          d={g.d}
          className="branch"
          stroke={g.color}
          strokeWidth={g.width}
          opacity={g.opacity}
        />
      ))}
    </svg>
  );
});

RootTreeSvg.displayName = 'RootTreeSvg';

export const StageCanvas: React.FC<StageCanvasProps> = ({
  totalOwned,
  branches,
  maxY,
  activeSkin,
  activeBuff,
  activeLuckyBuff,
  activeEvents,
  floatingTexts,
  lang = 'th',
  onClaimEvent,
}) => {
  const targetH = Math.max(480, maxY + 60);
  const isEn = lang === 'en';

  const buffBadges: string[] = [];
  const now = Date.now();
  if (activeBuff && now < activeBuff.expiresAt) {
    const remain = Math.ceil((activeBuff.expiresAt - now) / 1000);
    buffBadges.push(`⚡ ×${activeBuff.multiplier.toFixed(2)} ${remain}${isEn ? 's' : 'วิ'}`);
  }
  if (activeLuckyBuff && now < activeLuckyBuff.expiresAt) {
    const remain = Math.ceil((activeLuckyBuff.expiresAt - now) / 1000);
    buffBadges.push(`🍀 ×${fmtInt(activeLuckyBuff.multiplier)} ${remain}${isEn ? 's' : 'วิ'}`);
  }

  return (
    <div className="stage" id="stageBox">
      {/* Sticky topbar */}
      <div className="stage-topbar">
        <div className="stage-label" id="stageLabel">
          {stageName(totalOwned, lang)}
        </div>
        {buffBadges.length > 0 && (
          <div className="buff-badge" id="buffDisplay">
            {buffBadges.join(' · ')}
          </div>
        )}
      </div>

      {/* Optimized SVG Root Canvas */}
      <RootTreeSvg
        branches={branches}
        targetH={targetH}
        activeSkin={activeSkin}
      />

      {/* Clickable Floating Events */}
      {activeEvents.map(ev => {
        const isLucky = ev.type === 'lucky';
        const icon = isLucky ? '🍀' : ev.type === 'buff' ? '⚡' : '🎁';

        return (
          <button
            key={ev.id}
            onClick={() => onClaimEvent(ev)}
            style={{ left: `${ev.left}px`, top: `${ev.top}px` }}
            className={`game-event ${isLucky ? 'lucky' : ''}`}
          >
            {icon}
          </button>
        );
      })}

      {/* Floating Texts */}
      {floatingTexts.map(ft => (
        <div
          key={ft.id}
          className="floating-text"
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            color: ft.color,
          }}
        >
          {ft.text}
        </div>
      ))}
    </div>
  );
};
