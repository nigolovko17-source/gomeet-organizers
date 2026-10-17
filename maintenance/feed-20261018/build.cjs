const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-3f09737ae0b42f8beae091abc358a75c.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='06f53256fcc8a5bf29386b8d5f53f73e18873da4f616752f03abef772576a9a4')throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),old=before.get(1483),source=fs.readFileSync(path.join(__dirname,'ExploreScreen.jsx'),'utf8');
const compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end),after=modules(built),changed=[],deps=[];
if(before.size!==after.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))deps.push(id);}
if(changed.join(',')!=='1483'||deps.length)throw Error('Scope changed');
fs.writeFileSync(path.join(__dirname,'concept.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),revision=sha(built).slice(0,12);
const setup='<script>window.__FEED_CONCEPT__=true;window.__FEED_CONCEPT_STATE__=new URLSearchParams(location.search).get("state")||"ready";history.replaceState(null,"","/explore");</script>';
fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/feed-20261018/concept.js?rev='+revision));
const receipt={date:new Date().toISOString(),task:'UI-FEED-20261018',revision:'r4',baseCommit:'1985dffdb1f0a8803659464086f3b7916d966b4e',baseBundle:baseFile,baseSha256:sha(base),localBundle:'maintenance/feed-20261018/concept.js',sha256:sha(built),sourceSha256:sha(source),changedModules:changed,changedDependencyMaps:deps,untouchedModules:before.size-1,sourceData:'original useFeed/useEvent/useGoing/useSaved read hooks; no fixture data',previewActions:'favorite local state only; purchase CTA notice only; event/organizer navigation unchanged',environment:'local only',commit:'NOT RUN',publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({revision,changed,deps,untouched:before.size-1}));
