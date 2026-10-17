module.exports=function(g,r,i,a,m,exports,d){
  'use strict';
  const unwrap=v=>v&&v.__esModule?v.default:v;
  const React=r(d[0]),View=unwrap(r(d[1])),ScrollView=unwrap(r(d[2])),Input=unwrap(r(d[3])),Pressable=unwrap(r(d[4]));
  const ActivityIndicator=unwrap(r(d[6])),{useNavigation,useRoute,useFocusEffect}=r(d[7]);
  const Screen=unwrap(r(d[8])),Text=unwrap(r(d[9])),Button=unwrap(r(d[10])),PersonCard=unwrap(r(d[11]));
  const people=r(d[12]),{DesignColors:colors,DesignTypography:type}=r(d[14]),Avatar=unwrap(r(d[15]));
  const AuthGate=unwrap(r(d[17])),{Icon}=r(d[18]),chats=r(d[19]),{useAuth}=r(d[20]),{columnContent,useLayout}=r(d[21]);
  const {useFeed}=r(d[24]),Media=unwrap(r(d[25])),{eventImage}=r(d[26]);
  const preview=typeof window!=='undefined'&&!!window.__MESSAGES_CONCEPT__;
  const notice=message=>preview&&window.parent.postMessage({type:'gomeet-messages-notice',message},location.origin);
  const examples=[
    {id:'example-dm-1',type:'dm',name:'Аня Морозова',initials:'АМ',preview:'Супер, тогда увидимся у входа!',time:'18:42',ts:4},
    {id:'example-event-1',type:'event',name:'Вечер винила',preview:'Даша: Кто уже на месте?',time:'18:30',ts:3},
    {id:'example-dm-2',type:'dm',name:'Марк Волков',initials:'МВ',preview:'Ты тоже идёшь в субботу?',time:'вчера',ts:2},
    {id:'example-event-2',type:'event',name:'Новые знакомства',preview:'Пока никто не писал',time:'',ts:1}
  ];
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=MessagesScreen;

  function MessagesScreen(){
    const navigation=useNavigation(),route=useRoute(),{userId}=useAuth(),dm=chats.useDmChats(),events=chats.useEventChats(),feed=useFeed();
    const {tight}=useLayout(),padding=tight?16:20;
    const [query,setQuery]=React.useState(''),[focused,setFocused]=React.useState(false);
    const [results,setResults]=React.useState({query:'',people:[]}),[searchError,setSearchError]=React.useState(false);
    const trimmed=query.trim(),canSearch=trimmed.replace(/^@+/,'').length>=2;
    const scenario=preview?window.__MESSAGES_CONCEPT_STATE__:'ready';
    const searching=canSearch&&results.query!==trimmed;
    const found=canSearch&&results.query===trimmed?results.people:[];
    useFocusEffect(React.useCallback(()=>{
      if(!userId||!canSearch)return;
      let active=true;setSearchError(false);
      const timer=setTimeout(async()=>{try{const result=await people.searchPeople(trimmed,userId);if(active)setResults({query:trimmed,people:result});}
        catch{if(active){setSearchError(true);setResults({query:trimmed,people:[]});}}},300);
      return()=>{active=false;clearTimeout(timer);};
    },[trimmed,canSearch,userId]));
    chats.useChatListLive(React.useCallback(()=>{events.reload();dm.reload();},[events.reload,dm.reload]));
    const open=React.useCallback(chat=>{
      if(preview){notice('Карточка ведёт в переписку. Её экран проработаем отдельно; сообщения из концепта не отправляются.');return;}
      navigation.navigate('Chat',{chatId:chat.id,type:chat.type,name:chat.name,sub:chat.sub,initials:chat.initials});
    },[navigation]);
    const dmWith=route.params?.dmWith,dmName=route.params?.dmName;
    React.useEffect(()=>{if(dmWith){navigation.setParams({dmWith:undefined,dmName:undefined});open({id:dmWith,type:'dm',name:dmName||'Личный чат',initials:(dmName||'·').trim().slice(0,2).toUpperCase(),preview:'',time:''});}},[dmWith,dmName,navigation,open]);
    const toggle=async person=>{
      if(preview){notice('Подписка в этом концепте не меняется.');return;}
      if(!userId)return;const next=!person.isFollowing;
      const update=value=>setResults(state=>({...state,people:state.people.map(p=>p.id===person.id?{...p,isFollowing:value}:p)}));
      update(next);if(!(next?await people.follow(userId,person.id):await people.unfollow(userId,person.id)))update(!next);
    };
    if(!userId)return <Screen><AuthGate glyph="msg" title="Чаты открываются со своими" text="Отметьтесь «иду» — и попадёте в чат события. Личные переписки заводятся из «кто идёт»." reason="chat" onDone={()=>{events.reload();dm.reload();}}/></Screen>;
    const all=(scenario==='examples'?examples:['empty','error','loading'].includes(scenario)?[]:[...events.chats,...dm.chats]).slice().sort(chats.byFreshest);
    const normalized=trimmed.toLowerCase();
    const visible=normalized?all.filter(chat=>chat.name.toLowerCase().includes(normalized)||chat.sub?.toLowerCase().includes(normalized)||chat.preview.toLowerCase().includes(normalized)):all;
    const loading=scenario==='loading'||(scenario==='ready'&&(events.loading||dm.loading)&&!all.length);
    const eventById=new Map(feed.events.map(event=>[event.id,event]));
    const retry=()=>{if(preview&&scenario==='error')window.parent.postMessage({type:'gomeet-messages-retry'},location.origin);else{events.reload();dm.reload();}};
    return <Screen>
      <View style={[columnContent,{paddingHorizontal:padding,paddingTop:18,paddingBottom:20}]}>
        <Text accessibilityRole="header" style={styles.title}>Сообщения</Text>
        <View style={[styles.search,focused&&styles.inputFocus]}>
          <Icon name="search" size={18} color={colors.textSecondary}/>
          <Input value={query} onChangeText={setQuery} placeholder="Найти чат или человека" placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Поиск чатов и людей" returnKeyType="search" autoFocus={false} style={styles.input} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
          {!!query&&<Pressable accessibilityRole="button" accessibilityLabel="Очистить поиск" onPress={()=>setQuery('')} style={styles.clear}><Icon name="x" size={18} color={colors.text}/></Pressable>}
        </View>
      </View>
      {loading?<View style={[columnContent,{paddingHorizontal:padding,gap:10}]} accessibilityLabel="Загрузка сообщений">{[0,1,2,3,4].map(n=><View key={n} style={styles.skeletonRow}><View style={styles.skeletonFace}/><View style={{flex:1,gap:10}}><View style={styles.skeletonLine}/><View style={[styles.skeletonLine,{width:'45%',opacity:.6}]}/></View></View>)}</View>
      :scenario==='error'?<State icon="offline" title="Чаты не загрузились" text="Проверьте соединение и попробуйте ещё раз." action="Повторить" onPress={retry}/>
      :<ScrollView style={{flex:1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[columnContent,{paddingHorizontal:padding,paddingBottom:28,flexGrow:1}]}>
        {normalized&&<Text style={styles.sectionLabel}>ЧАТЫ</Text>}
        {visible.map((chat,index)=><ChatRow divider={index<visible.length-1} key={chat.type+chat.id} chat={chat} event={eventById.get(chat.id)} onPress={()=>open(chat)}/>)}
        {!visible.length&&(normalized?<Text style={styles.hint}>Чаты не найдены</Text>:<State icon="msg" title="Пока без сообщений"
          text="Отметьтесь «иду» — и чат события появится здесь."
          action="Найти события" onPress={()=>navigation.navigate('Tabs',{screen:'Explore'})}/>)}
        {!!normalized&&<View style={{paddingTop:26}}><Text style={styles.sectionLabel}>ЛЮДИ</Text>
          {!canSearch?<Text style={styles.hint}>Введите хотя бы 2 символа имени или никнейма</Text>:searching?<ActivityIndicator accessibilityLabel="Поиск людей" color={colors.text}/>:searchError?<Text accessibilityRole="alert" style={styles.hint}>Не удалось загрузить людей. Попробуйте ещё раз.</Text>:found.length?found.map(person=><PersonCard key={person.id} person={person} style={{backgroundColor:colors.background,marginBottom:8}}
            onOpenProfile={()=>navigation.navigate('UserProfile',{userId:person.id})} onToggle={()=>toggle(person)} onMessage={()=>open({id:person.id,type:'dm',name:person.name,initials:person.initials,preview:'',time:''})}/>):<Text style={styles.hint}>Люди не найдены</Text>}
        </View>}
      </ScrollView>}
    </Screen>;
  }
  function ChatRow({chat,event,onPress,divider}){
    const [focus,setFocus]=React.useState(false),isEvent=chat.type==='event';
    return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={chat.name} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
      style={({pressed})=>[styles.row,pressed&&styles.pressed,focus&&styles.rowFocus]}>
      <View style={styles.avatarWrap}>
        {isEvent?<View style={styles.poster}>{event?<Media design="2026" palette={event.palette} imageUri={event.imageUri} image={eventImage(event)} width={58} height={58}/>:<View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Icon name="ticket" size={24} color={colors.textSecondary}/></View>}</View>
          :<Avatar design="2026" name={chat.name} initials={chat.initials} avatarUrl={chat.avatarUrl} size={58}/>}
        {isEvent&&<View style={styles.eventBadge}><Icon name="users" size={10} color={colors.textSecondary}/></View>}
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}><Text numberOfLines={1} style={styles.rowName}>{chat.name}</Text>{!!chat.time&&<Text style={styles.rowTime}>{chat.time}</Text>}</View>
        <Text numberOfLines={1} style={styles.preview}>{chat.preview||chat.sub||' '}</Text>
      </View>
      {divider&&<View pointerEvents="none" style={styles.rowDivider}/>}
    </Pressable>;
  }
  function State({icon,title,text,action,onPress}){return <View style={styles.state}><View style={styles.stateIcon}><Icon name={icon} size={27} color={colors.textSecondary}/></View><Text accessibilityRole={icon==='offline'?'alert':'header'} style={styles.stateTitle}>{title}</Text><Text style={styles.stateText}>{text}</Text>{!!action&&<Button label={action} variant="secondary" onPress={onPress}/>}</View>;}
  const styles={
    title:{...type.sectionTitle,fontSize:28,lineHeight:36,color:colors.text,marginBottom:22},
    search:{minHeight:52,borderRadius:18,paddingLeft:16,paddingRight:4,flexDirection:'row',gap:10,alignItems:'center',backgroundColor:'#171717',borderWidth:1,borderColor:'#292929'},
    input:{...type.body,color:colors.text,flex:1,minWidth:0,paddingVertical:13,paddingHorizontal:0,outlineWidth:0,outlineStyle:'none',outlineColor:'transparent'},inputFocus:{borderColor:'#8d8b84'},
    clear:{width:44,height:44,alignItems:'center',justifyContent:'center',borderRadius:18},
    row:{flexDirection:'row',alignItems:'center',gap:13,minHeight:90,paddingVertical:14},avatarWrap:{width:58,height:58,flexShrink:0},
    poster:{width:58,height:58,borderRadius:17,overflow:'hidden',backgroundColor:'#222'},
    eventBadge:{position:'absolute',right:-2,bottom:-2,width:22,height:22,borderRadius:11,borderWidth:3,borderColor:colors.background,backgroundColor:'#242424',alignItems:'center',justifyContent:'center'},
    rowDivider:{position:'absolute',bottom:0,left:71,right:0,height:1,backgroundColor:'#272727'},
    rowBody:{flex:1,minWidth:0,gap:7},rowTop:{flexDirection:'row',alignItems:'baseline',gap:8},rowName:{...type.label,fontSize:15,lineHeight:20,color:colors.text,flex:1,minWidth:0},
    rowTime:{...type.caption,fontSize:11,color:colors.textSecondary,flexShrink:0},preview:{...type.body,fontSize:13,lineHeight:19,color:colors.textSecondary},
    pressed:{opacity:.65},rowFocus:{outlineWidth:2,outlineColor:colors.text,outlineOffset:2,borderRadius:12},
    sectionLabel:{...type.caption,fontSize:10,letterSpacing:1.4,color:colors.textSecondary,paddingVertical:8},hint:{...type.body,fontSize:14,color:colors.textSecondary,paddingVertical:14},
    state:{flex:1,alignItems:'center',justifyContent:'center',paddingVertical:48,paddingHorizontal:22,gap:14},stateIcon:{width:64,height:64,backgroundColor:'#171717',borderRadius:22,alignItems:'center',justifyContent:'center',marginBottom:6},
    stateTitle:{...type.sectionTitle,color:colors.text,textAlign:'center',fontSize:21},stateText:{...type.body,fontSize:14,lineHeight:21,color:colors.textSecondary,textAlign:'center',maxWidth:280,marginBottom:8},
    skeletonRow:{flexDirection:'row',alignItems:'center',gap:14,height:80},skeletonFace:{width:58,height:58,borderRadius:17,backgroundColor:'#202020'},skeletonLine:{height:13,width:'76%',borderRadius:5,backgroundColor:'#202020'}
  };
};
