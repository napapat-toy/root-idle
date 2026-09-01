'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ActiveBuff, FloatingTextItem, GameEventItem, GameState } from '@/types/game';
import {
  eventBonusMult,
  eventDurationMult,
  luckyChancePct,
  luckyDurationSeconds,
  luckyMagnitudeExtra,
  gaiaTouchBonusMult,
} from '@/constants/gameData';
import { fmt, fmtInt } from '@/lib/formatters';

interface UseRandomEventsProps {
  stateRef: React.MutableRefObject<GameState>;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
  totalRate: () => number;
}

export function useRandomEvents({ stateRef, setState, totalRate }: UseRandomEventsProps) {
  const [activeBuff, setActiveBuff] = useState<ActiveBuff | null>(null);
  const [activeLuckyBuff, setActiveLuckyBuff] = useState<ActiveBuff | null>(null);
  const [activeEvents, setActiveEvents] = useState<GameEventItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);

  const activeBuffRef = useRef<ActiveBuff | null>(activeBuff);
  activeBuffRef.current = activeBuff;
  const activeLuckyBuffRef = useRef<ActiveBuff | null>(activeLuckyBuff);
  activeLuckyBuffRef.current = activeLuckyBuff;

  // Event timers & single-source-of-truth claim protection
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeEventExpireRef = useRef<NodeJS.Timeout | null>(null);
  const autoEventClaimRef = useRef<NodeJS.Timeout | null>(null);
  const claimedEventIdsRef = useRef<Set<number>>(new Set());

  // Multiplier calculation from active buffs
  const currentBuffMultiplier = useCallback(() => {
    let mult = 1;
    const now = Date.now();
    if (activeBuffRef.current && now < activeBuffRef.current.expiresAt) {
      mult += activeBuffRef.current.multiplier - 1;
    }
    if (activeLuckyBuffRef.current && now < activeLuckyBuffRef.current.expiresAt) {
      mult += activeLuckyBuffRef.current.multiplier - 1;
    }
    return mult;
  }, []);

  // Floating text emitter
  const showFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1600);
  }, []);

  // Event trigger & claim
  const claimEvent = useCallback((ev: GameEventItem) => {
    if (claimedEventIdsRef.current.has(ev.id)) return;
    claimedEventIdsRef.current.add(ev.id);

    if (autoEventClaimRef.current) {
      clearTimeout(autoEventClaimRef.current);
      autoEventClaimRef.current = null;
    }

    const cur = stateRef.current;
    const bonusMult = eventBonusMult(cur);
    const durationMult = eventDurationMult(cur);
    const rate = totalRate();

    setActiveEvents(prev => prev.filter(e => e.id !== ev.id));

    if (ev.type === 'bump') {
      const seconds = (30 + Math.random() * 60) * durationMult;
      const amount = rate * seconds * bonusMult;
      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + amount,
        runEarned: prev.runEarned + amount,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
        },
      }));
      showFloatingText(ev.left + 26, ev.top + 20, `+${fmt(amount)}`, 'var(--accent-amber)');
    } else if (ev.type === 'lucky') {
      const isEn = cur.lang === 'en';
      const mult = (1 + (777 - 1) * bonusMult) * luckyMagnitudeExtra(cur) * gaiaTouchBonusMult(cur);
      const seconds = luckyDurationSeconds(cur);
      setActiveLuckyBuff({ multiplier: mult, expiresAt: Date.now() + seconds * 1000 });
      setState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
          luckyJackpotCount: (prev.stats?.luckyJackpotCount || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top + 20,
        isEn ? `🍀 Lucky! ×${fmtInt(mult)}` : `🍀 โชคดี! ×${fmtInt(mult)}`,
        '#ffd76a'
      );
    } else {
      const isEn = cur.lang === 'en';
      const baseMult = 2 + Math.random() * 2;
      const mult = 1 + (baseMult - 1) * bonusMult;
      const seconds = (20 + Math.random() * 40) * durationMult;
      setActiveBuff({ multiplier: mult, expiresAt: Date.now() + seconds * 1000 });
      setState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top + 20,
        isEn ? `×${mult.toFixed(1)} Surge!` : `×${mult.toFixed(1)} เรท!`,
        '#b7e08a'
      );
    }
  }, [showFloatingText, totalRate, setState, stateRef]);

  // Clean reset function for Prestige / Transcendence / Hard Reset
  const clearEventsAndBuffs = useCallback(() => {
    setActiveBuff(null);
    setActiveLuckyBuff(null);
    setActiveEvents([]);
    if (activeEventExpireRef.current) {
      clearTimeout(activeEventExpireRef.current);
      activeEventExpireRef.current = null;
    }
    if (autoEventClaimRef.current) {
      clearTimeout(autoEventClaimRef.current);
      autoEventClaimRef.current = null;
    }
    claimedEventIdsRef.current.clear();
  }, []);

  // Random event scheduler (105-155s interval)
  const scheduleNextEvent = useCallback(() => {
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);

    const delay = 105000 + Math.random() * 50000; // 105–155s
    eventTimerRef.current = setTimeout(() => {
      const cur = stateRef.current;
      const r = Math.random();
      const luckyPct = luckyChancePct(cur);
      const nonLuckyPct = 1 - luckyPct;
      const buffPct = nonLuckyPct * (32 / 92);
      const type: 'bump' | 'buff' | 'lucky' =
        r < luckyPct ? 'lucky' : r < luckyPct + buffPct ? 'buff' : 'bump';

      const left = 30 + Math.random() * 380;
      const top = 60 + Math.random() * 260;
      const id = Date.now();

      const newEv: GameEventItem = { id, type, left, top };
      setActiveEvents([newEv]);

      // Auto-event perk
      if (cur.prestige.autoEvent && cur.prestige.autoEventEnabled && cur.transcendence?.activeTrial !== 'void_anomaly') {
        autoEventClaimRef.current = setTimeout(() => {
          if (!claimedEventIdsRef.current.has(id)) {
            claimEvent(newEv);
          }
        }, 1200 + Math.random() * 1500);
      }

      // Expire after 12s if not clicked
      activeEventExpireRef.current = setTimeout(() => {
        setActiveEvents(prev => prev.filter(e => e.id !== id));
        claimedEventIdsRef.current.delete(id);
        scheduleNextEvent();
      }, 12000);
    }, delay);
  }, [claimEvent, stateRef]);

  useEffect(() => {
    scheduleNextEvent();
    return () => {
      if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
      if (activeEventExpireRef.current) clearTimeout(activeEventExpireRef.current);
      if (autoEventClaimRef.current) clearTimeout(autoEventClaimRef.current);
    };
  }, [scheduleNextEvent]);

  // Buff expiration check hook called by the tick loop
  const checkBuffExpirations = useCallback(() => {
    const curTime = Date.now();
    if (activeBuffRef.current && curTime >= activeBuffRef.current.expiresAt) {
      setActiveBuff(null);
    }
    if (activeLuckyBuffRef.current && curTime >= activeLuckyBuffRef.current.expiresAt) {
      setActiveLuckyBuff(null);
    }
  }, []);

  return {
    activeBuff,
    activeLuckyBuff,
    activeEvents,
    floatingTexts,
    showFloatingText,
    claimEvent,
    currentBuffMultiplier,
    clearEventsAndBuffs,
    checkBuffExpirations,
  };
}
