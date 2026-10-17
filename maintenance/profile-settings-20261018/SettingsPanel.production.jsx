  const React=t,Activity=l.default,Pressable=s.default,ScrollView=n.default,View=u.default,Text=j.default,AccountInfo=v.default;
  const colors=C.DesignColors,Icon=r(d[31]).Feather,useSafeAreaInsets=r(d[32]).useSafeAreaInsets,useColumnContent=E.useColumnContent;
  function SettingsPanel({profile,loading,failed,userId,mode,canOrganize,modeReady,stats,application,moderator,payout,onClose,onMode,onNavigate,onCopy,copyError,onQR,onRetry}){
    const column=useColumnContent(),insets=useSafeAreaInsets(),busy=loading,error=failed;
    const organizerConnected=canOrganize;
    const modeLabel=organizerConnected?(mode==='org'?'Режим гостя':'Режим организатора'):'Стать организатором';
    const unavailable=busy||error||!userId;
    return <View accessibilityViewIsModal style={[styles.screen,{paddingTop:insets.top}]}>
      <View style={[column,styles.header]}><Pressable accessibilityRole="button" accessibilityLabel="Назад в профиль" onPress={onClose} style={styles.back}><Icon name="arrow-left" size={21} color={colors.text}/></Pressable><Text variant="label" style={styles.muted}>Профиль</Text></View>
      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} contentContainerStyle={[column,styles.body]}>
        <Text variant="sectionTitle" accessibilityRole="header" style={styles.title}>Настройки</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={modeLabel} onPress={onMode} disabled={!modeReady} accessibilityState={{disabled:!modeReady}} style={({pressed})=>[styles.mode,pressed&&styles.pressed]}>
          <View style={styles.modeIcon}><Icon name={organizerConnected?'repeat':'plus'} size={21} color={colors.text}/></View><View style={{flex:1,gap:4}}><Text variant="label" style={styles.modeTitle}>{modeLabel}</Text><Text variant="caption" style={styles.muted}>{organizerConnected?(mode==='org'?'Сейчас вы организатор':'Сейчас вы гость'):'Подключение профиля организатора'}</Text></View><Icon name={organizerConnected?'arrow-up-right':'arrow-right'} size={20} color={colors.textSecondary}/>
        </Pressable>
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>Профиль</Text>
          {busy&&<View style={{flexDirection:'row',alignItems:'center',gap:10,padding:8}}><Activity color={colors.textSecondary} accessibilityLabel="Загрузка профиля"/><Text variant="caption" style={styles.muted}>Загружаем профиль…</Text></View>}
          {(error||!userId)&&<View style={styles.error}><Text variant="label">{!userId?'Нужен вход':'Профиль не загрузился'}</Text><Text variant="caption" style={styles.muted}>{!userId?'Войдите, чтобы открыть настройки профиля.':'Попробуйте ещё раз, чтобы открыть данные профиля.'}</Text>{userId&&<Pressable accessibilityRole="button" accessibilityLabel="Повторить загрузку профиля" onPress={onRetry} style={styles.retry}><Text variant="label" style={{fontSize:12}}>Повторить</Text><Icon name="rotate-cw" size={15} color={colors.text}/></Pressable>}</View>}
          {!!copyError&&<Text variant="caption" accessibilityRole="alert" style={{color:colors.danger,padding:4}}>{copyError}</Text>}
          <View style={styles.group}>
            <SettingsRow first icon="user" label="Редактировать профиль" disabled={unavailable} onPress={()=>onNavigate('EditProfile')}/>
            <SettingsRow icon="link" label="Ссылка на профиль" end="copy" disabled={unavailable} onPress={onCopy}/>
            <SettingsRow icon="grid" label="QR-код" disabled={unavailable} onPress={onQR}/>
          </View>
        </View>
        <AccountInfo/>
        <View style={styles.section}>
          <Text variant="label" style={styles.sectionLabel}>Сервис</Text>
          <View style={styles.group}>
            {canOrganize&&['pending','rejected'].includes(application?.status)&&<SettingsRow first icon="check-circle" label="Проверка ИНН" value={application.status==='pending'?'На проверке':'Отклонено'} onPress={()=>onNavigate('Verification')}/>}
            <SettingsRow first={!(canOrganize&&['pending','rejected'].includes(application?.status))} icon="tag" label="Мои билеты" value={!busy&&stats?.purchases>0?String(stats.purchases):null} onPress={()=>onNavigate('Tickets')}/>
            <SettingsRow icon="slash" label="Заблокированные" onPress={()=>onNavigate('Blocked')}/>
            {moderator&&<SettingsRow icon="flag" label="Разбор жалоб" onPress={()=>onNavigate('Moderation')}/>}
            {moderator&&<SettingsRow icon="inbox" label="Обращения" onPress={()=>onNavigate('SupportQueue')}/>}
            <SettingsRow icon="message-circle" label="Поддержка" onPress={()=>onNavigate('Support')}/>
            {payout.data?.can_view&&<SettingsRow icon="credit-card" label="Выплаты организаторам" onPress={()=>onNavigate('Payouts')}/>}
            <SettingsRow icon="info" label="О приложении" onPress={()=>onNavigate('About')}/>
          </View>
        </View>
      </ScrollView>

    </View>;
  }
  function SettingsRow({icon,label,end='chevron-right',value,first,onPress,disabled}){
    const [focused,setFocused]=React.useState(false);
    return <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{disabled:!!disabled}} disabled={!!disabled} onPress={onPress} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={({pressed})=>[styles.row,!first&&styles.rule,focused&&styles.focus,disabled&&styles.disabled,pressed&&styles.pressed]}>
      <View style={styles.rowIcon}><Icon name={icon} size={20} color={colors.textSecondary}/></View><Text variant="label" style={styles.rowLabel}>{label}</Text>{value&&<View style={styles.value}><Text variant="caption" style={styles.valueText}>{value}</Text></View>}<Icon name={end} size={17} color={colors.textSecondary}/>
    </Pressable>;
  }
  const styles={
    screen:{flex:1,backgroundColor:colors.background},header:{alignSelf:'center',paddingHorizontal:20,paddingTop:10,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:12},back:{width:44,height:44,borderWidth:1,borderColor:'#393936',borderRadius:22,alignItems:'center',justifyContent:'center'},muted:{color:colors.textSecondary},body:{alignSelf:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:32,gap:26},title:{fontSize:26,lineHeight:33},mode:{flexDirection:'row',alignItems:'center',gap:14,padding:16,minHeight:80,borderWidth:1,borderColor:'#41413b',borderRadius:20,backgroundColor:'#141413'},modeIcon:{width:42,height:42,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:'#242422'},modeTitle:{fontSize:14,lineHeight:20},section:{gap:10},sectionLabel:{color:colors.textSecondary,paddingLeft:4,fontSize:12,lineHeight:18},group:{borderWidth:1,borderColor:'#333330',borderRadius:20,backgroundColor:'#191918',overflow:'hidden'},row:{flexDirection:'row',alignItems:'center',gap:12,minHeight:58,paddingHorizontal:16,paddingVertical:15},rowIcon:{width:23,alignItems:'center'},rowLabel:{flex:1,minWidth:0,fontSize:14,lineHeight:20},rule:{borderTopWidth:1,borderTopColor:'#30302d'},value:{paddingHorizontal:8,minHeight:24,borderRadius:12,backgroundColor:'#292927',alignItems:'center',justifyContent:'center'},valueText:{fontSize:11,lineHeight:16,color:colors.textSecondary},pressed:{opacity:.65},disabled:{opacity:.4},focus:{outlineStyle:'solid',outlineWidth:2,outlineColor:colors.text,outlineOffset:-3},error:{padding:16,gap:8,borderWidth:1,borderColor:'#51413c',borderRadius:16},retry:{flexDirection:'row',alignItems:'center',alignSelf:'flex-start',gap:10,minHeight:44,paddingHorizontal:14,borderWidth:1,borderColor:'#605c53',borderRadius:22}
  };
