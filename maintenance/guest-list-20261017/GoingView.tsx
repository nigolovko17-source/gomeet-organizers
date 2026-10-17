import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import DesignText from '../components/DesignText';
import DesignButton from '../components/DesignButton';
import DesignLoadError from '../components/DesignLoadError';
import ScreenHeader from '../components/ScreenHeader';
import Avatar from '../components/Avatar';
import { DesignColors as C } from '../constants/design2026';
import { personWord } from '../data/plural';
import { columnContent } from '../constants/layout';
import GuestAvatars from './avatar-stack';

type Person = { id?: string; name: string; initials?: string; username?: string | null; avatarUrl?: string | null };
type Props = {
  eventTitle?: string; totalGoing: number; friends: Person[]; friendsCount: number;
  state: 'loading' | 'ready' | 'error' | 'empty' | 'unavailable';
  showAvatars?: boolean; placeholderAvatars?: boolean;
  top: number; bottom: number; column: any;
  onBack: () => void; onRetry: () => void;
};

export default function GoingView({ eventTitle, totalGoing, friends, friendsCount,
  state, showAvatars = true, placeholderAvatars = false, top, bottom, column, onBack, onRetry }: Props) {
  const otherCount = Math.max(0, totalGoing - friendsCount);
  return <View style={[guestStyles.screen, { paddingTop: top }]}>
    <View style={columnContent}>
      <ScreenHeader design="2026" title="Кто идёт" onBack={onBack} />
    </View>
    {state === 'error' ? <DesignLoadError title="Не удалось загрузить участников" onRetry={onRetry} />
      : state === 'loading' ? <View style={guestStyles.center}>
        <ActivityIndicator color={C.text} accessibilityLabel="Загружаем участников" />
      </View>
      : <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={[guestStyles.body, column, { paddingBottom: bottom + 32 }]}>
        <View style={guestStyles.summary}>
          <DesignText variant="caption" style={guestStyles.muted}>{eventTitle || 'Событие'}</DesignText>
          {state === 'unavailable' ? <DesignText variant="sectionTitle" style={guestStyles.unavailableTitle}>Список пока недоступен</DesignText>
            : <View style={guestStyles.totalRow}>
              <DesignText variant="eventTitle" style={guestStyles.number}>{totalGoing}</DesignText>
              <DesignText variant="label" style={guestStyles.totalLabel}>{personWord(totalGoing)}</DesignText>
            </View>}
          {friends.length > 0 && <View style={guestStyles.summaryPeople}>
            {showAvatars && <GuestAvatars people={friends} size={40} placeholders={placeholderAvatars} />}
            <DesignText variant="caption" style={[guestStyles.muted, guestStyles.flex]}>
              {friendsCount} из ваших подписок
            </DesignText>
          </View>}
        </View>

        {friends.length > 0 && <View style={guestStyles.section}>
          <View style={guestStyles.sectionHead}>
            <DesignText variant="label" style={guestStyles.sectionTitle}>Вы подписаны</DesignText>
            <View style={guestStyles.badge}><DesignText variant="caption">{friendsCount}</DesignText></View>
          </View>
          <View>
            {friends.map((person, index) => <View key={person.id ?? `${person.name}-${index}`} style={guestStyles.row}>
              {showAvatars && (placeholderAvatars
                ? <View testID="demo-avatar-placeholder" style={guestStyles.avatarPlaceholder}
                  accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
                : <Avatar design="2026" name={person.name} initials={person.initials} avatarUrl={person.avatarUrl} size={48} />)}
              <View style={guestStyles.personText}>
                <DesignText variant="label" style={guestStyles.personName}>{person.name || person.username || 'Пользователь'}</DesignText>
                {!!person.username && <DesignText variant="caption" style={guestStyles.muted}>@{person.username}</DesignText>}
              </View>
            </View>)}
          </View>
          {friendsCount > friends.length && <DesignText variant="caption" style={guestStyles.muted}>
            Показаны {friends.length} из {friendsCount} профилей из ваших подписок.
          </DesignText>}
        </View>}

        {otherCount > 0 && <View style={guestStyles.other}>
          <DesignText variant="label" style={guestStyles.sectionTitle}>
            {friends.length ? `Ещё ${otherCount} ${personWord(otherCount)}` : 'Профили не отображаются'}
          </DesignText>
          <DesignText variant="caption" style={guestStyles.otherNote}>
            {friends.length ? 'Имена и фото остальных гостей недоступны.' : 'Сейчас доступно только общее число участников. Здесь появятся профили, которые вы можете видеть.'}
          </DesignText>
        </View>}

        {state === 'empty' && <View style={guestStyles.other}>
          <DesignText variant="label" style={guestStyles.sectionTitle}>Пока без гостей</DesignText>
          <DesignText variant="caption" style={guestStyles.otherNote}>Здесь появятся участники события.</DesignText>
        </View>}
        {state === 'unavailable' && <DesignButton label="Обновить" variant="secondary" onPress={onRetry} />}
      </ScrollView>}
  </View>;
}

const guestStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { padding: 24, paddingTop: 12, gap: 28 },
  summary: { padding: 20, borderRadius: 24, backgroundColor: C.surface, gap: 16 },
  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' },
  number: { fontSize: 48, lineHeight: 54 },
  totalLabel: { fontSize: 16, lineHeight: 23, color: C.textSecondary },
  summaryPeople: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  section: { gap: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionTitle: { fontSize: 16, lineHeight: 22 },
  badge: { minWidth: 26, minHeight: 26, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: C.surfaceRaised },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 84, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  avatarPlaceholder: { width: 48, height: 48, flexShrink: 0, borderRadius: 24, backgroundColor: '#090909', borderWidth: 1, borderColor: C.border },
  personText: { flex: 1, minWidth: 0, gap: 3 },
  personName: { fontSize: 15, lineHeight: 21 },
  other: { padding: 18, borderRadius: 20, borderWidth: 1, borderColor: C.border, gap: 8 },
  otherNote: { color: C.textSecondary, fontSize: 13, lineHeight: 20 },
  unavailableTitle: { fontSize: 24, lineHeight: 30 },
  muted: { color: C.textSecondary },
  flex: { flex: 1, minWidth: 0 },
});
