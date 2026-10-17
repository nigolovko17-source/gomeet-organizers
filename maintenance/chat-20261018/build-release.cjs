const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),gen=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'),'utf8'));
if(accepted.revision!=='r2')throw Error('Expected accepted r2');
const localSource=path.join(__dirname,'ChatScreen.jsx'),archivedSource=path.resolve(root,'../../design/chat-concept-20261018/r2/ChatScreen.jsx');
const source=fs.readFileSync(fs.existsSync(localSource)?localSource:archivedSource,'utf8');if(sha(source)!==accepted.sourceSha256)throw Error('Accepted source changed');
const base=fs.readFileSync(path.join(root,accepted.baseBundle),'utf8');if(sha(base)!==accepted.baseSha256)throw Error('Published base changed');
const tree=parser.parse(source,{plugins:['jsx']});
function visualHash(ast){const parts=[];traverse(ast,{VariableDeclarator(p){if(p.node.id.name==='styles')parts.push(gen(p.node.init,{compact:true}).code);},JSXElement(p){const code=gen(p.node,{compact:true}).code;if(p.node.openingElement.name.name==='View'&&p.node.openingElement.attributes.some(a=>a.name?.name==='style'&&/styles\.(header|composerArea)/.test(gen(a,{compact:true}).code)))parts.push(code.replace(/preview\?chat\.sub:/g,''));}});return sha(JSON.stringify(parts));}
const visualBefore=visualHash(tree),changes=[];
const expressions={
 chat:'realChat',event:"chatHooks.useChatMessages(isDm?'':chat.id,userId,profile.name)",dm:"chatHooks.useDmMessages(isDm?chat.id:'',userId)",unavailable:'false',loading:'false',
 messages:"[...data.messages,...failures.map(message=>({...message,failed:true}))].map((message,index)=>({message,index,at:Number.isFinite(Date.parse(message.at))?Date.parse(message.at):Infinity})).sort((a,b)=>a.at-b.at||a.index-b.index).map(entry=>entry.message)",
 send:`async()=>{if(!canSend||sending.current)return;const text=draft.trim();sending.current=true;setPending(true);setDraft('');setInputHeight(52);try{const error=await data.send(text);if(error)setFailures(old=>[...old,{...failedMessage(text),error}]);}catch{setFailures(old=>[...old,{...failedMessage(text),error:'Не отправилось. Попробуйте ещё раз.'}]);}finally{sending.current=false;setPending(false);}}`,
 retry:`async message=>{if(!message||sending.current||pending||unavailable)return;sending.current=true;setPending(true);try{const error=await data.send(message.text);if(!error)setFailures(old=>old.filter(item=>item.id!==message.id));else setFailures(old=>old.map(item=>item.id===message.id?{...item,error}:item));}catch{setFailures(old=>old.map(item=>item.id===message.id?{...item,error:'Не отправилось. Попробуйте ещё раз.'}:item));}finally{sending.current=false;setPending(false);}}`
};
traverse(tree,{
 VariableDeclarator(p){const name=p.node.id.name;
  if(['preview','notice','personal','eventMessages','scenario','isEvent','added','seed','initialFailure','failed'].includes(name)){p.remove();changes.push(name);}
  else if(p.node.id.type==='ArrayPattern'&&p.node.id.elements[0]?.name==='added'){p.remove();changes.push('added state');}
  else if(p.node.id.type==='ArrayPattern'&&p.node.id.elements[0]?.name==='failure'){p.node.id.elements[0].name='failures';p.node.id.elements[1].name='setFailures';p.node.init=parser.parseExpression('React.useState([])');changes.push('failure queue');}
  else if(name==='localMessage'){p.node.id.name='failedMessage';p.node.init=parser.parseExpression("text=>({id:'failed-'+(++count.current),from:'me',text,at:new Date().toISOString()})");}
  else if(Object.hasOwn(expressions,name)){p.node.init=parser.parseExpression(expressions[name]);changes.push(name);}
 },
 IfStatement(p){const test=gen(p.node.test,{compact:true}).code;if(test==='preview'||test.startsWith('preview&&')){p.remove();changes.push('preview branch');}},
 ConditionalExpression(p){if(p.node.test.name==='preview'){p.replaceWith(p.node.alternate);changes.push('preview conditional');}},
 FunctionDeclaration(p){if(p.node.id.name==='ChatContent'){p.node.params[0].properties=p.node.params[0].properties.filter(prop=>prop.key.name!=='scenario');p.node.body.body.splice(1,0,...parser.parse('const sending=React.useRef(false);').program.body);}},
 JSXAttribute(p){if(p.node.name.name==='scenario')p.remove();else if(p.node.name.name==='onRetry'&&p.node.value.expression.name==='retry')p.node.value.expression=parser.parseExpression('()=>retry(message)');},
 JSXExpressionContainer(p){if(p.node.expression.type==='LogicalExpression'&&p.node.expression.left.type==='UnaryExpression'&&p.node.expression.left.argument.name==='preview')p.replaceWith(p.node.expression.right);}
});
// A new route gets isolated draft/failure state; backend message contracts stay unchanged.
traverse(tree,{JSXOpeningElement(p){if(p.node.name.name==='ChatContent')p.node.attributes.push(parser.parseExpression('(<X key={chat.type+chat.id}/>)',{plugins:['jsx']}).openingElement.attributes[0]);}});
if(visualHash(tree)!==visualBefore)throw Error('Accepted header/composer/styles changed');
let production=gen(tree,{comments:false}).code;
production=production.replace("pending ? 'Отправляем…' : 'Не отправлено · Повторить'","pending ? 'Отправляем…' : message.error ? message.error + ' · Повторить' : 'Не отправлено · Повторить'");
if(/__CHAT_CONCEPT|postMessage|demo-|error-example|event-announcement|\bscenario\b|\bpersonal\b|\beventMessages\b|\bpreview\b|\bnotice\b|setAdded|setFailure\(/.test(production))throw Error('Demo code remains');
fs.writeFileSync(path.join(__dirname,'ChatScreen.production.js'),production+'\n');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const compiled=babel.transformSync(production,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]]}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=gen(factory,{compact:true,comments:false}).code;
const before=modules(base),old=before.get(1579),deps=old.deps.elements.map(x=>x.value).concat(accepted.addedExistingDependencies);
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end,old.deps.start)+JSON.stringify(deps)+base.slice(old.deps.end),after=modules(built),changed=[],changedDeps=[];
if(before.size!==after.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1579'||changedDeps.join(',')!=='1579')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const receipt={date:new Date().toISOString(),task:'UI-DM-20261018',acceptedRevision:'r2',baseCommit:accepted.baseCommit,baseBundle:accepted.baseBundle,baseSha256:sha(base),sourceSha256:sha(source),sha256:sha(built),candidateBundle:'maintenance/chat-20261018/candidate.js',acceptedHeaderComposerStylesUnchanged:true,visualHash:visualBefore,changedModules:changed,changedDependencyMaps:changedDeps,untouchedModules:before.size-1,addedExistingDependencies:accepted.addedExistingDependencies,fixtureCodeAbsent:true,fixtureMessagesOrWrites:0,backend1493:'byte-exact; original read/send contracts',failureHandling:'local queue for actual hook errors, retry calls same hook, ref guard prevents parallel sends; route key isolates draft',states:'loader/disabled templates retained as inactive UI code because original hook has no state contract; no fabricated online/read flags',publication:'PENDING',commit:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({sha256:receipt.sha256,changed,changedDeps,fixtureCodeAbsent:true}));
