function useSettingsReturn(navigation,identity,setSettings,setQR){
  const pending=React.useRef(null);
  React.useEffect(()=>{pending.current=null;setSettings(false);setQR(false);},[identity,setSettings,setQR]);
  React.useEffect(()=>navigation.addListener('state',()=>{
    const state=navigation.getState(),active=state.routes[state.index];
    if(state.type==='tab'&&active?.name!=='Profile'){
      pending.current=null;setSettings(false);setQR(false);
    }
  }),[navigation,setSettings,setQR]);
  h.useFocusEffect(React.useCallback(()=>{
    const origin=pending.current;
    if(origin?.kind==='route'&&origin.identity===identity){pending.current=null;setSettings(true);}
    return()=>{if(pending.current?.kind==='qr'){pending.current=null;setQR(false);}};
  },[identity,setSettings,setQR]));
  const open=React.useCallback(()=>{pending.current=null;setSettings(true);},[setSettings]);
  const close=React.useCallback(()=>{pending.current=null;setSettings(false);},[setSettings]);
  const navigate=React.useCallback(screen=>{pending.current={kind:'route',identity};setSettings(false);navigation.navigate(screen);},[navigation,identity,setSettings]);
  const openQR=React.useCallback(()=>{pending.current={kind:'qr',identity};setSettings(false);setQR(true);},[identity,setSettings,setQR]);
  const closeQR=React.useCallback(()=>{setQR(false);const origin=pending.current;pending.current=null;if(origin?.kind==='qr'&&origin.identity===identity)setSettings(true);},[identity,setSettings,setQR]);
  const cancel=React.useCallback(()=>{pending.current=null;},[]);
  return{open,close,navigate,openQR,closeQR,cancel};
}
