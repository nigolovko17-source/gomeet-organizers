/** Web-only successor for the exact published organizers bundle. */
import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { Modal, View, ScrollView, Pressable, StyleSheet } from 'react-native';
import DesignText from './DesignText';
import DesignButton from './DesignButton';
import Sheet from './Sheet';
import { DATE_OPTIONS, filterEvents, normalizePrice, priceBounds, type Filters } from './filters';
import { eventWord } from '../data/plural';
import { DesignColors as C, DesignShape as Shape, DesignSpace as Space } from '../constants/design2026';

type Props = { visible: boolean; initial: Filters; events: any[]; onApply: (f: Filters) => void; onClose: () => void };
export default function FilterSheet({ visible, initial, events, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<Filters>(initial);

  const [minText, setMinText] = useState(String(priceBounds(initial).min));
  const [maxText, setMaxText] = useState(String(priceBounds(initial).max));
  const lastEdited = useRef<'min' | 'max'>('min');
  const trackDrag = useRef<'min' | 'max' | null>(null);
  useEffect(() => {
    if (visible) {
      const bounds = priceBounds(initial);
      setDraft({ ...initial, categories: [], price: 'any', minPrice: bounds.min, maxPrice: bounds.max });
      setMinText(String(bounds.min)); setMaxText(String(bounds.max));
    }
  }, [visible]);
  const { min: minPrice, max: maxPrice } = priceBounds(draft);
  const count = filterEvents(events, draft).length;
  function changePrice(which: 'min' | 'max', raw: number) {
    const value = which === 'min' ? Math.min(normalizePrice(raw, 0), maxPrice)
      : Math.max(normalizePrice(raw), minPrice);
    setDraft(d => ({ ...d, [which === 'min' ? 'minPrice' : 'maxPrice']: value }));
    (which === 'min' ? setMinText : setMaxText)(String(value));
  }
  function editPrice(which: 'min' | 'max', text: string) {
    lastEdited.current = which;
    (which === 'min' ? setMinText : setMaxText)(text);
    if (text === '') return;
    const value = Number(text);
    if (!Number.isFinite(value) || value < 0 || value > 20000) return;
    if (which === 'min' ? value > maxPrice : value < minPrice) return;
    setDraft(d => ({ ...d, [which === 'min' ? 'minPrice' : 'maxPrice']: Math.round(value) }));
  }
  function apply() {
    let min = normalizePrice(minText === '' ? 0 : Number(minText), 0);
    let max = normalizePrice(maxText === '' ? 20000 : Number(maxText));
    if (min > max) { if (lastEdited.current === 'max') max = min; else min = max; }
    onApply({ ...draft, minPrice: min, maxPrice: max });
  }
  function trackValue(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left - 12) / (rect.width - 24))) * 20000);
  }
  return <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
    {visible && <Sheet design="2026" title="Фильтры" onClose={onClose}
      footer={<DesignButton label={`Показать ${count} ${eventWord(count)}`} onPress={apply} />}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <style>{priceCSS}</style>
        <Section title="Когда">
          <View style={styles.pills}>{DATE_OPTIONS.map(o => <Pill key={o.key} label={o.label}
            selected={draft.date === o.key} onPress={() => setDraft(d => ({ ...d, date: o.key }))} />)}</View>
        </Section>
        <Section>
          <div className="gomeet-filter-price">

            <div className="gfp-head"><h2>Цена</h2></div>
            <div className="gfp-bounds">
              <label className="gfp-value"><span>от</span>
                <input type="number" min="0" max={maxPrice} step="1" inputMode="numeric"
                  aria-label="Цена билета от" value={minText}
                  onChange={e => editPrice('min', e.target.value)}
                  onBlur={() => changePrice('min', minText === '' ? 0 : Number(minText))}
                  onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} /><span>₽</span>
              </label>
              <label className="gfp-value"><span>до</span>
                <input type="number" min={minPrice} max="20000" step="1" inputMode="numeric"
                  aria-label="Цена билета до" value={maxText}
                  onChange={e => editPrice('max', e.target.value)}
                  onBlur={() => changePrice('max', maxText === '' ? 20000 : Number(maxText))}
                  onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} /><span>₽</span>
              </label>
            </div>
            <div className="gfp-dual-range" style={{ '--from': (minPrice / 200) + '%', '--to': (maxPrice / 200) + '%' } as React.CSSProperties}
              onPointerDown={e => {
                if (e.target instanceof HTMLInputElement) return;
                const value = trackValue(e);
                trackDrag.current = Math.abs(value - minPrice) <= Math.abs(value - maxPrice) ? 'min' : 'max';
                changePrice(trackDrag.current, value); e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={e => { if (trackDrag.current) changePrice(trackDrag.current, trackValue(e)); }}
              onPointerUp={e => { trackDrag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); }}
              onPointerCancel={() => { trackDrag.current = null; }}>
              <div className="gfp-track" />
              <input className="gfp-range" style={{ zIndex: minPrice === 20000 ? 4 : 2 }} type="range" min="0" max="20000" step="1" value={minPrice}
                aria-label="Минимальная цена билета" aria-valuetext={'От ' + minPrice.toLocaleString('ru-RU') + ' рублей за билет'}
                onChange={e => changePrice('min', Number(e.target.value))} />
              <input className="gfp-range" style={{ zIndex: 3 }} type="range" min="0" max="20000" step="1" value={maxPrice}
                aria-label="Максимальная цена билета" aria-valuetext={'До ' + maxPrice.toLocaleString('ru-RU') + ' рублей за билет'}
                onChange={e => changePrice('max', Number(e.target.value))} />
            </div>
            <div className="gfp-scale" aria-hidden="true"><span>0 ₽</span><span>20 000 ₽</span></div>
          </div>
        </Section>
      </ScrollView>
    </Sheet>}
  </Modal>;
}
function Section({ title, children }: { title?: string; children: ReactNode }) {
  return <View style={styles.section}>
    <View pointerEvents="none" style={styles.surface} />
    {title && <DesignText variant="label" accessibilityRole="header" style={{ color: C.text }}>{title}</DesignText>}
    {children}
  </View>;
}
function Pill({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const [focused, setFocused] = useState(false);
  return <Pressable onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
    accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={label}
    style={({ pressed }) => [styles.pill, selected && styles.selected, pressed && { opacity: 0.8 }, focused && styles.focus]}>
    <DesignText variant="label" style={{ color: selected ? C.onActionPrimary : C.text, flexShrink: 1 }}>{label}</DesignText>
  </Pressable>;
}
const styles = StyleSheet.create({
  scroll: { marginHorizontal: -12 },
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 12, gap: Space.lg },
  section: { gap: Space.sm, position: 'relative', isolation: 'isolate' },
  surface: { position: 'absolute', top: -10, bottom: -10, left: -12, right: -12,
    zIndex: -1, borderWidth: 1, borderColor: '#2b2b2b', backgroundColor: '#141414', borderRadius: 18 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.sm },
  pill: { minHeight: Shape.control, maxWidth: '100%', paddingHorizontal: Space.md, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', gap: Space.sm, borderRadius: Shape.pill,
    borderWidth: 1, borderColor: C.fieldBorder, backgroundColor: C.surface },
  selected: { backgroundColor: C.actionPrimary, borderColor: C.actionPrimary },
  focus: { outlineWidth: 2, outlineColor: C.focus, outlineOffset: 2 },
});
const priceCSS = `
.gomeet-filter-price{color:#f4f0e8;font:14px/20px Onest_600SemiBold,sans-serif;box-sizing:border-box}
.gomeet-filter-price *{box-sizing:border-box}.gfp-head{margin-bottom:12px}.gfp-bounds{display:flex;justify-content:space-between;gap:16px}.gfp-bounds .gfp-value{flex:0 1 46%;justify-content:space-between;min-width:0}
.gfp-head h2{font:14px/20px Onest_600SemiBold,sans-serif;margin:0}.gfp-value{display:flex;align-items:center;gap:6px;min-height:44px;padding:8px 14px;border:1px solid #777772;border-radius:999px;background:#191919;white-space:nowrap}
.gfp-value input{width:64px;border:0;padding:0;background:transparent;color:#f4f0e8;font:16px/24px Onest_600SemiBold,sans-serif;text-align:right;appearance:textfield;font-variant-numeric:tabular-nums}
.gfp-value input::-webkit-inner-spin-button,.gfp-value input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.gfp-value:focus-within{outline:2px solid #f4f0e8;outline-offset:3px}.gfp-value input:focus{outline:none}.gfp-value span:first-child{color:#b8b8b3;font:12px/20px Onest_400Regular,sans-serif}
.gfp-range{--fill:100%;appearance:none;-webkit-appearance:none;display:block;width:100%;height:44px;margin:0;background:transparent;cursor:pointer;border-radius:8px;position:absolute;inset:0;pointer-events:none;touch-action:pan-y}
.gfp-range::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:transparent}
.gfp-range::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;margin-top:-9px;border:3px solid #f4f0e8;border-radius:50%;background:#191919;box-shadow:0 0 0 3px #141414;pointer-events:auto;cursor:grab}
.gfp-range::-moz-range-track{height:6px;background:transparent}.gfp-range::-moz-range-progress{background:transparent}
.gfp-range::-moz-range-thumb{width:18px;height:18px;border:3px solid #f4f0e8;border-radius:50%;background:#191919;box-shadow:0 0 0 3px #141414;pointer-events:auto;cursor:grab}
.gfp-dual-range{position:relative;height:44px;margin-top:4px;touch-action:pan-y;cursor:pointer}.gfp-track{position:absolute;left:12px;right:12px;top:19px;height:6px;border-radius:999px;background:linear-gradient(to right,#424242 0%,#424242 var(--from),#f4f0e8 var(--from),#f4f0e8 var(--to),#424242 var(--to),#424242 100%)}.gfp-range:focus-visible{outline:2px solid #f4f0e8;outline-offset:3px}.gfp-scale{display:flex;justify-content:space-between;color:#b8b8b3;font:12px/18px Onest_400Regular,sans-serif;font-variant-numeric:tabular-nums}
`;
