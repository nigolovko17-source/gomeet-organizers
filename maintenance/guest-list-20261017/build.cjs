const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..'),deps=createRequire(path.resolve(root,'../../app/package.json'));
const parser=deps('@babel/parser'),traverse=deps('@babel/traverse').default,generate=deps('@babel/generator').default;
const babel=deps('@babel/core'),t=deps('@babel/types');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const compact=n=>generate(n,{compact:true,comments:false}).code;
const expr=s=>parser.parseExpression(s);
const baseBundle='_expo/static/js/web/index-2781ead8cadad3db0811270a50d5317e.js';
const base=fs.readFileSync(path.join(root,baseBundle),'utf8');
if(hash(base)!=='273f0dc0ba26e7b5a9b8878ae50877f7ada062a643969e8d569b5d38ad6182e6')throw Error('Poster base differs');
function modules(code){return new Map(parser.parse(code).program.body.flatMap(n=>{
  const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];
}));}
const before=modules(base);
const common={
 'react/jsx-runtime:jsx':'O.jsx','react/jsx-runtime:jsxs':'O.jsxs','react/jsx-runtime:Fragment':'O.Fragment',
 './avatar-stack:default':'GuestAvatars','./GoingView:default':'GoingView',
};
const posterBindings={...common,
 'react-native:View':'s.default','../components/Avatar:default':'z.default',
 '../components/DesignText:default':'D.default','../constants/design2026:DesignColors':'U.DesignColors',
 '../data/plural:personWord':'H.personWord',
};
const goingBindings={...common,
 'react/jsx-runtime:jsx':'r(d[19]).jsx','react/jsx-runtime:jsxs':'r(d[19]).jsxs','react/jsx-runtime:Fragment':'r(d[19]).Fragment',
 '@tanstack/react-query:useQuery':'r(d[0]).useQuery',
 'react-native-safe-area-context:useSafeAreaInsets':'r(d[1]).useSafeAreaInsets',
 '../constants/AuthProvider:useAuth':'r(d[2]).useAuth',
 '../lib/supabase:supabase':'r(d[3]).supabase','../lib/supabase:withTimeout':'r(d[3]).withTimeout',
 '../data/socialProof:fetchSocialProof':'r(d[4]).fetchSocialProof',
 '../components/DesignButton:default':'nativeDefault(r(d[5]))',
 '../components/DesignLoadError:default':'nativeDefault(r(d[6]))',
 'react-native:ActivityIndicator':'nativeDefault(r(d[7]))','react-native:ScrollView':'nativeDefault(r(d[8]))',
 'react-native:StyleSheet':'nativeDefault(r(d[9]))','react-native:View':'nativeDefault(r(d[10]))',
 '../components/DesignText:default':'nativeDefault(r(d[11]))','../components/ScreenHeader:default':'nativeDefault(r(d[12]))',
 '../components/Avatar:default':'nativeDefault(r(d[13]))','../data/hooks:useEvent':'r(d[14]).useEvent',
 '../data/plural:personWord':'r(d[15]).personWord','../constants/design2026:DesignColors':'r(d[16]).DesignColors',
 '../navigation/useGoBack:useGoBack':'r(d[17]).useGoBack',
 '../constants/layout:useColumnContent':'r(d[18]).useColumnContent','../constants/layout:columnContent':'r(d[18]).columnContent',
};
function compile(file,bindings){
 const code=babel.transformSync(fs.readFileSync(path.join(__dirname,file),'utf8'),{
  filename:file,babelrc:false,configFile:false,
  presets:[[deps.resolve('@babel/preset-typescript'),{allExtensions:true,isTSX:true}]],
  plugins:[[deps.resolve('@babel/plugin-transform-react-jsx'),{runtime:'automatic'}]],
 }).code;
 const ast=parser.parse(code,{sourceType:'module'});
 traverse(ast,{
  ImportDeclaration(p){for(const spec of p.node.specifiers){
   const key=p.node.source.value+':'+(spec.imported?.name??'default');
   if(!bindings[key])throw Error('Unmapped import '+key);
   for(const ref of p.scope.getBinding(spec.local.name).referencePaths)ref.replaceWith(expr(bindings[key]));
  }p.remove();},
  ExportDefaultDeclaration(p){p.replaceWith(p.node.declaration);},
  ExportNamedDeclaration(p){p.replaceWith(p.node.declaration);},
 });return ast.program.body;
}
function posterFactory(preview){
 const f=before.get(1539).factory;
 const ast=parser.parse('module.exports='+base.slice(f.start,f.end)+';');
 const factory=ast.program.body[0].expression.right;
 let count=0;
 traverse(ast,{ObjectExpression(p){
  const style=p.node.properties.find(x=>x.key?.name==='style');
  if(style&&compact(style.value).includes('[Z.people,')){
   const children=p.node.properties.find(x=>x.key?.name==='children').value.elements;
   children[0]=expr('(0,O.jsx)(s.default,{style:Z.flex,children:(0,O.jsx)(PosterGuests,{event:Q'+(preview?',placeholderAvatars:true':'')+'})})');count++;
  }
 }});
 if(count!==1)throw Error('People anchor differs');
 factory.body.body.push(...compile('avatar-stack.tsx',posterBindings),...compile('poster-guests.tsx',posterBindings));
 if(preview){
  factory.body.body.push(...compile('preview-data.ts',{}));
  traverse(ast,{
   VariableDeclarator(p){if(p.node.id.type==='ObjectPattern'&&p.node.id.properties.some(n=>n.value?.name==='Q')){
    p.node.init=t.callExpression(expr('(result)=>({...result,detail:result.detail?{...result.detail,...demoProof}:result.detail})'),[p.node.init]);
   }},
   ObjectExpression(p){const props=p.node.properties;const icon=props.find(x=>x.key?.name==='icon');
    if(props.some(x=>x.key?.name==='detail')&&props.some(x=>x.key?.name==='loading')||icon?.value.value==='heart'){
     const action=props.find(x=>x.key?.name==='onPress');if(action)action.value=expr('()=>{}');
    }
   }
  });
 }
 return compact(factory);
}
function goingFactory(preview){
 const ast=parser.parse('function factory(g,r,_i,a,m,_e,d){"use strict";function nativeDefault(v){return v&&v.__esModule?v.default:v;}Object.defineProperty(_e,"__esModule",{value:true});}');
 const factory=ast.program.body[0];
 factory.body.body.push(...compile('avatar-stack.tsx',goingBindings),...compile('GoingView.tsx',goingBindings));
 if(preview)factory.body.body.push(...compile('preview-data.ts',{}),...compile('PreviewGoingScreen.tsx',goingBindings));
 else factory.body.body.push(...compile('GoingScreen.tsx',goingBindings));
 factory.body.body.push(parser.parse('_e.default='+(preview?'PreviewGoingScreen':'GoingScreen')+';').program.body[0]);
 factory.id=null;return compact(factory);
}
function linkingFactory(){
 const fn=before.get(1033).factory,old=base.slice(fn.start,fn.end);
 const ast=parser.parse('module.exports='+old+';');let at=null;
 traverse(ast,{ObjectExpression(p){const keys=p.node.properties.map(n=>n.key?.name);
  if(keys.includes('Tabs')&&keys.includes('EventDetail')){
   if(at!==null||keys.includes('Going'))throw Error('Linking differs');
   at=p.node.start-'module.exports='.length+1;
  }
 }});
 if(at===null)throw Error('Existing routes missing');
 return old.slice(0,at)+'Going:"Going",'+old.slice(at);
}
function build(preview){
 let built=base;const replacements=[[1033,linkingFactory()],[1539,posterFactory(preview)],[1603,goingFactory(preview)]];
 for(const [id,code] of replacements.sort((a,b)=>before.get(b[0]).factory.start-before.get(a[0]).factory.start)){
  const f=before.get(id).factory;built=built.slice(0,f.start)+code+built.slice(f.end);
 }
 const after=modules(built),changed=[];
 if(after.size!==before.size)throw Error('Module inventory differs');
 for(const [id,n] of before){const next=after.get(id);
  if(base.slice(n.deps.start,n.deps.end)!==built.slice(next.deps.start,next.deps.end))throw Error('Dependencies differ '+id);
  if(hash(base.slice(n.factory.start,n.factory.end))!==hash(built.slice(next.factory.start,next.factory.end)))changed.push(id);
 }
 if(changed.join(',')!=='1033,1539,1603')throw Error('Unexpected changed modules '+changed);
 if(!preview&&built.includes('DEMO_GUEST_01'))throw Error('Fixture leaked into candidate');
 return {built,changed,untouchedModules:after.size-changed.length};
}
const candidate=build(false),preview=process.argv.includes('--preview')?build(true):null;
const bundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(candidate.built).digest('hex')+'.js';
fs.writeFileSync(path.join(root,bundle),candidate.built);
if(preview)fs.writeFileSync(path.join(__dirname,'preview-only.js'),preview.built);
for(const name of ['profile/index.html','404.html']){
 const p=path.join(root,name),s=fs.readFileSync(p,'utf8');
 fs.writeFileSync(p,s.replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/'+bundle));
}
if(preview){
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');
const setup='<script>const demoParams=new URLSearchParams(location.search);window.__GOMEET_GUEST_DEMO_STATE__=demoParams.get("state")||"four";history.replaceState(null,"",demoParams.get("view")==="poster"?"/event/38cca4f8-59db-ad99-e7b3-21862fcd87c8":"/Going?eventId=38cca4f8-59db-ad99-e7b3-21862fcd87c8");</script>';
const previewRevision=hash(preview.built).slice(0,12);
fs.writeFileSync(path.join(__dirname,'preview-app.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace('/'+bundle,'/maintenance/guest-list-20261017/preview-only.js?rev='+previewRevision));
const viewerPath=path.join(__dirname,'index.html');
fs.writeFileSync(viewerPath,fs.readFileSync(viewerPath,'utf8').replace(/const previewBuild="[^"]*";/,'const previewBuild="'+previewRevision+'";').replace(/&amp;build=[a-z0-9]+/,'&amp;build='+previewRevision));
}
const sourceFiles=['avatar-stack.tsx','poster-guests.tsx','GoingView.tsx','GoingScreen.tsx','build.cjs'];
const receipt={publishedBaseCommit:'e96b88243852c8c969b5d7f039675be0c83164ed',baseLocalBundle:baseBundle,baseLocalSha256:hash(base),bundle,sha256:hash(candidate.built),changedModules:candidate.changed,untouchedModules:candidate.untouchedModules,unchangedDependencyMaps:true,localOnly:true,fixtureAbsentFromCandidate:true,sourceHashes:Object.fromEntries(sourceFiles.map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))])),preview:preview?{file:'maintenance/guest-list-20261017/preview-only.js',sha256:hash(preview.built),syntheticOnly:true,sourceHashes:Object.fromEntries(['preview-data.ts','PreviewGoingScreen.tsx'].map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))]))}:null};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({bundle,changed:receipt.changedModules,untouched:receipt.untouchedModules,fixtureAbsent:true}));
