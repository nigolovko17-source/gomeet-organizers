module.exports=function(g,r,i,a,m,exports,d){
  'use strict';
  const unwrap=v=>v&&v.__esModule?v.default:v;
  const React=r(d[19]),View=unwrap(r(d[3])),ScrollView=unwrap(r(d[1])),Screen=unwrap(r(d[4])),Text=unwrap(r(d[6])),Pressable=unwrap(r(d[7]));
  const {DesignColors:colors}=r(d[10]),{useColumnContent}=r(d[11]),{LEGAL_URL}=r(d[15]),Icon=r(d[17]).Feather,palette=r(d[18]).palettes.dark;
  const Linking=unwrap(r(d[0])),{useGoBack}=r(d[12]),{useAuth}=r(d[13]),{useDiagnosticsConsent}=r(d[14]);
  Object.defineProperty(exports,'__esModule',{value:true});exports.default=AboutScreen;
  function AboutScreen(){
    const column=useColumnContent(),goBack=useGoBack(),{userId}=useAuth(),T=useDiagnosticsConsent(userId);
    const enabled=T.allowed,loading=T.loading,saving=T.saving,needsSync=T.needsSync,error=T.error,disabled=!userId||loading||saving;
    const change=value=>{if(!disabled)T.set(value);};
    const status=!userId?'Нужен вход':loading?'Загружаем настройку…':saving?'Сохраняем…':needsSync?'Выключено на этом устройстве':enabled?'Отправка включена':'Отправка выключена';
    return <Screen edges={['top','bottom']}>
      <View style={[column,S.header]}><Pressable accessibilityRole="button" accessibilityLabel="Назад" onPress={goBack} style={({pressed})=>[S.back,pressed&&S.pressed]}><Icon name="arrow-left" size={21} color={colors.text}/></Pressable><Text variant="label" style={S.context}>Настройки</Text></View>
      <ScrollView style={{flex:1}} showsVerticalScrollIndicator={false} contentContainerStyle={[column,S.body]}>
        <Text variant="sectionTitle" accessibilityRole="header" style={S.title}>О приложении</Text>
        <View style={S.section}><Text variant="label" style={S.sectionLabel}>Документы</Text><View style={S.group}>
          <DocumentRow first icon="file-text" label="Правила сервиса" onPress={()=>Linking.openURL(LEGAL_URL.terms)}/>
          <DocumentRow icon="shield" label="Что мы собираем" onPress={()=>Linking.openURL(LEGAL_URL.privacy)}/>
        </View></View>
        <View style={S.section}><Text variant="label" style={S.sectionLabel}>Диагностика</Text><View style={S.diagnostics}>
          <View style={S.switchRow}><View style={S.switchText}><Text variant="label" style={S.rowTitle}>Отчёты об ошибках</Text><Text variant="caption" accessibilityLiveRegion="polite" style={S.status}>{status}</Text></View><Pressable accessibilityRole="switch" accessibilityLabel="отправка отчётов об ошибках" aria-checked={enabled} aria-busy={loading||saving} accessibilityState={{checked:enabled,disabled,busy:loading||saving}} disabled={disabled} onPress={()=>change(!enabled)} onKeyDown={event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();event.stopPropagation();change(!enabled);}}} style={({pressed})=>[S.switchHit,pressed&&S.pressed,disabled&&S.disabled]}><View style={[S.track,enabled&&{backgroundColor:palette.accent}]}><View style={[S.thumb,enabled&&S.thumbOn]}/></View></Pressable></View>
          <Text variant="caption" style={S.description}>По желанию. Помогает находить ошибки{ '\n' }в работе приложения.</Text>
          {(error||needsSync)&&<View style={S.feedback}><Text variant="caption" accessibilityRole="alert" accessibilityLiveRegion="polite" style={S.error}>{error||'Отключение ещё не подтверждено.'}</Text><Pressable accessibilityRole="button" accessibilityLabel={needsSync?'Повторить отключение отчётов':'Повторить сохранение настройки'} disabled={disabled} onPress={()=>change(needsSync?false:true)} style={S.retry}><Text variant="label" style={S.retryLabel}>{needsSync?'Повторить отключение':'Повторить'}</Text><Icon name="rotate-cw" size={15} color={colors.text}/></Pressable></View>}
        </View></View>
      </ScrollView>
    </Screen>;
  }
  function DocumentRow({icon,label,onPress,first}){return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({pressed})=>[S.docRow,!first&&S.rule,pressed&&S.pressed]}><View style={S.docIcon}><Icon name={icon} size={20} color={colors.textSecondary}/></View><Text variant="label" style={S.docLabel}>{label}</Text><Icon name="arrow-up-right" size={18} color={colors.textSecondary}/></Pressable>}
  const S={
    header:{alignSelf:'center',paddingHorizontal:20,paddingTop:10,paddingBottom:8,flexDirection:'row',alignItems:'center',gap:12},back:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:'#393936',alignItems:'center',justifyContent:'center'},context:{fontSize:12,lineHeight:18,color:colors.textSecondary},
    body:{alignSelf:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:32,gap:26},title:{fontSize:26,lineHeight:33},
    section:{gap:10},sectionLabel:{fontSize:12,lineHeight:18,color:colors.textSecondary,paddingLeft:4},group:{borderWidth:1,borderColor:'#333330',borderRadius:22,backgroundColor:'#191918',overflow:'hidden'},docRow:{flexDirection:'row',alignItems:'center',gap:12,minHeight:68,paddingHorizontal:16,paddingVertical:12},rule:{borderTopWidth:1,borderTopColor:'#30302d'},docIcon:{width:24,alignItems:'center'},docLabel:{flex:1,minWidth:0,fontSize:14,lineHeight:20},
    diagnostics:{padding:16,borderWidth:1,borderColor:'#333330',borderRadius:22,backgroundColor:'#191918',gap:14},switchRow:{flexDirection:'row',alignItems:'center',gap:12},switchText:{flex:1,minWidth:0,gap:6},rowTitle:{fontSize:14,lineHeight:20},status:{fontSize:11,lineHeight:17,color:colors.textSecondary},switchHit:{width:52,minHeight:44,alignItems:'center',justifyContent:'center'},track:{width:48,height:28,borderRadius:14,paddingHorizontal:3,justifyContent:'center',backgroundColor:'#41413c'},thumb:{width:22,height:22,borderRadius:11,backgroundColor:'#b8b8b3',alignSelf:'flex-start'},thumbOn:{alignSelf:'flex-end',backgroundColor:'#101010'},description:{fontSize:12,lineHeight:19,color:colors.textSecondary},feedback:{borderTopWidth:1,borderTopColor:'#333330',paddingTop:13,gap:9},error:{fontSize:12,lineHeight:18,color:'#e4b9a8'},retry:{alignSelf:'flex-start',minHeight:44,borderRadius:22,paddingHorizontal:15,borderWidth:1,borderColor:'#4a4a44',flexDirection:'row',alignItems:'center',gap:12},retryLabel:{fontSize:11,lineHeight:17},pressed:{opacity:.65},disabled:{opacity:.45}
  };
};
