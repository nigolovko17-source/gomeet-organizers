const QRAvatar=(v=>v&&v.__esModule?v.default:v)(r(d[33]));
function ProfileQrCard({profile,profileLink,loading,failed,onRetry,identity}){
  const {width,height}=f.default();
  const [copying,setCopying]=React.useState(false),[copied,setCopied]=React.useState(false),[copyError,setCopyError]=React.useState(false),[focused,setFocused]=React.useState(false);
  const mounted=React.useRef(true),working=React.useRef(null),context=React.useRef(null),epoch=React.useRef(0);
  const busy=loading,error=failed,unavailable=busy||error||!profileLink;
  context.current={identity,profileLink,unavailable};
  React.useEffect(()=>{mounted.current=true;const focusTimer=window.setTimeout(()=>{document.querySelector('[role="button"][aria-label="закрыть"]')?.focus();},0);return()=>{mounted.current=false;epoch.current++;working.current=null;window.clearTimeout(focusTimer);};},[]);
  React.useEffect(()=>{epoch.current++;working.current=null;setCopying(false);setCopied(false);setCopyError(false);},[identity,profileLink,unavailable]);
  const size=Math.max(168,Math.floor(Math.min(224,width-112,height-390)));
  const copy=async()=>{
    const current=context.current;
    if(current.unavailable||working.current)return;
    const token={identity:current.identity,profileLink:current.profileLink,epoch:epoch.current};working.current=token;
    setCopying(true);setCopied(false);setCopyError(false);
    const accepts=()=>mounted.current&&working.current===token&&epoch.current===token.epoch&&context.current.identity===token.identity&&context.current.profileLink===token.profileLink&&!context.current.unavailable;
    try{
      if(typeof navigator.clipboard?.writeText!=='function')throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(token.profileLink);
      if(accepts())setCopied(true);
    }catch{
      if(accepts())setCopyError(true);
    }finally{
      if(mounted.current&&working.current===token){working.current=null;setCopying(false);}
    }
  };
  return <View style={QRStyle.content}>
    {busy?<View style={QRStyle.state}><Activity color={colors.textSecondary} accessibilityLabel="Загрузка QR-кода"/><Text variant="caption" style={QRStyle.caption}>Загружаем профиль…</Text></View>:error||!profileLink?<View style={QRStyle.state}><Icon name="grid" size={28} color={colors.textSecondary}/><Text variant="label" accessibilityRole="alert" style={QRStyle.stateTitle}>Не удалось открыть QR-код</Text><Text variant="caption" style={QRStyle.caption}>Попробуйте ещё раз.</Text><Pressable accessibilityRole="button" accessibilityLabel="Повторить загрузку QR-кода" onPress={onRetry} style={({pressed})=>[QRStyle.retry,pressed&&QRStyle.pressed]}><Text variant="label" style={QRStyle.retryLabel}>Повторить</Text><Icon name="rotate-cw" size={16} color={colors.text}/></Pressable></View>:<>
      <View style={[QRStyle.identity,{maxWidth:size+48}]}><QRAvatar size={44} name={profile.name} avatarUrl={profile.avatarUrl}/><View style={QRStyle.identityText}><Text variant="label" style={QRStyle.name}>{profile.name}</Text>{!!profile.username&&<Text variant="caption" style={QRStyle.username}>@{profile.username.replace(/^@/,'')}</Text>}</View></View>
      <View accessibilityLabel="QR-код профиля" style={QRStyle.qrFrame}><b.default value={profileLink} size={size} color="#000000" backgroundColor="#ffffff"/></View>
    </>}
    <View style={QRStyle.actions}><Pressable accessibilityRole="button" accessibilityLabel={copied?'Ссылка скопирована':'Скопировать ссылку на профиль'} disabled={unavailable||copying} aria-busy={copying} accessibilityState={{disabled:unavailable||copying,busy:copying}} onPress={copy} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} style={({pressed})=>[QRStyle.copy,focused&&QRStyle.focus,(unavailable||copying)&&QRStyle.disabled,pressed&&QRStyle.pressed]}><Text variant="label" accessibilityLiveRegion="polite" style={QRStyle.copyLabel}>{copying?'Копируем…':copied?'Ссылка скопирована':'Скопировать ссылку'}</Text><Icon name={copied?'check':'copy'} size={18} color="#101010"/></Pressable>{copyError&&<Text variant="caption" accessibilityRole="alert" style={QRStyle.error}>Не удалось скопировать ссылку.{ '\n' }Попробуйте ещё раз.</Text>}</View>
  </View>;
}
const QRStyle={
  content:{alignItems:'center',gap:22,paddingTop:6,paddingBottom:20},identity:{alignSelf:'center',flexDirection:'row',alignItems:'center',gap:12,minHeight:44},identityText:{minWidth:0,flexShrink:1,gap:4},name:{fontSize:16,lineHeight:22},username:{fontSize:12,lineHeight:18,color:colors.textSecondary},qrFrame:{padding:24,backgroundColor:'#ffffff',borderRadius:24},caption:{fontSize:12,lineHeight:18,color:colors.textSecondary,textAlign:'center',maxWidth:280},actions:{alignSelf:'stretch',gap:12,paddingTop:2},copy:{minHeight:52,paddingVertical:14,paddingHorizontal:18,borderRadius:26,backgroundColor:V.accent,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12},copyLabel:{fontSize:13,lineHeight:20,color:'#101010',flexShrink:1},error:{fontSize:12,lineHeight:18,color:'#e4b9a8',textAlign:'center'},state:{minHeight:316,alignItems:'center',justifyContent:'center',gap:16,paddingHorizontal:12},stateTitle:{fontSize:15,lineHeight:22,textAlign:'center'},retry:{minHeight:44,paddingHorizontal:16,borderRadius:22,borderWidth:1,borderColor:'#4a4a44',flexDirection:'row',alignItems:'center',gap:12},retryLabel:{fontSize:12,lineHeight:18},focus:{outlineStyle:'solid',outlineWidth:2,outlineColor:colors.text,outlineOffset:3},disabled:{opacity:.4},pressed:{opacity:.65}
};
