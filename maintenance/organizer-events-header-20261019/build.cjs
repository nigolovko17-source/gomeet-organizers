const fs=require('fs'),path=require('path'),crypto=require('crypto'),{createRequire}=require('module');
const req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json');
const parser=req('@babel/parser'),gen=req('@babel/generator').default,babel=req('@babel/core');
const root=path.resolve(__dirname,'../..'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-3d82274800e84d3d137035c4a04da486.js';
const base=fs.readFileSync(path.join(root,baseFile),'utf8');
const baseHash=sha(base),pin=JSON.parse(fs.readFileSync(path.join(__dirname,'BASE.json')));
if(baseHash!==pin.sha256)throw Error('Published base changed');
const previousFile=path.join(__dirname,'BUILD.json');
const previous=fs.existsSync(previousFile)?JSON.parse(fs.readFileSync(previousFile)):null;
const modules=s=>new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'&&c.arguments[1]?.type==='NumericLiteral'?[[c.arguments[1].value,{fn:c.arguments[0],deps:c.arguments[2]}]]:[]}));
const clean=n=>JSON.stringify(n,(k,v)=>['extra','loc','start','end','comments','leadingComments','trailingComments','innerComments','errors'].includes(k)?undefined:v);
const before=modules(base),wrapper=before.get(1331),list=before.get(1335),originalWrapper=clean(wrapper.fn),originalList=clean(list.fn),edits=[];
const expr=s=>parser.parseExpression(s);
function replace(node,key,value){edits.push({node,key,old:node[key],value});node[key]=value;}
let headerCount=0,titleCount=0,subtitleCount=0,styleCount=0,progressCount=0;
function walk(n,fn){if(!n||typeof n!=='object')return;fn(n);for(const[k,v]of Object.entries(n))if(!['loc','extra'].includes(k)){if(Array.isArray(v))v.forEach(x=>walk(x,fn));else if(v&&typeof v==='object')walk(v,fn);}}
walk(wrapper.fn,n=>{if(n.type==='CallExpression'&&n.arguments[0]?.object?.name==='u'&&n.arguments[0]?.property?.name==='default'&&n.arguments[1]?.type==='ObjectExpression'&&!n.arguments[1].properties.length){replace(n.arguments,0,expr('OrganizerEventsHeader'));headerCount++;}});
walk(list.fn,n=>{if(n.type==='ObjectProperty'&&n.key.name==='children'&&n.value.value==='События'){replace(n,'value',expr(JSON.stringify('Мои события')));titleCount++;}
 if(n.type==='ArrayExpression') {
  const index=n.elements.findIndex(c=>c?.type==='CallExpression'&&c.arguments[1]?.properties?.some(p=>p.key?.name==='children'&&p.value.value==='Ваши встречи. Всё под контролем.'));
  if(index>=0){replace(n,'elements',n.elements.filter((_,i)=>i!==index));subtitleCount++;}
  const progress=n.elements.findIndex(c=>c?.type==='CallExpression'&&c.arguments[1]?.properties?.some(p=>p.key?.name==='style'&&p.value?.object?.name==='k'&&p.value?.property?.name==='ticketProgress'));
  if(progress>=0){replace(n,'elements',n.elements.filter((_,i)=>i!==progress));progressCount++;}
 }
 if(n.type==='ObjectProperty'&&n.key.name==='style'&&n.value?.object?.name==='k'&&n.value?.property?.name==='pageTitle'){replace(n,'value',expr('[k.pageTitle,z<=350&&{fontSize:23,lineHeight:31}]'));styleCount++;}
});
function setStyle(name,key,value){let changed=0;walk(list.fn,n=>{if(n.type==='ObjectProperty'&&n.key.name===name&&n.value.type==='ObjectExpression'){const p=n.value.properties.find(x=>x.key?.name===key);if(!p)throw Error('Missing style '+name+'.'+key);replace(p,'value',expr(String(value)));changed++;}});if(changed!==1)throw Error('Unexpected style '+name);}
setStyle('list','paddingTop',16);setStyle('heading','paddingBottom',8);
// The title's typography is the only changed part of the existing title style.
let fontCount=0;
walk(list.fn,n=>{
  if(n.type!=='ObjectProperty'||n.key.name!=='pageTitle'||n.value.type!=='CallExpression')return;
  const o=n.value.arguments[2];if(!o)throw Error('Title style changed');
  for(const p of o.properties){
    if(p.key?.name==='fontSize'){replace(p,'value',expr('25'));fontCount++;}
    if(p.key?.name==='lineHeight'){replace(p,'value',expr('33'));fontCount++;}
  }
});
if([headerCount,titleCount,subtitleCount,styleCount,fontCount,progressCount].join(',')!=='1,1,1,1,2,1')throw Error('Unexpected header/card anchors');
for(const e of [...edits].reverse())e.node[e.key]=e.old;
if(clean(wrapper.fn)!==originalWrapper||clean(list.fn)!==originalList)throw Error('Unrelated AST changed');
for(const e of edits)e.node[e.key]=e.value;
const source=fs.readFileSync(path.join(__dirname,'OrganizerEventsHeader.jsx'),'utf8');
if(/fetch\s*\(|\.rpc\s*\(|localStorage|sessionStorage|useProfile|useAuth|setMode|postMessage/.test(source))throw Error('Unexpected action');
const binding=`var HeaderReact=r(d[10]),HeaderView=s.default,HeaderStyleSheet=n.default,HeaderText=e(r(d[11])).default,HeaderNavigation=r(d[12]),HeaderSafeArea=r(d[13]),HeaderLayout=r(d[14]),HeaderFonts=r(d[15]).Fonts,HeaderPressable=e(r(d[16])).default,HeaderSvg=r(d[17]).Svg,HeaderPath=r(d[17]).Path,HeaderColors=_.DesignColors;`;
const compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic',pragma:'HeaderReact.createElement',useBuiltIns:true}]]}).code;
wrapper.fn.body.body.push(...parser.parse(binding+'\n'+compiled).program.body);
const deps=[...wrapper.deps.elements.map(n=>n.value),36,1016,142,414,1333,948,1021,918];
const replacements=[{start:wrapper.fn.start,end:wrapper.fn.end,code:gen(wrapper.fn,{compact:true,comments:false}).code},{start:wrapper.deps.start,end:wrapper.deps.end,code:JSON.stringify(deps)},{start:list.fn.start,end:list.fn.end,code:gen(list.fn,{compact:true,comments:false}).code}];
let built=base;for(const e of replacements.sort((a,b)=>b.start-a.start))built=built.slice(0,e.start)+e.code+built.slice(e.end);
const after=modules(built),changed=[],changedDeps=[];
for(const[id,a]of before){const b=after.get(id);if(!b)throw Error('Module missing '+id);if(base.slice(a.fn.start,a.fn.end)!==built.slice(b.fn.start,b.fn.end))changed.push(id);if(a.deps&&base.slice(a.deps.start,a.deps.end)!==built.slice(b.deps.start,b.deps.end))changedDeps.push(id);}
if(after.size!==before.size||changed.join(',')!=='1331,1335'||changedDeps.join(',')!=='1331')throw Error('Unexpected scope '+JSON.stringify({changed,changedDeps}));
const releaseBundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(built).digest('hex')+'.js';
fs.writeFileSync(path.join(root,releaseBundle),built);
for(const file of ['profile/index.html','404.html']){
  const s=fs.readFileSync(path.join(root,file),'utf8'),active=s.match(/src="\/(\_expo\/static\/js\/web\/index-[a-f0-9]+\.js)"/)?.[1];
  if(!active||![baseFile,previous?.releaseBundle,releaseBundle].includes(active))throw Error('Unexpected entry '+file);
  fs.writeFileSync(path.join(root,file),s.replaceAll('/'+active,'/'+releaseBundle));
}
const entry=fs.readFileSync(path.join(root,'index.html'),'utf8');fs.writeFileSync(path.join(root,'index.html'),entry.replaceAll('settings-return-20261018','organizer-events-header-20261019'));
const report={task:'UI-ORG-EVENTS-HEADER-20261019',revision:'r2',baseCommit:pin.commit,baseFile,baseSha256:baseHash,releaseBundle,sha256:sha(built),sourceSha256:sha(source),changedModules:changed,changedDependencyMaps:changedDeps,unchangedModules:before.size-2,totalModules:before.size,restoredOriginalAstVerified:true,originalSharedHeader1332ByteIdentical:true,ticketProgressRemoved:true,brandNameRemoved:true,cardMetricsFooterActionsAndTabsPreserved:true,notificationAction:'Existing Notifications navigation route',publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
