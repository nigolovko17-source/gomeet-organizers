const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'),'utf8'));
if(accepted.revision!=='r4')throw Error('Expected accepted r4');
const source=fs.readFileSync(path.join(__dirname,'ExploreScreen.jsx'),'utf8');
if(sha(source)!==accepted.sourceSha256)throw Error('Accepted source changed');
const base=fs.readFileSync(path.join(root,accepted.baseBundle),'utf8');
if(sha(base)!==accepted.baseSha256)throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const tree=parser.parse(source,{plugins:['jsx']});
function visualHash(ast){const parts=[];traverse(ast,{JSXElement(p){parts.push(generate(p.node,{compact:true,comments:false}).code);},VariableDeclarator(p){if(p.node.id.name==='styles')parts.push(generate(p.node.init,{compact:true,comments:false}).code);}});return sha(JSON.stringify(parts));}
const visualBefore=visualHash(tree),changes=[];
const replacements={loading:'feed.loading',failed:'feed.failed',events:'feed.events',saved:'savedData.saved',refresh:'()=>feed.refresh()',toggleSaved:'()=>savedData.toggle()'};
traverse(tree,{
 VariableDeclarator(p){const name=p.node.id.name;
  if(['preview','notice','scenario'].includes(name)||(p.node.id.type==='ArrayPattern'&&p.node.id.elements[0]?.name==='localSaved')){changes.push(name||'localSaved');p.remove();}
  else if(Object.hasOwn(replacements,name)){p.node.init=parser.parseExpression(replacements[name]);changes.push(name);}
 },
 IfStatement(p){if(p.node.test.name==='preview'){p.remove();changes.push('attend preview branch');}}
});
if(changes.length!==11)throw Error('Release transformation anchors differ: '+changes.join(','));
if(visualBefore!==visualHash(tree))throw Error('Accepted JSX/styles changed');
const input=generate(tree,{comments:false}).code;
if(/__FEED_CONCEPT|postMessage|localSaved|setLocalSaved|\bpreview\b|\bscenario\b|\bnotice\b|только в макете|В концепте/.test(input))throw Error('Preview code remains');
fs.writeFileSync(path.join(__dirname,'ExploreScreen.production.js'),input+'\n');
const compiled=babel.transformSync(input,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
const before=modules(base),old=before.get(1483),built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end);
const after=modules(built),changed=[],changedDeps=[];
if(after.size!==before.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1483'||changedDeps.length)throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),setup='<script>history.replaceState(null,"","/explore");</script>';
fs.writeFileSync(path.join(__dirname,'release-preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/feed-20261018/candidate.js?rev='+sha(built).slice(0,12)));
const receipt={date:new Date().toISOString(),task:'UI-FEED-20261018',acceptedRevision:'r4',baseCommit:accepted.baseCommit,baseBundle:accepted.baseBundle,baseSha256:sha(base),sourceSha256:sha(source),acceptedPreviewSha256:accepted.sha256,candidateBundle:'maintenance/feed-20261018/candidate.js',sha256:sha(built),acceptedJSXAndStylesUnchanged:true,visualHash:visualBefore,previewAbsent:true,changes,changedModules:changed,changedDependencyMaps:changedDeps,untouchedModules:before.size-1,favorite:'existing useSaved.toggle',attend:'existing Purchase route, no order created by navigation',refresh:'original feed.refresh',data:'original hooks, ordering, price, artwork and visibility',publication:'PENDING',commit:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
