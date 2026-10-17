const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),generate=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const accepted=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'),'utf8'));
const source=fs.readFileSync(path.join(__dirname,'UserProfileScreen.jsx'),'utf8');
if(sha(source)!==accepted.sourceSha256)throw Error('Accepted source changed');
const base=fs.readFileSync(path.join(root,accepted.baseBundle),'utf8');
if(sha(base)!==accepted.baseSha256)throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const tree=parser.parse(source,{plugins:['jsx']});
function visualHash(ast){const parts=[];traverse(ast,{
 LogicalExpression(p){if(p.node.left.name==='safetyAction')p.skip();},
 JSXOpeningElement(p){parts.push(generate(p.node,{compact:true,comments:false}).code);},
 JSXText(p){parts.push(p.node.value);},
 VariableDeclarator(p){if(p.node.id.name==='styles')parts.push(generate(p.node.init,{compact:true,comments:false}).code);}
});return sha(JSON.stringify(parts));}
const priorVisual=visualHash(tree),changes=[];
const replacements={data:'query.data',profileUrl:'userProfileLink(userId)',loading:'query.isPending',failed:'query.isError',following:'data?.isFollowing ?? false',earned:'data?.earned ?? []',featured:'data?.featured ?? []',retry:'()=>refetch()'};
traverse(tree,{
 VariableDeclarator(p){const name=p.node.id.name;
  if(['preview','notify','scenario'].includes(name)||(p.node.id.type==='ArrayPattern'&&p.node.id.elements[0]?.name==='demoFollowing')){changes.push(name||'demoFollowing');p.remove();}
  else if(Object.hasOwn(replacements,name)){p.node.init=parser.parseExpression(replacements[name]);changes.push(name);}
 },
 IfStatement(p){if(p.node.test.name==='preview'){p.remove();changes.push('preview branch');}},
 LogicalExpression(p){if(p.node.left.type==='UnaryExpression'&&p.node.left.argument.name==='viewerId'&&p.node.right.type==='BinaryExpression'&&p.node.right.left.name==='scenario'){p.replaceWith(p.node.left);changes.push('auth');}},
 ExpressionStatement(p){if(p.node.expression.type==='CallExpression'&&p.node.expression.callee.name==='setDemoFollowing'){p.remove();changes.push('demo effect');}}
});
if(priorVisual!==visualHash(tree))throw Error('Accepted profile/menu/share JSX or styles changed during preview removal');
const imports=parser.parse('const ReportSheet=unwrap(r(d[29])), {blockUser}=r(d[30]);').program.body;
const fn=tree.program.body[0].expression.right;fn.body.body.splice(12,0,...imports);
const screen=fn.body.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name==='UserProfileScreen');
screen.body.body.splice(7,0,...parser.parse(`const [blockBusy,setBlockBusy]=React.useState(false),[blockError,setBlockError]=React.useState('');
React.useEffect(()=>setBlockError(''),[safetyAction,userId]);
const confirmBlock=async()=>{
 if(blockBusy)return;
 setBlockBusy(true);setBlockError('');
 try{
  const ok=await blockUser(userId);
  if(ok){setSafetyAction(null);back();}
  else setBlockError('Не вышло заблокировать. Проверьте связь и попробуйте ещё раз.');
 }catch{setBlockError('Не вышло заблокировать. Проверьте связь и попробуйте ещё раз.');}
 finally{setBlockBusy(false);}
};`).program.body);
const safety=parser.parseExpression(`safetyAction && <>
 {safetyAction==='report'&&<ReportSheet visible onClose={()=>setSafetyAction(null)} target="profile" targetId={userId} personId={userId} personName={data.profile.name} onBlocked={back}/>}
 {safetyAction==='block'&&<Sheet design="2026" title="Блокировка" onClose={()=>{if(!blockBusy)setSafetyAction(null);}}>
  <View style={styles.safetyBody}>
   <Text style={styles.stateTitle}>Заблокировать {data.profile.name}?</Text>
   <Text style={styles.stateText}>Вы перестанете видеть сообщения друг друга и писать друг другу, подписка между вами снимется. Его события останутся доступными по прямой ссылке, а уже купленный билет продолжит работать.</Text>
   {!!blockError&&<Text accessibilityRole="alert" style={styles.stateText}>{blockError}</Text>}
   <Button label="Заблокировать" variant="secondary" loading={blockBusy} onPress={confirmBlock}/>
   <Button label="Отмена" variant="secondary" disabled={blockBusy} onPress={()=>setSafetyAction(null)}/>
  </View>
 </Sheet>}
</>`,{plugins:['jsx']});
let safetyCount=0;
traverse(tree,{LogicalExpression(p){if(p.node.left.name==='safetyAction'){p.replaceWith(safety);p.skip();safetyCount++;}}});
if(safetyCount!==1||priorVisual!==visualHash(tree))throw Error('Safety replacement affected accepted visible profile');
const input=generate(tree,{comments:false}).code;
if(/__USER_PROFILE_CONCEPT|postMessage|demoFollowing|setDemoFollowing|\bpreview\b|\bscenario\b|В этом концепте|только в макете/.test(input))throw Error('Preview code remains');
fs.writeFileSync(path.join(__dirname,'UserProfileScreen.production.js'),input+'\n');
const compiled=babel.transformSync(input,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]],compact:false}).code;
const factory=parser.parse(compiled).program.body[0].expression.right,code=generate(factory,{compact:true,comments:false}).code;
const before=modules(base),old=before.get(1584),dependencies=[...old.deps.elements.map(n=>n.value),1422,1495,1541,1325];
const built=base.slice(0,old.factory.start)+code+base.slice(old.factory.end,old.deps.start)+JSON.stringify(dependencies)+base.slice(old.deps.end);
const after=modules(built),changed=[],changedDeps=[];
if(after.size!==before.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1584'||changedDeps.join(',')!=='1584')throw Error('Scope differs');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),setup='<script>history.replaceState(null,"","/people/91233d07-b1e1-4c04-9075-a8fce7487aa9");</script>';
fs.writeFileSync(path.join(__dirname,'release-preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/user-profile-20261018/candidate.js?rev='+sha(built).slice(0,12)));
const receipt={date:new Date().toISOString(),task:'UI-USER-PROFILE-20261018',acceptedRevision:'r2',baseCommit:accepted.baseCommit,baseBundle:accepted.baseBundle,baseSha256:sha(base),sourceSha256:sha(source),acceptedPreviewSha256:accepted.sha256,candidateBundle:'maintenance/user-profile-20261018/candidate.js',sha256:sha(built),acceptedProfileMenuShareJSXAndStylesUnchanged:true,visualHash:priorVisual,previewAbsent:true,changes,changedModules:changed,changedDependencyMaps:changedDeps,addedDependencies:[1422,1495,1541,1325],untouchedModules:before.size-1,messages:'original Chat dm navigation; no sends in verification',follow:'original follow/unfollow and query cache',safety:'existing ReportSheet1541; explicit block confirmation calls existing blockUser1325; actual writes not tested',publication:'PENDING',commit:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'RELEASE-BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt));
