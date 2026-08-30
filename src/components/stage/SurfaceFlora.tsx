'use client';

import React from 'react';

interface SurfaceFloraProps {
  theme?: 'grass' | 'moss' | 'crystal' | 'magma' | 'void' | 'yggdrasil';
  color: string;
}

export const SurfaceFlora: React.FC<SurfaceFloraProps> = React.memo(({ theme = 'grass', color }) => {
  switch (theme) {
    case 'grass':
      return (
        <g stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
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
      );

    case 'moss':
      return (
        <g stroke={color} fill={color} strokeWidth="1.2" opacity="0.85">
          <circle cx="28" cy="24" r="3" />
          <circle cx="78" cy="25" r="2.5" />
          <circle cx="132" cy="23" r="3.5" />
          <circle cx="186" cy="25" r="2" />
          <circle cx="225" cy="24" r="2.5" />
          <circle cx="276" cy="24" r="3" />
          <circle cx="318" cy="25" r="2.5" />
          <circle cx="370" cy="23" r="3.5" />
          <circle cx="424" cy="25" r="2.5" />
          <circle cx="474" cy="24" r="3" />
        </g>
      );

    case 'crystal':
      return (
        <g stroke={color} fill={`${color}33`} strokeWidth="1.2" strokeLinejoin="round" opacity="0.9">
          <polygon points="26,28 30,18 34,28" />
          <polygon points="76,28 80,19 84,28" />
          <polygon points="132,28 136,16 140,28" />
          <polygon points="187,28 190,20 193,28" />
          <polygon points="224,28 227,17 230,28" />
          <polygon points="274,28 278,18 282,28" />
          <polygon points="316,28 320,19 324,28" />
          <polygon points="368,28 372,16 376,28" />
          <polygon points="422,28 425,19 428,28" />
          <polygon points="472,28 475,17 478,28" />
        </g>
      );

    case 'magma':
      return (
        <g stroke={color} strokeWidth="1.6" strokeLinecap="round" opacity="0.9">
          <path d="M 20,28 L 28,23 L 36,29" />
          <path d="M 72,28 L 78,22 L 85,29" />
          <path d="M 128,29 L 134,20 L 142,28" />
          <path d="M 182,28 L 188,23 L 194,29" />
          <path d="M 220,29 L 226,21 L 232,28" />
          <path d="M 270,28 L 276,22 L 283,29" />
          <path d="M 312,29 L 318,20 L 325,28" />
          <path d="M 364,28 L 370,23 L 378,29" />
          <path d="M 418,29 L 424,21 L 430,28" />
          <path d="M 468,28 L 474,23 L 480,29" />
        </g>
      );

    case 'void':
      return (
        <g fill={color} opacity="0.85">
          <circle cx="28" cy="22" r="1.8" />
          <circle cx="78" cy="20" r="1.5" />
          <circle cx="135" cy="18" r="2.2" />
          <circle cx="188" cy="21" r="1.5" />
          <circle cx="226" cy="19" r="1.8" />
          <circle cx="278" cy="19" r="1.8" />
          <circle cx="320" cy="21" r="1.5" />
          <circle cx="372" cy="18" r="2.2" />
          <circle cx="425" cy="20" r="1.5" />
          <circle cx="475" cy="22" r="1.8" />
        </g>
      );

    case 'yggdrasil':
      return (
        <g stroke={color} strokeWidth="1.4" strokeLinecap="round" opacity="0.95">
          <path d="M 28,28 L 28,15 M 24,28 L 20,18 M 32,28 L 36,18" />
          <path d="M 78,28 L 78,16 M 74,28 L 70,19 M 82,28 L 86,19" />
          <path d="M 135,28 L 135,14 M 130,28 L 125,17 M 140,28 L 145,17" />
          <path d="M 188,28 L 188,16 M 184,28 L 180,19 M 192,28 L 196,19" />
          <path d="M 226,28 L 226,15 M 222,28 L 218,18 M 230,28 L 234,18" />
          <path d="M 278,28 L 278,15 M 274,28 L 270,18 M 282,28 L 286,18" />
          <path d="M 320,28 L 320,16 M 316,28 L 312,19 M 324,28 L 328,19" />
          <path d="M 372,28 L 372,14 M 367,28 L 362,17 M 377,28 L 382,17" />
          <path d="M 425,28 L 425,16 M 421,28 L 417,19 M 429,28 L 433,19" />
          <path d="M 475,28 L 475,15 M 471,28 L 467,18 M 479,28 L 483,18" />
        </g>
      );

    default:
      return null;
  }
});

SurfaceFlora.displayName = 'SurfaceFlora';
