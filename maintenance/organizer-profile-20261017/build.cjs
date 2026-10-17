const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),deps=createRequire(path.resolve(root,'../../app/package.json'));
const parser=deps('@babel/parser'),traverse=deps('@babel/traverse').default,generate=deps('@babel/generator').default,t=deps('@babel/types');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),code=n=>generate(n,{compact:true,comments:false}).code,expr=s=>parser.parseExpression(s);
const baseFile='_expo/static/js/web/index-45de94030c2598305a570ed785268fa4.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='cbbb4199e60cdc86cd63bf985fe204716c5b5de7c18a6da6a3af12c6aac24fd5')throw Error('Published base differs');
function modules(source){return new Map(parser.parse(source).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),original=before.get(1623);
function setProp(obj,name,value){const prop=obj.properties.find(x=>x.key?.name===name);if(prop)prop.value=expr(value);else obj.properties.push(t.objectProperty(t.identifier(name),expr(value)));}
function build(preview){
 const ast=parser.parse(fs.readFileSync(path.join(__dirname,'OrganizerProfileScreen.js'),'utf8')),factory=ast.program.body[0].expression.right;
 if(preview){
  let followCount=0;
  traverse(ast,{
   FunctionDeclaration(p){if(p.node.id?.name==='F')p.node.body.body.unshift(...parser.parse('const [demoFollowing,setDemoFollowing]=(0,t.useState)(null);').program.body);},
   VariableDeclarator(p){
    if(p.node.id.type==='ObjectPattern'&&p.node.id.properties.some(x=>x.key?.name==='following'))p.node.id.properties.find(x=>x.key?.name==='following').value=t.identifier('serverFollowing');
    if(p.node.id.name==='ge')p.parentPath.insertAfter(parser.parse('const U=demoFollowing??serverFollowing;').program.body[0]);
    if(p.node.id.name==='V')p.node.init=t.callExpression(expr('(result)=>window.__ORG_CONCEPT_STATE__==="empty"?{...result,data:{upcoming:[],past:[]},isPending:false,isError:false}:window.__ORG_CONCEPT_STATE__==="loading"?{...result,isPending:true,isError:false}:window.__ORG_CONCEPT_STATE__==="error"?{...result,isPending:false,isError:true}:result'),[p.node.init]);
    if(p.node.id.type==='ObjectPattern'&&p.node.id.properties.some(x=>x.key?.name==='org'))p.node.init=t.callExpression(expr('(result)=>window.__ORG_CONCEPT_STATE__==="unavailable"?{...result,org:null,loading:false}:result'),[p.node.init]);
    if(p.node.id.name==='ye')p.node.init=expr('async()=>{conceptNotice("Копирование ссылки показано в демонстрации.");re(false);de(false);}');
   },
   ObjectExpression(p){
    const props=p.node.properties,style=props.find(x=>x.key?.name==='style'),label=props.find(x=>x.key?.name==='accessibilityLabel'),buttonLabel=props.find(x=>x.key?.name==='label');
    if(style&&code(style.value)==='_.followButton'){setProp(p.node,'onPress','()=>{setDemoFollowing(!U);conceptNotice("Подписка изменена только в макете.");}');followCount++;}
    if(label?.value.value==='пожаловаться')setProp(p.node,'onPress','()=>{re(false);conceptNotice("В концепте жалоба не отправляется.");}');
    if(buttonLabel?.value.value==='Повторить')setProp(p.node,'onPress','()=>{if(window.__ORG_CONCEPT_STATE__==="error")window.parent.postMessage({type:"gomeet-organizer-retry"},location.origin);else V.refetch();}');
   },
  });
  if(followCount!==1)throw Error('Follow preview anchor differs');
  factory.body.body.push(...parser.parse('function conceptNotice(message){window.parent.postMessage({type:"gomeet-organizer-concept",message},location.origin);}').program.body);
 }
 const built=base.slice(0,original.factory.start)+code(factory)+base.slice(original.factory.end),after=modules(built),changed=[];
 if(after.size!==before.size)throw Error('Module count differs');
 for(const [id,old]of before){const next=after.get(id);if(base.slice(old.deps.start,old.deps.end)!==built.slice(next.deps.start,next.deps.end))throw Error('Dependencies changed '+id);if(sha(base.slice(old.factory.start,old.factory.end))!==sha(built.slice(next.factory.start,next.factory.end)))changed.push(id);}
 if(changed.join(',')!=='1623')throw Error('Scope differs '+changed);
 if(code(factory).includes('Chat')||code(factory).includes('написать сообщение'))throw Error('Organizer message entry remains');
 return {built,changed};
}
const candidate=build(false),preview=process.argv.includes('--preview')?build(true):null;
fs.writeFileSync(path.join(__dirname,'candidate.js'),candidate.built);
if(preview){
 fs.writeFileSync(path.join(__dirname,'concept.js'),preview.built);
 const rev=sha(preview.built).slice(0,12),entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');
 const setup='<script>const params=new URLSearchParams(location.search);window.__ORG_CONCEPT_STATE__=params.get("state")||"ready";history.replaceState(null,"","/organizers/58e61781-c012-56b6-a6d9-b20aa2a50344");</script>';
 fs.writeFileSync(path.join(__dirname,'preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/organizer-profile-20261017/concept.js?rev='+rev));
 const viewer=path.join(__dirname,'index.html');
 fs.writeFileSync(viewer,fs.readFileSync(viewer,'utf8').replace(/const previewRevision="[^"]*";/,'const previewRevision="'+rev+'";').replace(/&amp;build=[a-z0-9]+/,'&amp;build='+rev));
}
const receipt={date:new Date().toISOString(),revision:'r4',baseCommit:'d6d2f06861c306a28abb226b61e33f1e12f03239',baseBundle:baseFile,baseSha256:sha(base),candidateBundle:'maintenance/organizer-profile-20261017/candidate.js',sha256:sha(candidate.built),changedModules:candidate.changed,untouchedModules:before.size-1,unchangedDependencyMaps:true,sourceHashes:Object.fromEntries(['OrganizerProfileScreen.js','build.cjs','published-organizer.js'].map(file=>[file,sha(fs.readFileSync(path.join(__dirname,file)))])),preview:preview?{file:'maintenance/organizer-profile-20261017/concept.js',sha256:sha(preview.built),followSimulated:true,reportAndCopyIntercepted:true}:null,scope:'Original published layout retained; message button and Chat callback removed; follow is compact; share and menu remain 52px; sharing only in Share sheet; duplicate menu rows and QR helper caption removed',entryFilesUnchanged:true,environment:'local only',commit:'NOT RUN',publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({revision:'r4',changed:candidate.changed,untouched:before.size-1,dependenciesUnchanged:true,previewRevision:preview?sha(preview.built).slice(0,12):null}));
