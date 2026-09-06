'use client';

import React from 'react';
import { AutoRootMode, GameState, Language } from '@/types/game';
import { fmtInt } from '@/lib/formatters';
import { getActiveAutoRootMode, getAvailableAutoRootModes } from '@/lib/autoBuyer';
import { t } from '@/lib/i18n';

interface AutomationModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onToggleAutoRoot?: () => void;
  onSetAutoRootMode?: (mode: AutoRootMode) => void;
  onToggleAutoEvent?: () => void;
  onToggleAutoReset?: () => void;
  onOpenAutoResetConfig?: () => void;
}

export const AutomationModal: React.FC<AutomationModalProps> = ({
  isOpen,
  state,
  onClose,
  onToggleAutoRoot,
  onSetAutoRootMode,
  onToggleAutoEvent,
  onToggleAutoReset,
  onOpenAutoResetConfig,
}) => {
  if (!isOpen) return null;

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const isVoidTrial = state.transcendence?.activeTrial === 'void_anomaly';

  const availableAutoModes = getAvailableAutoRootModes(state);
  const activeAutoMode = getActiveAutoRootMode(state);

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

        <div className="offline-modal generic-modal" style={{ padding: '20px 24px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
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
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 1. Auto Root Buyer */}
          {state.prestige.autoRoot ? (
            <div
              className={`prestige-item ${!state.prestige.autoRootEnabled ? 'toggled-off' : ''}`}
              style={{ padding: '14px', borderRadius: '12px' }}
            >
              <div
                className="p-top"
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={onToggleAutoRoot}
              >
                <span style={{ fontWeight: 700, fontSize: '14px' }}>🌱 {isEn ? 'Auto Root Buyer' : 'ออโต้ซื้อราก & โบราณวัตถุ'}</span>
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
                    ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่')
                    : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ margin: '6px 0 10px', fontSize: '11.5px' }}>
                {isVoidTrial && state.prestige.autoRootEnabled
                  ? (isEn
                    ? '⚠️ Dimensional interference is currently suppressing this bot. It will automatically reactivate once the trial is conquered.'
                    : '⚠️ สนามพลังมิติสุญญะกำลังรบกวน บอทถูกระงับชั่วคราวและจะกลับมาทำงานอัตโนมัติเมื่อพิชิตด่านสำเร็จ')
                  : state.prestige.autoRootEnabled
                  ? (isEn ? 'Purchasing roots and claiming unearthed relics autonomously.' : 'ซื้อรากและช่วยเก็บโบราณวัตถุให้อัตโนมัติต่อเนื่อง (คลิกแถบด้านบนเพื่อเปิด/ปิด)')
                  : (isEn ? 'Disabled temporarily (Click header to resume)' : 'ปิดอยู่ชั่วคราว (คลิกแถบด้านบนเพื่อเปิดทำงาน)')}
              </div>

              {/* Mode Selector */}
              {availableAutoModes.length > 1 && onSetAutoRootMode && (
                <div style={{ background: 'var(--bg-panel-2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line-soil)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginBottom: '6px', fontWeight: 600 }}>
                    {isEn ? 'Select Intelligence Tier:' : 'เลือกระดับความฉลาดในการซื้อ:'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {availableAutoModes.map(m => {
                      const isActive = activeAutoMode === m && state.prestige.autoRootEnabled;
                      const titles: Record<AutoRootMode, string> = {
                        basic: tr.autoCheapest,
                        smart: tr.autoSmart,
                        all: tr.autoAll,
                      };
                      return (
                        <button
                          key={m}
                          onClick={e => {
                            e.stopPropagation();
                            onSetAutoRootMode(m);
                          }}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '11.5px',
                            fontWeight: 600,
                            background: isActive ? 'var(--accent-glow)' : 'transparent',
                            color: isActive ? '#12190d' : 'var(--root-cream-dim)',
                            border: isActive ? '1px solid var(--accent-glow)' : '1px solid var(--line-soil)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          {titles[m]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--bg-panel-2)', border: '1px dashed var(--line-soil)', borderRadius: '12px', padding: '14px', textAlign: 'center', color: 'var(--root-cream-dim)', fontSize: '12px' }}>
              🔒 {isEn ? 'Auto Root Buyer is available in the Prestige Shop' : 'ปลดล็อก ออโต้ซื้อราก ได้ในร้านค้าหว่านใหม่ (Prestige)'}
            </div>
          )}

          {/* 2. Auto Event Clicker */}
          {state.prestige.autoEvent && onToggleAutoEvent ? (
            <div
              onClick={onToggleAutoEvent}
              className={`prestige-item ${!state.prestige.autoEventEnabled ? 'toggled-off' : ''}`}
              style={{ padding: '14px', borderRadius: '12px', cursor: 'pointer' }}
            >
              <div className="p-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>🎯 {isEn ? 'Auto Event Clicker' : 'ออโต้เก็บอีเวนต์ & ลัคกี้'}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isVoidTrial && state.prestige.autoEventEnabled ? '#c084fc' : state.prestige.autoEventEnabled ? 'var(--accent-glow)' : 'var(--root-cream-dim)',
                  }}
                >
                  {isVoidTrial && state.prestige.autoEventEnabled
                    ? (isEn ? '🚫 SUPPRESSED' : '🚫 ถูกปิดกั้นชั่วคราว')
                    : state.prestige.autoEventEnabled
                    ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่')
                    : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ marginTop: '6px', fontSize: '11.5px' }}>
                {isVoidTrial && state.prestige.autoEventEnabled
                  ? (isEn
                    ? '⚠️ Dimensional interference is currently suppressing this bot. It will automatically reactivate once the trial is conquered.'
                    : '⚠️ สนามพลังมิติสุญญะกำลังรบกวน บอทถูกระงับชั่วคราวและจะกลับมาทำงานอัตโนมัติเมื่อพิชิตด่านสำเร็จ')
                  : state.prestige.autoEventEnabled
                  ? (isEn ? 'Automatically claims floating buffs and jackpots without sound.' : 'กดเก็บไอคอนโชคลาภ/บัฟเร่งความเร็วที่ลอยขึ้นมาให้อัตโนมัติ (คลิกเพื่อเปิด/ปิด)')
                  : (isEn ? 'Disabled temporarily (Click to enable)' : 'ปิดอยู่ชั่วคราว (คลิกเพื่อเปิดทำงาน)')}
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-panel-2)', border: '1px dashed var(--line-soil)', borderRadius: '12px', padding: '14px', textAlign: 'center', color: 'var(--root-cream-dim)', fontSize: '12px' }}>
              🔒 {isEn ? 'Auto Event Clicker is available in the Prestige Shop' : 'ปลดล็อก ออโต้อีเวนต์ ได้ในร้านค้าหว่านใหม่ (Prestige)'}
            </div>
          )}

          {/* 3. Auto Re-sow (Prestige) */}
          {state.prestige.autoReset ? (
            <div
              className={`prestige-item ${!state.prestige.autoResetEnabled ? 'toggled-off' : ''}`}
              style={{ padding: '14px', borderRadius: '12px' }}
            >
              <div className="p-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>🌌 {isEn ? 'Auto Re-sow (Prestige)' : 'ออโต้หว่านใหม่อัตโนมัติ'}</span>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isVoidTrial && state.prestige.autoResetEnabled ? '#c084fc' : state.prestige.autoResetEnabled ? 'var(--prestige-accent)' : 'var(--root-cream-dim)',
                  }}
                >
                  {isVoidTrial && state.prestige.autoResetEnabled
                    ? (isEn ? '🚫 SUPPRESSED' : '🚫 ถูกปิดกั้นชั่วคราว')
                    : state.prestige.autoResetEnabled
                    ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่')
                    : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ margin: '6px 0 10px', fontSize: '11.5px' }}>
                {isVoidTrial && state.prestige.autoResetEnabled
                  ? (isEn
                    ? '⚠️ Dimensional interference is currently suppressing this bot. It will automatically reactivate once the trial is conquered.'
                    : '⚠️ สนามพลังมิติสุญญะกำลังรบกวน บอทถูกระงับชั่วคราวและจะกลับมาทำงานอัตโนมัติเมื่อพิชิตด่านสำเร็จ')
                  : state.prestige.autoResetEnabled
                  ? (isEn
                    ? `Triggers automatically when reaching ≥${fmtInt(state.prestige.autoResetThreshold || 1000)} Eternal Seeds.`
                    : `หว่านใหม่อัตโนมัติทันทีที่สะสมได้ครบตามเป้าหมาย (≥${fmtInt(state.prestige.autoResetThreshold || 1000)} เมล็ด)`)
                  : (isEn ? 'Disabled' : 'ปิดอยู่')}
              </div>
              <div className="auto-cfg-actions" style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="auto-cfg-btn"
                  onClick={() => {
                    if (onOpenAutoResetConfig) onOpenAutoResetConfig();
                  }}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer' }}
                >
                  ⚙️ {isEn ? `Edit Target (≥${fmtInt(state.prestige.autoResetThreshold || 1000)})` : `ตั้งค่าเป้าหมาย (≥${fmtInt(state.prestige.autoResetThreshold || 1000)} เมล็ด)`}
                </button>
                <button
                  type="button"
                  className={`auto-cfg-btn ${state.prestige.autoResetEnabled ? 'toggle-on' : 'toggle-off'}`}
                  onClick={onToggleAutoReset}
                  style={{ padding: '7px 14px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {state.prestige.autoResetEnabled ? (isEn ? 'Turn OFF' : 'ปิดการทำงาน') : (isEn ? 'Turn ON' : 'เปิดการทำงาน')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-panel-2)', border: '1px dashed var(--line-soil)', borderRadius: '12px', padding: '14px', textAlign: 'center', color: 'var(--root-cream-dim)', fontSize: '12px' }}>
              🔒 {isEn ? 'Auto Re-sow is available in the Prestige Shop' : 'ปลดล็อก ออโต้หว่านใหม่ ได้ในร้านค้าหว่านใหม่ (Prestige)'}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};
