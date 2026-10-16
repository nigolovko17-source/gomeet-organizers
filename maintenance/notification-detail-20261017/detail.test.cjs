const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname,'../..');
const parser = createRequire(path.resolve(root,'../../app/package.json'))('@babel/parser');
const build = require('./BUILD.json');
const code = fs.readFileSync(path.join(root,build.bundle),'utf8');
const calls = new Map(parser.parse(code).program.body.flatMap(n=>{
 const c=n.expression;
 return c?.callee?.name==='__d'?[[c.arguments[1].value,c]]:[];
}));
class EndOfMonthDate extends Date {
 constructor(...args){super(...(args.length?args:[Date.UTC(2026,9,29,12)]));}
 static now(){return Date.UTC(2026,9,29,12);}
}
const react = {
 useState:initial=>[initial,()=>{}], useEffect:()=>{},useRef:value=>({current:value}),
 useMemo:fn=>fn(),useCallback:fn=>fn,
};
const modules={
 36:react,142:{useFocusEffect:()=>{}},1042:{supabase:null},1325:{blockedIds:async()=>new Set()},
 1322:{mskParts:()=>({}),rub:n=>n/100},1479:{LIMIT_LABEL:{}},
 1007:{useAuth:()=>({userId:null})},
 1481:{useAchievements:()=>({stats:{streak:7,months:[true,false]},earned:[]})},
 1318:{useMyTickets:()=>({tickets:[{id:'fixture',eventTitle:'Example',ticketName:'Entry',qty:1,eventWhen:'17 Oct',createdAt:'2026-10-17T10:00:00Z',eventId:'event'}]})},
 319:()=>null,44:{create:v=>v},312:()=>null,414:{useSafeAreaInsets:()=>({top:0,bottom:0})},
 1491:()=>null,1022:{Icon:()=>null},1169:{getNotifSeen:async()=>0,markNotifSeen:()=>{}},
 1548:{useGoBack:()=>()=>{}},1333:{columnContent:{},useLayout:()=>({tight:false})},
};
function load(id) {
 const call=calls.get(id),fn=call.arguments[0],out={};
 const factory=vm.runInNewContext('('+code.slice(fn.start,fn.end)+')',{Date:EndOfMonthDate});
 factory({},key=>{
  if(key===1478)return modules[1478]||(modules[1478]=load(1478));
  if(!(key in modules))throw Error('Unexpected dependency '+key);
  return modules[key];
 },null,null,{},out,call.arguments[2].elements.map(x=>x.value));
 return out;
}
const data=load(1478),screen=load(1577);
function runFactory(id, provider) {
 const call=calls.get(id),fn=call.arguments[0],out={};
 vm.runInNewContext('('+code.slice(fn.start,fn.end)+')')({},id=>{
  if(!(id in provider))throw Error('Unexpected dependency '+id);
  return provider[id];
 },null,null,{},out,call.arguments[2].elements.map(x=>x.value));
 return out;
}
const base={id:'fixture',title:'Example',body:'Actual notification text',at:Date.UTC(2026,9,17,12)};
test('actions use existing exact routes and only the supplied object IDs',()=>{
 const examples=[
  [{kind:'ticket',orderId:'order',eventId:'event'},'Ticket','orderId','order'],
  [{kind:'refund',orderId:'refund-order'},'Ticket','orderId','refund-order'],
  [{kind:'follow',actorId:'person'},'UserProfile','userId','person'],
  [{kind:'support',threadId:'thread'},'SupportThread','threadId','thread'],
  [{kind:'support_due',threadId:'staff-thread'},'SupportThread','as','support'],
  [{kind:'measure'},'Support',null,null],
  [{kind:'sale',eventId:'event'},'EventDetail','eventId','event'],
  [{kind:'referral',eventId:'event'},'EventDetail','eventId','event'],
  [{kind:'badge',badgeId:'badge'},'Tabs','screen','Profile'],
 ];
 for(const [n,target,key,value] of examples){const a=screen.notificationAction({...base,...n});assert.equal(a.screen,target);if(key)assert.equal(a.params[key],value);}
 assert.equal(screen.notificationAction({...base,kind:'follow'}),null);
 assert.equal(screen.notificationAction({...base,kind:'streak',eventId:'event'}),null);
 assert.equal(screen.notificationAction({...base,kind:'ticket',eventId:'event'}).label,'Открыть событие');
});
test('server enrichment copies known metadata without fictional amounts, replies or status',()=>{
 const n=data.serverRowToNotif({id:'n',kind:'refund',created_at:'2026-10-17T12:00:00Z',event_id:'event',actor:null,event:{title:'Actual event'},payload:{order_id:'order',total:12345,qty:2,internal_secret:'not for UI'}});
 assert.equal(n.orderId,'order');assert.equal(n.detail.amount,12345);assert.equal(n.detail.eventTitle,'Actual event');
 assert.equal(n.detail.internal_secret,undefined);assert.equal(n.detail.reply,undefined);assert.equal(n.detail.bankStatus,undefined);
 const missing=data.serverRowToNotif({id:'n',kind:'refund',created_at:'2026-10-17T12:00:00Z',event:null,payload:{total:'150000'}});
 assert.equal(missing.detail.amount,undefined);
 const m=screen.notificationModel({...base,kind:'refund',detail:{}});
 assert.equal(m.pairs.length,0);assert.equal(m.text,base.body);
 const support=screen.notificationModel({...base,kind:'support',threadId:'actual'});
 assert.equal(support.text,base.body);assert.equal(support.contextTitle,'Обращение в поддержку');
});
test('derived tickets carry actual order and event details into the screen',()=>{
 const n=data.useNotifications().items.find(n=>n.kind==='ticket');
 assert.equal(n.orderId,'fixture');assert.equal(n.detail.ticketName,'Entry');assert.equal(n.detail.quantity,1);
 const model=screen.notificationModel(n);assert.equal(model.contextTitle,'Example');assert.equal(model.action.screen,'Ticket');
 assert.equal(model.pairs[1][1],'1');
});
test('all ten detail screens and missing/loading/error states render with one relevant action',()=>{
 const appRequire=createRequire(path.resolve(root,'../../app/package.json')),React=appRequire('react');
 const {renderToStaticMarkup}=appRequire('react-dom/server');
 const provider={...modules,36:React,1022:{Icon:props=>React.createElement('svg',{'data-icon':props.name})}};
 const ui=runFactory(1577,provider);
 for(const kind of ['ticket','refund','follow','support','measure','badge','sale','review','referral','support_due']){
  const n={...base,kind,orderId:'order',eventId:'event',actorId:'actor',threadId:kind==='support'||kind==='support_due'?'thread':undefined,detail:{eventTitle:'Actual event',ticketName:'Entry',quantity:2,badgeName:'Actual award'}};
  const html=renderToStaticMarkup(React.createElement(ui.NotificationDetail,{n,onAction:()=>{},onBack:()=>{}}));
  assert.equal((html.match(/class="nd-primary"/g)||[]).length,1);
  assert.equal(html.includes('data-notification-detail="'+kind+'"'),true);
  assert.equal(html.includes('Александра'),false);assert.equal(html.includes('15:42'),false);
 }
 for(const [props,heading] of [[{loading:true},'Загрузка уведомления'],[{error:true},'Не удалось загрузить'],[{},'Уведомление недоступно']]){
  const html=renderToStaticMarkup(React.createElement(ui.NotificationDetail,{n:null,onBack:()=>{},reload:()=>{},...props}));assert.equal(html.includes(heading),true);
 }
});
function feedHarness(){
 let owner='owner-a',slots=[],cursor=0,focus,requests=[],ticketReloads=0;
 const React={
  useState:init=>{const i=cursor++;if(!(i in slots))slots[i]=typeof init==='function'?init():init;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}]},
  useRef:init=>{const i=cursor++;if(!(i in slots))slots[i]={current:init};return slots[i]},
  useMemo:fn=>fn(),useCallback:fn=>fn,useEffect:()=>{},
 };
 const query={select(){return this},order(){return this},limit(){return new Promise(resolve=>requests.push(resolve))}};
 const provider={...modules,36:React,142:{useFocusEffect:cb=>{focus=cb}},1042:{supabase:{from:()=>query}},
  1007:{useAuth:()=>({userId:owner})},1481:{useAchievements:()=>({earned:[],loading:false})},
  1318:{useMyTickets:()=>({tickets:[],loading:false,reload:()=>{ticketReloads++}})}};
 const d=runFactory(1478,provider);
 return {render(){cursor=0;return d.useNotifications()},focus(){return focus()},owner(value){owner=value},requests,ticketReloads:()=>ticketReloads};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
test('real read rejection becomes retryable error without inventing an unavailable success',async()=>{
 const h=feedHarness();assert.equal(h.render().loading,true);h.focus();
 h.requests.shift()({data:null,error:{message:'read denied'}});await tick();
 let result=h.render();assert.equal(result.loading,false);assert.equal(result.error,true);assert.equal(result.items.length,0);
 result.reload();assert.equal(h.ticketReloads(),1);h.requests.shift()({data:[],error:null});await tick();
 result=h.render();assert.equal(result.error,false);assert.equal(result.loading,false);assert.equal(result.items.length,0);
});
test('late requests from an old identity cannot enter the new identity feed',async()=>{
 const h=feedHarness();h.render();const cleanup=h.focus();const old=h.requests.shift();cleanup();
 h.owner('owner-b');let result=h.render();assert.equal(result.items.length,0);assert.equal(result.loading,true);h.focus();const fresh=h.requests.shift();
 const row=name=>({id:name,kind:'follow',created_at:'2026-10-17T12:00:00Z',actor_id:name,actor:{name},event:null,payload:{}});
 fresh({data:[row('Current')],error:null});await tick();old({data:[row('Old')],error:null});await tick();
 result=h.render();assert.equal(result.items.length,1);assert.equal(result.items[0].actorName,'Current');assert.equal(result.items.some(n=>n.actorName==='Old'),false);
});
test('Notifications has an explicit reloadable path in the existing linking configuration',()=>{
 const deps=calls.get(1033).arguments[2].elements.map(n=>n.value);
 const config=runFactory(1033,{[deps[0]]:{createURL:p=>'gomeet://'+p},[deps[1]]:{}}).linking;
 assert.equal(config.config.screens.Notifications,'Notifications');
 assert.equal(config.config.screens.Ticket,'ticket/:orderId');
 assert.equal(config.config.screens.Tabs.screens.Profile,'profile');
});
