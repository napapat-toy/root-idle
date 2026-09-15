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
  pickWeightedUnownedRelic,
  relicEventNutrientBonus,
  relicEventCooldownMultiplier,
  unownedRelicList,
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
  const activeLuckyBuffRef = useRef<ActiveBuff | null>(activeLuckyBuff);

  useEffect(() => {
    activeBuffRef.current = activeBuff;
  }, [activeBuff]);

  useEffect(() => {
    activeLuckyBuffRef.current = activeLuckyBuff;
  }, [activeLuckyBuff]);

  // Event timers & single-source-of-truth claim protection
  const eventTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeEventExpireRef = useRef<NodeJS.Timeout | null>(null);
  const autoEventClaimRef = useRef<NodeJS.Timeout | null>(null);
  const superJackpotExpireTimerRef = useRef<NodeJS.Timeout | null>(null);
  const claimedEventIdsRef = useRef<Set<number>>(new Set());
  const scheduleNextEventRef = useRef<() => void>(() => {});
  const claimEventRef = useRef<(ev: GameEventItem) => void>(() => {});

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
    const trialDurationMult = cur.transcendence?.activeTrial === 'permafrost' ? 0.5 : 1.0;
    const durationMult = eventDurationMult(cur) * trialDurationMult;
    const rate = totalRate();

    setActiveEvents(prev => prev.filter(e => e.id !== ev.id));

    if (ev.type === 'bump') {
      const isLuckyActive = (activeLuckyBuffRef.current && Date.now() < activeLuckyBuffRef.current.expiresAt) || !!ev.isSuperJackpot;
      const seconds = (30 + Math.random() * 60) * durationMult;
      const geodeMult = relicEventNutrientBonus(cur);
      const amount = rate * seconds * bonusMult * geodeMult;
      const isEn = cur.lang === 'en';

      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + amount,
        runEarned: prev.runEarned + amount,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
          superJackpotClaimed: isLuckyActive ? true : (prev.stats?.superJackpotClaimed || false),
        },
      }));

      if (isLuckyActive) {
        showFloatingText(
          ev.left + 26,
          ev.top + 20,
          isEn ? `💥 SUPER JACKPOT! +${fmt(amount)}` : `💥 แจ็กพอตซ้อนแจ็กพอต! +${fmt(amount)}`,
          '#ffd700'
        );
      } else {
        showFloatingText(ev.left + 26, ev.top + 20, `+${fmt(amount)}`, 'var(--accent-amber)');
      }
    } else if (ev.type === 'lucky') {
      const isEn = cur.lang === 'en';
      const mult = (1 + (777 - 1) * bonusMult) * luckyMagnitudeExtra(cur) * gaiaTouchBonusMult(cur);
      const seconds = luckyDurationSeconds(cur) * trialDurationMult;
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

      // 🎁 Spawn Super Jackpot Golden Box companion right beside the clover!
      const bumpId = Date.now() + 1;
      const companionBump: GameEventItem = {
        id: bumpId,
        type: 'bump',
        isSuperJackpot: true,
        left: Math.max(30, Math.min(380, ev.left + (Math.random() < 0.5 ? -50 : 50))),
        top: Math.max(60, Math.min(260, ev.top + (Math.random() < 0.5 ? -40 : 40))),
      };
      setActiveEvents(prev => [...prev.filter(e => e.id !== ev.id), companionBump]);

      // Auto-expire the companion box when the lucky buff expires
      if (superJackpotExpireTimerRef.current) {
        clearTimeout(superJackpotExpireTimerRef.current);
      }
      superJackpotExpireTimerRef.current = setTimeout(() => {
        setActiveEvents(prev => prev.filter(e => e.id !== bumpId));
        claimedEventIdsRef.current.delete(bumpId);
      }, seconds * 1000);

      // Auto-event perk triggers for the companion gift box as well
      if (cur.prestige.autoEvent && cur.prestige.autoEventEnabled && cur.transcendence?.activeTrial !== 'void_anomaly') {
        setTimeout(() => {
          if (!claimedEventIdsRef.current.has(bumpId)) {
            claimEventRef.current(companionBump);
          }
        }, 1200 + Math.random() * 1000);
      }

      // 20% Chance on Lucky Jackpot to unearth an un-maxed relic fragment!
      if (!cur.unclaimedRelicId && Math.random() < 0.20) {
        const unowned = unownedRelicList(cur);
        if (unowned.length > 0) {
          const picked = pickWeightedUnownedRelic(unowned);
          if (picked) {
            setState(prev => ({ ...prev, unclaimedRelicId: picked.id }));
            showFloatingText(
              ev.left + 26,
              ev.top - 12,
              isEn ? `🏺 Unearthed: ${picked.enName}!` : `🏺 ขุดพบ: ${picked.name}!`,
              picked.color || '#ffd76a'
            );
          }
        }
      }
    } else if (ev.type === 'aurora') {
      const isEn = cur.lang === 'en';
      const petalsGain = Math.floor(1 + Math.random() * 2.5); // 1, 2, or 3 petals
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          astralPetals: (prev.transcendence?.astralPetals || 0) + petalsGain,
        },
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top + 20,
        isEn ? `🌸 +${petalsGain} Astral Petals!` : `🌸 +${petalsGain} เกสรดวงดาว!`,
        '#f472b6'
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

  useEffect(() => {
    claimEventRef.current = claimEvent;
  }, [claimEvent]);

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
    if (superJackpotExpireTimerRef.current) {
      clearTimeout(superJackpotExpireTimerRef.current);
      superJackpotExpireTimerRef.current = null;
    }
    claimedEventIdsRef.current.clear();
  }, []);

  // Random event scheduler (105-155s interval)
  const scheduleNextEvent = useCallback(() => {
    if (eventTimerRef.current) clearTimeout(eventTimerRef.current);

    const cur = stateRef.current;
    const cdMult = relicEventCooldownMultiplier(cur);
    const trialCdMult = cur.transcendence?.activeTrial === 'permafrost' ? 1.6 : 1.0;
    const delay = (105000 + Math.random() * 50000) * cdMult * trialCdMult; // 105–155s scaled by Geode & Permafrost
    eventTimerRef.current = setTimeout(() => {
      const r = Math.random();
      const hasAurora = !!cur.transcendence?.auroraBloomUnlocked;
      let type: 'bump' | 'buff' | 'lucky' | 'aurora' = 'bump';

      if (hasAurora && Math.random() < 0.18) {
        type = 'aurora';
      } else {
        const luckyPct = luckyChancePct(cur);
        const nonLuckyPct = 1 - luckyPct;
        const buffPct = nonLuckyPct * (32 / 92);
        type = r < luckyPct ? 'lucky' : r < luckyPct + buffPct ? 'buff' : 'bump';
      }

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
        scheduleNextEventRef.current();
      }, 12000);
    }, delay);
  }, [claimEvent, stateRef]);

  useEffect(() => {
    scheduleNextEventRef.current = scheduleNextEvent;
  }, [scheduleNextEvent]);

  useEffect(() => {
    scheduleNextEvent();
    return () => {
      if (eventTimerRef.current) clearTimeout(eventTimerRef.current);
      if (activeEventExpireRef.current) clearTimeout(activeEventExpireRef.current);
      if (autoEventClaimRef.current) clearTimeout(autoEventClaimRef.current);
      if (superJackpotExpireTimerRef.current) clearTimeout(superJackpotExpireTimerRef.current);
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
