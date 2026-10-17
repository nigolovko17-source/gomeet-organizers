module.exports=function(userId,mode='guest'){
  const identity=userId?JSON.stringify([userId,mode]):null;
  const [snapshot,setSnapshot]=n.useState({identity:null,status:'idle',profile:p});
  const [attempt,setAttempt]=n.useState(0);
  const reload=n.useCallback(()=>setAttempt(value=>value+1),[]);
  n.useEffect(()=>{
    let active=true;
    if(!userId){setSnapshot({identity:null,status:'idle',profile:p});return()=>{active=false;};}
    const fail=error=>{if(!active)return;setSnapshot({identity,status:'failed',profile:p});try{o.captureError(error,{where:'useEditableProfile',code:error?.code});}catch{}};
    if(!t.supabase){fail(new Error('Profile service unavailable'));return()=>{active=false;};}
    setSnapshot({identity,status:'loading',profile:p});
    Promise.resolve().then(()=>t.supabase.rpc('my_profile_for_mode',{p_mode:mode})).then(({data,error})=>{
      if(!active)return;if(error){fail(error);return;}
      const row=Array.isArray(data)?data[0]:data;
      const profile=row?{name:row.name??'',username:row.username??'',avatarUrl:row.avatar_url,bio:row.bio??'',pinnedBadges:row.pinned_badges??null}:p;
      setSnapshot({identity,status:'ready',profile});
    }).catch(fail);
    return()=>{active=false;};
  },[userId,mode,attempt]);
  const matches=snapshot.identity===identity;
  return {profile:matches&&snapshot.status==='ready'?snapshot.profile:p,loading:!!userId&&(!matches||snapshot.status==='loading'||snapshot.status==='idle'),failed:!!userId&&matches&&snapshot.status==='failed',ready:!!userId&&matches&&snapshot.status==='ready',reload};
};
