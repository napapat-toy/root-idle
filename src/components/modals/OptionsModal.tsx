'use client';

import React, { useState, useEffect } from 'react';
import { AutoRootMode, GameState, Language, SaveSlotMeta, SkinId } from '@/types/game';
import { GAME_VERSION, SAVE_SLOT_COUNT, SKIN_DEFS } from '@/constants/gameData';
import { decodeSave, getSlotMeta } from '@/lib/storage';
import { fmtInt } from '@/lib/formatters';
import { getActiveAutoRootMode, getAvailableAutoRootModes } from '@/lib/autoBuyer';
import { ConfirmModal } from './ConfirmModal';
import { SKIN_NAMES, t } from '@/lib/i18n';

interface OptionsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onSelectSkin: (id: SkinId) => void;
  onExport: () => string;
  onImport: (code: string) => void;
  onSaveSlot: (slot: number) => void;
  onLoadSlot: (slot: number) => void;
  onDeleteSlot: (slot: number) => void;
  onHardReset: () => void;
  onSetLanguage?: (lang: Language) => void;
  onToggleAutoRoot?: () => void;
  onSetAutoRootMode?: (mode: AutoRootMode) => void;
  onToggleAutoEvent?: () => void;
  onToggleAutoReset?: () => void;
  onOpenAutoResetConfig?: () => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  state,
  onClose,
  onSelectSkin,
  onExport,
  onImport,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
  onHardReset,
  onSetLanguage,
  onToggleAutoRoot,
  onSetAutoRootMode,
  onToggleAutoEvent,
  onToggleAutoReset,
  onOpenAutoResetConfig,
}) => {
  const [subModal, setSubModal] = useState<'none' | 'export' | 'import'>('none');
  const [exportCode, setExportCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  const [slotsMeta, setSlotsMeta] = useState<Record<number, SaveSlotMeta | null>>({});

  const lang: Language = state.lang || 'th';
  const isEn = lang === 'en';
  const tr = t(lang);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  const refreshSlots = () => {
    const metas: Record<number, SaveSlotMeta | null> = {};
    for (let i = 1; i <= SAVE_SLOT_COUNT; i++) {
      metas[i] = getSlotMeta(i);
    }
    setSlotsMeta(metas);
  };

  useEffect(() => {
    if (isOpen) {
      refreshSlots();
      setSubModal('none');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSkinOwned = (id: SkinId) => {
    if (id === 'none') return true;
    if (id === 'rainbow') return state.prestige.auraRoots;
    if (id === 'sameorigin') return state.prestige.skinSameOrigin;
    if (id === 'grayscale') return state.prestige.skinGrayscale;
    if (id === 'gradient') return state.prestige.skinGradient;
    return false;
  };

  const handleExportClick = () => {
    const code = onExport();
    setExportCode(code);
    setCopySuccess(false);
    setSubModal('export');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportCode);
      setCopySuccess(true);
    } catch {
      setCopySuccess(true);
    }
  };

  const handleImportSubmit = () => {
    const raw = importCode.trim();
    if (!raw) {
      setImportError(isEn ? 'Please paste your save code' : 'กรุณาวางโค้ดเซฟ');
      return;
    }

    try {
      decodeSave(raw);
      setImportError('');
    } catch {
      setImportError(isEn ? 'Invalid or corrupted save code. Please recheck.' : 'โค้ดไม่ถูกต้องหรือเสียหาย ลองตรวจสอบอีกครั้ง');
      return;
    }

    setConfirmState({
      isOpen: true,
      title: isEn ? 'Confirm Import Save' : 'ยืนยันการนำเข้าเซฟ',
      message: isEn
        ? 'Importing will overwrite your current progress entirely. Continue?'
        : 'การนำเข้าจะเขียนทับ progress ปัจจุบันทั้งหมด ยืนยันที่จะนำเข้าหรือไม่?',
      action: () => {
        try {
          onImport(raw);
          setSubModal('none');
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          onClose();
        } catch {
          setImportError(isEn ? 'Failed to parse save code' : 'เกิดข้อผิดพลาดในการโหลดเซฟ');
        }
      },
    });
  };

  const handleSaveSlot = (slot: number) => {
    const existing = slotsMeta[slot];
    const doSave = () => {
      onSaveSlot(slot);
      refreshSlots();
      setConfirmState(prev => ({ ...prev, isOpen: false }));
    };

    if (existing) {
      setConfirmState({
        isOpen: true,
        title: isEn ? 'Confirm Overwrite Slot' : 'ยืนยันการทำรายการ',
        message: isEn ? `Slot ${slot} already contains saved data. Overwrite it?` : `ช่อง ${slot} มีเซฟอยู่แล้ว บันทึกทับเลยไหม?`,
        action: doSave,
      });
    } else {
      doSave();
    }
  };

  const handleLoadSlot = (slot: number) => {
    setConfirmState({
      isOpen: true,
      title: isEn ? 'Confirm Load Slot' : 'ยืนยันการทำรายการ',
      message: isEn
        ? `Loading Slot ${slot} will overwrite current progress. Proceed?`
        : `โหลดช่อง ${slot} จะเขียนทับ progress ปัจจุบันทั้งหมด ยืนยันไหม?`,
      action: () => {
        onLoadSlot(slot);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
        onClose();
      },
    });
  };

  const handleDeleteSlot = (slot: number) => {
    setConfirmState({
      isOpen: true,
      title: isEn ? 'Confirm Delete Slot' : 'ยืนยันการทำรายการ',
      message: isEn ? `Delete Save Slot ${slot}? This cannot be undone.` : `ลบเซฟช่อง ${slot} ใช่ไหม? กู้คืนไม่ได้`,
      action: () => {
        onDeleteSlot(slot);
        refreshSlots();
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleHardResetClick = () => {
    setConfirmState({
      isOpen: true,
      title: isEn ? 'Danger: Hard Reset' : 'ยืนยันการทำรายการ',
      message: isEn
        ? '⚠️ This will permanently delete ALL progress including Eternal Seeds and Prestige upgrades. Proceed?'
        : '⚠️ การกระทำนี้จะลบทุกอย่างอย่างถาวร รวมถึงเมล็ดนิรันดร์และของที่ซื้อในร้าน Prestige ทั้งหมด ไม่สามารถย้อนกลับได้ ยืนยันจะเริ่มใหม่จาก 0 ใช่ไหม?',
      action: () => {
        setConfirmState({
          isOpen: true,
          title: isEn ? 'Final Confirmation' : 'ยืนยันการทำรายการ',
          message: isEn ? 'Final warning: Absolutely irreversible. Are you 100% sure?' : 'ยืนยันอีกครั้ง — กดแล้วกู้คืนไม่ได้เลย แน่ใจจริงๆ นะ?',
          action: () => {
            onHardReset();
            setConfirmState(prev => ({ ...prev, isOpen: false }));
            onClose();
          },
        });
      },
    });
  };

  const hasAnyAuto = state.prestige.autoRoot || state.prestige.autoEvent || state.prestige.autoReset;
  const availableAutoModes = getAvailableAutoRootModes(state);
  const activeAutoMode = getActiveAutoRootMode(state);

  return (
    <>
      <div className="offline-backdrop" onClick={onClose}>
        <div className="modal-wrapper options-modal-wrapper" onClick={e => e.stopPropagation()}>
          <button className="modal-close-x" onClick={onClose} aria-label={tr.close}>
            &times;
          </button>

          <div className="offline-modal generic-modal options-modal-content">
            {subModal === 'none' && (
              <>
                <div className="icon">⚙️</div>
                <h2>{tr.optionsTitle}</h2>

                {/* Language Selection */}
                {onSetLanguage && (
                  <>
                    <div className="panel-title" style={{ margin: '12px 0 8px', textAlign: 'left' }}>
                      {tr.langSelectorTitle}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                      <button
                        onClick={() => onSetLanguage('th')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          background: lang === 'th' ? 'var(--accent-glow-dim)' : 'var(--bg-panel-2)',
                          color: lang === 'th' ? '#12190d' : 'var(--root-cream)',
                          borderColor: lang === 'th' ? 'var(--accent-glow)' : 'var(--line-soil)',
                          fontWeight: lang === 'th' ? 700 : 500,
                        }}
                      >
                        🇹🇭 ภาษาไทย (TH)
                      </button>
                      <button
                        onClick={() => onSetLanguage('en')}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          background: lang === 'en' ? 'var(--accent-glow-dim)' : 'var(--bg-panel-2)',
                          color: lang === 'en' ? '#12190d' : 'var(--root-cream)',
                          borderColor: lang === 'en' ? 'var(--accent-glow)' : 'var(--line-soil)',
                          fontWeight: lang === 'en' ? 700 : 500,
                        }}
                      >
                        🇬🇧 English (EN)
                      </button>
                    </div>
                  </>
                )}

                {/* Automation Toggles */}
                {hasAnyAuto && (
                  <>
                    <div className="panel-title" style={{ margin: '12px 0 8px', textAlign: 'left' }}>
                      {tr.automationTogglesTitle}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      {state.prestige.autoRoot && (
                        <div className={`prestige-item ${!state.prestige.autoRootEnabled ? 'toggled-off' : ''}`}>
                          <div
                            className="p-top"
                            style={{ cursor: 'pointer' }}
                            onClick={onToggleAutoRoot}
                          >
                            <span>🤖 {isEn ? 'Auto Root Buyer' : 'ออโต้ซื้อราก'}</span>
                            <span>{state.prestige.autoRootEnabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่')}</span>
                          </div>
                          <div className="p-desc" style={{ marginBottom: '8px' }}>
                            {state.prestige.autoRootEnabled
                              ? (isEn ? 'Running autonomously (Click header to toggle)' : 'กำลังทำงานอัตโนมัติ (คลิกข้อความด้านบนเพื่อเปิด/ปิด)')
                              : (isEn ? 'Disabled (Click header to enable)' : 'ปิดอยู่ (คลิกข้อความด้านบนเพื่อเปิดทำงาน)')}
                          </div>

                          {/* Mode Selector */}
                          {availableAutoModes.length > 1 && onSetAutoRootMode && (
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginBottom: '4px' }}>
                                {isEn ? 'Select Intelligence Tier:' : 'เลือกระดับการทำงาน:'}
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
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
                                        padding: '4px 6px',
                                        fontSize: '11px',
                                        background: isActive ? 'var(--accent-glow-dim)' : 'var(--bg-panel-2)',
                                        color: isActive ? '#12190d' : 'var(--root-cream-dim)',
                                        borderColor: isActive ? 'var(--accent-glow-dim)' : 'var(--line-soil)',
                                        borderRadius: '6px',
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
                      )}

                      {state.prestige.autoEvent && onToggleAutoEvent && (
                        <div
                          onClick={onToggleAutoEvent}
                          className={`prestige-item ${!state.prestige.autoEventEnabled ? 'toggled-off' : ''}`}
                        >
                          <div className="p-top">
                            <span>🎯 {isEn ? 'Auto Event Clicker' : 'ออโต้อีเว้น'}</span>
                            <span>{state.prestige.autoEventEnabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่')}</span>
                          </div>
                          <div className="p-desc">
                            {state.prestige.autoEventEnabled
                              ? (isEn ? 'Collecting floating events (Click to toggle)' : 'กำลังกดเก็บอีเว้นให้อัตโนมัติ (คลิกเพื่อปิดชั่วคราว)')
                              : (isEn ? 'Disabled (Click to enable)' : 'ปิดอยู่ (คลิกเพื่อเปิดทำงาน)')}
                          </div>
                        </div>
                      )}

                      {state.prestige.autoReset && (
                        <div className={`prestige-item ${!state.prestige.autoResetEnabled ? 'toggled-off' : ''}`}>
                          <div className="p-top">
                            <span>🔁 {isEn ? 'Auto Re-sow (Prestige)' : 'ออโต้หว่านใหม่'}</span>
                            <span style={{ color: state.prestige.autoResetEnabled ? 'var(--prestige-accent)' : 'var(--root-cream-dim)' }}>
                              {state.prestige.autoResetEnabled ? (isEn ? '🟢 Enabled' : '🟢 เปิดอยู่') : (isEn ? '⚪ Disabled' : '⚪ ปิดอยู่')}
                            </span>
                          </div>
                          <div className="p-desc">
                            {state.prestige.autoResetEnabled
                              ? (isEn
                                ? `Triggers automatically when reaching ≥${fmtInt(state.prestige.autoResetThreshold || 1000)} Eternal Seeds.`
                                : `หว่านใหม่อัตโนมัติทันทีที่สะสมได้ครบตามเป้าหมาย (≥${fmtInt(state.prestige.autoResetThreshold || 1000)} เมล็ด)`)
                              : (isEn ? 'Disabled' : 'ปิดอยู่')}
                          </div>
                          <div className="auto-cfg-actions">
                            <button
                              type="button"
                              className="auto-cfg-btn"
                              onClick={() => {
                                if (onOpenAutoResetConfig) onOpenAutoResetConfig();
                              }}
                            >
                              ⚙️ {isEn ? `Edit Target (≥${fmtInt(state.prestige.autoResetThreshold || 1000)})` : `ตั้งค่าเป้าหมาย (≥${fmtInt(state.prestige.autoResetThreshold || 1000)} เมล็ด)`}
                            </button>
                            <button
                              type="button"
                              className={`auto-cfg-btn ${state.prestige.autoResetEnabled ? 'toggle-on' : 'toggle-off'}`}
                              onClick={onToggleAutoReset}
                            >
                              {state.prestige.autoResetEnabled ? (isEn ? 'Turn OFF' : 'ปิดการทำงาน') : (isEn ? 'Turn ON' : 'เปิดการทำงาน')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Skins */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  {tr.skinPickerTitle}
                </div>
                <div style={{ textAlign: 'left' }}>
                  {SKIN_DEFS.map(sd => {
                    const owned = isSkinOwned(sd.id);
                    const active = state.prestige.activeSkin === sd.id;
                    const localizedSkinName = SKIN_NAMES[sd.id]?.[lang] || sd.name;

                    return (
                      <div
                        key={sd.id}
                        onClick={owned && !active ? () => onSelectSkin(sd.id) : undefined}
                        className={`prestige-item ${!owned ? 'disabled' : ''} ${
                          active ? 'skin-active' : ''
                        }`}
                      >
                        <div className="p-top">
                          <span>{localizedSkinName}</span>
                          <span>{active ? (isEn ? '✓ Equipped' : '✓ ใช้อยู่') : owned ? '' : (isEn ? '🔒 Locked' : '🔒 ยังไม่ปลดล็อก')}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Export / Import */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  {tr.exportImportTitle}
                </div>
                <div className="modal-actions" style={{ marginBottom: '14px' }}>
                  <button onClick={handleExportClick}>📤 {isEn ? 'Export Save Code' : 'Export โค้ดเซฟ'}</button>
                  <button
                    onClick={() => {
                      setImportCode('');
                      setImportError('');
                      setSubModal('import');
                    }}
                  >
                    📥 {isEn ? 'Import Save Code' : 'Import โค้ดเซฟ'}
                  </button>
                </div>

                {/* Save Slots */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  {tr.saveSlotsTitle}
                </div>
                <div style={{ textAlign: 'left' }}>
                  {Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => i + 1).map(slot => {
                    const meta = slotsMeta[slot];
                    const summary = meta
                      ? isEn
                        ? `Saved on ${new Date(meta.savedAt).toLocaleString('en-US', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })} · ${meta.totalOwned || 0} roots · ${fmtInt(meta.seeds || 0)} seeds`
                        : `บันทึกเมื่อ ${new Date(meta.savedAt).toLocaleString('th-TH', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })} · ${meta.totalOwned || 0} ต้น (รวมทุกชนิด) · ${fmtInt(meta.seeds || 0)} เมล็ด`
                      : tr.emptySlot;

                    return (
                      <div key={slot} className="prestige-item slot-item">
                        <div className="p-top">
                          <span>{isEn ? `Slot ${slot}` : `ช่อง ${slot}`}</span>
                        </div>
                        <div className="p-desc">{summary}</div>
                        <div className="modal-actions">
                          <button onClick={() => handleSaveSlot(slot)}>{tr.save}</button>
                          {meta && (
                            <>
                              <button className="secondary" onClick={() => handleLoadSlot(slot)}>
                                {tr.load}
                              </button>
                              <button
                                className="secondary danger-inline"
                                onClick={() => handleDeleteSlot(slot)}
                              >
                                {tr.delete}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Danger zone */}
                <div
                  className="panel-title"
                  style={{ margin: '18px 0 8px', textAlign: 'left', color: '#e08a8a' }}
                >
                  {tr.dangerZoneTitle}
                </div>
                <button className="danger-btn" onClick={handleHardResetClick}>
                  {tr.hardResetBtn}
                </button>

                <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '11px', color: 'var(--root-cream-dim)', opacity: 0.5, letterSpacing: '0.06em' }}>
                  Root Idle · v{GAME_VERSION}
                </div>
              </>
            )}

            {/* Export Submodal */}
            {subModal === 'export' && (
              <>
                <div className="icon">💾</div>
                <h2>{tr.exportTitle}</h2>
                <div className="away-time">{tr.exportDesc}</div>
                <textarea
                  readOnly
                  value={exportCode}
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                />
                <div className="modal-actions">
                  <button onClick={handleCopy}>
                    {copySuccess ? tr.copied : tr.copy}
                  </button>
                  <button className="secondary" onClick={() => setSubModal('none')}>
                    {tr.close}
                  </button>
                </div>
              </>
            )}

            {/* Import Submodal */}
            {subModal === 'import' && (
              <>
                <div className="icon">📥</div>
                <h2>{tr.importTitle}</h2>
                <div className="away-time">{tr.importDesc}</div>
                <textarea
                  value={importCode}
                  onChange={e => setImportCode(e.target.value)}
                  placeholder={tr.importPlaceholder}
                />
                {importError && <div className="import-error">{importError}</div>}
                <div className="modal-actions">
                  <button onClick={handleImportSubmit}>{tr.importBtn}</button>
                  <button className="secondary" onClick={() => setSubModal('none')}>
                    {tr.cancel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={tr.confirm}
        cancelText={tr.cancel}
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
