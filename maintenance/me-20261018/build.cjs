const fs=require('fs'),path=require('path'),crypto=require('crypto'),{createRequire}=require('module');
const root=path.resolve(__dirname,'../..'),req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json'),parser=req('@babel/parser'),babel=req('@babel/core'),gen=req('@babel/generator').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-17699c7e23bbd0cfea0c451b81beedb1.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='695e9ef6c8b37029de14fae57e2158095c2151a6ad27a7aa1f5bf239e3a63c1a')throw Error('Base changed');
const modules=s=>new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{fn:c.arguments[0],deps:c.arguments[2]}]]:[]}));
const before=modules(base),original=before.get(1529);
let source='module.exports = '+fs.readFileSync(path.join(__dirname,'OriginalProfile.js'),'utf8').split('// DEPS:')[0];
const tree=parser.parse(source),factory=tree.program.body[0].expression.right,W=factory.body.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='W'),ret=W.body.body.find(n=>n.type==='ReturnStatement');
source=source.slice(0,ret.start)+`return t.createElement(MeBody,{profile:e,loading:s,counts:l,mode:W,selected:$,tabs:G,onSelect:F,events:se,stats:K,conducted:J.data??0,navigation:x,featuredBadges:de});`+source.slice(ret.end);
source=source.replace('  const U =',fs.readFileSync(path.join(__dirname,'MeLayout.jsx'),'utf8')+'\n  const U =');
fs.writeFileSync(path.join(__dirname,'MeProfileScreen.jsx'),source);
const compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]]}).code;
const fn=parser.parse(compiled).program.body[0].expression.right,code=gen(fn,{compact:true,comments:false}).code;
const built=base.slice(0,original.fn.start)+code+base.slice(original.fn.end);fs.writeFileSync(path.join(__dirname,'concept.js'),built);
const after=modules(built),changed=[],changedDeps=[];
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.fn.start,x.fn.end))!==sha(built.slice(y.fn.start,y.fn.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(after.size!==1640||changed.join(',')!=='1529'||changedDeps.length)throw Error('Unexpected scope');
const clean=n=>JSON.stringify(n,(k,v)=>['extra','loc','start','end'].includes(k)?undefined:v);
for(const name of ['_','V']){const a=original.fn.body.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name===name),b=after.get(1529).fn.body.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name===name);if(clean(a)!==clean(b))throw Error('Shared export changed '+name);}
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),revision=sha(built).slice(0,12);
fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div><script>history.replaceState(null,"","/profile");</script>').replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/me-20261018/concept.js?rev='+revision));
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify({task:'UI-ME-20261018',revision:'r5',date:new Date().toISOString(),baseCommit:'5dea922163d9d006103f5404a0209d1f4fa15b1a',baseFile,baseSha256:sha(base),sha256:sha(built),changedModules:changed,changedDependencyMaps:changedDeps,untouchedModules:1639,sharedExports:'ProfileTabs / ProfileEvent AST identical',data:'original hooks and projections unchanged',achievements:'existing featured badge selection and renderer restored; collection is a structural placeholder; no new rules/artwork/progress defined',mutations:'edit/settings/pin/wallet are local notices or local React state',commit:'NOT RUN',publication:'NOT RUN'},null,2)+'\n');
console.log(JSON.stringify({revision,changed,changedDeps,modules:after.size}));
