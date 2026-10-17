const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-137ea609a783e6c924012753bc993cda.js';
const base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='51bef1daaa843d761b8ea5a2a3a6facb66309d15a18f63bb1478a63437bea9d6')throw Error('Published base differs');
function modules(source){return new Map(parser.parse(source).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),old=before.get(1580);
const source=fs.readFileSync(path.join(__dirname,'SectionScreen.jsx'),'utf8');
const release=process.argv.includes('--release');
let input=source,visualTemplateUnchanged=true;
if(release){
 const tree=parser.parse(source,{plugins:['jsx']});
 const visualHash=ast=>{
   const nodes=[];
   traverse(ast,{JSXElement(p){nodes.push(generate(p.node,{compact:true,comments:false}).code);},VariableDeclarator(p){if(p.node.id.name==='styles')nodes.push(generate(p.node.init,{compact:true,comments:false}).code);}});
   return sha(JSON.stringify(nodes));
 };
 const priorVisual=visualHash(tree),changes=[];
 const replacements={loading:'data.loading',failed:'data.failed',events:'section?.events ?? []',retry:'()=>data.refresh()',saved:'live.saved',toggle:'live.toggle'};
 traverse(tree,{VariableDeclarator(p){
   const name=p.node.id.name;
   if(['preview','notice','state'].includes(name)||(p.node.id.type==='ArrayPattern'&&p.node.id.elements[0]?.name==='demoSaved')){changes.push(name||'demoSaved');p.remove();}
   else if(Object.hasOwn(replacements,name)){p.node.init=parser.parseExpression(replacements[name]);changes.push(name);}
 }});
 if(changes.length!==10)throw Error('Release transformation anchors differ: '+changes.join(','));
 visualTemplateUnchanged=priorVisual===visualHash(tree);
 if(!visualTemplateUnchanged)throw Error('Accepted JSX or styles changed');
 input=generate(tree,{comments:false}).code;
 if(/__SECTION_CONCEPT|postMessage|demoSaved|setDemoSaved|gomeet-section-notice|только в макете/.test(input))throw Error('Preview code remains');
 fs.writeFileSync(path.join(__dirname,'SectionScreen.production.js'),input+'\n');
}
const compiled=babel.transformSync(input,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right;
const code=generate(factory,{compact:true,comments:false}).code;
const dependencies=[...old.deps.elements.map(n=>n.value),36,1022];
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end,old.deps.start)+JSON.stringify(dependencies)+base.slice(old.deps.end);
const after=modules(built),changed=[],changedDeps=[];
if(after.size!==before.size)throw Error('Module count differs');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1580'||changedDeps.join(',')!=='1580')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,release?'candidate.js':'concept.js'),built);
if(release){
 const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'),'utf8'));
 if(sha(source)!==accepted.sourceSha256)throw Error('Accepted source differs');
 const receipt={date:new Date().toISOString(),task:'UI-COLLECTION-20261017',baseCommit:accepted.baseCommit,baseBundle:baseFile,baseSha256:sha(base),candidateBundle:'maintenance/section-20261017/candidate.js',sha256:sha(built),sourceSha256:sha(source),acceptedPreviewSha256:accepted.sha256,acceptedJSXAndStylesUnchanged:visualTemplateUnchanged,previewAbsent:true,favoriteCallback:'existing useSaved.toggle',changedModules:changed,changedDependencyMaps:changedDeps,addedSectionDependencies:[36,1022],untouchedModules:before.size-1,publication:'PENDING',commit:'NOT RUN'};
 fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
 console.log(JSON.stringify({release:true,sha256:sha(built),changed,changedDeps,untouched:before.size-1,visualTemplateUnchanged}));
 process.exit(0);
}
const revision=sha(built).slice(0,12),entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');
const setup='<script>const p=new URLSearchParams(location.search);window.__SECTION_CONCEPT__=true;window.__SECTION_CONCEPT_STATE__=p.get("state")||"ready";const section=["trending","party","other"].includes(p.get("section"))?p.get("section"):"trending";history.replaceState(null,"","/section/"+section);</script>';
fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/section-20261017/concept.js?rev='+revision));
const receipt={date:new Date().toISOString(),revision:'r1',baseCommit:'c8e25e6799f10bdd762f6bb1765f75db8cae06fe',baseBundle:baseFile,baseSha256:sha(base),localBundle:'maintenance/section-20261017/concept.js',sha256:sha(built),changedModules:changed,changedDependencyMaps:changedDeps,addedSectionDependencies:[36,1022],untouchedModules:before.size-1,sourceSha256:sha(source),environment:'local concept only',favoriteWrites:'intercepted in Section preview; local state only',publication:'NOT RUN',commit:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({revision,changed,changedDeps,untouched:before.size-1}));
