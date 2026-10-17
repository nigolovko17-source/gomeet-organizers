const fs=require('fs'),path=require('path'),crypto=require('crypto'),{createRequire}=require('module');
const root=path.resolve(__dirname,'../..'),req=createRequire(path.resolve(root,'../../app/package.json'));
const parser=req('@babel/parser'),gen=req('@babel/generator').default,babel=req('@babel/core'),traverse=req('@babel/traverse').default;
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const baseFile='_expo/static/js/web/index-3f184a8d1d715491d9c16baa5b039059.js',base=fs.readFileSync(path.join(root,baseFile),'utf8');
if(sha(base)!=='0cf046d3bf7b7c7dd4b1d7775026ce5b6f92b2913513faba6f86674b9d4ad34a')throw Error('Published base changed');
function modules(s){return new Map(parser.parse(s).program.body.flatMap(n=>{const c=n.expression;return c?.callee?.name==='__d'?[[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]]:[];}));}
const before=modules(base),sourceFiles={1487:'MessagesScreen.jsx',1493:'ChatHooks.js'},replacements=[],sourceHashes={};
for(const[id,file]of Object.entries(sourceFiles)){
 const source=fs.readFileSync(path.join(__dirname,file),'utf8'),compiled=babel.transformSync(source,{babelrc:false,configFile:false,plugins:[[req('@babel/plugin-transform-react-jsx'),{runtime:'classic'}]]}).code;
 const factory=parser.parse(compiled).program.body[0].expression.right;
 replacements.push({start:before.get(+id).factory.start,end:before.get(+id).factory.end,code:gen(factory,{compact:true,comments:false}).code});sourceHashes[file]=sha(source);
}
let built=base;for(const item of replacements.sort((a,b)=>b.start-a.start))built=built.slice(0,item.start)+item.code+built.slice(item.end);
const after=modules(built),changed=[],changedDeps=[];if(before.size!==after.size)throw Error('Module count changed');
for(const[id,x]of before){const y=after.get(id);if(sha(base.slice(x.factory.start,x.factory.end))!==sha(built.slice(y.factory.start,y.factory.end)))changed.push(id);if(base.slice(x.deps.start,x.deps.end)!==built.slice(y.deps.start,y.deps.end))changedDeps.push(id);}
if(changed.join(',')!=='1487,1493'||changedDeps.length)throw Error('Scope differs');
const stylesOf=source=>{let out;traverse(parser.parse(source,{plugins:['jsx']}),{VariableDeclarator(p){if(p.node.id.name==='styles')out=gen(p.node.init,{compact:true,comments:false}).code;}});return out;};
const oldSource=fs.readFileSync(path.join(root,'maintenance/messages-20261018/MessagesScreen.production.js'),'utf8'),newSource=fs.readFileSync(path.join(__dirname,'MessagesScreen.jsx'),'utf8');
if(stylesOf(oldSource)!==stylesOf(newSource))throw Error('Styles changed');
if(/\buseFeed\b|\beventById\b/.test(newSource))throw Error('Feed lookup remains');
fs.writeFileSync(path.join(__dirname,'candidate.js'),built);
const entry=fs.readFileSync(path.join(root,'profile/index.html'),'utf8'),setup='<script>history.replaceState(null,"","/messages");</script>';
fs.writeFileSync(path.join(__dirname,'release-preview.html'),entry.replace('<div id="root"></div>','<div id="root"></div>'+setup).replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/maintenance/message-covers-20261018/candidate.js?rev='+sha(built).slice(0,12)));
const receipt={date:new Date().toISOString(),task:'UI-MESSAGE-COVERS-20261018',baseCommit:'17490225dba9afc996f31208a670cadcc00c0e5b',baseBundle:baseFile,baseSha256:sha(base),candidateBundle:'maintenance/message-covers-20261018/candidate.js',sha256:sha(built),sourceHashes,changedModules:changed,changedDependencyMaps:changedDeps,untouchedModules:before.size-2,stylesUnchanged:true,queryChanges:'no new requests; imageUri retained from existing fetchEventsByIds; useFeed removed from Messages',chatDetails1579Unchanged:true,publication:'PENDING'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
