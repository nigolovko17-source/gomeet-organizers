const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'),'utf8'));
if(accepted.revision!=='r2')throw Error('Expected accepted r2');
const source=fs.readFileSync(path.join(__dirname,'MessagesScreen.jsx'),'utf8');
if(sha(source)!==accepted.sourceSha256)throw Error('Accepted source changed');
const base=fs.readFileSync(path.join(root,accepted.baseBundle),'utf8');
if(sha(base)!==accepted.baseSha256)throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const tree=parser.parse(source,{plugins:['jsx']});
function visualHash(ast){const parts=[];traverse(ast,{
 FunctionDeclaration(p){if(['ChatRow','State'].includes(p.node.id.name))parts.push(generate(p.node,{compact:true,comments:false}).code);},
 VariableDeclarator(p){if(p.node.id.name==='styles')parts.push(generate(p.node.init,{compact:true,comments:false}).code);},
 JSXElement(p){const name=p.node.openingElement.name.name,code=generate(p.node,{compact:true,comments:false}).code;
  if(['ScrollView','AuthGate'].includes(name)||(name==='View'&&p.node.children.some(c=>c.type==='JSXElement'&&c.openingElement.name.name==='Text'&&generate(c,{compact:true}).code.includes('styles.title')))||(name==='View'&&p.node.openingElement.attributes.some(a=>a.name?.name==='accessibilityLabel'&&a.value?.value==='Загрузка сообщений')))parts.push(code);
 }
});return sha(JSON.stringify(parts));}
const visualBefore=visualHash(tree),changes=[];
traverse(tree,{
 VariableDeclarator(p){const name=p.node.id.name;
  if(['preview','notice','examples','scenario','retry'].includes(name)){changes.push(name);p.remove();}
  else if(name==='all'){p.node.init=parser.parseExpression('[...events.chats,...dm.chats].slice().sort(chats.byFreshest)');changes.push(name);}
  else if(name==='loading'){p.node.init=parser.parseExpression('(events.loading||dm.loading)&&!all.length');changes.push(name);}
 },
 IfStatement(p){if(p.node.test.name==='preview'){p.remove();changes.push('restore original action');}},
 ConditionalExpression(p){if(p.node.test.type==='BinaryExpression'&&p.node.test.left.name==='scenario'){p.replaceWith(p.node.alternate);changes.push('remove preview-only forced error');}}
});
if(changes.length!==10)throw Error('Release anchors differ: '+changes.join(','));
if(visualBefore!==visualHash(tree))throw Error('Accepted normal JSX/styles changed');
const input=generate(tree,{comments:false}).code;
if(/__MESSAGES_CONCEPT|postMessage|example-|\bscenario\b|\bnotice\b|const preview|const examples|Карточка ведёт|концепте/.test(input))throw Error('Preview code remains');
fs.writeFileSync(path.join(__dirname,'MessagesScreen.production.js'),input+'\n');
const compiled=babel.transformSync(input,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
const before=modules(base),old=before.get(1487),newDeps=old.deps.elements.map(x=>x.value).concat(accepted.addedExistingDependencies);
for(const id of newDeps)if(!before.has(id))throw Error('Missing dependency '+id);
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end,old.deps.start)+JSON.stringify(newDeps)+base.slice(old.deps.end),after=modules(built),changed=[],changedDeps=[];
if(after.size!==before.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1487'||changedDeps.join(',')!=='1487')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),setup='<script>history.replaceState(null,"","/messages");</script>';
fs.writeFileSync(path.join(__dirname,'release-preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/messages-20261018/candidate.js?rev='+sha(built).slice(0,12)));
const receipt={date:new Date().toISOString(),task:'UI-MESSAGES-20261018',acceptedRevision:'r2',baseCommit:accepted.baseCommit,baseBundle:accepted.baseBundle,baseSha256:sha(base),sourceSha256:sha(source),acceptedPreviewSha256:accepted.sha256,candidateBundle:'maintenance/messages-20261018/candidate.js',sha256:sha(built),acceptedNormalJSXAndStylesUnchanged:true,visualHash:visualBefore,previewAbsent:true,changes,changedModules:changed,changedDependencyMaps:changedDeps,addedExistingDependencies:accepted.addedExistingDependencies,untouchedModules:before.size-1,chat:'restored existing Chat route with unchanged payload and Chat1579 factory',people:'original searchPeople and follow/unfollow callbacks; no real mutations tested',dataHooks:'1493 unchanged; original list/auth/live/order/projection',limitations:'forced error scenario remains local only; original hooks expose loading and no explicit list error. Existing DM avatar initials fallback retained. No server/privacy/consent acceptance claim.',publication:'PENDING',commit:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({sha256:receipt.sha256,changed,changedDeps,untouched:before.size-1,acceptedNormalJSXAndStylesUnchanged:true,previewAbsent:true}));
