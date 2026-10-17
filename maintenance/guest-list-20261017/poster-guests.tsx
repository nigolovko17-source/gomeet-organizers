import { View } from 'react-native';
import DesignText from '../components/DesignText';
import { DesignColors as C } from '../constants/design2026';
import { personWord } from '../data/plural';
import GuestAvatars from './avatar-stack';

export default function PosterGuests({ event, showAvatars = true, placeholderAvatars = false }: { event: any; showAvatars?: boolean; placeholderAvatars?: boolean }) {
  return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, minWidth: 0 }}>
    {showAvatars && <GuestAvatars people={event.friends ?? []} size={40} ringColor={C.surface} placeholders={placeholderAvatars} />}
    <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
      <DesignText variant="caption" style={{ color: C.textSecondary }}>Кто идёт</DesignText>
      <DesignText variant="label" style={{ fontSize: 16, lineHeight: 21 }}>
        {event.totalGoing} {personWord(event.totalGoing)}
      </DesignText>
    </View>
  </View>;
}
