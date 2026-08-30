'use client';

import React, { useState, useEffect } from 'react';
import { GameState, Language, SaveSlotMeta } from '@/types/game';
import { GAME_VERSION, SAVE_SLOT_COUNT } from '@/constants/gameData';
import { decodeSave, getSlotMeta } from '@/lib/storage';
import { fmt, fmtInt, formatDuration } from '@/lib/formatters';
import { ConfirmModal } from './ConfirmModal';
import { MODULE_TRANSLATIONS, t } from '@/lib/i18n';

interface OptionsModalProps {
  isOpen: boolean;
  state: GameState;
  onClose: () => void;
  onExport: () => string;
  onImport: (code: string) => void;
  onSaveSlot: (slot: number) => void;
  onLoadSlot: (slot: number) => void;
  onDeleteSlot: (slot: number) => void;
  onHardReset: () => void;
  onSetLanguage?: (lang: Language) => void;
}

export const OptionsModal: React.FC<OptionsModalProps> = ({
  isOpen,
  state,
  onClose,
  onExport,
  onImport,
  onSaveSlot,
  onLoadSlot,
  onDeleteSlot,
  onHardReset,
  onSetLanguage,
}) => {
  const [subModal, setSubModal] = useState<'none' | 'export' | 'import'>('none');
  const [exportCode, setExportCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  const [slotsMeta, setSlotsMeta] = useState<Record<number, SaveSlotMeta | null>>({});
  const [activeTab, setActiveTab] = useState<'saves' | 'settings'>('saves');

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

                {/* Tab Switcher */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bg-panel-2)',
                    borderRadius: '10px',
                    padding: '3px',
                    gap: '4px',
                    border: '1px solid var(--line-soil)',
                    marginBottom: '14px',
                  }}
                >
                  <button
                    onClick={() => setActiveTab('saves')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '7px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: activeTab === 'saves' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'saves' ? '#12190d' : 'var(--root-cream)',
                    }}
                  >
                    💾 {isEn ? 'Save Data' : 'ข้อมูลเซฟ'}
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '7px',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: activeTab === 'settings' ? 'var(--accent-glow)' : 'transparent',
                      color: activeTab === 'settings' ? '#12190d' : 'var(--root-cream)',
                    }}
                  >
                    ⚙️ {isEn ? 'Settings' : 'การตั้งค่าทั่วไป'}
                  </button>
                </div>

                {/* TAB 1: SAVES */}
                {activeTab === 'saves' && (
                  <>
                    {/* Export / Import */}
                    <div className="panel-title" style={{ margin: '8px 0 8px', textAlign: 'left' }}>
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
                        const dateString = meta
                          ? new Date(meta.savedAt).toLocaleString(isEn ? 'en-US' : 'th-TH', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })
                          : '';
                        const playTimeText = meta?.totalPlayTimeSeconds && meta.totalPlayTimeSeconds > 0
                          ? formatDuration(meta.totalPlayTimeSeconds, lang)
                          : null;
                        const highestName = meta?.highestModuleId
                          ? (MODULE_TRANSLATIONS[meta.highestModuleId]?.[lang]?.name || meta.highestModuleId)
                          : null;
                        const nutrientText = meta?.nutrients !== undefined ? fmt(meta.nutrients) : null;
                        const lifetimeNutrientsText = meta?.lifetimeNutrients && meta.lifetimeNutrients > (meta.nutrients || 0)
                          ? fmt(meta.lifetimeNutrients)
                          : null;
                        const pendingText = meta?.pendingSeeds && meta.pendingSeeds > 0
                          ? ` (+${fmtInt(meta.pendingSeeds)} ${isEn ? 'pending' : 'รอรับ ✨'})`
                          : '';
                        const lifetimeSeedsText = meta?.lifetimeSeeds && meta.lifetimeSeeds > (meta.seeds || 0)
                          ? fmtInt(meta.lifetimeSeeds)
                          : null;

                        return (
                          <div key={slot} className="prestige-item slot-item">
                            <div className="p-top">
                              <span>{isEn ? `Slot ${slot}` : `ช่อง ${slot}`}</span>
                              {meta && (
                                <span style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontWeight: 400 }}>
                                  {playTimeText ? `⏱️ ${playTimeText} · ` : ''}{dateString}
                                </span>
                              )}
                            </div>
                            <div className="p-desc" style={{ marginTop: '4px', lineHeight: 1.5 }}>
                              {meta ? (
                                <>
                                  {nutrientText && (
                                    <div>
                                      🌱 <b style={{ color: 'var(--accent-amber)' }}>{nutrientText}</b> {isEn ? 'nutrients' : 'สารอาหาร'}
                                      {lifetimeNutrientsText && (
                                        <span style={{ color: 'var(--root-cream-dim)', fontSize: '10.5px' }}>
                                          {' '}({isEn ? 'lifetime' : 'สะสม'} {lifetimeNutrientsText})
                                        </span>
                                      )}
                                      {highestName && <span> · {highestName} ({fmtInt(meta.totalOwned || 0)} {isEn ? 'roots' : 'ต้น'})</span>}
                                    </div>
                                  )}
                                  <div style={{ color: 'var(--prestige-accent)' }}>
                                    🌌 <b>{fmtInt(meta.seeds || 0)}</b> {isEn ? 'Seeds' : 'เมล็ดนิรันดร์'}
                                    {pendingText && <span style={{ color: 'var(--accent-glow)', fontWeight: 600 }}>{pendingText}</span>}
                                    {lifetimeSeedsText && (
                                      <span style={{ color: '#ffd76a', fontSize: '10.5px' }}>
                                        {' '}· {isEn ? 'all-time' : 'ตลอดกาล'} {lifetimeSeedsText}
                                      </span>
                                    )}
                                    {meta.prestigeCount !== undefined && meta.prestigeCount > 0 && (
                                      <span style={{ color: 'var(--root-cream-dim)' }}> · Prestige ×{meta.prestigeCount}</span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <span style={{ opacity: 0.6 }}>{tr.emptySlot}</span>
                              )}
                            </div>
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
                  </>
                )}

                {/* TAB 2: SETTINGS */}
                {activeTab === 'settings' && (
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Language Selection */}
                    {onSetLanguage && (
                      <div>
                        <div className="panel-title" style={{ margin: '8px 0 8px' }}>
                          {tr.langSelectorTitle}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => onSetLanguage('th')}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '8px',
                              background: lang === 'th' ? 'var(--accent-glow-dim)' : 'var(--bg-panel-2)',
                              color: lang === 'th' ? '#12190d' : 'var(--root-cream)',
                              borderColor: lang === 'th' ? 'var(--accent-glow)' : 'var(--line-soil)',
                              fontWeight: lang === 'th' ? 700 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            🇹🇭 ภาษาไทย (TH)
                          </button>
                          <button
                            onClick={() => onSetLanguage('en')}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '8px',
                              background: lang === 'en' ? 'var(--accent-glow-dim)' : 'var(--bg-panel-2)',
                              color: lang === 'en' ? '#12190d' : 'var(--root-cream)',
                              borderColor: lang === 'en' ? 'var(--accent-glow)' : 'var(--line-soil)',
                              fontWeight: lang === 'en' ? 700 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            🇬🇧 English (EN)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* App & Audio Info */}
                    <div style={{ background: 'var(--bg-panel-2)', border: '1px solid var(--line-soil)', borderRadius: '10px', padding: '12px', marginTop: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--root-cream)', marginBottom: '4px' }}>
                        🌿 {isEn ? 'About Root Idle' : 'เกี่ยวกับเกม Root Idle'}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--root-cream-dim)', lineHeight: 1.5 }}>
                        {isEn
                          ? 'A tranquil, atmospheric incremental idle tree growth experience. Designed to be completely silent and peaceful.'
                          : 'เกมจำลองการเติบโตของเครือข่ายรากไม้ใต้พิภพ ออกแบบให้เล่นได้อย่างสงบ ผ่อนคลาย และไร้เสียงรบกวน 100%'}
                      </div>
                    </div>
                  </div>
                )}

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
