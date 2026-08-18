'use client';

import React, { useState, useEffect } from 'react';
import { AutoRootMode, GameState, SaveSlotMeta, SkinId } from '@/types/game';
import { SAVE_SLOT_COUNT, SKIN_DEFS } from '@/constants/gameData';
import { getSlotMeta } from '@/lib/storage';
import { fmtInt } from '@/lib/formatters';
import { getActiveAutoRootMode, getAvailableAutoRootModes } from '@/lib/autoBuyer';
import { ConfirmModal } from './ConfirmModal';

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
  onToggleAutoRoot?: () => void;
  onSetAutoRootMode?: (mode: AutoRootMode) => void;
  onToggleAutoEvent?: () => void;
  onToggleAutoReset?: () => void;
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
  onToggleAutoRoot,
  onSetAutoRootMode,
  onToggleAutoEvent,
  onToggleAutoReset,
}) => {
  const [subModal, setSubModal] = useState<'none' | 'export' | 'import'>('none');
  const [exportCode, setExportCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState('');
  const [slotsMeta, setSlotsMeta] = useState<Record<number, SaveSlotMeta | null>>({});

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
    if (!importCode.trim()) {
      setImportError('กรุณาวางโค้ดเซฟ');
      return;
    }
    setConfirmState({
      isOpen: true,
      title: 'ยืนยันการทำรายการ',
      message: 'การนำเข้าจะเขียนทับ progress ปัจจุบันทั้งหมด ยืนยันไหม?',
      action: () => {
        try {
          onImport(importCode.trim());
          setSubModal('none');
          setConfirmState(prev => ({ ...prev, isOpen: false }));
          onClose();
        } catch {
          setImportError('โค้ดไม่ถูกต้องหรือเสียหาย ลองตรวจสอบอีกครั้ง');
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
        title: 'ยืนยันการทำรายการ',
        message: `ช่อง ${slot} มีเซฟอยู่แล้ว บันทึกทับเลยไหม?`,
        action: doSave,
      });
    } else {
      doSave();
    }
  };

  const handleLoadSlot = (slot: number) => {
    setConfirmState({
      isOpen: true,
      title: 'ยืนยันการทำรายการ',
      message: `โหลดช่อง ${slot} จะเขียนทับ progress ปัจจุบันทั้งหมด ยืนยันไหม?`,
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
      title: 'ยืนยันการทำรายการ',
      message: `ลบเซฟช่อง ${slot} ใช่ไหม? กู้คืนไม่ได้`,
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
      title: 'ยืนยันการทำรายการ',
      message:
        '⚠️ การกระทำนี้จะลบทุกอย่างอย่างถาวร รวมถึงเมล็ดนิรันดร์และของที่ซื้อในร้าน Prestige ทั้งหมด ไม่สามารถย้อนกลับได้ ยืนยันจะเริ่มใหม่จาก 0 ใช่ไหม?',
      action: () => {
        setConfirmState({
          isOpen: true,
          title: 'ยืนยันการทำรายการ',
          message: 'ยืนยันอีกครั้ง — กดแล้วกู้คืนไม่ได้เลย แน่ใจจริงๆ นะ?',
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
      <div className="offline-backdrop">
        <div className="modal-wrapper">
          <button className="modal-close-x" onClick={onClose} aria-label="ปิด">
            &times;
          </button>

          <div className="offline-modal generic-modal">
            {subModal === 'none' && (
              <>
                <div className="icon">⚙️</div>
                <h2>ตัวเลือก</h2>

                {/* Automation Toggles */}
                {hasAnyAuto && (
                  <>
                    <div className="panel-title" style={{ margin: '12px 0 8px', textAlign: 'left' }}>
                      สวิตช์ระบบออโต้ (เปิด/ปิด)
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      {state.prestige.autoRoot && (
                        <div className={`prestige-item ${!state.prestige.autoRootEnabled ? 'toggled-off' : ''}`}>
                          <div
                            className="p-top"
                            style={{ cursor: 'pointer' }}
                            onClick={onToggleAutoRoot}
                          >
                            <span>🤖 ออโต้ซื้อราก</span>
                            <span>{state.prestige.autoRootEnabled ? '🟢 เปิดอยู่' : '⚪ ปิดอยู่'}</span>
                          </div>
                          <div className="p-desc" style={{ marginBottom: '8px' }}>
                            {state.prestige.autoRootEnabled
                              ? 'กำลังทำงานอัตโนมัติ (คลิกข้อความด้านบนเพื่อเปิด/ปิด)'
                              : 'ปิดอยู่ (คลิกข้อความด้านบนเพื่อเปิดทำงาน)'}
                          </div>

                          {/* Mode Selector */}
                          {availableAutoModes.length > 1 && onSetAutoRootMode && (
                            <div>
                              <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', marginBottom: '4px' }}>
                                เลือกระดับการทำงาน:
                              </div>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                {availableAutoModes.map(m => {
                                  const isActive = activeAutoMode === m && state.prestige.autoRootEnabled;
                                  const titles: Record<AutoRootMode, string> = {
                                    basic: 'ถูกที่สุด',
                                    smart: 'อัจฉริยะ',
                                    all: 'ทุกอย่าง',
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
                            <span>🎯 ออโต้อีเว้น</span>
                            <span>{state.prestige.autoEventEnabled ? '🟢 เปิดอยู่' : '⚪ ปิดอยู่'}</span>
                          </div>
                          <div className="p-desc">
                            {state.prestige.autoEventEnabled
                              ? 'กำลังกดเก็บอีเว้นให้อัตโนมัติ (คลิกเพื่อปิดชั่วคราว)'
                              : 'ปิดอยู่ (คลิกเพื่อเปิดทำงาน)'}
                          </div>
                        </div>
                      )}

                      {state.prestige.autoReset && onToggleAutoReset && (
                        <div
                          onClick={onToggleAutoReset}
                          className={`prestige-item ${!state.prestige.autoResetEnabled ? 'toggled-off' : ''}`}
                        >
                          <div className="p-top">
                            <span>🔁 ออโต้หว่านใหม่</span>
                            <span>{state.prestige.autoResetEnabled ? '🟢 เปิดอยู่' : '⚪ ปิดอยู่'}</span>
                          </div>
                          <div className="p-desc">
                            {state.prestige.autoResetEnabled
                              ? 'กำลังหว่านใหม่อัตโนมัติเมื่อคุ้ม (คลิกเพื่อปิดชั่วคราว)'
                              : 'ปิดอยู่ (คลิกเพื่อเปิดทำงาน)'}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Skins */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  สกิน
                </div>
                <div style={{ textAlign: 'left' }}>
                  {SKIN_DEFS.map(sd => {
                    const owned = isSkinOwned(sd.id);
                    const active = state.prestige.activeSkin === sd.id;

                    return (
                      <div
                        key={sd.id}
                        onClick={owned && !active ? () => onSelectSkin(sd.id) : undefined}
                        className={`prestige-item ${!owned ? 'disabled' : ''} ${
                          active ? 'skin-active' : ''
                        }`}
                      >
                        <div className="p-top">
                          <span>{sd.name}</span>
                          <span>{active ? '✓ ใช้อยู่' : owned ? '' : '🔒 ยังไม่ปลดล็อก'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Export / Import */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  Export / Import
                </div>
                <div className="modal-actions" style={{ marginBottom: '14px' }}>
                  <button onClick={handleExportClick}>📤 Export โค้ดเซฟ</button>
                  <button
                    onClick={() => {
                      setImportCode('');
                      setImportError('');
                      setSubModal('import');
                    }}
                  >
                    📥 Import โค้ดเซฟ
                  </button>
                </div>

                {/* Save Slots */}
                <div className="panel-title" style={{ margin: '16px 0 8px', textAlign: 'left' }}>
                  Save Slot (ในเครื่องนี้)
                </div>
                <div style={{ textAlign: 'left' }}>
                  {Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => i + 1).map(slot => {
                    const meta = slotsMeta[slot];
                    const summary = meta
                      ? `บันทึกเมื่อ ${new Date(meta.savedAt).toLocaleString('th-TH', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })} · ${meta.totalOwned || 0} ต้น (รวมทุกชนิด) · ${fmtInt(
                          meta.seeds || 0
                        )} เมล็ด`
                      : 'ว่าง';

                    return (
                      <div key={slot} className="prestige-item slot-item">
                        <div className="p-top">
                          <span>ช่อง {slot}</span>
                        </div>
                        <div className="p-desc">{summary}</div>
                        <div className="modal-actions">
                          <button onClick={() => handleSaveSlot(slot)}>บันทึก</button>
                          {meta && (
                            <>
                              <button className="secondary" onClick={() => handleLoadSlot(slot)}>
                                โหลด
                              </button>
                              <button
                                className="secondary danger-inline"
                                onClick={() => handleDeleteSlot(slot)}
                              >
                                ลบ
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
                  โซนอันตราย
                </div>
                <button className="danger-btn" onClick={handleHardResetClick}>
                  🗑️ ล้างข้อมูล / เริ่มใหม่จาก 0 ทั้งหมด
                </button>
              </>
            )}

            {/* Export Submodal */}
            {subModal === 'export' && (
              <>
                <div className="icon">💾</div>
                <h2>โค้ดเซฟของคุณ</h2>
                <div className="away-time">
                  คัดลอกเก็บไว้ แล้วนำไปวางตอน Import บนเครื่องอื่น — ข้อมูลครบทุกอย่าง ไม่มีอะไรหาย
                </div>
                <textarea
                  readOnly
                  value={exportCode}
                  onClick={e => (e.target as HTMLTextAreaElement).select()}
                />
                <div className="modal-actions">
                  <button onClick={handleCopy}>
                    {copySuccess ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}
                  </button>
                  <button className="secondary" onClick={() => setSubModal('none')}>
                    ปิด
                  </button>
                </div>
              </>
            )}

            {/* Import Submodal */}
            {subModal === 'import' && (
              <>
                <div className="icon">📥</div>
                <h2>นำเข้าโค้ดเซฟ</h2>
                <div className="away-time">
                  วางโค้ดที่คัดลอกมาจากเครื่องเดิม การนำเข้าจะเขียนทับ progress ปัจจุบัน
                </div>
                <textarea
                  value={importCode}
                  onChange={e => setImportCode(e.target.value)}
                  placeholder="วางโค้ดตรงนี้"
                />
                {importError && <div className="import-error">{importError}</div>}
                <div className="modal-actions">
                  <button onClick={handleImportSubmit}>นำเข้า</button>
                  <button className="secondary" onClick={() => setSubModal('none')}>
                    ยกเลิก
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
        onConfirm={confirmState.action}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};
