const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json');
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core'),sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-d6a27665769a523daff6a4cab6549879.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='b6dd9878780dc95ae853c5194bdbcc056634f49659a0baac786e1d2adaaeae84')throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),old=before.get(1487),source=fs.readFileSync(path.join(__dirname,'MessagesScreen.jsx'),'utf8');
const compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
const newDeps=old.deps.elements.map(x=>x.value).concat([1320,1370,1400]);
for(const id of newDeps)if(!before.has(id))throw Error('Missing dependency '+id);
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end,old.deps.start)+JSON.stringify(newDeps)+base.slice(old.deps.end);
const after=modules(built),changed=[],deps=[];
if(before.size!==after.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))deps.push(id);}
if(changed.join(',')!=='1487'||deps.join(',')!=='1487')throw Error('Scope changed');
fs.writeFileSync(path.join(__dirname,'concept.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),revision=sha(built).slice(0,12);
const setup='<script>window.__MESSAGES_CONCEPT__=true;window.__MESSAGES_CONCEPT_STATE__=new URLSearchParams(location.search).get("state")||"ready";history.replaceState(null,"","/messages");</script>';
fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/messages-20261018/concept.js?rev='+revision));
const receipt={date:new Date().toISOString(),task:'UI-MESSAGES-20261018',revision:'r2',baseCommit:'f62a2410f5eba5a60e5054234f013de650ab7791',baseBundle:baseFile,baseSha256:sha(base),localBundle:'maintenance/messages-20261018/concept.js',sha256:sha(built),sourceSha256:sha(source),changedModules:changed,changedDependencyMaps:deps,addedExistingDependencies:[1320,1370,1400],untouchedModules:before.size-1,sourceData:'original useDmChats/useEventChats/searchPeople; existing useFeed for event poster lookup',examples:'four fictional rows only in preview examples mode; no fake online/unread/delivery flags',previewActions:'Chat navigation and follow actions intercepted to notice; actual Chat factory untouched',environment:'local only',commit:'NOT RUN',publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({revision,changed,deps,untouched:before.size-1}));
