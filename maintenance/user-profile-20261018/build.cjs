const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-a5dce012da44fb7cfb8fcc03da5f7da7.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='5523ad4d3aa7670c17074d6e654678dbcbd79e5a9b83165cbd924fafe0198b5c')throw Error('Published base differs');
function modules(source){return new Map(parser.parse(source).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),original=before.get(1584),source=fs.readFileSync(path.join(__dirname,'UserProfileScreen.jsx'),'utf8');
const compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
if(!source.includes("navigation.navigate('Chat'")||!source.includes('label="Написать"')||!source.includes('<MenuItem icon="share" label="Поделиться"'))throw Error('Requested message/menu actions missing');
const dependencies=[...original.deps.elements.map(n=>n.value),1422,1495];
const built=base.slice(0,original.factory.start)+code+base.slice(original.factory.end,original.deps.start)+JSON.stringify(dependencies)+base.slice(original.deps.end);
const after=modules(built),changed=[],changedDeps=[];
if(after.size!==before.size)throw Error('Module count differs');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1584'||changedDeps.join(',')!=='1584')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'concept.js'),built);
const revision=sha(built).slice(0,12),entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');
const setup='<script>window.__USER_PROFILE_CONCEPT__=true;window.__USER_PROFILE_CONCEPT_STATE__=new URLSearchParams(location.search).get("state")||"ready";history.replaceState(null,"","/people/91233d07-b1e1-4c04-9075-a8fce7487aa9");</script>';
fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/user-profile-20261018/concept.js?rev='+revision));
const receipt={date:new Date().toISOString(),task:'UI-USER-PROFILE-20261018',revision:'r2',baseCommit:'3c7ab34ddaf74178a19545e493aca055ace9c38e',baseBundle:baseFile,baseSha256:sha(base),localBundle:'maintenance/user-profile-20261018/concept.js',sha256:sha(built),sourceSha256:sha(source),changedModules:changed,changedDependencyMaps:changedDeps,addedDependencies:[1422,1495],untouchedModules:before.size-1,profileData:'original usePublicProfile RPC; no fixture injection',follow:'local React state in preview',messages:'restored button and original Chat route; preview notice only, no sends',share:'entry moved to ellipsis menu only',copy:'notice only in preview',menuSafety:'mock entry and explanation; no report/block writes',achievements:'original returned badge data and artwork/rules; layout only',environment:'local only',commit:'NOT RUN',publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({revision,changed,changedDeps,untouched:before.size-1}));
