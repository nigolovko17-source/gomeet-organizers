module.exports = function (g, r, i, a, m, _e, d) {
  "use strict";

  function e(e) {
    return e && e.__esModule ? e : {
      default: e
    };
  }
  Object.defineProperty(_e, "__esModule", {
    value: !0
  }), Object.defineProperty(_e, "default", {
    enumerable: !0,
    get: function () {
      return W;
    }
  }), _e.ProfileTabs = _, _e.ProfileEvent = V;
  var t = r(d[0]),
    n = e(r(d[1])),
    s = e(r(d[2])),
    l = e(r(d[3])),
    o = e(r(d[4])),
    c = e(r(d[5])),
    u = e(r(d[6])),
    f = e(r(d[7])),
    b = r(d[8]),
    h = r(d[9]),
    x = r(d[10]),
    p = e(r(d[11])),
    y = e(r(d[12])),
    j = e(r(d[13])),
    v = e(r(d[14])),
    w = e(r(d[15])),
    C = r(d[16]),
    D = r(d[17]),
    P = r(d[18]),
    R = r(d[19]),
    E = r(d[20]),
    I = r(d[21]),
    S = r(d[22]),
    L = r(d[23]),
    z = r(d[24]),
    H = r(d[25]),
    k = r(d[26]),
    A = r(d[27]),
    F = r(d[28]),
    B = r(d[29]);
  const O = ["Ближайшие", "Избранное", "Прошедшие"],
    T = ["Ближайшие", "Прошедшие"];
  function W({
    profile: e,
    loading: s,
    counts: l,
    onSettings: u
  }) {
    const h = (0, t.useRef)(null),
      x = (0, b.useNavigation)(),
      {
        userId: w
      } = (0, P.useAuth)(),
      [E, F] = (0, t.useState)("Ближайшие"),
      {
        mode: W
      } = (0, R.useMode)(),
      $ = "org" === W && "Избранное" === E ? "Ближайшие" : E,
      G = "org" === W ? T : O,
      X = (0, k.useOrganizerProfileEvents)(w, "org" === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" === W && X.refetch();
    }, [W, X.refetch]));
    const q = "org" === W ? "organizer" : "guest",
      J = (0, k.useConductedEventCount)(w, "org" === W);
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" === W && J.refetch();
    }, [W, J.refetch]));
    const {
        stats: K,
        earned: Q,
        primaryBadge: Y,
        loading: Z
      } = (0, I.useAchievements)(q),
      ee = (0, S.useRewardBadges)(!0),
      te = (0, L.mergeProfileBadges)(Q, ee.isError ? [] : ee.data ?? [], q),
      ae = (0, A.useUpcomingProfileEvents)("org" !== W && "Ближайшие" === $),
      ie = (0, z.useSavedEvents)("org" !== W && "Избранное" === $),
      ne = (0, H.useAttendedEvents)("org" !== W && "Прошедшие" === $),
      re = ae.reload;
    (0, b.useFocusEffect)((0, t.useCallback)(() => {
      "org" !== W && "Ближайшие" === $ && re();
    }, [W, $, re]));
    const se = "org" === W ? {
        events: X.data?.["Прошедшие" === $ ? "past" : "upcoming"] ?? [],
        loading: X.isPending,
        failed: X.isError,
        reload: X.refetch
      } : "Ближайшие" === $ ? ae : "Избранное" === $ ? ie : ne,
      le = [Y, ...te.map(e => e.def).filter(e => e.id !== Y?.id)].filter(e => !!e).slice(0, 3),
      oe = e.pinnedBadges?.map(e => te.find(t => t.def.id === e)?.def).filter(e => !!e).slice(0, 3),
      de = 0 === e.pinnedBadges?.length ? [] : oe?.length ? oe : le,
      ce = te.slice(0, 6),
      ue = () => x.navigate("Trophies", {
        audience: q
      });
    return t.createElement(MeBody,{profile:e,loading:s,counts:l,mode:W,selected:$,tabs:G,onSelect:F,events:se,stats:K,conducted:J.data??0,navigation:x,featuredBadges:de});
  }
  function _({
    items: e,
    selected: n,
    onSelect: c
  }) {
    const [u, b] = (0, t.useState)(0),
      h = (0, t.useRef)(new s.default.Value(0)).current,
      x = (0, t.useRef)(0),
      y = (0, E.useReduceMotion)(),
      j = Math.max(0, (u - 6) / e.length);
    return (0, t.useEffect)(() => {
      const t = e.indexOf(n) * j;
      return h.stopAnimation(), x.current !== u || y ? h.setValue(t) : s.default.timing(h, {
        toValue: t,
        duration: (0, E.motionDuration)(240, y),
        easing: l.default.out(l.default.cubic),
        useNativeDriver: !0
      }).start(), x.current = u, () => h.stopAnimation();
    }, [n, j, u, y, h, e]), (0, B.jsxs)(f.default, {
      style: U.tabs,
      accessibilityRole: "tablist",
      accessibilityLabel: "События в профиле",
      onLayout: e => b(e.nativeEvent.layout.width),
      children: [u > 0 && (0, B.jsx)(s.default.View, {
        pointerEvents: "none",
        "aria-hidden": !0,
        testID: "profile-tab-indicator",
        style: [U.tabIndicator, {
          width: j,
          transform: [{
            translateX: h
          }]
        }]
      }), e.map(e => (0, B.jsx)(o.default, {
        onPress: () => c(e),
        accessibilityRole: "tab",
        accessibilityState: {
          selected: e === n
        },
        "aria-selected": e === n,
        accessibilityLabel: e,
        style: U.tab,
        children: (0, B.jsx)(p.default, {
          variant: "caption",
          style: {
            color: e === n ? D.DesignColors.onActionPrimary : D.DesignColors.text,
            textAlign: "center"
          },
          children: e
        })
      }, e))]
    });
  }
  function N({
    icon: e,
    label: t,
    onPress: n
  }) {
    return (0, B.jsx)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: t,
      style: U.round,
      children: (0, B.jsx)(h.Feather, {
        name: e,
        size: 20,
        color: D.DesignColors.text
      })
    });
  }
  function M({
    value: e,
    label: t,
    onPress: n
  }) {
    const s = (0, B.jsxs)(B.Fragment, {
      children: [(0, B.jsx)(p.default, {
        variant: "sectionTitle",
        children: e
      }), (0, B.jsx)(p.default, {
        variant: "caption",
        style: U.statLabel,
        children: t
      })]
    });
    return n ? (0, B.jsx)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: `${t}: ${e}`,
      style: U.stat,
      children: s
    }) : (0, B.jsx)(f.default, {
      accessibilityLabel: `${t}: ${e}`,
      style: U.stat,
      children: s
    });
  }
  function V({
    event: e,
    wide: t,
    onPress: n
  }) {
    return (0, B.jsxs)(o.default, {
      onPress: n,
      accessibilityRole: "button",
      accessibilityLabel: e.title,
      style: [U.event, t && U.wide],
      children: [(0, B.jsx)(f.default, {
        style: u.default.absoluteFill,
        children: (0, B.jsx)(w.default, {
          design: "2026",
          palette: e.palette,
          imageUri: e.imageUri,
          image: (0, F.eventImage)(e),
          height: 188
        })
      }), (0, B.jsx)(x.LinearGradient, {
        colors: ["rgba(10,10,10,0.3)", "rgba(10,10,10,0.15)", "rgba(10,10,10,0.96)"],
        style: u.default.absoluteFill
      }), (0, B.jsxs)(f.default, {
        style: U.date,
        children: [(0, B.jsx)(p.default, {
          variant: "sectionTitle",
          children: e.num
        }), (0, B.jsx)(p.default, {
          variant: "caption",
          children: e.month?.slice(0, 3).toUpperCase()
        })]
      }), (0, B.jsxs)(f.default, {
        style: U.eventBody,
        children: [(0, B.jsx)(p.default, {
          variant: "label",
          numberOfLines: 3,
          children: e.title
        }), (0, B.jsxs)(f.default, {
          style: U.place,
          children: [(0, B.jsx)(C.Icon, {
            name: "pin",
            size: 16,
            color: D.DesignColors.text
          }), (0, B.jsx)(p.default, {
            variant: "caption",
            numberOfLines: 1,
            style: {
              flex: 1
            },
            children: e.place
          })]
        })]
      })]
    });
  }
const React=t,View=f.default,Text=p.default,Pressable=o.default,Hero=j.default,Feather=h.Feather,ProfileTabs=_,ProfileEvent=V;
const notify=message=>window.parent.postMessage({type:'gomeet-me-notice',message},location.origin);
function MeBody({profile,loading,counts,mode,selected,tabs,onSelect,events,stats,conducted,navigation,featuredBadges}){
  const [pane,setPane]=React.useState('profile'),[filter,setFilter]=React.useState('Все');
  const [focused,setFocused]=React.useState(null);
  const go=()=>notify('Вход сохранён в структуре. Из локального концепта данные профиля не меняются.');
  const heading=pane==='pin'?'На профиле':'Достижения';
  if(pane!=='profile')return <View style={{gap:24,paddingTop:8}}>
    <View style={ME.heading}><Action icon="arrow-left" label="Назад к профилю" onPress={()=>setPane('profile')}/><Text variant="sectionTitle" style={ME.pageTitle}>{heading}</Text>{pane==='collection'?<Pressable style={ME.smallButton} accessibilityRole="button" onPress={()=>setPane('pin')}><Text variant="label" style={ME.smallText}>На профиле</Text></Pressable>:<View style={{width:44}}/>}</View>
    {pane==='collection'?<>
      <View style={ME.filters} accessibilityRole="tablist" accessibilityLabel="Фильтр достижений">{['Все','Полученные','В процессе'].map(label=><Pressable key={label} accessibilityRole="tab" accessibilityState={{selected:filter===label}} aria-selected={filter===label} onPress={()=>{setFilter(label);setFocused(null)}} style={[ME.filter,filter===label&&ME.selectedFilter]}><Text variant="caption" style={[ME.filterText,filter===label&&{color:'#171717'}]}>{label}</Text></Pressable>)}</View>
      <View style={ME.placeholderGrid}>{Array.from({length:filter==='Все'?6:3},(_,index)=><Pressable key={filter+index} accessibilityRole="button" accessibilityLabel={'Место награды '+(index+1)} onPress={()=>setFocused(index)} style={[ME.placeholderTile,focused===index&&ME.focusedTile]}><View style={ME.placeholderCircle}/><View style={ME.placeholderLine}/><View style={[ME.placeholderLine,{width:'40%',opacity:.4}]}/></Pressable>)}</View>
      {focused!==null&&<View style={ME.structureNote}><Text variant="caption" style={ME.muted}>Здесь откроется выбранная награда. Её оформление и содержание будут подготовлены в отдельном чате.</Text></View>}
      <MenuRow icon="tag" title="Мои промокоды" onPress={()=>notify('Сохранён существующий вход в кошелёк промокодов. Его содержимое здесь не меняем.')}/>
    </>:<>
      <Text variant="caption" style={ME.muted}>Выберите награды, которые будут видны в профиле.</Text>
      <View style={ME.pinSlots}>{[1,2,3].map(n=><Pressable key={n} accessibilityRole="button" accessibilityLabel={'Место в профиле '+n} onPress={()=>notify('Здесь будет выбор полученной награды для места '+n+'. В макете ничего не сохраняется.')} style={ME.pinSlot}><Feather name="plus" size={22} color="#b7b5ae"/></Pressable>)}</View>
      <Pressable style={ME.primary} accessibilityRole="button" onPress={()=>setPane('collection')}><Text variant="label" style={ME.primaryText}>Готово</Text></Pressable>
    </>}
  </View>;
  return <>
    <Hero compact profile={profile} loading={loading} featured={featuredBadges} onBadge={()=>setPane('collection')} onEdit={go} toolbar={<><View style={{flex:1}}/><Action icon="settings" label="настройки профиля" onPress={go}/></>}/>
    <View style={ME.stats}><Stat value={mode==='org'?conducted:stats.attended} title={mode==='org'?'Провёл':'Посетил'} onPress={()=>onSelect('Прошедшие')}/><View style={ME.statDivider}/><Stat value={counts.followers} title="Подписчики"/>{mode!=='org'&&<><View style={ME.statDivider}/><Stat value={counts.following} title="Подписки"/></>}</View>
    <View style={ME.achievementCard}>
      <Pressable accessibilityRole="button" accessibilityLabel="Открыть достижения" style={ME.achievementTop} onPress={()=>setPane('collection')}><View style={ME.achievementIcon}><Feather name="award" size={23} color="#efede5"/></View><View style={{flex:1,gap:3}}><Text variant="sectionTitle" style={ME.cardTitle}>Достижения</Text><Text variant="caption" style={ME.mutedSmall}>Ваша коллекция наград</Text></View><Feather name="arrow-up-right" size={21} color="#efede5"/></Pressable>
      <View style={ME.achievementFooter}><Pressable accessibilityRole="button" onPress={()=>setPane('pin')} style={ME.footerButton}><Feather name="grid" size={15} color="#b7b5ae"/><Text variant="label" style={ME.footerText}>На профиле</Text></Pressable><View style={ME.footerDivider}/><Pressable accessibilityRole="button" style={ME.footerButton} onPress={()=>notify('Сохранён существующий вход в кошелёк промокодов. Его содержимое здесь не меняем.')}><Feather name="tag" size={15} color="#b7b5ae"/><Text variant="label" style={ME.footerText}>Промокоды</Text></Pressable></View>
    </View>
    <View style={ME.eventsHeading}><Text variant="sectionTitle" style={ME.sectionTitle}>Мои события</Text></View>
    <ProfileTabs items={tabs} selected={selected} onSelect={onSelect}/>
    {selected==='Прошедшие'&&mode!=='org'&&<Text variant="caption" style={ME.mutedSmall}>Посещения, подтверждённые билетом на входе</Text>}
    {events.loading?<View style={ME.empty}><Text variant="caption" style={ME.muted}>Загружаем события…</Text></View>:events.failed?<View style={ME.empty}><Text>Не удалось загрузить события</Text><Pressable style={ME.edit} accessibilityRole="button" onPress={events.reload}><Text>Повторить</Text></Pressable></View>:events.events.length?<View style={U.grid}>{events.events.map((event,index)=><ProfileEvent key={event.id} event={event} wide={index%3===2} onPress={()=>navigation.navigate(mode==='org'&&selected==='Ближайшие'?'OrgEventDetail':'EventDetail',{eventId:event.id})}/>)}</View>:<View style={ME.empty}><Feather name={selected==='Избранное'?'heart':'calendar'} size={25} color="#b7b5ae"/><Text variant="label" style={ME.emptyTitle}>{selected==='Избранное'?'Сохраните то, что интересно':selected==='Прошедшие'?'Здесь появятся ваши посещения':'Ближайших событий пока нет'}</Text><Text variant="caption" style={ME.muted}>{selected==='Избранное'?'Нажмите сердце на событии — оно появится здесь.':selected==='Прошедшие'?'Посещение засчитается после сканирования билета.':'События с действующими билетами появятся здесь.'}</Text></View>}
  </>;
}
function Action({icon,label,onPress}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={ME.action}><Feather name={icon} size={20} color="#efede5"/></Pressable>}
function Stat({value,title,onPress}){const content=<><Text variant="sectionTitle">{value}</Text><Text variant="caption" style={U.statLabel}>{title}</Text></>;return onPress?<Pressable accessibilityRole="button" accessibilityLabel={title+': '+value} onPress={onPress} style={ME.stat}>{content}</Pressable>:<View style={ME.stat}>{content}</View>}
function MenuRow({icon,title,onPress}){return <Pressable accessibilityRole="button" onPress={onPress} style={ME.menuRow}><Feather name={icon} size={19} color="#b7b5ae"/><Text variant="label" style={{flex:1,fontSize:15}}>{title}</Text><Feather name="chevron-right" size={19} color="#b7b5ae"/></Pressable>}
const ME={
 action:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#363633',alignItems:'center',justifyContent:'center',backgroundColor:'#101010'},
 edit:{flexDirection:'row',gap:9,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#41413e',borderRadius:24,minHeight:44,paddingHorizontal:24},
 stats:{flexDirection:'row',alignItems:'center',paddingVertical:6,marginBottom:2},stat:{flex:1,alignItems:'center',justifyContent:'center',minHeight:56,gap:4},statDivider:{height:26,width:1,backgroundColor:'#30302e'},
 achievementCard:{borderWidth:1,borderColor:'#393937',borderRadius:22,backgroundColor:'#191918',overflow:'hidden'},achievementTop:{flexDirection:'row',alignItems:'center',gap:13,padding:18,minHeight:86},achievementIcon:{width:45,height:45,borderRadius:16,backgroundColor:'#272726',alignItems:'center',justifyContent:'center'},cardTitle:{fontSize:18,lineHeight:23},mutedSmall:{fontSize:10,lineHeight:15,color:'#b7b5ae'},achievementFooter:{flexDirection:'row',borderTopWidth:1,borderColor:'#343431',alignItems:'center',paddingHorizontal:8},footerButton:{flex:1,minHeight:48,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8},footerText:{fontSize:11,color:'#d0cec6'},footerDivider:{width:1,height:20,backgroundColor:'#343431'},
 eventsHeading:{marginTop:14,marginBottom:-4},sectionTitle:{fontSize:22,lineHeight:28},empty:{padding:24,gap:14,alignItems:'center',backgroundColor:'#191918',borderRadius:20},emptyTitle:{fontSize:15,textAlign:'center'},muted:{fontSize:12,lineHeight:18,color:'#b7b5ae',textAlign:'center'},
 heading:{flexDirection:'row',alignItems:'center',gap:8},pageTitle:{fontSize:20,lineHeight:28,flex:1},smallButton:{minHeight:44,justifyContent:'center',paddingHorizontal:10,borderWidth:1,borderColor:'#41413e',borderRadius:22},smallText:{fontSize:11},
 filters:{flexDirection:'row',gap:5},filter:{flex:1,minHeight:44,alignItems:'center',justifyContent:'center',borderRadius:22,backgroundColor:'#20201e'},selectedFilter:{backgroundColor:'#efede5'},filterText:{fontSize:11},placeholderGrid:{flexDirection:'row',flexWrap:'wrap',gap:12},placeholderTile:{width:'46%',flexGrow:1,minHeight:158,borderWidth:1,borderColor:'#30302e',borderRadius:20,alignItems:'center',justifyContent:'center',gap:12,backgroundColor:'#171716'},focusedTile:{borderColor:'#efede5'},placeholderCircle:{width:60,height:60,borderRadius:30,backgroundColor:'#30302e'},placeholderLine:{width:'60%',height:6,borderRadius:3,backgroundColor:'#44443f'},structureNote:{padding:16,borderRadius:16,backgroundColor:'#20201e'},menuRow:{minHeight:60,flexDirection:'row',alignItems:'center',gap:12,borderTopWidth:1,borderColor:'#30302e'},pinSlots:{flexDirection:'row',gap:12,justifyContent:'center',marginVertical:12},pinSlot:{width:76,height:76,borderRadius:38,borderStyle:'dashed',borderWidth:1,borderColor:'#68685f',alignItems:'center',justifyContent:'center'},primary:{minHeight:48,borderRadius:24,backgroundColor:'#efede5',alignItems:'center',justifyContent:'center'},primaryText:{fontSize:14,color:'#171717'}
};

  const U = u.default.create({
    hero: {
      position: "relative",
      marginHorizontal: -8,
      paddingBottom: 8
    },
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8
    },
    round: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: D.DesignColors.photoProtection
    },
    identity: {
      alignItems: "center",
      gap: 4
    },
    portraitRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      paddingHorizontal: 8,
      gap: 8
    },
    avatar: {
      borderRadius: 60,
      borderWidth: 1,
      borderColor: D.DesignColors.text
    },
    add: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: D.DesignColors.text,
      alignItems: "center",
      justifyContent: "center"
    },
    name: {
      textAlign: "center",
      textTransform: "uppercase",
      marginTop: 8
    },
    username: {
      minHeight: 36,
      justifyContent: "center"
    },
    featured: {
      flexDirection: "row",
      gap: 24,
      marginTop: 16
    },
    stats: {
      flexDirection: "row",
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      paddingVertical: 16
    },
    stat: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      paddingHorizontal: 4
    },
    statLabel: {
      textAlign: "center",
      fontSize: 10,
      lineHeight: 14
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.pill,
      padding: 3
    },
    tabIndicator: {
      position: "absolute",
      left: 3,
      top: 3,
      bottom: 3,
      borderRadius: D.DesignShape.pill,
      backgroundColor: D.DesignColors.actionPrimary
    },
    tab: {
      flex: 1,
      minHeight: 48,
      borderRadius: D.DesignShape.pill,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 3
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12
    },
    event: {
      width: "47%",
      flexGrow: 1,
      minHeight: 188,
      borderRadius: 20,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: D.DesignColors.border,
      justifyContent: "space-between"
    },
    wide: {
      width: "100%"
    },
    date: {
      padding: 12
    },
    eventBody: {
      padding: 12,
      gap: 6
    },
    place: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4
    },
    empty: {
      padding: 20,
      gap: 12,
      backgroundColor: D.DesignColors.surface,
      borderRadius: D.DesignShape.card,
      alignItems: "center"
    },
    note: {
      textAlign: "center",
      color: D.DesignColors.textSecondary
    },
    awards: {
      padding: 16,
      borderRadius: D.DesignShape.card,
      backgroundColor: D.DesignColors.surface,
      gap: 12
    },
    awardsHead: {
      flexDirection: "row",
      alignItems: "center"
    },
    all: {
      minHeight: 48,
      justifyContent: "center"
    },
    award: {
      width: 76,
      alignItems: "center",
      gap: 8
    },
    awardName: {
      fontSize: 10,
      lineHeight: 14,
      textAlign: "center"
    }
  });
}
