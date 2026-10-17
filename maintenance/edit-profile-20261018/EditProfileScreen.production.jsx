module.exports=function(g,r,i,a,m,exports,d){
  'use strict';
  const unwrap=v=>v&&v.__esModule?v.default:v;
  const React=r(d[0]),Activity=unwrap(r(d[1])),Pressable=unwrap(r(d[5])),ScrollView=unwrap(r(d[6])),View=unwrap(r(d[8]));
  const Text=unwrap(r(d[9])),Button=unwrap(r(d[10])),{useSafeAreaInsets}=r(d[12]),{DesignColors:colors,DesignTypography:type}=r(d[13]);
  const Avatar=unwrap(r(d[14])),Icon=r(d[32]).Feather,{useAuth}=r(d[18]),{useColumnContent}=r(d[19]),data=r(d[20]);
  const badges=r(d[23]),rewards=r(d[24]),{useMode}=r(d[25]),legacy=r(d[26]),{useInterests}=r(d[27]),Input=unwrap(r(d[31]));
  const {useToast}=r(d[16]),avatarActions=r(d[17]),CheckRow=unwrap(r(d[22])),{useGoBack}=r(d[29]),Sheet=unwrap(r(d[33])),{useNavigation}=r(d[34]);
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=EditProfile;
  function EditProfile(){
    const column=useColumnContent(),insets=useSafeAreaInsets(),{userId}=useAuth(),{mode}=useMode(),originalBack=useGoBack(),navigation=useNavigation(),{showToast}=useToast();
    const goBack=()=>navigation.canGoBack()?originalBack():navigation.navigate('Tabs',{screen:'Profile'});
    const {profile,loading,failed,ready:readReady,reload}=data.useEditableProfile(userId,mode),interests=useInterests();
    const {earned}=legacy.useAchievements(mode==='org'?'organizer':'guest'),reward=rewards.useRewardBadges(true);
    const list=badges.mergeProfileBadges(earned,reward.isError?[]:reward.data??[],mode==='org'?'organizer':'guest');
    const [name,setName]=React.useState(''),[username,setUsername]=React.useState(''),[bio,setBio]=React.useState('');
    const [touched,setTouched]=React.useState({}),[submitted,setSubmitted]=React.useState(false);
    const [photo,setPhoto]=React.useState(null),[picking,setPicking]=React.useState(false),[saving,setSaving]=React.useState(false);
    const [pinned,setPinned]=React.useState(null),[pinnedOpen,setPinnedOpen]=React.useState(false);
    const [saveError,setSaveError]=React.useState(null),[fieldErrors,setFieldErrors]=React.useState({}),[hydrated,setHydrated]=React.useState(null);
    const identity=JSON.stringify([userId,mode]),mounted=React.useRef(true),saveLock=React.useRef(null),pickLock=React.useRef(null),context=React.useRef(null);
    context.current={identity,ready:readReady&&hydrated===identity};
    React.useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
    React.useEffect(()=>{setHydrated(null);setPhoto(null);setPinnedOpen(false);setSaveError(null);setFieldErrors({});setSubmitted(false);setTouched({});setSaving(false);setPicking(false);saveLock.current=null;pickLock.current=null;},[identity]);
    React.useEffect(()=>{if(readReady){setName(profile.name);setUsername(profile.username);setBio(profile.bio??'');setPinned(profile.pinnedBadges==null?null:profile.pinnedBadges.filter(id=>badges.profileBadgeDefinition(id)?.audience===(mode==='org'?'organizer':'guest')));setHydrated(identity);}},[readReady,profile,identity,mode]);
    const validContext=key=>mounted.current&&context.current?.identity===key&&context.current?.ready;
    const nameError=name.trim().length<2?'Имя — хотя бы два знака':fieldErrors.name??null;
    const usernameError=data.USERNAME_RULE.test(data.normalizeUsername(username))?fieldErrors.username??null:'Латиница, цифры и подчёркивание, от 2 до 30 знаков';
    const busy=!!userId&&(loading||(!failed&&hydrated!==identity)||(mode!=='org'&&interests.loading));
    const badInterests=mode!=='org'&&interests.failed;
    const blocked=busy||failed||!userId||!readReady||hydrated!==identity||badInterests||saving||picking;
    const change=(setter,field)=>value=>{setter(value);setSaveError(null);if(field)setFieldErrors(current=>({...current,[field]:null}));};
    const back=()=>{if(!saveLock.current)goBack();};
    const choosePhoto=async()=>{
      if(blocked||pickLock.current)return;
      const key=identity,token={};pickLock.current=token;setPicking(true);setSaveError(null);
      try{const picked=await avatarActions.pickAvatar();if(validContext(key)&&pickLock.current===token&&picked)setPhoto(picked);}
      catch{if(validContext(key))setSaveError('Не удалось выбрать фото. Попробуйте ещё раз.');}
      finally{if(pickLock.current===token){pickLock.current=null;if(mounted.current)setPicking(false);}}
    };
    const submit=async()=>{
      if(saveLock.current||blocked)return;
      setSubmitted(true);setSaveError(null);if(nameError||usernameError)return;
      const key=identity,token={};saveLock.current=token;setSaving(true);
      const payload={userId,mode,name,username,avatarUrl:profile.avatarUrl,bio,pinnedBadges:pinned,interests:mode==='org'?[]:interests.interests};
      try{
        if(photo){const uploaded=await avatarActions.uploadAvatar(photo,userId);if(!validContext(key)||saveLock.current!==token)return;if(!uploaded){setSaveError('Фото не загрузилось. Проверьте связь и попробуйте ещё раз.');return;}payload.avatarUrl=uploaded;}
        if(!validContext(key)||saveLock.current!==token)return;
        const result=await data.saveMyProfile(payload);
        if(!validContext(key)||saveLock.current!==token)return;
        if(result.ok){showToast('Профиль сохранён');goBack();}
        else if(result.field)setFieldErrors(current=>({...current,[result.field]:result.error}));
        else setSaveError(result.error);
      }catch{if(validContext(key))setSaveError('Не получилось сохранить. Проверьте связь и попробуйте ещё раз.');}
      finally{if(saveLock.current===token){saveLock.current=null;if(mounted.current)setSaving(false);}}
    };
    const picked=pinned;
    const awardText=picked==null?'Автоматическая подборка':picked.length?picked.map(id=>list.find(b=>b.def.id===id)?.def.name).filter(Boolean).join(' · ')||'Выбранные награды':'Не показывать в профиле';
    const avatarUri=photo?.uri??profile.avatarUrl;
    return <View style={[styles.screen,{paddingTop:insets.top}]}>
      <View style={[column,styles.header]}><Pressable accessibilityRole="button" accessibilityLabel="Назад в профиль" onPress={back} style={styles.back}><Icon name="arrow-left" size={21} color={colors.text}/></Pressable><Text variant="label" style={styles.breadcrumb}>Профиль</Text></View>
      {busy?<View style={styles.state}><Activity color={colors.text} accessibilityLabel="Загрузка профиля"/><Text variant="caption" style={styles.muted}>Загружаем профиль…</Text></View>
      :failed||!userId?<View style={styles.state}><Text variant="sectionTitle" style={styles.stateTitle}>{!userId?'Нужен вход':'Профиль не загрузился'}</Text><Text variant="caption" style={styles.muted}>{!userId?'Войдите, чтобы изменить профиль.':'Проверьте соединение и попробуйте ещё раз.'}</Text><Button label="Повторить" variant="secondary" onPress={reload}/></View>
      :<ScrollView style={{flex:1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[column,styles.body]}>
        <Text variant="sectionTitle" accessibilityRole="header" style={styles.title}>Редактировать{String.fromCharCode(10)}профиль</Text>
        <View style={styles.photoRow}>
          <Pressable accessibilityRole="button" accessibilityLabel="Изменить фото профиля" disabled={blocked} onPress={choosePhoto} style={styles.photo}>
            <Avatar design="2026" name={name||'·'} avatarUrl={avatarUri} size={92}/>
            <View style={styles.photoMark}><Icon name="image" size={15} color={colors.onActionPrimary}/></View>
          </Pressable>
          <View style={{gap:10,alignItems:'flex-start',flex:1}}><Text variant="label">Фото профиля</Text><Pressable accessibilityRole="button" accessibilityLabel="Выбрать другое фото" disabled={blocked} onPress={choosePhoto} style={styles.photoButton}><Text variant="label" style={{fontSize:12}}>Изменить фото</Text></Pressable></View>
        </View>
        <View style={{gap:20}}>
          <Field label="Имя" error={(submitted||touched.name)&&nameError}><FormInput value={name} editable={!saving&&!picking} onChangeText={change(setName,'name')} onBlur={()=>setTouched(s=>({...s,name:true}))} label="Имя" placeholder="Как вас зовут" maxLength={80} invalid={!!((submitted||touched.name)&&nameError)}/></Field>
          <Field label="Никнейм" error={(submitted||touched.username)&&usernameError} hint="Латиница, цифры и подчёркивание · 2–30 знаков"><View style={{position:'relative'}}><Text variant="body" style={styles.prefix}>@</Text><FormInput value={username} editable={!saving&&!picking} onChangeText={change(setUsername,'username')} onBlur={()=>setTouched(s=>({...s,username:true}))} label="Никнейм" placeholder="username" maxLength={31} prefix autoCapitalize="none" invalid={!!((submitted||touched.username)&&usernameError)}/></View></Field>
          <Field label="О себе" counter={bio.length+'/160'}><FormInput value={bio} editable={!saving&&!picking} onChangeText={change(setBio)} label="О себе" placeholder="Пара слов о вас" maxLength={160} multiline/></Field>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Настроить награды в профиле" disabled={blocked} onPress={()=>setPinnedOpen(true)} style={styles.awardsRow}>
          <View style={{flex:1,gap:5}}><Text variant="label">Награды в профиле</Text><Text variant="caption" numberOfLines={2} style={styles.muted}>{awardText}</Text></View><Icon name="chevron-right" size={20} color={colors.textSecondary}/>
        </Pressable>
        {badInterests&&<Text variant="caption" accessibilityRole="alert" style={styles.errorText}>Не удалось загрузить данные профиля. Сохранение недоступно.</Text>}
        {!!saveError&&<Text variant="caption" accessibilityRole="alert" style={styles.errorText}>{saveError}</Text>}
      </ScrollView>}
      <View style={[styles.footer,{paddingBottom:Math.max(insets.bottom,16)}]}><View style={column}><Button label="Сохранить" accessibilityLabel="Сохранить профиль" disabled={blocked} loading={saving||picking} onPress={submit}/></View></View>
      {pinnedOpen&&<Sheet design="2026" title="Награды в профиле" onClose={()=>{if(!saving)setPinnedOpen(false);}}>
        <View style={{gap:10,padding:16}}>
          {reward.isLoading&&<Activity accessibilityLabel="Загрузка новых наград"/>}
          {reward.isError&&<><Text variant="caption" style={styles.errorText}>Не удалось загрузить новые награды. Повторите загрузку, чтобы выбрать их.</Text><Button label="Повторить загрузку новых наград" variant="secondary" loading={reward.isFetching} onPress={()=>reward.refetch()}/></>}
          <CheckRow label="Подбирать автоматически" disabled={saving} selected={pinned===null} onPress={()=>setPinned(null)}/>
          <CheckRow label="Не показывать награды в шапке" disabled={saving} selected={pinned?.length===0} onPress={()=>setPinned([])}/>
          {list.map(({def})=><CheckRow key={def.id} label={def.name} detail={pinned?.includes(def.id)?'Место '+(pinned.indexOf(def.id)+1):undefined} selected={pinned?.includes(def.id)??false} disabled={saving||!!pinned&&pinned.length>=3&&!pinned.includes(def.id)} onPress={()=>setPinned(current=>current?.includes(def.id)?current.filter(id=>id!==def.id):[...(current??[]),def.id])}/>)}
          <Button label="Готово" disabled={saving} onPress={()=>setPinnedOpen(false)}/>
        </View>
      </Sheet>}
    </View>;
  }
  function Field({label,counter,hint,error,children}){return <View style={{gap:8}}><View style={{flexDirection:'row',alignItems:'center'}}><Text variant="label" style={{flex:1}}>{label}</Text>{counter&&<Text variant="caption" style={styles.muted}>{counter}</Text>}</View>{children}{error?<Text variant="caption" accessibilityRole="alert" style={styles.errorText}>{error}</Text>:hint?<Text variant="caption" style={styles.hint}>{hint}</Text>:null}</View>}
  function FormInput({label,prefix,multiline,invalid,onBlur,...props}){const[focused,setFocused]=React.useState(false);return <Input {...props} accessibilityLabel={label} autoFocus={false} autoCorrect={false} multiline={!!multiline} placeholderTextColor={colors.textMuted} onFocus={()=>setFocused(true)} onBlur={()=>{setFocused(false);onBlur?.()}} style={[type.body,styles.input,prefix&&{paddingLeft:36},multiline&&styles.bio,focused&&styles.inputFocus,invalid&&styles.inputError]}/>}
  const styles={screen:{flex:1,backgroundColor:colors.background},header:{alignSelf:'center',paddingHorizontal:20,paddingTop:10,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:12},back:{width:44,height:44,borderWidth:1,borderColor:'#393936',borderRadius:22,alignItems:'center',justifyContent:'center'},breadcrumb:{color:colors.textSecondary},body:{alignSelf:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:28,gap:24},title:{fontSize:26,lineHeight:33},photoRow:{flexDirection:'row',alignItems:'center',gap:22,paddingBottom:2},photo:{width:92,height:92,borderRadius:46},photoMark:{position:'absolute',right:-2,bottom:-2,width:28,height:28,borderRadius:14,backgroundColor:colors.actionPrimary,borderWidth:3,borderColor:colors.background,alignItems:'center',justifyContent:'center'},photoButton:{paddingHorizontal:16,minHeight:40,borderRadius:20,borderWidth:1,borderColor:'#454541',alignItems:'center',justifyContent:'center'},input:{minWidth:0,minHeight:54,paddingHorizontal:16,paddingVertical:14,borderRadius:16,borderWidth:1,borderColor:'#383835',backgroundColor:'#191918',color:colors.text,outlineStyle:'none',outlineWidth:0},inputFocus:{borderColor:'#8b8a81'},inputError:{borderColor:'#efaaa0'},bio:{minHeight:110,textAlignVertical:'top'},prefix:{position:'absolute',left:16,top:15,zIndex:1,color:colors.textSecondary,pointerEvents:'none'},hint:{color:colors.textSecondary,fontSize:10,lineHeight:15},muted:{color:colors.textSecondary},errorText:{color:'#efaaa0'},success:{color:colors.textSecondary},awardsRow:{flexDirection:'row',gap:12,alignItems:'center',paddingVertical:18,borderTopWidth:1,borderBottomWidth:1,borderColor:'#333330'},footer:{paddingTop:14,paddingHorizontal:20,borderTopWidth:1,borderColor:'#30302d',alignItems:'center',backgroundColor:colors.background},state:{flex:1,alignItems:'center',justifyContent:'center',gap:18,padding:28},stateTitle:{fontSize:22,lineHeight:28,textAlign:'center'}};
};
