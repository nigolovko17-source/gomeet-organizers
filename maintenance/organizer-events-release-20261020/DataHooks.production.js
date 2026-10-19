module.exports=function({React,Navigation,Client,EditApi,Covers,Geo,Demo,Model}){
 const api=Client.supabase,listeners=new Set(),notices=new Map(),listPositions=new Map(),uploads=new WeakMap();
 const SELECT='id,title,starts_at,ends_at,venue_id,city,description,age_limit,cover_url,status,guest_list_enabled,venues(name,address)';
 const emit=()=>listeners.forEach(f=>f());
 function useRevision(){const[n,set]=React.useState(0);React.useEffect(()=>{const f=()=>set(x=>x+1);listeners.add(f);return()=>listeners.delete(f)},[]);return n}
 async function readOwned(userId,id){
  if(!api||!userId)throw Error('auth');
  if(id){const{data,error}=await api.from('events').select(SELECT).eq('id',id).eq('created_by',userId).maybeSingle();if(error)throw error;return data?Model.normalize(data):null}
  const rows=[];for(let offset=0;;offset+=500){const{data,error}=await api.from('events').select(SELECT).eq('created_by',userId).order('starts_at',{ascending:true}).order('id',{ascending:true}).range(offset,offset+499);if(error)throw error;rows.push(...(data||[]).map(Model.normalize));if(!data||data.length<500)break}return rows;
 }
 function useOwned(userId,id){
  const focused=Navigation.useIsFocused(),rev=useRevision(),[attempt,setAttempt]=React.useState(0),key=String(userId||'')+':'+String(id||''),[state,setState]=React.useState({key:'',loading:true,data:null,error:null});
  React.useEffect(()=>{if(!focused)return;if(!userId){setState({key,loading:false,data:null,error:'auth'});return}let active=true;setState(s=>({key,loading:true,data:s.key===key?s.data:null,error:null}));readOwned(userId,id).then(data=>{if(active)setState({key,loading:false,data,error:null})}).catch(error=>{if(active)setState(s=>({key,loading:false,data:s.key===key?s.data:null,error}))});return()=>{active=false}},[key,focused,rev,attempt]);
  return{...(state.key===key?state:{key,loading:true,data:null,error:null}),reload:()=>setAttempt(n=>n+1)};
 }
 async function readMetrics(events){
  const{data,error}=await api.rpc('organizer_metric_overview');if(error)throw error;
  const map=new Map((data||[]).map(r=>[r.event_id,{ticketsSold:Number(r.tickets_sold??0),ticketAmount:Number(r.ticket_amount??0),checkedIn:Number(r.checked_in_tickets??0),salesLimit:r.sales_limit==null?null:Number(r.sales_limit),unlimited:r.unlimited===true}]));
  const ids=events.map(e=>e.id);let types=[];if(ids.length){const res=await api.from('tickets').select('id,event_id,free,name,unlimited,qty').in('event_id',ids);if(!res.error)types=res.data||[]}
  return new Map(events.map(e=>{let stats=map.get(e.id)||{ticketsSold:0,ticketAmount:0,checkedIn:0,salesLimit:null,unlimited:false};if(Demo.PROFILE_DEMO_METRICS)stats=Demo.demoDashboardEvent({id:e.id,title:e.title,stats}).stats;const list=types.filter(t=>t.event_id===e.id);return[e.id,{...stats,types:list,typesKnown:types.length>0,free:stats.ticketAmount===0&&list.length>0&&list.every(t=>t.free),mixed:list.some(t=>t.free)&&list.some(t=>!t.free)}]}));
 }
 function useMetrics(userId,events){
  const key=userId+':'+events.map(e=>e.id+':'+e.title).join('|'),rev=useRevision(),[attempt,setAttempt]=React.useState(0),[state,set]=React.useState({key:'',data:null,loading:true,error:null});
  React.useEffect(()=>{if(!userId||!events.length){set({key,data:new Map(),loading:false,error:null});return}let active=true;set(s=>({key,data:s.key===key?s.data:null,loading:true,error:null}));readMetrics(events).then(data=>{if(active)set({key,data,loading:false,error:null})}).catch(error=>{if(active)set(s=>({key,data:s.key===key?s.data:null,loading:false,error}))});return()=>{active=false}},[key,rev,attempt]);
  return{...(state.key===key?state:{data:null,loading:true,error:null}),reload:()=>setAttempt(n=>n+1)};
 }
 async function readQuotas(userId,eventId){const own=await readOwned(userId,eventId);if(!own)throw Error('access');const{data,error}=await api.from('tickets').select('*').eq('event_id',eventId).order('sort');if(error)throw error;return(data||[]).map(r=>({id:r.id,name:r.name||'Входной билет',free:!!r.free,unlimited:r.unlimited===true,limit:r.sales_limit==null?null:Number(r.sales_limit),remaining:r.qty==null?null:Number(r.qty)}))}
 function useQuotas(userId,eventId){const[attempt,retry]=React.useState(0),[state,set]=React.useState({key:'',loading:true,data:null,error:null}),key=userId+':'+eventId;React.useEffect(()=>{let active=true;set(s=>({key,loading:true,data:s.key===key?s.data:null,error:null}));readQuotas(userId,eventId).then(data=>{if(active)set({key,loading:false,data,error:null})}).catch(error=>{if(active)set(s=>({key,loading:false,data:s.key===key?s.data:null,error}))});return()=>{active=false}},[key,attempt]);return{...(state.key===key?state:{loading:true,data:null,error:null}),reload:()=>retry(n=>n+1)}}
 async function setQuota(userId,eventId,ticketId,value){const own=await readOwned(userId,eventId);if(!own||Model.archived(own))throw Error('archive');const{error}=await api.rpc('set_ticket_sales_limit',{p_ticket_id:ticketId,p_sales_limit:value});if(error)throw error;emit()}
 async function resolveVenue(userId,e,f){
  if(f.venue.trim()===e.venue&&f.address.trim()===e.address)return e.venueId;
  if(!f.venue.trim())return null;
  let q=api.from('venues').select('id').eq('name',f.venue.trim()).eq('city',e.city);q=f.address.trim()?q.eq('address',f.address.trim()):q.is('address',null);const existing=await q.limit(1).maybeSingle();if(existing.error)throw existing.error;if(existing.data)return existing.data.id;
  let coords=null;try{coords=await Geo.geocodeVenue(f.venue.trim(),f.address.trim()||null,e.city)}catch{}
  const{data,error}=await api.from('venues').insert({name:f.venue.trim(),address:f.address.trim()||null,city:e.city,created_by:userId,lat:coords?.lat??null,lng:coords?.lng??null}).select('id').single();if(error)throw error;return data.id;
 }
 async function saveOwned(userId,base,form,target,picked,onStage){
  const current=await readOwned(userId,base.id);if(!current)return{kind:'access'};if(Model.archived(current))return{kind:'archive',event:current};if(Model.fingerprint(current)!==Model.fingerprint(base))return{kind:'conflict',event:current};
  let uploaded=null,venueId;try{if(picked){onStage('upload');uploaded=uploads.get(picked)||await Covers.uploadCover(picked,userId);if(uploaded)uploads.set(picked,uploaded);if(!uploaded)return{kind:'error',message:'Афиша не загрузилась. Прежнее изображение сохранено.'}}venueId=await resolveVenue(userId,current,form)}catch(error){if(uploaded){try{await Covers.removeCover(uploaded)}catch{}if(picked)uploads.delete(picked)}return{kind:'error',message:'Не удалось сохранить площадку. Правки остались в форме.'}}
  const patch=Model.patchOf(current,form,venueId,uploaded||current.cover,target);onStage('save');
  let result;try{result=await EditApi.saveEvent(patch)}catch{return{kind:'unknown',patch,uploaded,base:current}}
  if(!result.ok){const known=/афиша|описание|возраст|на проверке|в архиве|проверить событие/i.test(result.error||'');if(!known)return{kind:'unknown',patch,uploaded,base:current};if(uploaded){try{await Covers.removeCover(uploaded)}catch{}if(picked)uploads.delete(picked)}return{kind:'error',message:result.error}}
  let saved;try{saved=await readOwned(userId,base.id)}catch{return{kind:'unknown',patch,uploaded,base:current}}
  if(!saved)return{kind:'access'};
  if(uploaded&&base.cover&&saved.cover===uploaded)try{await Covers.removeCover(base.cover)}catch{}
  emit();return{kind:'saved',event:saved,matches:Model.matches(saved,{...patch,status:result.status}),status:result.status};
 }
 async function checkResult(userId,pending){const event=await readOwned(userId,pending.patch.id);if(!event)return{kind:'access'};if(Model.matches(event,pending.patch)){emit();return{kind:'saved',event,matches:true,status:event.status}}return{kind:'unconfirmed',event}}
 return{useOwned,useMetrics,useQuotas,readOwned,readQuotas,setQuota,saveOwned,checkResult,emit,notices,listPositions};
};
