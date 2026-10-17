module.exports = function (g, r, i, a, m, exports, d) {
  'use strict';

  const unwrap = value => value && value.__esModule ? value.default : value;
  const React = r(d[0]),
    ActivityIndicator = unwrap(r(d[1]));
  const Pressable = unwrap(r(d[3])),
    ScrollView = unwrap(r(d[4])),
    View = unwrap(r(d[7]));
  const {
      useFocusEffect
    } = r(d[8]),
    Screen = unwrap(r(d[9])),
    Header = unwrap(r(d[10]));
  const ProfileHero = unwrap(r(d[11])),
    Text = unwrap(r(d[12])),
    Button = unwrap(r(d[13]));
  const IconButton = unwrap(r(d[14])),
    Badge = unwrap(r(d[15])),
    Sheet = unwrap(r(d[16]));
  const AnonGate = unwrap(r(d[17])),
    {
      useAuth
    } = r(d[18]),
    layout = r(d[19]);
  const {
    DesignColors: colors,
    DesignTypography: type
  } = r(d[20]);
  const {
      usePublicProfile
    } = r(d[21]),
    followApi = r(d[22]),
    {
      queryClient
    } = r(d[23]);
  const {
      userProfileLink
    } = r(d[24]),
    {
      useGoBack
    } = r(d[25]);
  const {
      Feather
    } = r(d[27]),
    QRCode = unwrap(r(d[28]));
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  const ReportSheet = unwrap(r(d[29])),
    {
      blockUser
    } = r(d[30]);
  exports.default = UserProfileScreen;
  function UserProfileScreen({
    route,
    navigation
  }) {
    const userId = route.params.userId,
      {
        userId: viewerId
      } = useAuth();
    const back = useGoBack(),
      column = layout.useColumnContent();
    const query = usePublicProfile(userId, viewerId),
      refetch = query.refetch;
    useFocusEffect(React.useCallback(() => {
      if (viewerId) refetch();
    }, [viewerId, refetch]));
    const [busy, setBusy] = React.useState(false),
      [message, setMessage] = React.useState('');
    const [shareOpen, setShareOpen] = React.useState(false),
      [menuOpen, setMenuOpen] = React.useState(false);
    const [badge, setBadge] = React.useState(null),
      [safetyAction, setSafetyAction] = React.useState(null);
    const [blockBusy, setBlockBusy] = React.useState(false),
      [blockError, setBlockError] = React.useState('');
    React.useEffect(() => setBlockError(''), [safetyAction, userId]);
    const confirmBlock = async () => {
      if (blockBusy) return;
      setBlockBusy(true);
      setBlockError('');
      try {
        const ok = await blockUser(userId);
        if (ok) {
          setSafetyAction(null);
          back();
        } else setBlockError('Не вышло заблокировать. Проверьте связь и попробуйте ещё раз.');
      } catch {
        setBlockError('Не вышло заблокировать. Проверьте связь и попробуйте ещё раз.');
      } finally {
        setBlockBusy(false);
      }
    };
    React.useEffect(() => {
      setMessage('');
      setBadge(null);
    }, [userId]);
    const data = query.data;
    const profileUrl = userProfileLink(userId);
    const loading = query.isPending,
      failed = query.isError;
    const isSelf = userId === viewerId;
    const following = data?.isFollowing ?? false;
    const earned = data?.earned ?? [];
    const featured = data?.featured ?? [];
    const retry = () => refetch();
    const toggleFollow = async () => {
      if (!viewerId || !data || busy || isSelf) return;
      setBusy(true);
      setMessage('');
      try {
        const next = !data.isFollowing;
        if (!(await (next ? followApi.follow(viewerId, userId) : followApi.unfollow(viewerId, userId)))) {
          setMessage('Не получилось изменить подписку. Попробуйте ещё раз.');
          return;
        }
        queryClient.setQueryData(['public-user-profile', userId, viewerId], value => value ? {
          ...value,
          isFollowing: next,
          followers: Math.max(0, value.followers + (next ? 1 : -1))
        } : value);
      } catch {
        setMessage('Не получилось изменить подписку. Проверьте связь.');
      } finally {
        setBusy(false);
      }
    };
    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(profileUrl);
        setShareOpen(false);
        setMessage('Ссылка на профиль скопирована.');
      } catch {
        setMessage('Не получилось скопировать ссылку. Попробуйте ещё раз.');
      }
    };
    const openMessage = () => {
      navigation.navigate('Chat', {
        chatId: userId,
        type: 'dm',
        name: data.profile.name,
        initials: data.profile.initials
      });
    };
    if (!viewerId) return <Screen background="bg" edges={['top', 'bottom']}>
      <Header design="2026" title="Профиль" onBack={back} />
      <AnonGate glyph="users" title="Познакомьтесь со своими" text="Создайте профиль, чтобы смотреть профили людей, подписываться и общаться." reason="profile" />
    </Screen>;
    if (loading || failed || !data) return <Screen background="bg" edges={['top', 'bottom']}>
      <Header design="2026" title="Профиль" onBack={back} />
      <View style={styles.unavailable}>
        {loading ? <ActivityIndicator color={colors.text} accessibilityLabel="Загрузка профиля" /> : <>
          <Text accessibilityRole={failed ? 'alert' : 'header'} style={styles.stateTitle}>{failed ? 'Не удалось загрузить профиль' : 'Профиль недоступен'}</Text>
          <Text style={styles.stateText}>{failed ? 'Проверьте связь и попробуйте ещё раз.' : 'Пользователь не найден или просмотр недоступен.'}</Text>
          {failed && <Button label="Повторить" variant="secondary" onPress={retry} />}
        </>}
      </View>
    </Screen>;
    return <Screen background="bg" edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, column]}>
        <ProfileHero compact profile={data.profile} modeLabel={data.isOrganizer ? 'Организатор' : undefined} featured={featured} onBadge={setBadge} message={message} toolbar={<><IconButton icon="back" label="назад" onPress={back} /><Text style={styles.toolbarLabel}>профиль</Text><View style={{
            flex: 1
          }} /></>} />
        {isSelf ? <Button label="Мой профиль" onPress={() => navigation.navigate('Tabs', {
          screen: 'Profile'
        })} /> : <View style={styles.actions}>
          <Button label={following ? 'Вы подписаны' : 'Подписаться'} variant={following ? 'secondary' : 'primary'} selected={following} loading={busy} onPress={toggleFollow} style={styles.follow} accessibilityLabel={following ? 'отписаться' : 'подписаться'} />
          <Button label="Написать" variant="secondary" onPress={openMessage} style={styles.message} />
          <MoreButton onPress={() => setMenuOpen(true)} />
        </View>}
        <View style={styles.stats}>
          <Stat value={data.attended} label="Событий посещено" />
          <Stat value={data.followers} label="Подписчики" divider />
          <Stat value={data.following} label="Подписки" divider />
        </View>
        {data.isOrganizer && <Button label="События организатора" variant="secondary" onPress={() => navigation.navigate('OrganizerProfile', {
          organizerId: userId
        })} />}
        <View style={styles.awards}>
          <View style={styles.sectionHead}><Text style={styles.sectionTitle}>Награды</Text>{earned.length > 0 && <Text style={styles.muted}>{earned.length}</Text>}</View>
          {earned.length ? <View style={styles.awardGrid}>{earned.map(item => <Pressable key={item.id} style={styles.award} onPress={() => setBadge(item)} accessibilityRole="button" accessibilityLabel={`награда ${item.name}`}>
            <Badge design="2026" def={item} size={52} /><Text variant="caption" style={styles.awardName}>{item.name}</Text>
          </Pressable>)}</View> : <View style={styles.noAwards}><Text style={styles.emptyAwards}>Полученных наград пока нет.</Text></View>}
        </View>
      </ScrollView>
      {shareOpen && <Sheet design="2026" title="Поделиться профилем" onClose={() => setShareOpen(false)}>
        <View style={styles.shareBody}><View style={styles.qrPaper}><QRCode value={profileUrl} size={200} color="#000000" backgroundColor="#ffffff" /></View>
          <Text variant="label">{data.profile.name}</Text>{!!data.profile.username && <Text style={styles.muted}>@{data.profile.username}</Text>}
          <Button label="Скопировать ссылку" accessibilityLabel="скопировать ссылку на профиль" onPress={copyLink} style={{
            alignSelf: 'stretch',
            marginTop: 4
          }} />
        </View>
      </Sheet>}
      {menuOpen && <Sheet design="2026" title="Действия профиля" onClose={() => setMenuOpen(false)}>
        <View style={styles.menu}>
          <MenuItem icon="share" label="Поделиться" danger={false} onPress={() => {
            setMenuOpen(false);
            setMessage('');
            setShareOpen(true);
          }} />
          <MenuItem icon="flag" label="Пожаловаться" onPress={() => {
            setMenuOpen(false);
            setSafetyAction('report');
          }} />
          <MenuItem icon="slash" label="Заблокировать" onPress={() => {
            setMenuOpen(false);
            setSafetyAction('block');
          }} />
        </View>
      </Sheet>}
      {safetyAction && <>
 {safetyAction === 'report' && <ReportSheet visible onClose={() => setSafetyAction(null)} target="profile" targetId={userId} personId={userId} personName={data.profile.name} onBlocked={back} />}
 {safetyAction === 'block' && <Sheet design="2026" title="Блокировка" onClose={() => {
          if (!blockBusy) setSafetyAction(null);
        }}>
  <View style={styles.safetyBody}>
   <Text style={styles.stateTitle}>Заблокировать {data.profile.name}?</Text>
   <Text style={styles.stateText}>Вы перестанете видеть сообщения друг друга и писать друг другу, подписка между вами снимется. Его события останутся доступными по прямой ссылке, а уже купленный билет продолжит работать.</Text>
   {!!blockError && <Text accessibilityRole="alert" style={styles.stateText}>{blockError}</Text>}
   <Button label="Заблокировать" variant="secondary" loading={blockBusy} onPress={confirmBlock} />
   <Button label="Отмена" variant="secondary" disabled={blockBusy} onPress={() => setSafetyAction(null)} />
  </View>
 </Sheet>}
</>}
      {badge && <Sheet design="2026" title={badge.name} onClose={() => setBadge(null)}>
        <View style={styles.badgeDetail}><Badge design="2026" def={badge} size={72} /><Text>{badge.description}</Text></View>
      </Sheet>}
    </Screen>;
  }
  function MoreButton({
    onPress
  }) {
    const [focused, setFocused] = React.useState(false);
    return <Pressable accessibilityRole="button" accessibilityLabel="действия профиля" onPress={onPress} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={({
      pressed,
      hovered
    }) => [styles.more, (pressed || hovered) && {
      backgroundColor: colors.surfaceRaised
    }, focused && styles.focus]}><Feather name="more-horizontal" size={24} color={colors.text} /></Pressable>;
  }
  function Stat({
    value,
    label,
    divider
  }) {
    return <View style={[styles.stat, divider && styles.statDivider]} accessibilityLabel={`${label}: ${value}`}><Text variant="sectionTitle">{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
  }
  function MenuItem({
    icon,
    label,
    onPress,
    danger = true
  }) {
    return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({
      pressed
    }) => [styles.menuItem, pressed && {
      opacity: .7
    }]}><Feather name={icon} size={22} color={danger ? colors.danger : colors.text} /><Text style={[styles.menuLabel, {
        color: danger ? colors.danger : colors.text
      }]}>{label}</Text></Pressable>;
  }
  const styles = {
    body: {
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 32,
      gap: 20
    },
    toolbarLabel: {
      ...type.caption,
      color: colors.textSecondary,
      marginLeft: 12
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    follow: {
      flex: 1.3,
      minWidth: 0,
      paddingHorizontal: 10
    },
    message: {
      flex: 1,
      minWidth: 0,
      paddingHorizontal: 10
    },
    more: {
      width: 52,
      height: 52,
      flexShrink: 0,
      borderRadius: 26,
      borderWidth: 1,
      borderColor: colors.fieldBorder,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background
    },
    focus: {
      outlineWidth: 2,
      outlineColor: colors.text,
      outlineOffset: 3
    },
    stats: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      backgroundColor: colors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      minHeight: 48,
      paddingHorizontal: 5
    },
    statDivider: {
      borderLeftWidth: 1,
      borderLeftColor: colors.border
    },
    statLabel: {
      ...type.caption,
      fontSize: 11,
      lineHeight: 16,
      minHeight: 32,
      textAlign: 'center',
      color: colors.textSecondary
    },
    awards: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      padding: 18,
      gap: 16
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    sectionTitle: {
      ...type.label,
      fontSize: 16,
      lineHeight: 22,
      color: colors.text
    },
    muted: {
      ...type.caption,
      color: colors.textSecondary
    },
    noAwards: {
      paddingTop: 8,
      paddingBottom: 12
    },
    emptyAwards: {
      ...type.body,
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary
    },
    awardGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    award: {
      width: '30%',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 8
    },
    awardName: {
      color: colors.textSecondary,
      textAlign: 'center'
    },
    shareBody: {
      alignItems: 'center',
      gap: 12,
      paddingBottom: 24
    },
    qrPaper: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12
    },
    menu: {
      gap: 4,
      paddingBottom: 16
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      minHeight: 60,
      paddingHorizontal: 4
    },
    menuLabel: {
      ...type.label,
      fontSize: 16,
      lineHeight: 22,
      color: colors.danger
    },
    safetyBody: {
      alignItems: 'stretch',
      gap: 24,
      paddingBottom: 24
    },
    badgeDetail: {
      alignItems: 'center',
      gap: 16,
      paddingBottom: 24
    },
    unavailable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 16
    },
    stateTitle: {
      ...type.sectionTitle,
      textAlign: 'center',
      color: colors.text
    },
    stateText: {
      ...type.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: 'center'
    }
  };
};
