'use client';

import React from 'react';
import { GameState, Language } from '@/types/game';
import { t } from '@/lib/i18n';

interface AutomationModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onToggleAutoRoot?: () => void;
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  isOpen,
  state,
  onClose,
  onToggleAutoRoot,
}) => {
  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const isVoidTrial = state.transcendence?.activeTrial === 'void_anomaly';

  return (
    <div className="offline-backdrop" onClick={onClose} style={{ zIndex: 2100 }}>
      <div
        className="modal-wrapper"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '520px', width: '100%' }}
      >
        <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
          &times;
        </button>

        <div className="offline-modal generic-modal" style={{ padding: 'clamp(14px, 3.5vw, 20px)', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="icon" style={{ fontSize: '32px', marginBottom: '6px' }}>🤖</div>
          <h2 style={{ marginBottom: '4px' }}>
            {isEn ? 'Automation Control Hub' : 'ศูนย์ควบคุมระบบอัตโนมัติ'}
          </h2>
          <div className="away-time" style={{ marginBottom: '16px', fontSize: '12px' }}>
            {isEn ? 'Manage autonomous bots and prestige routines' : 'จัดการสวิตช์และระดับการทำงานของระบบออโต้'}
          </div>

          {/* Void Anomaly Interference Warning Banner */}
          {isVoidTrial && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(99, 102, 241, 0.12))',
                border: '1px solid rgba(192, 132, 252, 0.45)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                color: '#e9d5ff',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
                lineHeight: '1.45',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '22px', flexShrink: 0 }}>🌌</span>
              <div>
                <strong style={{ color: '#ffffff' }}>
                  {isEn ? 'Void Anomaly Active: ' : 'กำลังอยู่ในการทดลอง "รอยแยกสูญญะ": '}
                </strong>
                {isEn
                  ? 'All automation bots are temporarily suppressed by dimensional interference until you grow 25 World Trees.'
                  : 'ระบบบอททั้งหมดถูกสนามพลังมิติสุญญะปิดกั้นชั่วคราว (ไม่ทำงาน) จนกว่าจะปลูกรากต้นไม้โลกครบ 25 ต้นเพื่อพิชิตการทดลอง!'}
              </div>
            </div>
          )}

        {/* Automation Items Container */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Universal Automation Control */}
          {state.prestige.autoRoot ? (
            <div
              className={`prestige-item ${!state.prestige.autoRootEnabled ? 'toggled-off' : ''}`}
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer' }}
              onClick={onToggleAutoRoot}
            >
              <div
                className="p-top"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontWeight: 700, fontSize: '15px' }}>♾️ {isEn ? 'Universal Automation' : 'ออโต้สรรพสิ่ง (All-in-One)'}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isVoidTrial && state.prestige.autoRootEnabled ? '#c084fc' : state.prestige.autoRootEnabled ? 'var(--accent-glow)' : 'var(--root-cream-dim)',
                  }}
                >
                  {isVoidTrial && state.prestige.autoRootEnabled
                    ? (isEn ? '🚫 SUPPRESSED' : '🚫 ถูกปิดกั้นชั่วคราว')
                    : state.prestige.autoRootEnabled
                    ? (isEn ? '🟢 ACTIVE' : '🟢 เปิดใช้งานอยู่')
                    : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ margin: '8px 0 12px', fontSize: '12px', lineHeight: '1.5' }}>
                {isVoidTrial && state.prestige.autoRootEnabled
                  ? (isEn
                    ? '⚠️ Dimensional interference is currently suppressing this bot. It will automatically reactivate once the trial is conquered.'
                    : '⚠️ สนามพลังมิติสุญญะกำลังรบกวน บอทถูกระงับชั่วคราวและจะกลับมาทำงานอัตโนมัติเมื่อพิชิตด่านสำเร็จ')
                  : state.prestige.autoRootEnabled
                  ? (isEn
                    ? 'Autonomous master active: Purchasing high-ROI roots (10-25 packs), upgrades, echoes, species networks & claiming floating events.'
                    : 'ระบบทำงานครบวงจร: วิเคราะห์ซื้อรากที่คุ้มค่า (เหมาซื้อ 10-25 ต้น), อัปเกรดราก, ปลุกเสียงสะท้อน, สร้างเครือข่ายรากไม้ และช่วยคลิกเก็บอีเวนต์ลอย')
                  : (isEn ? 'Disabled temporarily (Click card to resume)' : 'ปิดอยู่ชั่วคราว (คลิกการ์ดนี้เพื่อเปิดทำงาน)')}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`auto-cfg-btn ${state.prestige.autoRootEnabled ? 'toggle-on' : 'toggle-off'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onToggleAutoRoot) onToggleAutoRoot();
                  }}
                  style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {state.prestige.autoRootEnabled ? (isEn ? 'Turn OFF' : 'ปิดการทำงานชั่วคราว') : (isEn ? 'Turn ON' : 'เปิดการทำงาน')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-panel-2)', border: '1px dashed var(--line-soil)', borderRadius: '12px', padding: '18px', textAlign: 'center', color: 'var(--root-cream-dim)', fontSize: '12.5px' }}>
              🔒 {isEn ? 'Universal Automation is available in the Prestige Shop (10,000 Seeds)' : 'ปลดล็อก ออโต้สรรพสิ่ง ได้ในร้านค้าหว่านใหม่ (10,000 เมล็ดนิรันดร์)'}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};
