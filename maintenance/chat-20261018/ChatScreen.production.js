module.exports = function (g, r, i, a, m, exports, d) {
  'use strict';

  const unwrap = v => v && v.__esModule ? v.default : v;
  const React = r(d[0]),
    View = unwrap(r(d[1])),
    ScrollView = unwrap(r(d[2])),
    Pressable = unwrap(r(d[3]));
  const KeyboardAvoidingView = unwrap(r(d[5])),
    Screen = unwrap(r(d[7])),
    Text = unwrap(r(d[8]));
  const {
      DesignColors: colors,
      DesignTypography: type
    } = r(d[11]),
    Avatar = unwrap(r(d[12]));
  const {
      useProfile
    } = r(d[13]),
    chatHooks = r(d[14]),
    ReportSheet = unwrap(r(d[15])),
    {
      useAuth
    } = r(d[16]);
  const {
      columnContent,
      useLayout
    } = r(d[17]),
    {
      useGoBack
    } = r(d[18]),
    Input = unwrap(r(d[21])),
    {
      Icon
    } = r(d[22]);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.default = ChatScreen;
  const sameDay = (a, b) => !!a && !!b && new Date(a).toDateString() === new Date(b).toDateString();
  const isOrdinary = m => m && !m.isSystem && !m.isOrg;
  const sameAuthor = (a, b) => isOrdinary(a) && isOrdinary(b) && a.from === b.from && (a.from === 'me' || (a.authorId || a.author) === (b.authorId || b.author)) && sameDay(a.at, b.at);
  function dayLabel(at) {
    const date = new Date(at);
    if (Number.isNaN(date.getTime())) return '';
    const today = new Date(),
      yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return date.toDateString() === today.toDateString() ? 'Сегодня' : date.toDateString() === yesterday.toDateString() ? 'Вчера' : date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }
  function ChatScreen({
    route
  }) {
    const onBack = useGoBack(),
      params = route.params || {};
    const realChat = {
      id: params.chatId,
      type: params.type,
      name: params.name || (params.type === 'dm' ? 'Личный чат' : 'Чат события'),
      sub: params.sub,
      initials: params.initials
    };
    const chat = realChat;
    return <ChatContent chat={chat} onBack={onBack} key={chat.type + chat.id} />;
  }
  function ChatContent({
    chat,
    onBack
  }) {
    const {
        userId
      } = useAuth(),
      {
        profile
      } = useProfile('guest'),
      {
        tight
      } = useLayout(),
      isDm = chat.type === 'dm',
      padding = tight ? 16 : 20;
    const sending = React.useRef(false);
    const event = chatHooks.useChatMessages(isDm ? '' : chat.id, userId, profile.name);
    const dm = chatHooks.useDmMessages(isDm ? chat.id : '', userId),
      data = isDm ? dm : event;
    const [draft, setDraft] = React.useState(''),
      [focused, setFocused] = React.useState(false),
      [inputHeight, setInputHeight] = React.useState(52);
    const [pending, setPending] = React.useState(false),
      [failures, setFailures] = React.useState([]),
      [report, setReport] = React.useState(null);
    const list = React.useRef(null),
      count = React.useRef(0);
    const messages = [...data.messages, ...failures.map(message => ({
      ...message,
      failed: true
    }))].map((message, index) => ({
      message,
      index,
      at: Number.isFinite(Date.parse(message.at)) ? Date.parse(message.at) : Infinity
    })).sort((a, b) => a.at - b.at || a.index - b.index).map(entry => entry.message);
    const unavailable = false,
      loading = false,
      canSend = !!draft.trim() && !unavailable && !pending && !loading;
    const scrollToEnd = () => list.current?.scrollToEnd({
      animated: false
    });
    React.useEffect(() => {
      const frame = requestAnimationFrame(scrollToEnd);
      return () => cancelAnimationFrame(frame);
    }, [messages.length]);
    const failedMessage = text => ({
      id: 'failed-' + ++count.current,
      from: 'me',
      text,
      at: new Date().toISOString()
    });
    const send = async () => {
      if (!canSend || sending.current) return;
      const text = draft.trim();
      sending.current = true;
      setPending(true);
      setDraft('');
      setInputHeight(52);
      try {
        const error = await data.send(text);
        if (error) setFailures(old => [...old, {
          ...failedMessage(text),
          error
        }]);
      } catch {
        setFailures(old => [...old, {
          ...failedMessage(text),
          error: 'Не отправилось. Попробуйте ещё раз.'
        }]);
      } finally {
        sending.current = false;
        setPending(false);
      }
    };
    const retry = async message => {
      if (!message || sending.current || pending || unavailable) return;
      sending.current = true;
      setPending(true);
      try {
        const error = await data.send(message.text);
        if (!error) setFailures(old => old.filter(item => item.id !== message.id));else setFailures(old => old.map(item => item.id === message.id ? {
          ...item,
          error
        } : item));
      } catch {
        setFailures(old => old.map(item => item.id === message.id ? {
          ...item,
          error: 'Не отправилось. Попробуйте ещё раз.'
        } : item));
      } finally {
        sending.current = false;
        setPending(false);
      }
    };
    const showReport = message => {
      setReport({
        id: message.id,
        authorId: message.authorId,
        author: message.author
      });
    };
    return <Screen edges={['top', 'bottom']}>
      <View style={[styles.header, columnContent, {
        paddingHorizontal: padding
      }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={onBack} style={({
          pressed
        }) => [styles.back, pressed && styles.pressed]}><Icon name="back" size={22} color={colors.text} /></Pressable>
        {isDm ? <Avatar design="2026" name={chat.name} initials={chat.initials} size={42} /> : <View style={styles.eventAvatar}><Icon name="ticket" size={21} color={colors.textSecondary} /></View>}
        <View style={styles.identity}><Text accessibilityRole="header" numberOfLines={2} style={styles.name}>{chat.name}</Text><Text numberOfLines={1} style={styles.subtitle}>{isDm ? 'Личная переписка' : chat.sub || 'Чат события'}</Text></View>
      </View>
      <KeyboardAvoidingView style={styles.grow} behavior={undefined}>
        <ScrollView ref={list} style={styles.grow} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" onContentSizeChange={scrollToEnd} contentContainerStyle={[columnContent, styles.history, {
          paddingHorizontal: padding
        }]}>
          {loading ? <View style={styles.empty} accessibilityLabel="Загрузка переписки"><View style={[styles.placeholder, {
              alignSelf: 'flex-start',
              width: '65%'
            }]} /><View style={[styles.placeholder, {
              alignSelf: 'flex-end',
              width: '52%'
            }]} /><Text style={styles.emptyText}>Загружаем переписку</Text></View> : !messages.length ? <View style={styles.empty}><View style={styles.emptyIcon}><Icon name="msg" size={30} color={colors.textSecondary} /></View>{unavailable && <Text accessibilityRole="header" style={styles.emptyTitle}>Переписка недоступна</Text>}<Text style={styles.emptyText}>{unavailable ? 'Сейчас отправлять сообщения нельзя.' : 'Здесь появится ваш разговор.'}</Text></View> : messages.map((message, index) => {
            const prev = messages[index - 1],
              next = messages[index + 1],
              start = !sameAuthor(prev, message),
              end = !sameAuthor(message, next),
              showDay = !!message.at && !sameDay(prev?.at, message.at);
            return <View key={message.id} style={{
              marginTop: index === 0 ? 0 : start ? 16 : 4
            }}>
              {showDay && <View style={styles.dateRow}><View style={styles.dateLine} /><Text style={styles.date}>{dayLabel(message.at)}</Text><View style={styles.dateLine} /></View>}
              <Message message={message} isDm={isDm} groupStart={start} groupEnd={end} onLongPress={() => showReport(message)} onRetry={() => retry(message)} pending={pending} />
            </View>;
          })}
        </ScrollView>
        <View style={[columnContent, styles.composerArea, {
          paddingHorizontal: padding
        }]}>
          <View style={styles.composerRow}>
            <View style={[styles.inputShell, focused && styles.inputFocus, unavailable && styles.disabledField]}>
              <Input accessibilityLabel="Сообщение" placeholder={unavailable ? 'Сообщения недоступны' : 'Сообщение'} placeholderTextColor={colors.textSecondary} value={draft} onChangeText={setDraft} maxLength={2000} multiline autoFocus={false} editable={!unavailable && !pending && !loading} textAlignVertical="top" onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onContentSizeChange={e => setInputHeight(Math.max(52, Math.min(128, e.nativeEvent.contentSize.height)))} style={[styles.input, {
                height: inputHeight
              }]} />
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel={pending ? 'Отправляем сообщение' : 'Отправить сообщение'} accessibilityState={{
              disabled: !canSend
            }} disabled={!canSend} onPress={send} style={({
              pressed
            }) => [styles.send, !canSend && styles.sendDisabled, pressed && styles.pressed]}>
              <View style={{
                transform: [{
                  rotate: '90deg'
                }]
              }}><Icon name="back" size={21} color={canSend ? colors.background : colors.textSecondary} /></View>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
      <ReportSheet visible={!!report} onClose={() => setReport(null)} target={isDm ? 'dm' : 'message'} targetId={report?.id || ''} personId={report?.authorId} personName={report?.author} />
    </Screen>;
  }
  function Message({
    message,
    isDm,
    groupStart,
    groupEnd,
    onLongPress,
    onRetry,
    pending
  }) {
    const mine = message.from === 'me',
      time = chatHooks.formatMessageTime(message.at);
    if (message.isSystem) return <Text style={styles.system}>{message.text}</Text>;
    if (message.isOrg) return <View style={styles.announcement}><View style={styles.announcementLabel}><Icon name="info" size={15} color={colors.textSecondary} /><Text style={styles.author}>Организатор</Text></View><Text style={styles.announcementText}>{message.text}</Text>{!!time && <Text style={styles.time}>{time}</Text>}</View>;
    return <View style={[styles.messageRow, mine && styles.mineRow]}>
      {!mine && !isDm && <View style={styles.messageAvatar}>{groupEnd && <Avatar design="2026" name={message.author || 'Участник'} size={28} />}</View>}
      <View style={[styles.messageColumn, mine && {
        alignItems: 'flex-end'
      }]}>
        <Pressable onLongPress={!mine ? onLongPress : undefined} delayLongPress={350} accessibilityRole={!mine ? 'button' : undefined} accessibilityLabel={!mine ? `Сообщение от ${message.author || 'участника'}: ${message.text}. Удерживайте для действий.` : undefined} style={[styles.bubble, mine ? styles.mine : styles.theirs, groupEnd && (mine ? styles.mineEnd : styles.theirsEnd), message.failed && styles.failed]}>
          {!mine && !isDm && groupStart && !!message.author && <Text style={styles.author}>{message.author}</Text>}
          <Text style={[styles.messageText, mine && styles.mineText]}>{message.text}</Text>
          {!!time && <Text style={[styles.time, mine && styles.mineTime]}>{time}</Text>}
        </Pressable>
        {message.failed && <Pressable accessibilityRole="button" accessibilityLabel="Повторить отправку" onPress={onRetry} disabled={pending} style={styles.retry}><Text style={styles.retryText}>{pending ? 'Отправляем…' : message.error ? message.error + ' · Повторить' : 'Не отправлено · Повторить'}</Text></Pressable>}
      </View>
    </View>;
  }
  const styles = {
    grow: {
      flex: 1,
      minHeight: 0
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#222'
    },
    back: {
      width: 44,
      height: 44,
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    eventAvatar: {
      width: 42,
      height: 42,
      borderRadius: 14,
      backgroundColor: '#202020',
      alignItems: 'center',
      justifyContent: 'center'
    },
    identity: {
      flex: 1,
      minWidth: 0,
      gap: 4
    },
    name: {
      ...type.label,
      fontSize: 16,
      lineHeight: 21,
      color: colors.text
    },
    subtitle: {
      ...type.caption,
      fontSize: 11,
      lineHeight: 16,
      color: colors.textSecondary
    },
    history: {
      flexGrow: 1,
      justifyContent: 'flex-end',
      paddingTop: 20,
      paddingBottom: 22
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingTop: 4,
      paddingBottom: 18
    },
    dateLine: {
      height: 1,
      width: 24,
      backgroundColor: '#242424'
    },
    date: {
      ...type.caption,
      fontSize: 10,
      color: colors.textSecondary
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 7,
      justifyContent: 'flex-start'
    },
    mineRow: {
      justifyContent: 'flex-end'
    },
    messageAvatar: {
      width: 28,
      flexShrink: 0
    },
    messageColumn: {
      maxWidth: '84%',
      minWidth: 0,
      flexShrink: 1
    },
    bubble: {
      paddingHorizontal: 14,
      paddingTop: 11,
      paddingBottom: 7,
      borderRadius: 20,
      minWidth: 64
    },
    mine: {
      backgroundColor: colors.text
    },
    theirs: {
      backgroundColor: '#1c1c1c'
    },
    mineEnd: {
      borderBottomRightRadius: 6
    },
    theirsEnd: {
      borderBottomLeftRadius: 6
    },
    messageText: {
      ...type.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
      overflowWrap: 'anywhere'
    },
    mineText: {
      color: colors.background
    },
    time: {
      ...type.caption,
      fontSize: 10,
      lineHeight: 14,
      color: colors.textSecondary,
      alignSelf: 'flex-end',
      marginTop: 4
    },
    mineTime: {
      color: '#68655f'
    },
    author: {
      ...type.label,
      fontSize: 11,
      lineHeight: 16,
      color: colors.textSecondary,
      marginBottom: 5
    },
    system: {
      ...type.caption,
      fontSize: 11,
      lineHeight: 17,
      color: colors.textSecondary,
      textAlign: 'center',
      paddingVertical: 6
    },
    announcement: {
      backgroundColor: '#141414',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#303030',
      padding: 16
    },
    announcementLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginBottom: 5
    },
    announcementText: {
      ...type.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.text
    },
    composerArea: {
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: '#222'
    },
    composerRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 10
    },
    inputShell: {
      flex: 1,
      minWidth: 0,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#2b2b2b',
      backgroundColor: '#171717',
      overflow: 'hidden'
    },
    inputFocus: {
      borderColor: '#8d8b84'
    },
    input: {
      ...type.body,
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
      minHeight: 52,
      maxHeight: 128,
      paddingHorizontal: 16,
      paddingVertical: 14,
      outlineWidth: 0,
      outlineStyle: 'none',
      outlineColor: 'transparent',
      borderWidth: 0,
      resize: 'none'
    },
    send: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.text,
      marginBottom: 3
    },
    sendDisabled: {
      backgroundColor: '#222'
    },
    disabledField: {
      opacity: .5
    },
    pressed: {
      opacity: .65
    },
    failed: {
      borderWidth: 1,
      borderColor: '#c86b66'
    },
    retry: {
      minHeight: 44,
      alignItems: 'flex-end',
      justifyContent: 'center',
      paddingHorizontal: 4
    },
    retryText: {
      ...type.caption,
      fontSize: 11,
      color: '#e39a93'
    },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 24
    },
    emptyIcon: {
      width: 68,
      height: 68,
      borderRadius: 24,
      backgroundColor: '#171717',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8
    },
    emptyTitle: {
      ...type.sectionTitle,
      fontSize: 22,
      lineHeight: 28,
      color: colors.text,
      textAlign: 'center'
    },
    emptyText: {
      ...type.body,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: 'center'
    },
    placeholder: {
      height: 66,
      borderRadius: 20,
      backgroundColor: '#1c1c1c',
      marginBottom: 8
    }
  };
};
