const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '../..');
const deps = createRequire(path.resolve(root, '../../app/package.json'));
const parser = deps('@babel/parser'), babel = deps('@babel/core');
const traverse = deps('@babel/traverse').default, generate = deps('@babel/generator').default;
const t = deps('@babel/types');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const baseBundle = '_expo/static/js/web/index-f1aaf73ec226919a3ea33ef39cdd10e4.js';
const original = fs.readFileSync(path.join(root, baseBundle), 'utf8');
if (hash(original) !== '62a5cf98d386bbe2c4395654bdee79fe900d35ef85c6a96e23e3c71e0b0fb828') throw Error('Published base differs');
function modules(code) {
  return new Map(parser.parse(code).program.body.flatMap(n => {
    const c=n.expression;
    return c?.callee?.name==='__d' ? [[c.arguments[1].value,{factory:c.arguments[0],deps:c.arguments[2]}]] : [];
  }));
}
const before=modules(original);
const source=parser.parse(fs.readFileSync(path.join(__dirname,'event-detail.js'),'utf8'));
const factory=source.program.body[0].expression.right;
const compiled=babel.transformSync(fs.readFileSync(path.join(__dirname,'poster-like.tsx'),'utf8'),{
  filename:'poster-like.tsx',babelrc:false,configFile:false,
  presets:[[deps.resolve('@babel/preset-typescript'),{allExtensions:true,isTSX:true}]],
  plugins:[[deps.resolve('@babel/plugin-transform-react-jsx'),{runtime:'automatic'}]],
}).code;
const helper=parser.parse(compiled,{sourceType:'module'});
const bindings={
  'react:useState':'t.useState',
  'react-native:Pressable':'o.default',
  '../components/Icon:Icon':'w.Icon',
  '../constants/design2026:DesignColors':'U.DesignColors',
  'react/jsx-runtime:jsx':'O.jsx',
};
traverse(helper,{
  ImportDeclaration(p){
    for(const spec of p.node.specifiers){
      const key=p.node.source.value+':'+spec.imported.name;
      if(!bindings[key])throw Error('Unmapped dependency '+key);
      const binding=p.scope.getBinding(spec.local.name);
      for(const ref of binding.referencePaths)ref.replaceWith(parser.parseExpression(bindings[key]));
    }
    p.remove();
  },
  ExportDefaultDeclaration(p){p.replaceWith(p.node.declaration);},
});
if(helper.program.body.length!==1||helper.program.body[0].id?.name!=='PosterLike')throw Error('Unexpected helper');
factory.body.body.push(...helper.program.body);
const old=before.get(1539).factory;
const replacement=generate(factory,{compact:true,comments:false}).code;
const built=original.slice(0,old.start)+replacement+original.slice(old.end);
const after=modules(built),changed=[];
if(after.size!==before.size)throw Error('Module inventory differs');
for(const [id,n] of before){
  const next=after.get(id);
  if(original.slice(n.deps.start,n.deps.end)!==built.slice(next.deps.start,next.deps.end))throw Error('Dependency map differs '+id);
  if(hash(original.slice(n.factory.start,n.factory.end))!==hash(built.slice(next.factory.start,next.factory.end)))changed.push(id);
}
if(changed.join(',')!=='1539')throw Error('Unexpected changed modules '+changed);
const bundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(built).digest('hex')+'.js';
fs.writeFileSync(path.join(root,bundle),built);
for(const name of ['profile/index.html','404.html']){
  const p=path.join(root,name),s=fs.readFileSync(p,'utf8');
  const out=s.replace(/\/_expo\/static\/js\/web\/index-[a-f0-9]+\.js/g,'/'+bundle);
  if(!out.includes(bundle))throw Error('Entry missing');fs.writeFileSync(p,out);
}
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify({
  baseCommit:'e96b88243852c8c969b5d7f039675be0c83164ed',baseBundle,baseSha256:hash(original),
  bundle,sha256:hash(built),changedModules:changed,untouchedModules:after.size-changed.length,
  unchangedDependencyMaps:true,localOnly:true,retainedOldBundle:true,
  sourceHashes:Object.fromEntries(['event-detail.js','poster-like.tsx','build.cjs'].map(f=>[f,hash(fs.readFileSync(path.join(__dirname,f)))])),
},null,2)+'\n');
console.log(JSON.stringify({bundle,changed,untouchedModules:after.size-changed.length}));
