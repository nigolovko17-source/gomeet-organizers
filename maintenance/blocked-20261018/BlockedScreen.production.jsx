module.exports=function(g,r,i,a,m,exports,d){
  'use strict';
  const unwrap=v=>v&&v.__esModule?v.default:v;
  const React=r(d[0]),View=unwrap(r(d[1])),Pressable=unwrap(r(d[8])),Text=unwrap(r(d[10])),Screen=unwrap(r(d[7]));
  const {useColumnContent}=r(d[14]),{DesignColors:colors}=r(d[9]),Icon=r(d[18]).Feather,ScrollView=unwrap(r(d[19]));
  const Avatar=unwrap(r(d[11])),api=r(d[13]),{useFocusEffect}=r(d[5]),{useGoBack}=r(d[16]),{useAuth}=r(d[20]);
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=BlockedScreen;
  function BlockedScreen(){
    const column=useColumnContent(),goBack=useGoBack(),{userId}=useAuth();
    const [rows,setRows]=React.useState([]),[status,setStatus]=React.useState('loading'),[busy,setBusy]=React.useState(null),[rowError,setRowError]=React.useState(null),[notice,setNotice]=React.useState('');
    const generation=React.useRef(0),focused=React.useRef(false),identity=React.useRef(userId),pending=React.useRef(null),loadedOwner=React.useRef(null);
    identity.current=userId;
    const valid=(token,owner)=>focused.current&&generation.current===token&&identity.current===owner;
    const load=React.useCallback(()=>{
      const token=++generation.current,owner=userId;
      pending.current=null;loadedOwner.current=null;setBusy(null);setRows([]);setRowError(null);setNotice('');setStatus(owner?'loading':'signedout');
      if(!owner)return;
      Promise.resolve().then(()=>api.listBlockedStrict()).then(result=>{
        if(!valid(token,owner))return;
        if(!Array.isArray(result))throw new Error('Invalid blocked list');
        loadedOwner.current=owner;setRows(result);setStatus('ready');
      }).catch(()=>{if(valid(token,owner))setStatus('error');});
    },[userId]);
    useFocusEffect(React.useCallback(()=>{
      focused.current=true;load();
      return ()=>{focused.current=false;generation.current++;pending.current=null;};
    },[load]));
    const unblock=async person=>{
      if(!userId||identity.current!==userId||loadedOwner.current!==userId||!focused.current||status!=='ready'||pending.current||!rows.some(row=>row.id===person.id))return;
      const token=generation.current,owner=userId;
      pending.current=person.id;setBusy(person.id);setRowError(null);setNotice('');
      try{
        if(await api.unblockUser(person.id)!==true)throw new Error('Unblock failed');
        if(valid(token,owner)){setRows(old=>old.filter(row=>row.id!==person.id));setNotice('Блокировка снята');}
      }catch{if(valid(token,owner))setRowError(person.id);}
      finally{if(valid(token,owner)){pending.current=null;setBusy(null);}}
    };
    const loading=status==='loading'||(!!userId&&loadedOwner.current!==userId&&status!=='error'),failed=status==='error';
    return <Screen edges={['top','bottom']}>
      <View style={[column,S.header]}><Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={goBack} style={({pressed})=>[S.back,pressed&&S.pressed]}><Icon name="arrow-left" size={21} color={colors.text}/></Pressable><Text variant="label" style={S.context}>Настройки</Text></View>
      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} contentContainerStyle={[column,S.body]}>
        <View style={S.heading}><Text variant="sectionTitle" accessibilityRole="header" style={S.title}>Заблокированные</Text></View>
        {status==='signedout'?<View style={S.state}><StateIcon name="user"/><Text variant="sectionTitle" style={S.stateTitle}>Нужен вход</Text><Text variant="caption" style={S.stateText}>Войдите, чтобы открыть список заблокированных.</Text></View>:loading?<View accessibilityRole="progressbar" accessibilityLabel="Загружаем список" style={S.group}>{[0,1,2].map((n)=><View key={n} style={[S.skeletonRow,n>0&&S.rule]}><View style={S.skeletonAvatar}/><View style={{flex:1,gap:8}}><View style={S.skeletonName}/><View style={S.skeletonNick}/></View><View style={S.skeletonAction}/></View>)}</View>:
        failed?<View style={S.state}><StateIcon name="wifi-off"/><Text variant="sectionTitle" style={S.stateTitle}>Не удалось загрузить</Text><Text variant="caption" style={S.stateText}>Проверьте соединение и попробуйте ещё раз.</Text><Pressable accessibilityRole="button" accessibilityLabel="Повторить загрузку списка" onPress={load} style={({pressed})=>[S.retry,pressed&&S.pressed]}><Text variant="label" style={S.retryLabel}>Повторить</Text><Icon name="rotate-cw" size={15} color={colors.text}/></Pressable></View>:
        rows.length===0?<View style={S.state}><StateIcon name="users"/><Text variant="sectionTitle" style={S.stateTitle}>Список пуст</Text><Text variant="caption" style={S.stateText}>Заблокировать пользователя можно{ '\n' }в его профиле или сообщении.</Text></View>:<>
          <View style={S.group}>{rows.map((person,index)=><View key={person.id} style={index>0&&S.rule}>
            <View style={S.row}><Avatar design="2026" name={person.name} avatarUrl={person.avatarUrl} size={40}/><View style={S.person}><Text variant="label" style={S.name} numberOfLines={1} accessibilityLabel={person.name}>{person.name}</Text><Text variant="caption" style={S.nick} numberOfLines={1}>@{person.username}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={'Разблокировать '+person.name} accessibilityState={{disabled:!!busy,busy:busy===person.id}} disabled={!!busy} onPress={()=>unblock(person)} style={({pressed})=>[S.unblock,pressed&&S.pressed,busy&&S.disabled]}><Text variant="label" style={S.unblockLabel}>{busy===person.id?'Снимаем…':'Разблокировать'}</Text></Pressable></View>
            {rowError===person.id&&<Text variant="caption" accessibilityRole="alert" style={S.rowError}>Не удалось снять блокировку. Попробуйте ещё раз.</Text>}
          </View>)}</View>
        </>}
        {!!notice&&<Text variant="caption" accessibilityLiveRegion="polite" style={S.notice}>{notice}</Text>}
      </ScrollView>
    </Screen>;
  }
  function StateIcon({name}){return <View style={S.stateIcon}><Icon name={name} size={28} color={colors.textSecondary}/></View>}
  const S={
    header:{alignSelf:'center',paddingHorizontal:20,paddingTop:10,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:12},back:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#393936',alignItems:'center',justifyContent:'center'},context:{fontSize:12,lineHeight:18,color:colors.textSecondary},
    body:{alignSelf:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:32,gap:22,flexGrow:1},heading:{alignItems:'flex-start'},title:{fontSize:22,lineHeight:30,letterSpacing:-.4},
    group:{borderWidth:1,borderColor:'#333330',borderRadius:22,backgroundColor:'#191918',overflow:'hidden'},row:{flexDirection:'row',flexWrap:'wrap',alignItems:'center',gap:10,minHeight:90,paddingHorizontal:12,paddingVertical:16},rule:{borderTopWidth:1,borderTopColor:'#30302d'},avatar:{width:40,height:40,borderRadius:20,backgroundColor:'#060606',borderWidth:1,borderColor:'#363633'},person:{flex:1,minWidth:110,gap:5},name:{fontSize:13,lineHeight:19},nick:{fontSize:11,lineHeight:16,color:colors.textSecondary},unblock:{width:112,minHeight:44,marginLeft:'auto',paddingHorizontal:8,alignItems:'center',justifyContent:'center',borderRadius:22,borderWidth:1,borderColor:'#4a4a44',backgroundColor:'#232321'},unblockLabel:{fontSize:11,lineHeight:16},disabled:{opacity:.55},pressed:{opacity:.65},
    state:{flex:1,minHeight:300,alignItems:'center',justifyContent:'center',gap:14,paddingVertical:40},stateIcon:{width:72,height:72,borderRadius:36,borderWidth:1,borderColor:'#343431',backgroundColor:'#191918',alignItems:'center',justifyContent:'center',marginBottom:4},stateTitle:{fontSize:18,lineHeight:25,textAlign:'center'},stateText:{fontSize:12,lineHeight:19,color:colors.textSecondary,textAlign:'center',maxWidth:270},retry:{minHeight:44,paddingHorizontal:20,borderRadius:22,borderWidth:1,borderColor:'#4a4a44',flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginTop:7},retryLabel:{fontSize:12,lineHeight:18},rowError:{color:'#e4b9a8',fontSize:11,lineHeight:17,paddingHorizontal:16,paddingBottom:16},notice:{fontSize:12,lineHeight:18,color:colors.textSecondary,textAlign:'center'},
    skeletonRow:{minHeight:90,padding:16,flexDirection:'row',alignItems:'center',gap:12},skeletonAvatar:{width:40,height:40,borderRadius:20,backgroundColor:'#2b2b28'},skeletonName:{height:10,width:'85%',borderRadius:5,backgroundColor:'#30302c'},skeletonNick:{height:8,width:'65%',borderRadius:4,backgroundColor:'#282825'},skeletonAction:{width:85,height:30,borderRadius:16,backgroundColor:'#282825'}
  };
};
