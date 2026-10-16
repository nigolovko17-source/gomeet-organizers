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
test('initial release never generates a streak at end of month',()=>{
 assert.equal(data.streakAtRisk(7,[true,false],new Date('2026-10-29T12:00:00Z')),false);
 const result=data.useNotifications();
 assert.equal(result.risk,false);
 assert.equal(result.items.some(n=>n.kind==='streak'),false);
 assert.equal(result.items.length,1);
 assert.equal(result.items[0].kind,'ticket');
});
test('grouping excludes stale streak rows and preserves date/year separation',()=>{
 const at=s=>new Date(s).getTime();
 const result=screen.groupItems([
  {id:'stale',kind:'streak',at:at('2026-10-17T15:00:00Z')},
  {id:'fresh',kind:'ticket',at:at('2026-10-17T12:00:00Z')},
  {id:'a',kind:'ticket',at:at('2026-10-16T12:00:00Z')},
  {id:'b',kind:'badge',at:at('2026-10-16T10:00:00Z')},
  {id:'c',kind:'support',at:at('2025-10-16T12:00:00Z')},
 ],at('2026-10-17T00:00:00Z'));
 assert.equal(result.length,3);
 assert.equal(result[0].fresh,true);
 assert.equal(result[0].items.length,1);
 assert.equal(result[1].items.length,2);
 assert.equal(result[2].items.length,1);
 assert.equal(result.flatMap(g=>g.items).length,4);
 assert.notEqual(result[1].key,result[2].key);
});
test('all ten initial-release card kinds render without synthetic product screens',()=>{
 const appRequire=createRequire(path.resolve(root,'../../app/package.json'));
 const React=appRequire('react');
 const {renderToStaticMarkup}=appRequire('react-dom/server');
 const kinds=['ticket','refund','follow','support','measure','badge','sale','review','referral','support_due'];
 const rows=kinds.map((kind,i)=>({id:'test-'+kind,kind,title:kind==='ticket'?'Билет куплен: Example':kind==='badge'?'Ты получил бейдж «Example»':'Example',body:'Test body',at:Date.UTC(2026,9,16,12-i),actorName:'Test User'}));
 const provider={
  36:React,319:props=>React.createElement('div',null,props.children),
  44:{create:v=>v},312:props=>React.createElement('div',null,props.children),
  414:{useSafeAreaInsets:()=>({top:0,bottom:0})},1491:()=>null,
  1022:{Icon:props=>React.createElement('svg',{'data-icon':props.name})},
  1478:{useNotifications:()=>({items:rows}),markServerNotificationsRead:()=>{}},
  1169:{getNotifSeen:async()=>0,markNotifSeen:()=>{}},1548:{useGoBack:()=>()=>{}},
  1333:{columnContent:{},useLayout:()=>({tight:false})},
 };
 const call=calls.get(1577),fn=call.arguments[0],out={};
 vm.runInNewContext('('+code.slice(fn.start,fn.end)+')')({},id=>provider[id],null,null,{},out,call.arguments[2].elements.map(x=>x.value));
 const markup=renderToStaticMarkup(React.createElement(out.default,{navigation:{navigate:()=>{throw Error('Unexpected navigation during render');}}}));
 assert.equal((markup.match(/data-notification-kind=/g)||[]).length,10);
 assert.equal((markup.match(/class="nn-mark nn-avatar"/g)||[]).length,2);
 assert.equal((markup.match(/class="nn-award-slot"/g)||[]).length,1);
 assert.equal((markup.match(/class="nn-audience"/g)||[]).length,4);
 assert.equal(markup.includes('data-notification-kind="streak"'),false);
 assert.equal(markup.includes('<dialog'),false);
});
