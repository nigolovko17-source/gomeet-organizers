const fs=require('fs'),path=require('path'),crypto=require('crypto'),{createRequire}=require('module');
const root=path.resolve(__dirname,'../..'),req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json');
const parser=req('@babel/parser'),babel=req('@babel/core'),gen=req('@babel/generator').default,traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),clean=n=>JSON.stringify(n,(k,v)=>['extra','loc','start','end'].includes(k)?undefined:v);
const baseFile='_expo/static/js/web/index-71c79e111e8cdf7cc6527659a6b67242.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='e1c4f6af2c5a9a5b72e0f5c190e8059e326a60692bc8298abcd07a4ce749fb37')throw Error('Base changed');
const modules=s=>new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{fn:c.arguments[0],deps:c.arguments[2]}]]:[]}));
const before=modules(base),original=before.get(1494),originalFn=JSON.parse(JSON.stringify(original.fn)),source=fs.readFileSync(path.join(__dirname,'SettingsPanel.production.jsx'),'utf8');
if(/__PROFILE_SETTINGS|postMessage|\bnotice\b|not-organizer|концепт|setRecovered|\bscenario\b/.test(source))throw Error('Preview code remains');
const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'ACCEPTED-STYLE.json'),'utf8')),parse=s=>parser.parse(s,{plugins:['jsx']});
const pick=(tree,name)=>{let out;traverse(tree,{VariableDeclarator(p){if(p.node.id.name===name)out=p.node.init;},FunctionDeclaration(p){if(p.node.id.name===name)out=p.node;}});return out;};
const panelTree=parse(source);
if(sha(clean(pick(panelTree,'styles')))!==accepted.stylesSha256||sha(clean(pick(panelTree,'SettingsRow')))!==accepted.rowSha256)throw Error('Accepted styles/helper changed');
const walk=(n,fn)=>{if(!n||typeof n!=='object')return;fn(n);for(const[k,v]of Object.entries(n))if(!['loc','extra'].includes(k)){if(Array.isArray(v))v.forEach(n=>walk(n,fn));else if(v&&typeof v==='object')walk(v,fn);}};
const f=original.fn.body.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='F');let modeAdded=0,modalChanged=0,originalModalChildren;
walk(f,n=>{if(n.type==='VariableDeclarator'&&n.id.type==='ObjectPattern'&&n.id.properties.some(p=>p.key?.name==='canOrganize')){n.id.properties.push(parser.parseExpression('({ready:SettingsModeReady})').properties[0]);modeAdded++;}
 if(n.type==='CallExpression'&&n.arguments[0]?.type==='MemberExpression'&&n.arguments[0].object.name==='o'&&n.arguments[0].property.name==='default'){
  const obj=n.arguments[1];if(obj?.type!=='ObjectExpression'||!obj.properties.some(p=>p.key?.name==='visible'&&p.value?.name==='he'))return;
  const children=obj.properties.find(p=>p.key?.name==='children');originalModalChildren=JSON.parse(JSON.stringify(children.value));const dialogs=[];
  walk(children.value,c=>{if(c.type==='CallExpression'&&c.arguments[0]?.name==='L')dialogs.push(gen(c,{compact:true,comments:false}).code);});
  if(dialogs.length!==2)throw Error('Legacy dialogs changed');
  const panel=`B.jsx(SettingsPanel,{profile:N,loading:J,failed:K,userId:te,mode:oe,canOrganize:ie,modeReady:SettingsModeReady,stats:Z,application:ne,moderator:ae,payout:le,onClose:()=>pe(false),onMode:()=>{if(!SettingsModeReady)return;if(ie){se(oe==='org'?'guest':'org');pe(false);}else{pe(false);Q.navigate('Verification');}},onNavigate:screen=>{pe(false);Q.navigate(screen);},onCopy:fe,copyError:ce,onQR:()=>{pe(false);de(true);},onRetry:U})`;
  children.value=parser.parseExpression(`B.jsxs(B.Fragment,{children:[${panel},${dialogs.join(',')}]})`);modalChanged++;
 }
});
if(modeAdded!==1||modalChanged!==1)throw Error('Expected one mode context and settings modal');
const verification=JSON.parse(JSON.stringify(original.fn));
walk(verification,n=>{if(n.type==='ObjectPattern')n.properties=n.properties.filter(p=>p.value?.name!=='SettingsModeReady');if(n.type==='CallExpression'&&n.arguments[0]?.type==='MemberExpression'&&n.arguments[0].object.name==='o'&&n.arguments[0].property.name==='default'){const obj=n.arguments[1];if(obj?.type==='ObjectExpression'&&obj.properties.some(p=>p.key?.name==='visible'&&p.value?.name==='he'))obj.properties.find(p=>p.key?.name==='children').value=originalModalChildren;}});
if(clean(verification)!==clean(originalFn))throw Error('Original profile/read/QR/copy/account logic changed');
original.fn.body.body.push(...panelTree.program.body);
const fullSource='module.exports = '+gen(original.fn,{comments:false,jsescOption:{minimal:true}}).code+';\n';
fs.writeFileSync(path.join(__dirname,'ProfileSettings.production.jsx'),fullSource);
const compiled=babel.transformSync(fullSource,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic',useBuiltIns:true}]]}).code;
const code=gen(parser.parse(compiled).program.body[0].expression.right,{compact:true,comments:false}).code,deps=[...original.deps.elements.map(n=>n.value),1422,414];
let built=base;for(const edit of [{start:original.fn.start,end:original.fn.end,code},{start:original.deps.start,end:original.deps.end,code:JSON.stringify(deps)}].sort((a,b)=>b.start-a.start))built=built.slice(0,edit.start)+edit.code+built.slice(edit.end);
const after=modules(built),changed=[],changedDeps=[];for(const[id,x]of before){const y=after.get(id);if(base.slice(x.fn.start,x.fn.end)!==built.slice(y.fn.start,y.fn.end))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(after.size!==1640||changed.join(',')!=='1494'||changedDeps.join(',')!=='1494')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');
fs.writeFileSync(path.join(__dirname,'release-preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div><script>history.replaceState(null,"","/profile");</script>').replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/profile-settings-20261018/candidate.js?rev='+sha(built).slice(0,12)));
const report={task:'UI-PROFILE-SETTINGS-20261018',revision:'production-r2',date:new Date().toISOString(),baseCommit:'ecda6a958d424df62f6852c1ac727dea939b23f9',baseBundle:baseFile,baseSha256:sha(base),sha256:sha(built),sourceSha256:sha(source),acceptedSourceSha256:accepted.acceptedSourceSha256,changedModules:changed,changedDependencyMaps:changedDeps,untouchedModules:1639,stylesAndSettingsRowAstIdentical:true,originalProfileReadQrCopyAccountLogicAstPreserved:true,settingsPresentation:'existing Modal now renders accepted full screen; existing close entry retained; no new route',mode:'ready-bound original setMode only for canOrganize; false navigates Verification',becomeOrganizer:'entry to existing registered Verification1624 only; no role grant or submission',editor1601AndReadGuard1602Unchanged:true,previewAbsent:true,commit:'NOT RUN',publication:'PENDING'};
fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({sha256:report.sha256,changed,changedDeps,untouched:1639,stylesIdentical:true,previewAbsent:true}));
