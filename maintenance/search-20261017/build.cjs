const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../..');
const deps = createRequire(path.resolve(root, '../../app/package.json'));
const babel = deps('@babel/core'), parser = deps('@babel/parser');
const traverse = deps('@babel/traverse').default, generate = deps('@babel/generator').default;
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const baseBundle = '_expo/static/js/web/index-b872a31afaf359bc1e905b9ee4c2df80.js';
const original = fs.readFileSync(path.join(root, baseBundle), 'utf8');
if (hash(original) !== 'b07333d909eaca8be7c5b99f434f471c9a936fc44e8cdb9fdc8cb5f2ddabb6b1') throw Error('Published base differs');
function modules(code) {
  return new Map(parser.parse(code).program.body.flatMap(n => {
    const c=n.expression;
    return c?.callee?.name==='__d' ? [[c.arguments[1].value,c.arguments[0]]] : [];
  }));
}
const before=modules(original);
const bindings={
  react:'r(d[0])',
  'react-native':'({View:nativeDefault(r(d[1])),TextInput:nativeDefault(r(d[2])),Pressable:nativeDefault(r(d[3])),FlatList:nativeDefault(r(d[4])),ScrollView:nativeDefault(r(d[5])),StyleSheet:nativeDefault(r(d[6]))})',
  '@react-navigation/native':'r(d[7])',
  '../components/Screen':'r(d[8])', '../components/DesignText':'r(d[9])',
  '../constants/design2026':'r(d[10])', '../components/EventCard':'r(d[11])',
  '../components/EventImage':'r(d[12])', '../components/Skeleton':'r(d[13])',
  '../components/Icon':'r(d[14])', '../data/eventImages':'r(d[15])',
  '../data/hooks':'r(d[16])', '../data/search':'r(d[17])',
  '../constants/layout':'r(d[18])', '../constants/theme':'r(d[19])',
  '../navigation/useGoBack':'r(d[20])',
};
function compile() {
  const result=babel.transformSync(fs.readFileSync(path.join(__dirname,'SearchScreen.tsx'),'utf8'),{
    filename:'SearchScreen.tsx',babelrc:false,configFile:false,
    presets:[[deps.resolve('@babel/preset-typescript'),{allExtensions:true,isTSX:true}]],
    plugins:[[deps.resolve('@babel/plugin-transform-react-jsx'),{runtime:'classic'}],deps.resolve('@babel/plugin-transform-modules-commonjs')],
  });
  const ast=parser.parse(result.code);
  traverse(ast,{CallExpression(p){const n=p.node;if(n.callee.name!=='require')return;
    const key=n.arguments[0].value;if(!bindings[key])throw Error('Unmapped dependency '+key);
    p.replaceWith(parser.parseExpression(bindings[key]));
  }});
  return 'function(g,r,i,a,m,_e,d){const exports=_e;function nativeDefault(v){return v&&v.__esModule?v.default:v;}'+generate(ast,{compact:true,comments:false}).code+'}';
}
function linking() {
  const fn=before.get(1033), old=original.slice(fn.start,fn.end), prefix='const selected=';
  const ast=parser.parse(prefix+old);let at=null;
  traverse(ast,{ObjectExpression(p){const keys=p.node.properties.map(n=>n.key?.name);
    if(keys.includes('Tabs')&&keys.includes('EventDetail')){
      if(at!==null||keys.includes('Search'))throw Error('Linking differs');
      at=p.node.start-prefix.length+1;
    }
  }});
  if(at===null)throw Error('Linking map missing');
  return old.slice(0,at)+'Search:"Search",'+old.slice(at);
}
let built=original;
const replacements=[[1583,compile()],[1033,linking()]];
for(const [id,replacement] of replacements.sort((a,b)=>before.get(b[0]).start-before.get(a[0]).start)) {
  const n=before.get(id);built=built.slice(0,n.start)+replacement+built.slice(n.end);
}
const after=modules(built),changed=[];
if(after.size!==before.size)throw Error('Module inventory differs');
for(const [id,n] of before){const other=after.get(id);if(hash(original.slice(n.start,n.end))!==hash(built.slice(other.start,other.end)))changed.push(id)}
if(changed.join(',')!=='1033,1583')throw Error('Unexpected changed modules '+changed);
const bundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(built).digest('hex')+'.js';
fs.writeFileSync(path.join(root,bundle),built);
for(const name of ['profile/index.html','404.html']){
  const p=path.join(root,name),s=fs.readFileSync(p,'utf8');
  const out=s.replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/'+bundle);
  if(!out.includes(bundle))throw Error('Entry missing');fs.writeFileSync(p,out);
}
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify({
  baseCommit:'fa1ba0837bc1daf38c0fb40231dfa399db312deb',baseBundle,baseSha256:hash(original),
  bundle,sha256:hash(built),changedModules:changed,untouchedModules:after.size-changed.length,
  localOnly:true,retainedOldBundle:true,
  sourceHashes:Object.fromEntries(['SearchScreen.tsx','build.cjs'].map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))])),
},null,2)+'\n');
console.log(JSON.stringify({bundle,changed,untouchedModules:after.size-changed.length}));
