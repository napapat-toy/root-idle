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

  const availableAutoModes = getAvailableAutoRootModes(state);
  const activeAutoMode = getActiveAutoRootMode(state);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          width: '94vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line-soil)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--root-cream)' }}>
                {isEn ? 'Automation Control Hub' : 'ศูนย์ควบคุมระบบอัตโนมัติ'}
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--root-cream-dim)' }}>
                {isEn ? 'Manage autonomous bots and prestige routines' : 'จัดการสวิตช์และระดับการทำงานของระบบออโต้'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '20px',
              color: 'var(--root-cream-dim)',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            ✕
          </button>
        </div>

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
                <span style={{ fontSize: '12px', fontWeight: 700, color: state.prestige.autoRootEnabled ? 'var(--accent-glow)' : 'var(--root-cream-dim)' }}>
                  {state.prestige.autoRootEnabled ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่') : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ margin: '6px 0 10px', fontSize: '11.5px' }}>
                {state.prestige.autoRootEnabled
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
                <span style={{ fontSize: '12px', fontWeight: 700, color: state.prestige.autoEventEnabled ? 'var(--accent-glow)' : 'var(--root-cream-dim)' }}>
                  {state.prestige.autoEventEnabled ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่') : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ marginTop: '6px', fontSize: '11.5px' }}>
                {state.prestige.autoEventEnabled
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
                <span style={{ fontSize: '12px', fontWeight: 700, color: state.prestige.autoResetEnabled ? 'var(--prestige-accent)' : 'var(--root-cream-dim)' }}>
                  {state.prestige.autoResetEnabled ? (isEn ? '🟢 ENABLED' : '🟢 เปิดอยู่') : (isEn ? '⚪ DISABLED' : '⚪ ปิดอยู่')}
                </span>
              </div>
              <div className="p-desc" style={{ margin: '6px 0 10px', fontSize: '11.5px' }}>
                {state.prestige.autoResetEnabled
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
  );
};
