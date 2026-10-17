module.exports = function (g, r, i, a, m, exports, d) {
  'use strict';
  const unwrap = value => value && value.__esModule ? value.default : value;
  const View = unwrap(r(d[0])), FlatList = unwrap(r(d[1]));
  const { useSafeAreaInsets } = r(d[3]);
  const Text = unwrap(r(d[4])), Pressable = unwrap(r(d[5]));
  const Button = unwrap(r(d[7])), layout = r(d[10]);
  const EventMedia = unwrap(r(d[11])), { eventImage } = r(d[13]);
  const { useHomeSections } = r(d[14]), { useSaved } = r(d[15]);
  const { DesignColors: colors, DesignTypography: type } = r(d[16]);
  const { useGoBack } = r(d[17]);
  const React = r(d[19]), { Icon } = r(d[20]);
  Object.defineProperty(exports, '__esModule', { value: true });
  exports.default = SectionScreen;
  const preview = typeof window !== 'undefined' && !!window.__SECTION_CONCEPT__;
  const notice = message => preview && window.parent.postMessage({type:'gomeet-section-notice', message}, location.origin);
  const eventWord = count => count % 10 === 1 && count % 100 !== 11 ? 'событие' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'события' : 'событий';

  function SectionScreen({ route, navigation }) {
    const back = useGoBack(), insets = useSafeAreaInsets();
    const column = layout.useColumnContent();
    const data = useHomeSections();
    const section = data.sections.find(item => item.key === route.params.sectionKey);
    const state = preview ? window.__SECTION_CONCEPT_STATE__ : 'ready';
    const loading = data.loading || state === 'loading';
    const failed = data.failed || state === 'error';
    const events = state === 'empty' ? [] : section?.events ?? [];
    const title = section?.title ?? 'Подборка';
    const retry = () => {
      if (preview && state === 'error') window.parent.postMessage({type:'gomeet-section-retry'}, location.origin);
      else data.refresh();
    };
    return <View style={[styles.screen, {paddingTop:insets.top}]}>
      <View style={[layout.columnContent, styles.toolbar]}>
        <CircleButton name="back" label="назад" onPress={back}/>
        <Text style={styles.toolbarLabel}>подборка</Text>
      </View>
      <FlatList
        data={loading || failed ? [] : events}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[column, styles.list, {paddingBottom:insets.bottom + 28}]}
        ListHeaderComponent={<View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          <View style={styles.summary}>
            <Text style={styles.tagline}>{section?.tagline ?? 'События в одной подборке'}</Text>
            {!failed && <View style={styles.count}><Text style={styles.countText}>{loading ? '…' : `${events.length} ${eventWord(events.length)}`}</Text></View>}
          </View>
        </View>}
        ListEmptyComponent={loading ? <View accessibilityLabel="Загружаем подборку" style={styles.skeletons}>
          {[0,1,2,3].map(key => <View key={key} style={styles.skeletonRow}>
            <View style={[styles.thumb, styles.ghost]}/>
            <View style={styles.skeletonBody}><View style={[styles.ghost, styles.ghostDate]}/><View style={[styles.ghost, styles.ghostTitle]}/><View style={[styles.ghost, styles.ghostPlace]}/><View style={[styles.ghost, styles.ghostPrice]}/></View>
          </View>)}
        </View> : <View style={styles.empty}>
          <View style={styles.emptyIcon}><Icon name={failed ? 'offline' : 'feed'} size={28} color={colors.textSecondary}/></View>
          <Text accessibilityRole={failed ? 'alert' : 'header'} style={styles.emptyTitle}>{failed ? 'Подборка не загрузилась' : 'Пока без событий'}</Text>
          <Text style={styles.emptyText}>{failed ? 'Проверьте соединение и попробуйте ещё раз.' : 'Загляните позже или выберите другую подборку на главной.'}</Text>
          <Button label={failed ? 'Повторить' : 'На главную'} variant="secondary" onPress={failed ? retry : back}/>
        </View>}
        renderItem={({item}) => <EventRow event={item} onOpen={() => navigation.navigate('EventDetail', {eventId:item.id})}/>}
      />
    </View>;
  }

  function EventRow({ event, onOpen }) {
    const live = useSaved(event.id);
    const [demoSaved, setDemoSaved] = React.useState(null);
    const saved = preview ? demoSaved ?? live.saved : live.saved;
    const toggle = () => {
      if (preview) {
        setDemoSaved(!saved);
        notice(saved ? 'Убрано из избранного только в макете.' : 'Добавлено в избранное только в макете.');
      } else live.toggle();
    };
    const [focused, setFocused] = React.useState(false);
    return <View style={styles.card}>
      <Pressable accessibilityRole="button" accessibilityLabel={event.title}
        onPress={onOpen} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={({pressed, hovered}) => [styles.cardMain, (pressed || hovered) && styles.cardActive, focused && styles.focus]}>
        <View style={styles.thumb}><EventMedia design="2026" palette={event.palette} imageUri={event.imageUri} image={eventImage(event)} height={128} width={96}/></View>
        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.when}>{[event.day, [event.num,event.month].filter(Boolean).join(' ')].filter(Boolean).join(', ')} · {event.time}</Text>
          <Text numberOfLines={3} style={styles.eventTitle}>{event.title}</Text>
          <Text numberOfLines={1} style={styles.place}>{event.place}</Text>
          <View style={styles.priceLine}><Text numberOfLines={1} style={styles.price}>{event.price}</Text></View>
        </View>
      </Pressable>
      <View style={styles.favorite}><CircleButton name="heart" selected={saved} label={`${saved ? 'убрать из избранного' : 'в избранное'}: ${event.title}`} onPress={toggle}/></View>
    </View>;
  }

  function CircleButton({name,label,onPress,selected=false}) {
    const [focused,setFocused] = React.useState(false);
    return <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{selected}} onPress={onPress}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={({pressed,hovered}) => [styles.circle, selected && styles.circleSelected, (pressed || hovered) && styles.circleActive, focused && styles.focus]}>
      <Icon name={name} size={20} color={selected ? colors.background : colors.text}/>
    </Pressable>;
  }

  const styles = {
    screen:{flex:1,backgroundColor:colors.background},
    toolbar:{paddingHorizontal:20,paddingTop:14,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:14},
    toolbarLabel:{...type.caption,fontSize:13,color:colors.textSecondary},
    list:{paddingHorizontal:20,paddingTop:18,flexGrow:1},
    heading:{gap:14,marginBottom:24},
    title:{...type.eventTitle,fontSize:32,lineHeight:38,color:colors.text},
    summary:{flexDirection:'row',alignItems:'center',gap:12,justifyContent:'space-between'},
    tagline:{...type.caption,fontSize:13,lineHeight:19,color:colors.textSecondary,flex:1,minWidth:0},
    count:{paddingHorizontal:10,paddingVertical:5,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,borderRadius:20},
    countText:{...type.caption,fontSize:11,lineHeight:16,color:colors.text},
    card:{position:'relative',marginBottom:12,borderRadius:20,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border},
    cardMain:{flexDirection:'row',padding:12,gap:14,minHeight:154,borderRadius:19},
    cardActive:{backgroundColor:colors.surfaceRaised},
    thumb:{width:96,height:128,borderRadius:12,overflow:'hidden',flexShrink:0},
    cardBody:{flex:1,minWidth:0,gap:5},
    when:{...type.caption,fontSize:11,lineHeight:16,color:colors.textSecondary},
    eventTitle:{...type.label,fontSize:16,lineHeight:22,color:colors.text},
    place:{...type.caption,fontSize:12,lineHeight:18,color:colors.textSecondary},
    priceLine:{marginTop:'auto',paddingRight:44,minHeight:27,justifyContent:'flex-end'},
    price:{...type.label,fontSize:14,lineHeight:20,color:colors.text},
    favorite:{position:'absolute',right:6,bottom:6},
    circle:{width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.fieldBorder,backgroundColor:colors.background},
    circleSelected:{backgroundColor:colors.text,borderColor:colors.text},
    circleActive:{opacity:.75},
    focus:{outlineWidth:2,outlineColor:colors.text,outlineOffset:3},
    empty:{flex:1,alignItems:'center',justifyContent:'center',gap:16,paddingTop:55,paddingBottom:80,paddingHorizontal:16},
    emptyIcon:{width:64,height:64,borderRadius:20,alignItems:'center',justifyContent:'center',backgroundColor:colors.surface,borderWidth:1,borderColor:colors.border,marginBottom:8},
    emptyTitle:{...type.sectionTitle,fontSize:22,lineHeight:28,textAlign:'center',color:colors.text},
    emptyText:{...type.body,fontSize:14,lineHeight:21,color:colors.textSecondary,textAlign:'center',marginBottom:8,maxWidth:280},
    skeletons:{gap:12},
    skeletonRow:{flexDirection:'row',padding:12,gap:14,borderWidth:1,borderColor:colors.border,borderRadius:20,backgroundColor:colors.surface},
    skeletonBody:{flex:1,gap:12,paddingTop:5},
    ghost:{backgroundColor:colors.surfaceRaised,borderRadius:5},
    ghostDate:{height:10,width:'75%'},ghostTitle:{height:36,width:'100%'},ghostPlace:{height:10,width:'60%'},ghostPrice:{height:14,width:'42%',marginTop:10}
  };
};
