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
const baseName = 'index-4cf313c0640998c32c1c69a06d3571c6.js';
const basePath = '_expo/static/js/web/' + baseName;
const original = fs.readFileSync(path.join(root, basePath), 'utf8');
if (hash(original) !== '36bdd663481becd189c6775581c113a48a9880cacf46027d2b091131eae055f9') throw Error('Published base bundle differs');
function modules(code) {
  return new Map(parser.parse(code).program.body.flatMap(n => {
    const c = n.expression;
    return c?.callee?.name === '__d' ? [[c.arguments[1].value, c.arguments[0]]] : [];
  }));
}
const originals = modules(original);
const uiMap = {
  react: 'r(d[0])',
  'react-native': '({Modal: nativeDefault(r(d[1])), View: nativeDefault(r(d[2])), ScrollView: nativeDefault(r(d[3])), Pressable: nativeDefault(r(d[4])), StyleSheet: nativeDefault(r(d[5]))})',
  './DesignText': 'r(d[7])', './DesignButton': 'r(d[8])', './Sheet': 'r(d[9])',
  './filters': 'r(d[10])', '../data/plural': 'r(d[11])', '../constants/design2026': 'r(d[12])',
};
function compile(file, bindings) {
  const transformed = babel.transformSync(fs.readFileSync(path.join(__dirname, file), 'utf8'), {
    filename: file, babelrc: false, configFile: false,
    presets: [[deps.resolve('@babel/preset-typescript'), { allExtensions: true, isTSX: file.endsWith('.tsx') }]],
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
function disableStreak() {
  const node = originals.get(1478);
  const oldFactory = original.slice(node.start, node.end);
  const predicate = node.body.body.find(n => n.type === 'FunctionDeclaration' && n.id.name === 'k');
  if (!predicate || !oldFactory.includes('streakAtRisk=k')) throw Error('Streak predicate export differs');
  const policy = parser.parse(fs.readFileSync(path.join(__dirname,'streak-policy.js'),'utf8'), {sourceType:'module'}).program.body[0].declaration;
  return oldFactory.slice(0,predicate.body.start-node.start) + generate(policy.body).code + oldFactory.slice(predicate.body.end-node.start);
}
const notificationMap = {
  react:'r(d[0])',
  'react-native':'({ScrollView:nativeDefault(r(d[4])), StyleSheet:nativeDefault(r(d[5])), View:nativeDefault(r(d[6]))})',
  'react-native-safe-area-context':'r(d[7])',
  './ScreenHeader':'r(d[11])', './Icon':'r(d[13])', './notifications':'r(d[14])',
  './notifStore':'r(d[16])', './useGoBack':'r(d[18])', './layout':'r(d[19])',
};
const replacements = [
  [1421, compile('FilterSheet.tsx', uiMap)],
  [1477, compile('filters.ts', { './format': 'r(d[0])' })],
  [1478, disableStreak()],
  [1577, compile('NotificationsScreen.tsx', notificationMap)],
];
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
if (changed.join(',') !== '1421,1477,1478,1577') throw Error('Unexpected module change: ' + changed);
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
  baseCommit:'26cea873cb321020c9558068f037a867162171e9',baseBundle:basePath,
  baseSha256:hash(original),bundle:bundlePath,sha256:hash(built),changedModules:changed,
  untouchedModules:after.size-changed.length,retainedOldBundle:true,
  sourceHashes:Object.fromEntries(['FilterSheet.tsx','filters.ts','NotificationsScreen.tsx','streak-policy.js','build.cjs'].map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))])),
},null,2)+'\n');
console.log(JSON.stringify({bundle:bundlePath,changed,untouchedModules:after.size-4}));
