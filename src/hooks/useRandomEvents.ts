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
  pactEventIntervalMultiplier,
  pactRelicDropMultiplier,
  baseTotalRate,
  harmonicSurgeMinMult,
  harmonicSurgeMinSeconds,
  harmonicSurgeMinBuffSeconds,
  isHyperdriveActive,
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
    if (activeBuffRef.current && activeBuffRef.current.remainingSeconds > 0) {
      mult += activeBuffRef.current.multiplier - 1;
    }
    if (activeLuckyBuffRef.current && activeLuckyBuffRef.current.remainingSeconds > 0) {
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

    if (activeEventExpireRef.current && !ev.isSuperJackpot) {
      clearTimeout(activeEventExpireRef.current);
      activeEventExpireRef.current = null;
      claimedEventIdsRef.current.delete(ev.id);
      scheduleNextEventRef.current();
    }

    const cur = stateRef.current;
    const bonusMult = eventBonusMult(cur);
    const trialDurationMult = cur.transcendence?.activeTrial === 'permafrost' ? 0.5 : 1.0;
    const durationMult = eventDurationMult(cur) * trialDurationMult;
    const rate = totalRate();

    setActiveEvents(prev => prev.filter(e => e.id !== ev.id));

    if (ev.type === 'bump') {
      const isSuper = !!ev.isSuperJackpot;
      const isLuckyActive = !!(activeLuckyBuffRef.current && activeLuckyBuffRef.current.remainingSeconds > 0);
      const minNormalSec = harmonicSurgeMinSeconds(cur);
      const normalBaseSec = minNormalSec >= 90 ? 90 : minNormalSec + Math.random() * (90 - minNormalSec);
      const baseSeconds = isSuper ? (300 + Math.random() * 300) : normalBaseSec;
      const seconds = baseSeconds * durationMult;
      const geodeMult = relicEventNutrientBonus(cur);
      
      // If Super Jackpot box, guarantee lucky magnitude multiplier even if buff just expired
      const luckyFallbackMult = Math.min(77000, 777 * luckyMagnitudeExtra(cur) * gaiaTouchBonusMult(cur));
      const effectiveRate = isSuper && !isLuckyActive ? baseTotalRate(cur) * luckyFallbackMult : rate;
      const amount = effectiveRate * seconds * bonusMult * geodeMult;
      const isEn = cur.lang === 'en';

      setState(prev => ({
        ...prev,
        nutrients: prev.nutrients + amount,
        runEarned: prev.runEarned + amount,
        stats: {
          ...prev.stats,
          totalEventsClaimed: (prev.stats?.totalEventsClaimed || 0) + 1,
          superJackpotClaimed: isSuper ? true : (prev.stats?.superJackpotClaimed || false),
          superJackpotCount: (prev.stats?.superJackpotCount || (prev.stats?.superJackpotClaimed ? 1 : 0)) + (isSuper ? 1 : 0),
        },
      }));

      if (isSuper) {
        showFloatingText(
          ev.left + 26,
          ev.top + 20,
          isEn ? `💥 SUPER JACKPOT! +${fmt(amount)}` : `💥 แจ็กพอตซ้อนแจ็กพอต! +${fmt(amount)}`,
          '#ffd700'
        );
      } else if (isLuckyActive) {
        showFloatingText(
          ev.left + 26,
          ev.top + 20,
          isEn ? `🍀 Lucky Harvest! +${fmt(amount)}` : `🍀 เก็บเกี่ยวโชคดี! +${fmt(amount)}`,
          '#ffd76a'
        );
      } else {
        showFloatingText(ev.left + 26, ev.top + 20, `+${fmt(amount)}`, 'var(--accent-amber)');
      }
    } else if (ev.type === 'lucky') {
      const isEn = cur.lang === 'en';
      const inTrial = !!cur.transcendence?.activeTrial && cur.transcendence.activeTrial !== 'none';
      const biomeLuckyMult = (!inTrial && cur.activeBiome === 'crystal_caverns') ? 1.35 : 1.0;
      const baseLucky = 777;
      const rawMult = baseLucky * luckyMagnitudeExtra(cur) * gaiaTouchBonusMult(cur) * biomeLuckyMult;
      const mult = Math.min(77000, rawMult);
      const seconds = luckyDurationSeconds(cur) * trialDurationMult;
      const newLucky: ActiveBuff = { multiplier: mult, remainingSeconds: seconds, expiresAt: Date.now() + seconds * 1000 };
      activeLuckyBuffRef.current = newLucky;
      setActiveLuckyBuff(newLucky);
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

      // 🎁 5% Chance on Lucky Jackpot to spawn Super Jackpot Golden Box companion!
      if (Math.random() < 0.05) {
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
          const companionAutoClaimDelay = (1200 + Math.random() * 1000) * (isHyperdriveActive(cur) ? 0.5 : 1.0);
          setTimeout(() => {
            if (!claimedEventIdsRef.current.has(bumpId)) {
              claimEventRef.current(companionBump);
            }
          }, companionAutoClaimDelay);
        }
      }

      // 20% Chance on Lucky Jackpot to unearth an un-maxed relic fragment! (boosted by pact_unstable_aether)
      if (!cur.unclaimedRelicId && Math.random() < 0.20 * pactRelicDropMultiplier(cur)) {
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
      const petalsGain = 1; // Exactly 1 petal
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
        isEn ? `🌸 +${petalsGain} Astral Petal!` : `🌸 +${petalsGain} เกสรดวงดาว!`,
        '#f472b6'
      );
    } else {
      const isEn = cur.lang === 'en';
      const minBaseMult = harmonicSurgeMinMult(cur);
      const baseMult = minBaseMult >= 4.0 ? 4.0 : minBaseMult + Math.random() * (4.0 - minBaseMult);
      const mult = Math.min(77000, 1 + (baseMult - 1) * bonusMult);
      const minBuffSec = harmonicSurgeMinBuffSeconds(cur);
      const baseSeconds = minBuffSec >= 60 ? 60 : minBuffSec + Math.random() * (60 - minBuffSec);
      const seconds = baseSeconds * durationMult;
      const now = Date.now();
      const currentBuff = activeBuffRef.current;
      const isBuffActive = !!(currentBuff && currentBuff.remainingSeconds > 0);

      let finalMultiplier: number;
      let finalRemainingSeconds: number;
      let floatingLabel: string;

      if (isBuffActive) {
        if (mult >= currentBuff.multiplier) {
          // New multiplier is higher or equal: replace multiplier, take longer duration
          finalMultiplier = mult;
          finalRemainingSeconds = Math.max(currentBuff.remainingSeconds, seconds);
          floatingLabel = isEn ? `×${mult.toFixed(1)} Surge Upgraded!` : `×${mult.toFixed(1)} เรทอัปเกรด!`;
        } else {
          // New multiplier is lower: keep existing higher multiplier, extend duration by full seconds
          finalMultiplier = currentBuff.multiplier;
          finalRemainingSeconds = currentBuff.remainingSeconds + seconds;
          floatingLabel = isEn ? `+${Math.round(seconds)}s Extended! (×${finalMultiplier.toFixed(1)})` : `+${Math.round(seconds)}วิ ต่อเวลา! (×${finalMultiplier.toFixed(1)})`;
        }
      } else {
        finalMultiplier = mult;
        finalRemainingSeconds = seconds;
        floatingLabel = isEn ? `×${mult.toFixed(1)} Surge!` : `×${mult.toFixed(1)} เรท!`;
      }

      const newBuff: ActiveBuff = {
        multiplier: finalMultiplier,
        remainingSeconds: finalRemainingSeconds,
        expiresAt: now + finalRemainingSeconds * 1000,
      };
      activeBuffRef.current = newBuff;
      setActiveBuff(newBuff);
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
        floatingLabel,
        '#b7e08a'
      );
    }

    // 🌸 5% Chance on claiming ANY event (bump, buff, lucky) to drop +1 Astral Petal (once Aurora Bloom is unlocked)
    if (ev.type !== 'aurora' && cur.transcendence?.auroraBloomUnlocked && Math.random() < 0.07) {
      const isEn = cur.lang === 'en';
      setState(prev => ({
        ...prev,
        transcendence: {
          ...prev.transcendence,
          astralPetals: (prev.transcendence?.astralPetals || 0) + 1,
        },
      }));
      showFloatingText(
        ev.left + 26,
        ev.top - 18,
        isEn ? '🌸 +1 Astral Petal!' : '🌸 +1 เกสรดวงดาว!',
        '#f472b6'
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
    const pactCdMult = pactEventIntervalMultiplier(cur);
    const isHyper = isHyperdriveActive(cur);
    const hyperMult = isHyper ? 0.5 : 1.0;
    // Base 120s (2 minutes), with ±10s variation (110s ~ 130s), scaled by Geode, Permafrost, Unstable Aether & Hyperdrive
    const delay = (110000 + Math.random() * 20000) * cdMult * trialCdMult * pactCdMult * hyperMult;
    eventTimerRef.current = setTimeout(() => {
      const r = Math.random();
      let type: 'bump' | 'buff' | 'lucky' | 'aurora' = 'bump';

      // Plan B: If any buff is currently active, do NOT roll buff or lucky to prevent collisions!
      const isAnyBuffActive = Boolean(
        (activeBuffRef.current && activeBuffRef.current.remainingSeconds > 0) ||
        (activeLuckyBuffRef.current && activeLuckyBuffRef.current.remainingSeconds > 0)
      );

      if (isAnyBuffActive) {
        type = 'bump';
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
        const autoClaimDelay = (1200 + Math.random() * 1500) * (isHyperdriveActive(cur) ? 0.5 : 1.0);
        autoEventClaimRef.current = setTimeout(() => {
          if (!claimedEventIdsRef.current.has(id)) {
            claimEvent(newEv);
          }
        }, autoClaimDelay);
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

  // Buff expiration and tick countdown hook called by the game loop with effectiveDt
  const checkBuffExpirations = useCallback((effectiveDt: number = 0) => {
    // 1. Lightning Buff countdown
    if (activeBuffRef.current) {
      const nextSec = activeBuffRef.current.remainingSeconds - effectiveDt;
      if (nextSec <= 0) {
        activeBuffRef.current = null;
        setActiveBuff(null);
      } else {
        const prevCeil = Math.ceil(activeBuffRef.current.remainingSeconds);
        const nextCeil = Math.ceil(nextSec);
        activeBuffRef.current = {
          ...activeBuffRef.current,
          remainingSeconds: nextSec,
          expiresAt: Date.now() + nextSec * 1000,
        };
        if (prevCeil !== nextCeil) {
          setActiveBuff(activeBuffRef.current);
        }
      }
    }

    // 2. Lucky Buff countdown
    if (activeLuckyBuffRef.current) {
      const nextSec = activeLuckyBuffRef.current.remainingSeconds - effectiveDt;
      if (nextSec <= 0) {
        activeLuckyBuffRef.current = null;
        setActiveLuckyBuff(null);
      } else {
        const prevCeil = Math.ceil(activeLuckyBuffRef.current.remainingSeconds);
        const nextCeil = Math.ceil(nextSec);
        activeLuckyBuffRef.current = {
          ...activeLuckyBuffRef.current,
          remainingSeconds: nextSec,
          expiresAt: Date.now() + nextSec * 1000,
        };
        if (prevCeil !== nextCeil) {
          setActiveLuckyBuff(activeLuckyBuffRef.current);
        }
      }
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
