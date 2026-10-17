import { View } from 'react-native';
import Avatar from '../components/Avatar';
import { DesignColors as C } from '../constants/design2026';

type Person = { id?: string; name: string; initials?: string; avatarUrl?: string | null; username?: string | null };

// The stack is decorative: the parent button announces the participant count.
export default function GuestAvatars({ people, size = 40, ringColor = C.surface, placeholders = false }: {
  people: Person[]; size?: number; ringColor?: string; placeholders?: boolean;
}) {
  const faces = people.slice(0, 4);
  if (!faces.length) return null;
  return <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 0 }}
    pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {faces.map((person, index) => <View key={person.id ?? `${person.name}-${index}`}
      style={{ zIndex: faces.length - index, marginLeft: index ? -12 : 0 }}>
      {placeholders ? <View testID="demo-avatar-placeholder" style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: '#090909',
        borderWidth: 2, borderColor: ringColor, padding: 1,
      }}><View style={{ flex: 1, borderRadius: size / 2, borderWidth: 1, borderColor: C.border }} /></View>
        : <Avatar design="2026" name={person.name} initials={person.initials}
          avatarUrl={person.avatarUrl} size={size} ring ringColor={ringColor} />}
    </View>)}
  </View>;
}
