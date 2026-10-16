const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const deps = createRequire(path.resolve(root, '../../app/package.json'));
const babel = deps('@babel/core');
const parser = deps('@babel/parser');
const traverse = deps('@babel/traverse').default;
const generate = deps('@babel/generator').default;
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const baseName = 'index-598bfabd144a8f76d8e41265ad372d14.js';
const basePath = '_expo/static/js/web/' + baseName;
const original = fs.readFileSync(path.join(root, basePath), 'utf8');
if (hash(original) !== 'f3f1e950c58f96dc9e42092913daaccde30f7909f62d1a15015117c2fbf9d405') throw Error('Published base bundle differs');
function modules(code) {
  return new Map(parser.parse(code).program.body.flatMap(n => {
    const c = n.expression;
    return c?.callee?.name === '__d' ? [[c.arguments[1].value, c.arguments[0]]] : [];
  }));
}
const originals = modules(original);
function compile(files, bindings) {
  const source = files.map(file => fs.readFileSync(path.join(__dirname,file),'utf8')).join('\n') + '\nconst detailCSS=' + JSON.stringify(fs.readFileSync(path.join(__dirname,'notification-detail.css'),'utf8')) + ';';
  const transformed = babel.transformSync(source, {
    filename: 'NotificationsScreen.tsx', babelrc: false, configFile: false,
    presets: [[deps.resolve('@babel/preset-typescript'), { allExtensions: true, isTSX: true }]],
    plugins: [[deps.resolve('@babel/plugin-transform-react-jsx'), { runtime: 'classic' }], deps.resolve('@babel/plugin-transform-modules-commonjs')],
  });
  const ast = parser.parse(transformed.code);
  traverse(ast, { CallExpression(p) {
    const n = p.node;
    if (n.callee.name !== 'require') return;
    const key = n.arguments[0].value;
    if (!bindings[key]) throw Error('Unmapped dependency ' + key);
    p.replaceWith(parser.parseExpression(bindings[key]));
  }});
  const code = generate(ast, { compact: true, comments: false }).code;
  return `function(g,r,i,a,m,_e,d){const exports=_e;function nativeDefault(v){return v&&v.__esModule?v.default:v;}${code}}`;
}
function dataFactory() {
  const node = originals.get(1478), old = original.slice(node.start,node.end);
  if (!old.includes('e.serverRowToNotif=y') || !old.includes('useNotifications=function')) throw Error('Published data exports differ');
  const prefix='const selected=', ast=parser.parse(prefix+old), edits=[];
  traverse(ast,{
    AssignmentExpression(p){const n=p.node;if(n.left.type==='MemberExpression'&&n.left.property.name==='useNotifications')
      edits.push([n.right.start-prefix.length,n.right.end-prefix.length,'function(){return gmUseNotificationFeed({React:t,useFocusEffect:a.useFocusEffect,useAuth:l.useAuth,useAchievements:u.useAchievements,useMyTickets:c.useMyTickets,fetchServerNotifs:f,supabase:n.supabase})}']);},
    FunctionDeclaration(p){const n=p.node;if(n.id.name==='y')edits.push([n.id.start-prefix.length,n.id.end-prefix.length,'gmBaseServerRowToNotif']);
      if(n.id.name==='f'){const fail=n.body.body.find(x=>x.type==='IfStatement'&&generate(x.test,{compact:true}).code==='o||!a');
        if(!fail)throw Error('Server read error branch differs');
        edits.push([fail.consequent.start-prefix.length,fail.consequent.end-prefix.length,'{throw o||new Error("notifications_read_failed")}']);}},
  });
  if(edits.length!==3)throw Error('Data patch count differs: '+edits.length);
  let result=old;for(const [start,end,code] of edits.sort((a,b)=>b[0]-a[0]))result=result.slice(0,start)+code+result.slice(end);
  const helpers=parser.parse(fs.readFileSync(path.join(__dirname,'notification-data.js'),'utf8'),{sourceType:'module'}).program.body.map(n=>{
    if(n.type!=='ExportNamedDeclaration'||n.declaration.type!=='FunctionDeclaration')throw Error('Unexpected data helper');
    return generate(n.declaration,{compact:true,comments:false}).code;
  }).join('');
  return result.slice(0,-1)+helpers+'function y(row){return gmNotificationMetadata(row,gmBaseServerRowToNotif(row))}'+result.slice(-1);
}
function linkingFactory() {
  const node=originals.get(1033), old=original.slice(node.start,node.end), prefix='const selected=';
  const route=parser.parse(fs.readFileSync(path.join(__dirname,'linking-route.js'),'utf8'),{sourceType:'module'}).program.body[0].declaration.declarations[0].init.value;
  const ast=parser.parse(prefix+old);let at=null;
  traverse(ast,{ObjectExpression(p){const keys=p.node.properties.map(x=>x.key?.name);
    if(keys.includes('Tabs')&&keys.includes('EventDetail')){if(at!==null)throw Error('Ambiguous linking map');at=p.node.start-prefix.length+1;}}});
  if(at===null)throw Error('Published linking map differs');
  return old.slice(0,at)+'Notifications:'+JSON.stringify(route)+','+old.slice(at);
}
const notificationMap = {
  react:'r(d[0])',
  'react-native':'({ScrollView:nativeDefault(r(d[4])), StyleSheet:nativeDefault(r(d[5])), View:nativeDefault(r(d[6]))})',
  'react-native-safe-area-context':'r(d[7])',
  './ScreenHeader':'r(d[11])', './Icon':'r(d[13])', './notifications':'r(d[14])',
  './notifStore':'r(d[16])', './useGoBack':'r(d[18])', './layout':'r(d[19])',
};
const replacements = [[1033, linkingFactory()], [1478, dataFactory()], [1577, compile(['NotificationsScreen.tsx','notification-detail.tsx'],notificationMap)]];
let built = original;
for (const [id, replacement] of replacements.sort((a,b) => originals.get(b[0]).start - originals.get(a[0]).start)) {
  const n = originals.get(id);
  built = built.slice(0,n.start) + replacement + built.slice(n.end);
}
const after = modules(built);
if (after.size !== originals.size) throw Error('Module inventory changed');
const changed = [];
for (const [id,n] of originals) {
  const other = after.get(id);
  if (hash(original.slice(n.start,n.end)) !== hash(built.slice(other.start,other.end))) changed.push(id);
}
if (changed.join(',') !== '1033,1478,1577') throw Error('Unexpected module change: ' + changed);
const name = 'index-' + crypto.createHash('md5').update(built).digest('hex') + '.js';
const bundlePath = '_expo/static/js/web/' + name;
fs.writeFileSync(path.join(root,bundlePath), built);
for (const html of ['profile/index.html', '404.html']) {
  const file = path.join(root,html), content = fs.readFileSync(file,'utf8');
  const result = content.replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g, '/' + bundlePath);
  if (!result.includes(bundlePath)) throw Error('HTML entry missing');
  fs.writeFileSync(file,result);
}
fs.writeFileSync(path.join(__dirname,'BUILD.json'), JSON.stringify({
  baseCommit:'a7088272bf3e8779a9e5c33fd95dc5d52b7f3e5b',baseBundle:basePath,
  baseSha256:hash(original),bundle:bundlePath,sha256:hash(built),changedModules:changed,
  untouchedModules:after.size-changed.length,retainedOldBundle:true,
  sourceHashes:Object.fromEntries(['NotificationsScreen.tsx','notification-detail.tsx','notification-detail.css','notification-data.js','linking-route.js','build.cjs'].map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))])),
},null,2)+'\n');
console.log(JSON.stringify({bundle:bundlePath,changed,untouchedModules:after.size-3}));
