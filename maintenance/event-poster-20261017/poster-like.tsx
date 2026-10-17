import { useState } from 'react';
import { Pressable } from 'react-native';
import { Icon } from '../components/Icon';
import { DesignColors as C } from '../constants/design2026';

// Local to the event poster: other screens retain the existing 52 px control.
export default function PosterLike({ label, onPress, selected = false, disabled = false }: {
  label: string;
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
      accessibilityLabel={label} accessibilityState={{ selected, disabled }}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onHoverIn={() => setHovered(true)} onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [{
        width: 44, minHeight: 44, flexShrink: 0, borderRadius: 999,
        borderWidth: 1, borderColor: C.fieldBorder,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: disabled ? C.actionDisabled : selected
          ? (pressed || hovered ? C.actionPressed : C.actionPrimary)
          : pressed || hovered ? C.surfaceRaised : C.background,
      }, focused && { outlineWidth: 2, outlineColor: C.focus, outlineOffset: 3 }]}>
      <Icon name="heart" size={22}
        color={disabled ? C.onActionDisabled : selected ? C.onActionPrimary : C.text} />
    </Pressable>
  );
}
