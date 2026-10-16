/**
 * Поиск событий.
 *
 * Переведён на новый контур (Г5/R9): `palettes.dark` и токены вместо
 * `useThemedStyles(makeStyles)` + `Palette`, `AppText` вместо голого `Text`,
 * знаковый набор проекта вместо Feather. Ушли и устаревшие псевдонимы
 * скруглений (`Radius.md`, C7), и высоты числом в разметке.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { View, TextInput, Pressable, FlatList, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import AppText from '../components/DesignText';
import { DesignColors as C, DesignTypography as Type } from '../constants/design2026';
import EventCard from '../components/EventCard';
import EventImage from '../components/EventImage';
import { SkeletonEventRow, SkeletonPoster } from '../components/Skeleton';
import { Icon } from '../components/Icon';
import { eventImage } from '../data/eventImages';
import { useEventSearch, useFeed, useSocialProofMap } from '../data/hooks';
import { getRecent, addRecent, loadRecent, removeRecent, wipeRecent } from '../data/search';
import { useColumnContent, useEdge } from '../constants/layout';
import { Fonts,
  Border, IconSize, Layout, Radius, Spacing, palettes,
} from '../constants/theme';
import { useGoBack } from '../navigation/useGoBack';

const Ink = palettes.dark;

/** Квадрат обложки в строке результата. */
const THUMB = 56;
/** Сколько строк-скелетонов показываем, пока идёт запрос. */
const SKELETONS = 6;
/** Ширина афиши в ленте рекомендаций. Уже, чем на Главной: здесь блок вводный. */
const RAIL_CARD = 156;
/** Сколько афиш кладём в ленту — дальше рука не докручивает. */
const RAIL_LIMIT = 4;
/** Сколько событий идёт строками под подсказками, чтобы низ экрана не пустовал. */
const LIST_LIMIT = 6;

export default function SearchScreen() {
  const column = useColumnContent();
  const edge = useEdge();
  const goBack = useGoBack();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const { results, loading, failed } = useEventSearch(query);
  const showResults = query.trim().length > 0;

  /*
   * Пустой поиск больше не пустой экран. Пока запрос не набран, под строкой
   * стоят события — та же выборка, что кормит Главную и Ленту (один запрос на
   * всё приложение, D12), с интересами человека наверху. Жанровые подсказки временно убраны по поручению пользователя: здесь
   * остаются рекомендации, продолжение афиши и история запросов.
   */
  const { events: feed, loading: feedLoading, failed: feedFailed } = useFeed();
  const recommended = useMemo(() => feed.slice(0, RAIL_LIMIT), [feed]);
  /* Продолжение той же выборки — строками, как результаты поиска. Афишами
     весь низ экрана не закрыть: лента горизонтальная, под ней оставалась
     пустота в пол-экрана, а список читается плотнее и уже знаком по выдаче. */
  const more = useMemo(() => feed.slice(RAIL_LIMIT, RAIL_LIMIT + LIST_LIMIT), [feed]);
  const railIds = useMemo(() => recommended.map(e => e.id), [recommended]);
  const proof = useSocialProofMap(railIds);

  // Недавние лежат на диске, а рисуются синхронно: поднимаем их один раз при
  // открытии экрана и перерисовываемся, когда список появился.
  const [recent, setRecent] = useState<string[]>(getRecent());
  useEffect(() => { loadRecent().then(setRecent); }, []);

  const open = (id: string) => {
    addRecent(query);
    setRecent(getRecent());
    navigation.navigate('EventDetail', { eventId: id });
  };

  return (
    <Screen edges={['top']}>
      <View style={[styles.header, edge]}>
        <Pressable onPress={() => goBack()} style={styles.back} accessibilityRole="button" accessibilityLabel="назад">
          <Icon name="back" size={IconSize.md} color={Ink.gray1} />
        </Pressable>
        <View style={[styles.inputWrap, inputFocused && styles.focus]}>
          <Icon name="search" size={IconSize.sm} color={Ink.gray5} />
          <TextInput
            nativeID="gomeet-event-search"
            style={styles.input}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="События, места, организаторы"
            placeholderTextColor={Ink.gray5}
            value={query}
            onChangeText={setQuery}
            autoFocus={false}
            returnKeyType="search"
            accessibilityLabel="поиск событий"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={Spacing.sm} accessibilityRole="button" accessibilityLabel="очистить">
              <Icon name="x" size={IconSize.sm} color={Ink.gray5} />
            </Pressable>
          )}
        </View>
      </View>

      {showResults ? (
        loading ? (
          <View style={styles.list}>
            {Array.from({ length: SKELETONS }).map((_, i) => (
              <SkeletonEventRow key={i} />
            ))}
          </View>
        ) : failed ? (
          // Сбой запроса — не «ничего не найдено». Раньше здесь молча
          // подставлялся мок, и человек видел выдуманные события как ответ.
          <View style={styles.empty}>
            <Icon name="offline" size={IconSize.lg} color={Ink.gray5} />
            <AppText style={styles.emptyTitle}>Поиск не ответил</AppText>
            <AppText style={styles.emptyText}>Проверьте связь и попробуйте ещё раз</AppText>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.empty}>
            <Icon name="search" size={IconSize.lg} color={Ink.gray5} />
            <AppText style={styles.emptyTitle}>Ничего не найдено</AppText>
            <AppText style={styles.emptyText}>Попробуй другой запрос</AppText>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={e => e.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[styles.list, column]}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                onPress={() => open(item.id)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={styles.thumb}>
                  <EventImage
                    palette={item.palette}
                    imageUri={item.imageUri}
                    image={eventImage(item)}
                    height={THUMB}
                    width={THUMB}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.title} numberOfLines={1}>{item.title}</AppText>
                  <AppText style={styles.meta} numberOfLines={1}>
                    {item.place} · {item.day}, {item.time}
                  </AppText>
                </View>
              </Pressable>
            )}
          />
        )
      ) : (
        <ScrollView
          contentContainerStyle={[styles.suggest, column]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Рекомендации стоят первыми — вплотную под строкой. */}
          <View style={styles.block}>
            <View style={[styles.blockHead, styles.gutter]}>
              <AppText style={styles.overline} accessibilityRole="header">рекомендуем</AppText>
            </View>
            {feedLoading && recommended.length === 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.rail}
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonPoster key={i} width={RAIL_CARD} />
                ))}
              </ScrollView>
            ) : feedFailed ? (
              // Сбой — не пустое место: молчащий блок человек читает как «тут
              // ничего нет», хотя дело в связи. Тот же язык, что у выдачи.
              <AppText style={[styles.railNote, styles.gutter]}>
                Рекомендации не загрузились — проверьте связь
              </AppText>
            ) : recommended.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.rail}
              >
                {recommended.map(e => (
                  <EventCard
                    key={e.id}
                    event={e}
                    proof={proof.get(e.id)}
                    variant="poster"
                    width={RAIL_CARD}
                    onOpen={() => navigation.navigate('EventDetail', { eventId: e.id })}
                  />
                ))}
              </ScrollView>
            ) : null}
          </View>

          {more.length > 0 && (
            <View style={[styles.block, styles.gutter]}>
              <View style={styles.blockHead}>
                <AppText style={styles.overline} accessibilityRole="header">ещё события</AppText>
              </View>
              {more.map(e => (
                <Pressable
                  key={e.id}
                  style={({ pressed }) => [styles.row, pressed && styles.pressed]}
                  onPress={() => navigation.navigate('EventDetail', { eventId: e.id })}
                  accessibilityRole="button"
                  accessibilityLabel={e.title}
                >
                  <View style={styles.thumb}>
                    <EventImage
                      palette={e.palette}
                      imageUri={e.imageUri}
                      image={eventImage(e)}
                      height={THUMB}
                      width={THUMB}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <AppText style={styles.title} numberOfLines={1}>{e.title}</AppText>
                    <AppText style={styles.meta} numberOfLines={1}>
                      {e.place} · {e.day}, {e.time}
                    </AppText>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {recent.length > 0 && (
            <View style={[styles.block, styles.gutter]}>
              {/* «Очистить» встало в строку заголовка — раньше стереть всю
                  историю можно было только по одному крестику. */}
              <View style={styles.blockHead}>
                <AppText style={styles.overline} accessibilityRole="header">искали недавно</AppText>
                <Pressable
                  onPress={() => { wipeRecent(); setRecent([]); }}
                  hitSlop={Spacing.md}
                  accessibilityRole="button"
                  accessibilityLabel="очистить историю поиска"
                >
                  <AppText style={styles.clearAll}>очистить</AppText>
                </Pressable>
              </View>
              {/*
                История — список, а не чипы: у строки есть крестик, и промах
                («винил» вместо «винтаж») можно забыть по одному. Чипами
                это было невозможно — только стереть всю историю целиком.
              */}
              {recent.map(q => (
                <View key={q} style={styles.recentRow}>
                  <Icon name="clock" size={IconSize.sm} color={Ink.gray4} />
                  <Pressable
                    style={({ pressed }) => [styles.recentHit, pressed && styles.pressed]}
                    onPress={() => setQuery(q)}
                    accessibilityRole="button"
                    accessibilityLabel={q}
                  >
                    <AppText style={styles.recentText} numberOfLines={1}>{q}</AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => { removeRecent(q); setRecent(getRecent()); }}
                    hitSlop={Spacing.md}
                    accessibilityRole="button"
                    accessibilityLabel={`забыть запрос ${q}`}
                  >
                    <Icon name="x" size={IconSize.sm} color={Ink.gray4} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
  },
  // Круглая «назад» — та же, что на остальных внутренних экранах.
  back: {
    width: Layout.controlMd,
    height: Layout.controlMd,
    borderRadius: Radius.full,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: Border.subtleDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Обводка заметная, а не волосяная: поле здесь главное на экране, в него
  // человек и пришёл.
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: C.fieldBorder,
    paddingHorizontal: 18,
    height: Layout.controlMd,
  },
  input: { ...Type.body, flex: 1, minWidth: 0, color: C.text, padding: 0, outlineWidth: 0, outlineStyle: 'none', outlineColor: 'transparent' },
  focus: { borderColor: C.focus, outlineWidth: 0, outlineStyle: 'none' },

  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl, gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: Radius.media,
    overflow: 'hidden',
    backgroundColor: C.surface,
  },
  title: { ...Type.label, fontSize: 16, color: C.text, fontFamily: Fonts.displayBold, fontWeight: 'normal' },
  meta: { ...Type.caption, color: C.textSecondary, marginTop: 2 },

  /* Поля живут внутри блоков: ленты рекомендаций и чипов упираются в край
     экрана, чтобы карточка «выглядывала» и было видно, что ряд крутится. */
  suggest: { paddingBottom: Spacing.xxl, gap: Spacing.xl, paddingTop: Spacing.xs },
  gutter: { paddingHorizontal: Spacing.xl },
  block: { gap: Spacing.md },
  blockHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  overline: { ...Type.label, color: Ink.gray4 },
  clearAll: { fontSize: 13, fontWeight: '600', color: Ink.gray4 },

  rail: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.xl },
  railNote: { fontSize: 14, lineHeight: 20, color: Ink.gray4 },
  /* Отклик на нажатие — прозрачностью: границы блока не двигаются, соседи не
     дёргаются (правило про press-state без сдвига раскладки). */
  pressed: { opacity: 0.6 },

  chips: { flexDirection: 'row', gap: Spacing.sm, paddingHorizontal: Spacing.xl },
  chip: {
    height: Layout.controlSm,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: Border.subtleDark,
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, fontWeight: '600', color: Ink.textSecondary },

  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Border.subtleDark,
  },
  recentHit: { flex: 1, minHeight: 24, justifyContent: 'center' },
  recentText: { fontSize: 15, color: Ink.gray1 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingBottom: Spacing.section,
  },
  emptyTitle: { ...Type.sectionTitle, color: C.text, textAlign: 'center' },
  emptyText: { ...Type.body, color: C.textSecondary, textAlign: 'center' },
});
