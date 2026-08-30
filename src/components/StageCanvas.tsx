'use client';

import React, { useMemo } from 'react';
import { ActiveBuff, BiomeId, Branch, FloatingTextItem, GameEventItem, Language, SkinId } from '@/types/game';
import { getBranchColor } from '@/lib/treeGenerator';
import { BIOME_DEFS, RELIC_DEFS, RELIC_RARITY_INFO, getSubterraneanDepthInfo } from '@/constants/gameData';
import { fmtMultiplier } from '@/lib/formatters';

interface StageCanvasProps {
  totalOwned: number;
  branches: Branch[];
  maxY: number;
  activeSkin: SkinId;
  activeBuff: ActiveBuff | null;
  activeLuckyBuff: ActiveBuff | null;
  activeEvents: GameEventItem[];
  floatingTexts: FloatingTextItem[];
  unclaimedRelicId?: string | null;
  activeBiome?: BiomeId;
  lang?: Language;
  onClaimEvent: (event: GameEventItem) => void;
  onClaimUnearthedRelic?: (relicId: string) => void;
  onWaterCanvas?: (x: number, y: number) => void;
}

interface RootTreeSvgProps {
  branches: Branch[];
  targetH: number;
  activeSkin: SkinId;
  totalOwned: number;
  grassColor?: string;
  soilLine?: string;
}

const TrunkBase: React.FC<{ totalOwned: number; activeSkin: SkinId }> = React.memo(({ totalOwned, activeSkin }) => {
  // Clean, minimalist rectangular trunk stem growing smoothly from 10px to 26px
  const width = Math.min(26, Math.max(10, 10 + Math.sqrt(totalOwned) * 0.5));
  const height = 48;

  let barkFill = '#523820'; // Default rich dark wood
  let barkStroke = '#321f10';

  if (activeSkin === 'rainbow') {
    barkFill = '#dcd4c0';
    barkStroke = '#a99a80';
  } else if (activeSkin === 'sakura') {
    barkFill = '#2b1f28';
    barkStroke = '#1c131a';
  } else if (activeSkin === 'cafe') {
    barkFill = '#2a1b14';
    barkStroke = '#1a0f0a';
  } else if (activeSkin === 'autumn') {
    barkFill = '#341a12';
    barkStroke = '#220e08';
  } else if (activeSkin === 'ocean') {
    barkFill = '#0a1a24';
    barkStroke = '#040d13';
  } else if (activeSkin === 'frost') {
    barkFill = '#14202c';
    barkStroke = '#0a131b';
  } else if (activeSkin === 'sunset') {
    barkFill = '#2a1522';
    barkStroke = '#190a14';
  } else if (activeSkin === 'sameorigin') {
    barkFill = '#dcd4c0';
    barkStroke = '#a99a80';
  } else if (activeSkin === 'mystic') {
    barkFill = '#181e18';
    barkStroke = '#0c120c';
  } else if (activeSkin === 'cyberpunk') {
    barkFill = '#0e0e16';
    barkStroke = '#05050a';
  } else if (activeSkin === 'grayscale') {
    barkFill = '#666666';
    barkStroke = '#333333';
  } else if (activeSkin === 'gradient') {
    barkFill = '#1e3825';
    barkStroke = '#102215';
  } else if (activeSkin === 'nebula') {
    barkFill = '#140f28';
    barkStroke = '#090615';
  } else if (activeSkin === 'imperial') {
    barkFill = '#241b10';
    barkStroke = '#130d06';
  }

  const left = 250 - width / 2;
  const right = 250 + width / 2;

  return (
    <g id="trunkBase">
      {/* Solid trunk wood fill */}
      <rect x={left} y={0} width={width} height={height} fill={barkFill} />
      {/* Outer bark boundary (left, top, right) open at bottom to merge with roots */}
      <path
        d={`M ${left}, ${height} L ${left}, 0 L ${right}, 0 L ${right}, ${height}`}
        fill="none"
        stroke={barkStroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </g>
  );
});

TrunkBase.displayName = 'TrunkBase';

const RootTreeSvg: React.FC<RootTreeSvgProps> = React.memo(({
  branches,
  targetH,
  activeSkin,
  totalOwned,
  grassColor = '#8fd17a',
  soilLine = '#3a2717',
}) => {
  const batchedGroups = useMemo(() => {
    const groups: { [key: string]: string[] } = {};

    for (let i = 0; i < branches.length; i++) {
      const b = branches[i];
      if (b.depth === 0) continue;
      const color = getBranchColor(branches, b, i, activeSkin);
      const width = b.width;
      const opacity = Number((0.6 + Math.max(0, 4 - b.depth) * 0.08).toFixed(2));
      const key = `${color}_${width}_${opacity}`;

      if (!groups[key]) groups[key] = [];
      groups[key].push(`M ${b.x1.toFixed(1)} ${b.y1.toFixed(1)} L ${b.x2.toFixed(1)} ${b.y2.toFixed(1)}`);
    }

    return Object.entries(groups).map(([key, dArray]) => {
      const [color, width, opacity] = key.split('_');
      return {
        color,
        width: parseFloat(width),
        opacity: parseFloat(opacity),
        d: dArray.join(' '),
      };
    });
  }, [branches, activeSkin]);

  return (
    <svg
      className="root-svg"
      viewBox={`0 0 500 ${targetH}`}
      preserveAspectRatio="xMidYMin meet"
    >
      <defs>
        {/* Sky / Surface sunlight gradient */}
        <linearGradient id="surfaceSkyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 235, 170, 0.22)" />
          <stop offset="60%" stopColor="rgba(180, 220, 140, 0.08)" />
          <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
        </linearGradient>

        {/* Grass / topsoil transition gradient */}
        <linearGradient id="grassGroundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={grassColor} stopOpacity="0.8" />
          <stop offset="40%" stopColor={soilLine} stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Above-ground sunlight zone */}
      <rect x="0" y="0" width="500" height="30" fill="url(#surfaceSkyGrad)" />

      {/* Surface grass ground line along y=28..30 */}
      <path
        d="M 0,28 Q 60,25 125,28 T 250,27 T 375,28 T 500,26 L 500,0 L 0,0 Z"
        fill="rgba(143, 209, 122, 0.04)"
      />
      <path
        d="M 0,29 Q 65,26 130,29.5 T 250,28.5 T 380,29.5 T 500,28 L 500,36 L 0,36 Z"
        fill="url(#grassGroundGrad)"
        opacity="0.85"
      />

      {/* Grass blade tufts across ground line on both sides of the trunk */}
      <g stroke={grassColor} strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        <path d="M 25,28 L 22,21 M 28,28 L 31,20 M 33,28 L 38,22" />
        <path d="M 75,28 L 72,21 M 79,28 L 83,22" />
        <path d="M 130,28 L 127,21 M 134,28 L 138,19 M 139,28 L 144,22" />
        <path d="M 185,28 L 181,21 M 189,28 L 193,20" />
        <path d="M 222,28 L 219,21 M 226,28 L 229,19" />
        <path d="M 274,28 L 271,19 M 278,28 L 282,21" />
        <path d="M 315,28 L 311,21 M 319,28 L 323,20" />
        <path d="M 365,28 L 362,21 M 369,28 L 373,19 M 374,28 L 379,22" />
        <path d="M 420,28 L 417,21 M 424,28 L 428,20" />
        <path d="M 470,28 L 467,21 M 474,28 L 478,22" />
      </g>

      {/* The Root branches */}
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

      {/* Clean rectangular trunk placed over the root origin points */}
      <TrunkBase totalOwned={totalOwned} activeSkin={activeSkin} />
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
  unclaimedRelicId,
  activeBiome = 'topsoil',
  lang = 'th',
  onClaimEvent,
  onClaimUnearthedRelic,
  onWaterCanvas,
}) => {
  const targetH = Math.max(480, maxY + 24);
  const isEn = lang === 'en';

  const depthInfo = useMemo(() => {
    return getSubterraneanDepthInfo(totalOwned, maxY, lang);
  }, [totalOwned, maxY, lang]);

  const currentBiome = useMemo(() => {
    return BIOME_DEFS.find(b => b.id === activeBiome) || BIOME_DEFS[0];
  }, [activeBiome]);

  const canvasBackground = useMemo(() => {
    if (activeBiome && activeBiome !== 'topsoil') {
      return currentBiome.bgGradient;
    }
    return depthInfo.bgGradient;
  }, [activeBiome, currentBiome, depthInfo.bgGradient]);

  const unclaimedRelic = useMemo(() => {
    if (!unclaimedRelicId) return null;
    return RELIC_DEFS.find(r => r.id === unclaimedRelicId) || null;
  }, [unclaimedRelicId]);

  const buffBadges: string[] = [];
  const now = Date.now();
  if (activeBuff && now < activeBuff.expiresAt) {
    const remain = Math.ceil((activeBuff.expiresAt - now) / 1000);
    buffBadges.push(`⚡ ×${activeBuff.multiplier.toFixed(2)} (${remain}${isEn ? 's' : 'วิ'})`);
  }
  if (activeLuckyBuff && now < activeLuckyBuff.expiresAt) {
    const remain = Math.ceil((activeLuckyBuff.expiresAt - now) / 1000);
    buffBadges.push(`🍀 ×${fmtMultiplier(activeLuckyBuff.multiplier)} (${remain}${isEn ? 's' : 'วิ'})`);
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onWaterCanvas) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onWaterCanvas(x, y);
    }
  };

  return (
    <div
      className="stage"
      id="stageBox"
      onClick={handleCanvasClick}
      style={{
        background: canvasBackground,
        transition: 'background 1.5s ease-in-out',
      }}
    >
      {/* Sticky topbar */}
      <div className="stage-topbar">
        <div className="stage-label" id="stageLabel">
          {depthInfo.layerTitle}
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
        totalOwned={totalOwned}
        grassColor={depthInfo.grassColor}
        soilLine={depthInfo.soilLine}
      />

      {/* Unearthed Relic Node (Persistent until claimed) */}
      {unclaimedRelic && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClaimUnearthedRelic?.(unclaimedRelic.id);
          }}
          className="unearthed-relic-node"
          style={{
            position: 'absolute',
            left: '50%',
            top: `${Math.min(targetH - 90, 260)}px`,
            transform: 'translateX(-50%)',
            background: `radial-gradient(circle, ${unclaimedRelic.color}35 0%, rgba(20,15,10,0.95) 75%)`,
            border: `2px solid ${unclaimedRelic.color}`,
            borderRadius: '16px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: `0 0 24px ${unclaimedRelic.color}66`,
            animation: 'pulse 2s infinite ease-in-out',
            zIndex: 30,
          }}
          title={isEn ? `Click to Claim: ${unclaimedRelic.name}` : `คลิกเพื่อเก็บโบราณวัตถุ: ${unclaimedRelic.name}`}
        >
          <span style={{ fontSize: '26px' }}>{unclaimedRelic.icon}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#ffd76a', fontWeight: 700 }}>
                {isEn ? '✨ Unearthed Relic!' : '✨ ขุดพบโบราณวัตถุ!'}
              </span>
              <span
                style={{
                  fontSize: '9.5px',
                  color: RELIC_RARITY_INFO[unclaimedRelic.rarity].color,
                  background: RELIC_RARITY_INFO[unclaimedRelic.rarity].badgeBg,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  border: `1px solid ${RELIC_RARITY_INFO[unclaimedRelic.rarity].color}66`,
                }}
              >
                {isEn ? RELIC_RARITY_INFO[unclaimedRelic.rarity].enName : RELIC_RARITY_INFO[unclaimedRelic.rarity].name}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 700 }}>
              {unclaimedRelic.name}
            </div>
          </div>
        </button>
      )}

      {/* Clickable Floating Events */}
      {activeEvents.map(ev => {
        const isLucky = ev.type === 'lucky';
        const icon = isLucky ? '🍀' : ev.type === 'buff' ? '⚡' : '🎁';

        return (
          <button
            key={ev.id}
            onClick={(e) => {
              e.stopPropagation();
              onClaimEvent(ev);
            }}
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
