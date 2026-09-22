import { AchievementDef } from '@/types/achievements';

export const TIME_ACHIEVEMENTS: AchievementDef[] = [
// ===== ⏳ หมวด 6: เวลา & ความผูกพัน (Dedication & Time) =====
  {
    id: 'playtime_10m',
    category: 'time',
    title: 'รดน้ำอย่างใจเย็น',
    desc: 'เวลาเล่นสะสมรวมครบ 10 นาที',
    icon: '⏱️',
    bonusPct: 1,
    check: (s) => s.totalPlayTimeSeconds >= 600,
  },
  {
    id: 'playtime_1h',
    category: 'time',
    title: 'ผู้เฝ้ามองราก',
    desc: 'เวลาเล่นสะสมรวมครบ 1 ชั่วโมง',
    icon: '⏳',
    bonusPct: 3,
    check: (s) => s.totalPlayTimeSeconds >= 3600,
  },
  {
    id: 'playtime_12h',
    category: 'time',
    title: 'ป่าไม้ตลอดกาล',
    desc: 'เวลาเล่นสะสมรวมครบ 12 ชั่วโมง',
    icon: '🏆',
    bonusPct: 7,
    check: (s) => s.totalPlayTimeSeconds >= 43200,
  },
  {
    id: 'playtime_24h',
    category: 'time',
    title: 'ผู้พิทักษ์ผืนป่า',
    desc: 'เวลาเล่นสะสมรวมครบ 24 ชั่วโมง (1 วันเต็ม)',
    icon: '🛡️',
    bonusPct: 10,
    check: (s) => s.totalPlayTimeSeconds >= 86400,
  },
  {
    id: 'offline_1h',
    category: 'time',
    title: 'กลับมาดูแล',
    desc: 'เก็บผลผลิตออฟไลน์ (Offline Gain) ที่หายไปเกิน 1 ชั่วโมง',
    icon: '🏡',
    bonusPct: 2,
    check: (s) => (s.stats?.maxOfflineTimeSeconds || 0) >= 3600,
  },
  {
    id: 'offline_24h',
    category: 'time',
    title: 'การหลับใหลอันยาวนาน',
    desc: 'เก็บผลผลิตออฟไลน์ (Offline Gain) ที่หายไปเกิน 24 ชั่วโมง',
    icon: '💤',
    bonusPct: 8,
    check: (s) => (s.stats?.maxOfflineTimeSeconds || 0) >= 86400,
  },
];
