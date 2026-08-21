'use client';

import React from 'react';
import { GameState } from '@/types/game';
import { stageName } from '@/constants/gameData';
import { fmt } from '@/lib/formatters';
import { ACHIEVEMENTS } from '@/constants/achievementsData';

interface StatsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
}

function formatDuration(totalSeconds: number): string {
  const sec = Math.floor(totalSeconds || 0);
  if (sec < 60) return `${sec} วินาที`;
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600) % 24;
  const d = Math.floor(sec / 86400);

  if (d > 0) return `${d} วัน ${h} ชม. ${m} นาที`;
  if (h > 0) return `${h} ชม. ${m} นาที`;
  return `${m} นาที ${sec % 60} วินาที`;
}

export const StatsModal: React.FC<StatsModalProps> = React.memo(({
  isOpen,
  state,
  onClose,
}) => {
  if (!isOpen) return null;

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedAchievements = state.achievements?.length || 0;
  const achPercent = Math.round((unlockedAchievements / totalAchievements) * 100);

  const stats = state.stats || {
    prestigeCount: 0,
    totalEventsClaimed: 0,
    luckyJackpotCount: 0,
    maxOfflineTimeSeconds: 0,
    superJackpotClaimed: false,
    totalSeedsEarnedLifetime: state.eternalSeeds || 0,
    totalNutrientsEarnedLifetime: state.runEarned || state.nutrients || 0,
  };

  const lifetimeNutrients = stats.totalNutrientsEarnedLifetime || (state.runEarned + (stats.prestigeCount > 0 ? state.nutrients : 0));
  const lifetimeSeeds = Math.max(stats.totalSeedsEarnedLifetime || 0, state.eternalSeeds || 0);

  return (
    <div className="offline-backdrop" onClick={onClose}>
      <div className="modal-wrapper stats-modal-wrapper" onClick={e => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label="ปิด">
          &times;
        </button>

        <div className="offline-modal generic-modal stats-modal-content">
          <div className="icon">📊</div>
          <h2>สถิติ & บันทึกการเติบโต</h2>
          <div className="away-time" style={{ marginBottom: '14px' }}>
            ภาพรวมการเดินทางและความก้าวหน้าของรากไม้ของคุณ
          </div>

          <div className="stats-dashboard-grid">
            {/* 1. เวลา & การเดินทาง */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">⏱️</span>
                <span className="stats-card-title">เวลา & การเดินทาง</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">เวลาเล่นสะสมทั้งหมด:</span>
                  <span className="stats-value">{formatDuration(state.totalPlayTimeSeconds)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">เวลาในรอบปัจจุบัน:</span>
                  <span className="stats-value">{formatDuration(state.runPlayTimeSeconds)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">ระยะการเติบโต:</span>
                  <span className="stats-value highlight">{stageName(state.totalOwned)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">เวลาพักผ่อนออฟไลน์สูงสุด:</span>
                  <span className="stats-value">{formatDuration(stats.maxOfflineTimeSeconds)}</span>
                </div>
              </div>
            </div>

            {/* 2. ผลผลิต & สารอาหาร */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">💧</span>
                <span className="stats-card-title">ผลผลิต & สารอาหาร</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">สารอาหารปัจจุบัน:</span>
                  <span className="stats-value highlight">{fmt(state.nutrients)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">ผลิตได้ในรอบนี้:</span>
                  <span className="stats-value">{fmt(state.runEarned)}</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">สารอาหารสะสมตลอดกาล:</span>
                  <span className="stats-value golden">{fmt(lifetimeNutrients)}</span>
                </div>
              </div>
            </div>

            {/* 3. การหว่านใหม่ Prestige */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌌</span>
                <span className="stats-card-title">การหว่านใหม่ (Prestige)</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">จำนวนครั้งที่หว่านใหม่:</span>
                  <span className="stats-value purple">{stats.prestigeCount} ครั้ง</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">เมล็ดนิรันดร์ปัจจุบัน:</span>
                  <span className="stats-value purple">{fmt(state.eternalSeeds)} เมล็ด</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">เมล็ดนิรันดร์สะสมตลอดกาล:</span>
                  <span className="stats-value golden">{fmt(lifetimeSeeds)} เมล็ด</span>
                </div>
              </div>
            </div>

            {/* 4. ราก & ความสำเร็จ */}
            <div className="stats-card">
              <div className="stats-card-header">
                <span className="stats-card-icon">🌿</span>
                <span className="stats-card-title">ราก & ความสำเร็จ</span>
              </div>
              <div className="stats-card-rows">
                <div className="stats-row">
                  <span className="stats-label">จำนวนรากเสริมในรอบนี้:</span>
                  <span className="stats-value">{state.totalOwned} ท่อน</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">เหรียญความสำเร็จ:</span>
                  <span className="stats-value green">{unlockedAchievements} / {totalAchievements} ({achPercent}%)</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">อีเวนต์ที่เก็บได้ทั้งหมด:</span>
                  <span className="stats-value">{stats.totalEventsClaimed} ครั้ง</span>
                </div>
                <div className="stats-row">
                  <span className="stats-label">แจ็กพอตโชคดี (🍀 ×777):</span>
                  <span className="stats-value golden">{stats.luckyJackpotCount} ครั้ง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

StatsModal.displayName = 'StatsModal';
