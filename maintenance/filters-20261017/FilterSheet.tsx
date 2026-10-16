/** Web-only successor for the exact published organizers bundle. */
import React, { useState, useEffect, type ReactNode } from 'react';
import { Modal, View, ScrollView, Pressable, StyleSheet } from 'react-native';
import DesignText from './DesignText';
import DesignButton from './DesignButton';
import Sheet from './Sheet';
import { DATE_OPTIONS, filterEvents, normalizePrice, type Filters } from './filters';
import { eventWord } from '../data/plural';
import { DesignColors as C, DesignShape as Shape, DesignSpace as Space } from '../constants/design2026';

type Props = { visible: boolean; initial: Filters; events: any[]; onApply: (f: Filters) => void; onClose: () => void };
export default function FilterSheet({ visible, initial, events, onApply, onClose }: Props) {
  const [draft, setDraft] = useState<Filters>(initial);
  const [priceText, setPriceText] = useState(String(normalizePrice(initial.maxPrice)));
  useEffect(() => {
    if (visible) {
      const maxPrice = normalizePrice(initial.maxPrice);
      setDraft({ ...initial, categories: [], price: 'any', maxPrice });
      setPriceText(String(maxPrice));
    }
  }, [visible]);
  const maxPrice = normalizePrice(draft.maxPrice);
  const count = filterEvents(events, draft).length;
  const changePrice = (value: number) => {
    const price = normalizePrice(value);
    setDraft(d => ({ ...d, maxPrice: price }));
    setPriceText(String(price));
  };
  return <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
    {visible && <Sheet design="2026" title="Фильтры" onClose={onClose}
      footer={<DesignButton label={`Показать ${count} ${eventWord(count)}`} onPress={() => onApply(draft)} />}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <style>{priceCSS}</style>
        <Section title="Когда">
          <View style={styles.pills}>{DATE_OPTIONS.map(o => <Pill key={o.key} label={o.label}
            selected={draft.date === o.key} onPress={() => setDraft(d => ({ ...d, date: o.key }))} />)}</View>
        </Section>
        <Section>
          <div className="gomeet-filter-price">
            <div className="gfp-head"><h2>Цена</h2>
              <label className="gfp-value"><span>до</span>
                <input type="number" min="0" max="20000" step="1" inputMode="numeric"
                  aria-label="Указать максимальную цену билета" value={priceText}
                  onChange={e => { if (e.target.value === '') setPriceText(''); else changePrice(Number(e.target.value)); }}
                  onBlur={() => changePrice(priceText === '' ? 0 : Number(priceText))}
                  onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
                <span>₽</span>
              </label>
            </div>
            <input className="gfp-range" type="range" min="0" max="20000" step="1" value={maxPrice}
              aria-label="Максимальная цена билета"
              aria-valuetext={maxPrice === 0 ? 'Только бесплатные билеты' : `До ${maxPrice.toLocaleString('ru-RU')} рублей за билет`}
              style={{ '--fill': `${maxPrice / 200}%` } as React.CSSProperties}
              onChange={e => changePrice(Number(e.target.value))} />
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
.gomeet-filter-price *{box-sizing:border-box}.gfp-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:2px}
.gfp-head h2{font:14px/20px Onest_600SemiBold,sans-serif;margin:0}.gfp-value{display:flex;align-items:center;gap:6px;min-height:44px;padding:8px 14px;border:1px solid #777772;border-radius:999px;background:#191919;white-space:nowrap}
.gfp-value input{width:64px;border:0;padding:0;background:transparent;color:#f4f0e8;font:16px/24px Onest_600SemiBold,sans-serif;text-align:right;appearance:textfield;font-variant-numeric:tabular-nums}
.gfp-value input::-webkit-inner-spin-button,.gfp-value input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.gfp-value:focus-within{outline:2px solid #f4f0e8;outline-offset:3px}.gfp-value input:focus{outline:none}.gfp-value span:first-child{color:#b8b8b3;font:12px/20px Onest_400Regular,sans-serif}
.gfp-range{--fill:100%;appearance:none;-webkit-appearance:none;display:block;width:100%;height:44px;margin:4px 0 0;background:transparent;cursor:pointer;border-radius:8px;touch-action:pan-y}
.gfp-range::-webkit-slider-runnable-track{height:6px;border-radius:999px;background:linear-gradient(to right,#f4f0e8 0%,#f4f0e8 var(--fill),#424242 var(--fill),#424242 100%)}
.gfp-range::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;margin-top:-9px;border:3px solid #f4f0e8;border-radius:50%;background:#191919;box-shadow:0 0 0 3px #141414}
.gfp-range::-moz-range-track{height:6px;border-radius:999px;background:#424242}.gfp-range::-moz-range-progress{height:6px;border-radius:999px;background:#f4f0e8}
.gfp-range::-moz-range-thumb{width:18px;height:18px;border:3px solid #f4f0e8;border-radius:50%;background:#191919;box-shadow:0 0 0 3px #141414}
.gfp-range:focus-visible{outline:2px solid #f4f0e8;outline-offset:3px}.gfp-scale{display:flex;justify-content:space-between;color:#b8b8b3;font:12px/18px Onest_400Regular,sans-serif;font-variant-numeric:tabular-nums}
`;
