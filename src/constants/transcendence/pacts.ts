import { GameState, PactDef, PactId } from '@/types/game';
import { isInTrial } from './trials';

export const PACT_DEFS: PactDef[] = [
  {
    id: 'pact_arid_soil',
    name: 'ผืนดินแห้งแล้ง',
    enName: 'Arid Soil',
    icon: '🍂',
    desc: 'สารอาหารในผิวดินแห้งแล้ง ซึมซับสารอาหารได้ช้าลง',
    enDesc: 'Arid topsoil condition reducing natural moisture and nutrient absorption',
    handicapDesc: 'เรทการผลิตสารอาหารพื้นฐานลดลง 20% (×0.80)',
    enHandicapDesc: 'Base nutrient production rate reduced by 20% (×0.80)',
    rewardDesc: 'ได้รับเมล็ดพันธุ์นิรันดร์ (Eternal Seeds) เมื่อ Prestige เพิ่มขึ้น +15%',
    enRewardDesc: '+15% Eternal Seeds earned upon Prestige',
    seedsBonusPct: 15,
  },
  {
    id: 'pact_scarcity',
    name: 'ทรัพยากรขาดแคลน',
    enName: 'Resource Scarcity',
    icon: '🪙',
    desc: 'ดินแน่นหนาและแร่ธาตุหายาก ต้องใช้สารอาหารมากกว่าปกติในการแตกราก',
    enDesc: 'Dense mineral crust requiring more nutrients to sprout new roots',
    handicapDesc: 'ราคารากและอัปเกรดทุกชนิดแพงขึ้น 30% (×1.30)',
    enHandicapDesc: 'Cost of all roots and upgrades increased by 30% (×1.30)',
    rewardDesc: 'ได้รับเมล็ดนิรันดร์ +20% และละอองชีวิต (🌍) เมื่อ Transcendence +15%',
    enRewardDesc: '+20% Eternal Seeds & +15% Gaia Essences earned upon Transcendence',
    seedsBonusPct: 20,
    essencesBonusPct: 15,
  },
  {
    id: 'pact_manual',
    name: 'ปิดผนึกกลไก',
    enName: 'Vow of Manual Labor',
    icon: '🤖',
    desc: 'ปฏิญาณตนพึ่งพาสองมือ ปิดการทำงานของระบบบอทอัตโนมัติทั้งหมด',
    enDesc: 'Vow of self-reliance disabling all Automation bot modules',
    handicapDesc: 'ระบบบอทอัตโนมัติทั้งหมดถูกระงับการทำงาน (ต้องสั่งการด้วยมือ)',
    enHandicapDesc: 'All Automation bots suppressed (must manually purchase & manage)',
    rewardDesc: 'ได้รับเมล็ดนิรันดร์ +50% และละอองชีวิต (🌍) +35%',
    enRewardDesc: '+50% Eternal Seeds & +35% Gaia Essences earned upon Transcendence',
    seedsBonusPct: 50,
    essencesBonusPct: 35,
  },
  {
    id: 'pact_dim_resonance',
    name: 'รากไร้ประกาย',
    enName: 'Dim Resonance',
    icon: '🌑',
    desc: 'คลื่นพลังงานใต้ผืนดินหม่นหมอง ลดทอนการสะท้อนและการประสานของราก',
    enDesc: 'Dim subterranean harmonics dulling echo chambers and mycorrhizal networks',
    handicapDesc: 'โบนัสจากการสะท้อนราก (Echoes) และเครือข่ายราก (Synergies) ลดลง 50%',
    enHandicapDesc: 'Echo Chamber & Mycorrhizal Network bonuses reduced by 50%',
    rewardDesc: 'ได้รับเมล็ดพันธุ์นิรันดร์เมื่อ Prestige เพิ่มขึ้น +25%',
    enRewardDesc: '+25% Eternal Seeds earned upon Prestige',
    seedsBonusPct: 25,
  },
  {
    id: 'pact_unstable_aether',
    name: 'มวลสารผันผวน',
    enName: 'Unstable Aether',
    icon: '⚡',
    desc: 'กระแสเอเธอร์แปรปรวน อีเวนต์สุ่มเกิดยากขึ้น แต่โอกาสพบวัตถุล้ำค่าสูงขึ้น',
    enDesc: 'Turbulent aether currents slowing random anomalies while boosting serendipity',
    handicapDesc: 'คูลดาวน์อีเวนต์สุ่มเกิดช้าลง 40% (×1.40)',
    enHandicapDesc: 'Random event cooldown increased by 40% (×1.40)',
    rewardDesc: 'โอกาสค้นพบโบราณวัตถุเพิ่มขึ้น ×1.25 (+25% ของโอกาสเดิม) และเมล็ด +15%',
    enRewardDesc: 'Relic unearth chance ×1.25 (+25% relative) & +15% Eternal Seeds',
    seedsBonusPct: 15,
  },
];

export function isPactActive(state: GameState, pactId: PactId): boolean {
  if (isInTrial(state)) return false;
  return !!state.pacts?.[pactId];
}

export function pactRateMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  let mult = 1.0;
  if (state.pacts?.['pact_arid_soil']) mult *= 0.80;
  return mult;
}

export function pactCostMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  let mult = 1.0;
  if (state.pacts?.['pact_scarcity']) mult *= 1.30;
  return mult;
}

export function pactDisableAuto(state: GameState): boolean {
  if (isInTrial(state)) return false;
  return !!state.pacts?.['pact_manual'];
}

export function pactResonanceMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  return state.pacts?.['pact_dim_resonance'] ? 0.50 : 1.0;
}

export function pactEventIntervalMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  return state.pacts?.['pact_unstable_aether'] ? 1.40 : 1.0;
}

export function pactRelicDropMultiplier(state: GameState): number {
  if (isInTrial(state)) return 1.0;
  return state.pacts?.['pact_unstable_aether'] ? 1.25 : 1.0;
}

export function pactSeedsBonusMultiplier(state: GameState): number {
  if (isInTrial(state) || !state.pacts) return 1.0;
  let totalBonusPct = 0;
  for (const def of PACT_DEFS) {
    if (state.pacts[def.id]) {
      totalBonusPct += def.seedsBonusPct;
    }
  }
  return 1 + totalBonusPct * 0.01;
}

export function pactEssenceBonusMultiplier(state: GameState): number {
  if (isInTrial(state) || !state.pacts) return 1.0;
  let totalBonusPct = 0;
  for (const def of PACT_DEFS) {
    if (state.pacts[def.id] && def.essencesBonusPct) {
      totalBonusPct += def.essencesBonusPct;
    }
  }
  return 1 + totalBonusPct * 0.01;
}
