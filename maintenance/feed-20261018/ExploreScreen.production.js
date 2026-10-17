module.exports = function (g, r, i, a, m, exports, d) {
  'use strict';

  const unwrap = v => v && v.__esModule ? v.default : v;
  const React = r(d[0]),
    ActivityIndicator = unwrap(r(d[1])),
    Animated = unwrap(r(d[2])),
    Easing = unwrap(r(d[3]));
  const FlatList = unwrap(r(d[4])),
    Pressable = unwrap(r(d[6])),
    RefreshControl = unwrap(r(d[7]));
  const Modal = unwrap(r(d[8])),
    ScrollView = unwrap(r(d[9])),
    View = unwrap(r(d[11]));
  const {
      useNavigation,
      useFocusEffect
    } = r(d[12]),
    {
      LinearGradient
    } = r(d[13]);
  const Screen = unwrap(r(d[14])),
    Text = unwrap(r(d[21])),
    Avatar = unwrap(r(d[16]));
  const Button = unwrap(r(d[20])),
    Sheet = unwrap(r(d[22]));
  const {
    DesignColors: colors,
    DesignTypography: type
  } = r(d[23]);
  const {
      eventPosterContent
    } = r(d[24]),
    {
      Icon
    } = r(d[25]),
    {
      eventImage
    } = r(d[26]);
  const {
      useFeed,
      useEvent
    } = r(d[27]),
    {
      useGoingMap,
      useGoing
    } = r(d[28]),
    {
      useSaved
    } = r(d[29]);
  const {
    useReduceMotion
  } = r(d[32]);
  const viewability = {
    itemVisiblePercentThreshold: 55,
    minimumViewTime: 60
  };
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.default = ExploreScreen;
  function ExploreScreen() {
    const navigation = useNavigation(),
      feed = useFeed();
    const loading = feed.loading,
      failed = feed.failed;
    const events = feed.events;
    const [height, setHeight] = React.useState(0),
      [activeId, setActiveId] = React.useState(null);
    const list = React.useRef(null),
      returnId = React.useRef(null);
    const ids = React.useMemo(() => events.map(e => e.id), [events]),
      going = useGoingMap(ids);
    const onVisible = React.useRef(({
      viewableItems
    }) => {
      const event = viewableItems[0]?.item;
      if (event) setActiveId(event.id);
    }).current;
    React.useEffect(() => setActiveId(id => id && ids.includes(id) ? id : ids[0] ?? null), [ids]);
    useFocusEffect(React.useCallback(() => {
      if (!returnId.current || height <= 0) return;
      const index = ids.indexOf(returnId.current);
      if (index < 0) {
        returnId.current = null;
        return;
      }
      const frame = requestAnimationFrame(() => list.current?.scrollToOffset({
        offset: index * height,
        animated: false
      }));
      return () => cancelAnimationFrame(frame);
    }, [ids, height]));
    const refresh = () => feed.refresh();
    const open = event => {
      returnId.current = event.id;
      navigation.navigate('EventDetail', {
        eventId: event.id
      });
    };
    const attend = event => {
      returnId.current = event.id;
      navigation.navigate('Purchase', {
        eventId: event.id
      });
    };
    return <Screen background="bg" edges={[]}>
      <View style={styles.feed} onLayout={e => {
        const value = e.nativeEvent.layout.height;
        if (value > 0) setHeight(value);
      }}>
        {loading ? <View style={styles.state} accessibilityLabel="Загрузка ленты">
          <View style={styles.stateMark}><ActivityIndicator color={colors.text} /></View><Text style={styles.stateTitle}>Собираем ленту</Text>
        </View> : !events.length ? <View style={styles.state}>
          <View style={styles.stateMark}><Icon name={failed ? 'offline' : 'feed'} size={28} color={colors.textSecondary} /></View>
          <Text accessibilityRole={failed ? 'alert' : 'header'} style={styles.stateTitle}>{failed ? 'Лента не загрузилась' : 'Пока без событий'}</Text>
          <Text style={styles.stateText}>{failed ? 'Проверьте соединение и попробуйте ещё раз.' : 'Новые события появятся здесь. Загляните чуть позже.'}</Text>
          <Button label={failed ? 'Повторить' : 'Обновить ленту'} variant="secondary" onPress={refresh} />
        </View> : height > 0 && <FlatList ref={list} data={events} keyExtractor={event => event.id} pagingEnabled snapToInterval={height} snapToAlignment="start" decelerationRate="fast" disableIntervalMomentum showsVerticalScrollIndicator={false} onViewableItemsChanged={onVisible} viewabilityConfig={viewability} onScrollBeginDrag={() => {
          returnId.current = null;
        }} getItemLayout={(_, index) => ({
          length: height,
          offset: index * height,
          index
        })} refreshControl={<RefreshControl refreshing={feed.refreshing} onRefresh={refresh} tintColor={colors.textSecondary} />} renderItem={({
          item
        }) => <FeedPage event={item} height={height} active={item.id === activeId} knownGoing={going.has(item.id)} onOpen={() => open(item)} onAttend={() => attend(item)} />} />}
      </View>
    </Screen>;
  }
  function FeedPage({
    event,
    height,
    active,
    knownGoing,
    onOpen,
    onAttend
  }) {
    const navigation = useNavigation(),
      {
        going
      } = useGoing(event.id, knownGoing),
      savedData = useSaved(event.id);
    const {
        detail
      } = useEvent(active ? event.id : ''),
      poster = eventPosterContent(detail ?? event),
      organizer = detail?.organizer;
    const [about, setAbout] = React.useState(false);
    const saved = savedData.saved;
    const reduced = useReduceMotion(),
      fade = React.useRef(new Animated.Value(active ? 1 : 0)).current;
    React.useEffect(() => {
      if (!active) setAbout(false);
    }, [active]);
    React.useEffect(() => {
      if (reduced) {
        fade.setValue(active ? 1 : 0);
        return;
      }
      const animation = Animated.timing(fade, {
        toValue: active ? 1 : 0,
        duration: 180,
        easing: Easing.bezier(.2, .8, .2, 1),
        useNativeDriver: true
      });
      animation.start();
      return () => animation.stop();
    }, [active, reduced, fade]);
    const openOrganizer = () => {
      if (organizer) {
        setAbout(false);
        navigation.navigate('OrganizerProfile', {
          organizerId: organizer.id
        });
      }
    };
    const toggleSaved = () => savedData.toggle();
    const when = [event.day, [event.num, event.month].filter(Boolean).join(' ')].filter(Boolean).join(', ') + ' · ' + event.time;
    const reducedHeight = height < 600;
    return <View style={[styles.page, {
      height
    }]} accessibilityElementsHidden={!active} importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}>
      <Pressable style={styles.fill} onPress={onOpen} accessibilityRole="button" accessibilityLabel={`открыть событие: ${event.title}`}>
        <EventMedia event={event} height={height} />
      </Pressable>
      <LinearGradient colors={['rgba(10,10,10,.48)', 'rgba(10,10,10,0)', 'rgba(10,10,10,.30)', '#0a0a0a', '#0a0a0a']} locations={[0, .22, .43, .73, 1]} style={styles.fill} pointerEvents="none" />
      <Animated.View style={[styles.info, {
        opacity: fade.interpolate({
          inputRange: [0, 1],
          outputRange: [.55, 1]
        })
      }, reducedHeight && styles.infoCompact]}>
        <Pressable accessibilityRole="button" accessibilityLabel={event.title} onPress={onOpen} style={({
          pressed
        }) => pressed && styles.pressed}>
          <Text accessibilityRole="header" style={styles.title}>{event.title}</Text>
        </Pressable>
        <View style={styles.organizerRow}>
          <Pressable disabled={!organizer} accessibilityRole={organizer ? 'button' : undefined} accessibilityLabel={`профиль организатора: ${poster.organizerName}`} onPress={openOrganizer} style={({
            pressed
          }) => [styles.organizer, pressed && styles.pressed]}>
            <Avatar name={poster.organizerName} initials={organizer?.initials ?? poster.organizerInitials} avatarUrl={organizer?.avatarUrl} size={32} design="2026" />
            <Text numberOfLines={1} style={styles.organizerName}>{poster.organizerName}</Text>
          </Pressable>
        </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`о событии: ${event.title}`} onPress={() => setAbout(true)} style={({
          pressed
        }) => [styles.about, pressed && styles.pressed]}>
            <Text style={styles.aboutText}>О событии</Text>
          </Pressable>
        <View style={styles.actions}>
          <Action onPress={going ? onOpen : onAttend} label={going ? 'Билет у вас' : 'Иду'} price={event.price} selected={going} />
          <Favorite saved={saved} title={event.title} onPress={toggleSaved} />
        </View>
      </Animated.View>
      <Modal visible={about} transparent animationType="none" onRequestClose={() => setAbout(false)}>
        {about && <Sheet design="2026" title="О событии" onClose={() => setAbout(false)}>
          <ScrollView style={{
            maxHeight: height * .68
          }} contentContainerStyle={styles.sheet} showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetTitle}>{event.title}</Text>
            <View style={styles.metaRow}><Icon name="cal" size={20} color={colors.textSecondary} /><Text style={styles.sheetText}>{when}</Text></View>
            <View style={styles.metaRow}><Icon name="pin" size={20} color={colors.textSecondary} /><Text style={styles.sheetText}>{[event.city, event.place].filter(Boolean).join(' · ')}</Text></View>
            <View style={styles.rule} />
            <Pressable disabled={!organizer} accessibilityRole={organizer ? 'button' : undefined} accessibilityLabel={`организатор: ${poster.organizerName}`} onPress={openOrganizer} style={styles.sheetOrganizer}>
              <Avatar name={poster.organizerName} initials={organizer?.initials ?? poster.organizerInitials} avatarUrl={organizer?.avatarUrl} size={40} design="2026" />
              <View style={{
                flex: 1,
                gap: 3
              }}><Text style={styles.caption}>Организатор</Text><Text variant="label">{poster.organizerName}</Text></View>
            </Pressable>
            <Text style={styles.description}>{poster.description}</Text>
            <Button label="Открыть афишу" variant="secondary" onPress={() => {
              setAbout(false);
              onOpen();
            }} />
          </ScrollView>
        </Sheet>}
      </Modal>
    </View>;
  }
  const Media = unwrap(r(d[19]));
  function EventMedia({
    event,
    height
  }) {
    return <Media design="2026" palette={event.palette} imageUri={event.imageUri} image={eventImage(event)} height={height} />;
  }
  function Action({
    label,
    price,
    onPress,
    selected
  }) {
    const [focus, setFocus] = React.useState(false);
    return <Pressable accessibilityRole="button" accessibilityLabel={`${label}, ${price}`} accessibilityState={{
      selected
    }} onPress={onPress} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={({
      pressed
    }) => [styles.go, selected && styles.goSelected, pressed && styles.pressed, focus && styles.focus]}>
      <Text numberOfLines={1} style={[styles.goLabel, selected && styles.selectedText]}>{label}</Text>
      <View style={[styles.goDivider, selected && {
        backgroundColor: colors.fieldBorder
      }]} />
      <Text numberOfLines={1} style={[styles.goPrice, selected && styles.selectedText]}>{price}</Text>
    </Pressable>;
  }
  function Favorite({
    saved,
    title,
    onPress
  }) {
    const [focus, setFocus] = React.useState(false);
    return <Pressable accessibilityRole="button" accessibilityState={{
      selected: saved
    }} accessibilityLabel={`${saved ? 'убрать из избранного' : 'в избранное'}: ${title}`} onPress={onPress} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={({
      pressed
    }) => [styles.favorite, saved && styles.favoriteSelected, pressed && styles.pressed, focus && styles.focus]}><Icon name="heart" size={21} color={saved ? colors.background : colors.text} /></Pressable>;
  }
  const styles = {
    feed: {
      flex: 1,
      backgroundColor: colors.background
    },
    page: {
      justifyContent: 'flex-end',
      backgroundColor: colors.background
    },
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    info: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      gap: 12
    },
    infoCompact: {
      paddingHorizontal: 16,
      paddingBottom: 12,
      gap: 12
    },
    title: {
      ...type.eventTitle,
      fontSize: 34,
      lineHeight: 40,
      color: colors.text
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 9
    },
    organizerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    organizer: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      minHeight: 44
    },
    organizerName: {
      ...type.body,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      flex: 1
    },
    about: {
      minHeight: 32,
      alignSelf: 'flex-start',
      justifyContent: 'center',
      paddingRight: 20,
      marginTop: -8
    },
    aboutText: {
      ...type.label,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    go: {
      height: 48,
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderRadius: 24,
      paddingHorizontal: 14,
      backgroundColor: colors.text,
      borderWidth: 1,
      borderColor: colors.text
    },
    goSelected: {
      backgroundColor: colors.background,
      borderColor: colors.fieldBorder
    },
    goLabel: {
      ...type.label,
      fontSize: 14,
      lineHeight: 20,
      color: colors.background,
      flexShrink: 1
    },
    goDivider: {
      width: 1,
      height: 14,
      backgroundColor: 'rgba(10,10,10,.20)'
    },
    goPrice: {
      ...type.caption,
      fontSize: 12,
      lineHeight: 18,
      color: colors.background,
      flexShrink: 1
    },
    selectedText: {
      color: colors.text
    },
    favorite: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.fieldBorder,
      backgroundColor: 'rgba(10,10,10,.55)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    favoriteSelected: {
      backgroundColor: colors.text,
      borderColor: colors.text
    },
    pressed: {
      opacity: .72
    },
    focus: {
      outlineWidth: 2,
      outlineColor: colors.text,
      outlineOffset: 3
    },
    sheet: {
      gap: 18,
      paddingBottom: 24
    },
    sheetTitle: {
      ...type.sectionTitle,
      fontSize: 24,
      lineHeight: 30,
      color: colors.text
    },
    sheetText: {
      ...type.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.text,
      flex: 1
    },
    sheetOrganizer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      minHeight: 48
    },
    caption: {
      ...type.caption,
      color: colors.textSecondary
    },
    rule: {
      height: 1,
      backgroundColor: colors.border
    },
    description: {
      ...type.body,
      fontSize: 14,
      lineHeight: 23,
      color: colors.textSecondary
    },
    state: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 28,
      gap: 16
    },
    stateMark: {
      width: 64,
      height: 64,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8
    },
    stateTitle: {
      ...type.sectionTitle,
      fontSize: 24,
      lineHeight: 30,
      color: colors.text,
      textAlign: 'center'
    },
    stateText: {
      ...type.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: 'center',
      maxWidth: 280,
      marginBottom: 8
    }
  };
};
