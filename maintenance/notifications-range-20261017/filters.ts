/**
 * Логика фильтров Ленты — чистые функции, без React.
 * Используется и экраном (фильтрация), и панелью фильтров (опции + счётчик).
 */
import type { EventData } from './types';
import { CATEGORY_LABEL, mskParts, nowMsk } from './format';

export type Filters = {
  date: string;
  categories: string[];
  price: string;
  minPrice: number;
  maxPrice: number;
};

export const DEFAULT_FILTERS: Filters = { date: 'all', categories: [], price: 'any', minPrice: 0, maxPrice: 20000 };

export const DATE_OPTIONS = [
  { key: 'all', label: 'Любая дата' },
  { key: 'today', label: 'Сегодня' },
  { key: 'tomorrow', label: 'Завтра' },
  { key: 'weekend', label: 'Выходные' },
];

// Тот же справочник, что показывает карточка события (`CATEGORY_LABEL`), а не
// его копия: фильтр сверяет ключи с `events.category_id`, и разойтись им
// нельзя — пропущенный слаг делает свои события неотфильтровываемыми.
export const CATEGORY_OPTIONS: { key: string; label: string }[] =
  Object.entries(CATEGORY_LABEL).map(([key, label]) => ({ key, label }));

export const PRICE_OPTIONS = [
  { key: 'any', label: 'Любая' },
  { key: 'free', label: 'Бесплатно' },
  { key: 'to500', label: 'до 500 ₽' },
  { key: '500to1500', label: '500–1500 ₽' },
  { key: '1500to3000', label: '1500–3000 ₽' },
  { key: 'from3000', label: 'от 3000 ₽' },
];

export function matchesFilters(e: EventData, f: Filters): boolean {
  // Дата — по реальному starts_at (МСК). Нет данных (мок) — не отсеиваем.
  if (f.date !== 'all' && e.startsAt) {
    const p = mskParts(e.startsAt);
    if (f.date === 'today') {
      const n = nowMsk();
      if (!(p.y === n.y && p.mon === n.mon && p.date === n.date)) return false;
    } else if (f.date === 'tomorrow') {
      const t = mskParts(new Date(Date.now() + 24 * 3600 * 1000).toISOString());
      if (!(p.y === t.y && p.mon === t.mon && p.date === t.date)) return false;
    } else if (f.date === 'weekend') {
      if (p.dow !== 6 && p.dow !== 0) return false;
    }
  }

  // priceMin is in kopecks; the selected maximum is inclusive and in rubles.
  const bounds = priceBounds(f);
  if (e.priceMin != null && (e.priceMin < bounds.min * 100 || e.priceMin > bounds.max * 100)) return false;

  return true;
}

export function filterEvents(events: EventData[], f: Filters): EventData[] {
  return events.filter(e => matchesFilters(e, f));
}

export function isActive(f: Filters): boolean {
  const bounds = priceBounds(f);
  return f.date !== 'all' || bounds.min > 0 || bounds.max < 20000;
}



export function normalizePrice(value: number | undefined, fallback = 20000): number {
  return Number.isFinite(value) ? Math.max(0, Math.min(20000, Math.round(value!))) : fallback;
}

export function priceBounds(f: Pick<Filters, 'minPrice' | 'maxPrice'>) {
  const max = normalizePrice(f.maxPrice);
  return { min: Math.min(normalizePrice(f.minPrice, 0), max), max };
}
