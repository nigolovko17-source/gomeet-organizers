const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),{createRequire}=require('module');
const req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json'),parser=req('@babel/parser');
const root=path.resolve(__dirname,'../..'),source='maintenance/organizer-summary-20261020/r8',baseFile='_expo/static/js/web/index-a8d417524b49e3e65aa64c5956dd4926.js';
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const base=fs.readFileSync(path.join(root,baseFile),'utf8');
const files=Object.fromEntries(['app.html','app.js','model.js','style.css','refinement.css'].map(n=>[n,fs.readFileSync(path.join(root,source,n),'utf8')]));
files['style.css']+='\n/* Host keeps the existing navigation. */\n#nav{display:none}main{padding-bottom:28px}\n';
assert(files['app.js'].includes("button('По событиям'"));assert(!files['app.js'].includes("button('До события'"));
const assetDir='maintenance/organizer-summary-publish-20261021/ui-'+sha(Object.entries(files).map(([n,s])=>n+s).join('')).slice(0,16);
fs.mkdirSync(path.join(root,assetDir),{recursive:true});
for(const[n,s]of Object.entries(files)){if(n.endsWith('.js'))parser.parse(s);fs.writeFileSync(path.join(root,assetDir,n),s)}
const defs=s=>new Map(parser.parse(s).program.body.filter(n=>n.expression?.callee?.name==='__d').map(n=>[n.expression.arguments[1].value,n]));
const before=defs(base),old=before.get(1339),oldCode=base.slice(old.start,old.end),oldAsset='/maintenance/organizer-review-touchups-20261020/ui-c562ee2b5e5bbe9d/app.html';
assert.equal(oldCode.split(oldAsset).length,2);
const replacement=oldCode.replace(oldAsset,'/'+assetDir+'/app.html');
const built=base.slice(0,old.start)+replacement+base.slice(old.end),after=defs(built);assert.equal(before.size,after.size);
let unchanged=0;for(const[id,n]of before){if(id===1339)continue;const a=after.get(id);assert.equal(base.slice(n.start,n.end),built.slice(a.start,a.end),'module '+id);unchanged++}
const bundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(built).digest('hex')+'.js';fs.writeFileSync(path.join(root,bundle),built);
const entries=['profile/index.html','Create/index.html','OrgScan/index.html','OrgSummary/index.html','404.html'];
for(const n of entries){const p=path.join(root,n),s=fs.readFileSync(p,'utf8');assert(s.includes(baseFile));fs.writeFileSync(p,s.replace(baseFile,bundle))}
const report={baseCommit:'7b9a2dc56fbaada2556e3d96c97ebaa200b0b96e',baseFile,baseSha256:sha(base),source,bundle,bundleSha256:sha(built),assetDir,assetHashes:Object.fromEntries(Object.entries(files).map(([n,s])=>[n,sha(s)])),changedModules:[1339],byteIdenticalModules:unchanged,entries,hostAuthModeAndNavigationUnchanged:true,realAnalytics:false,serverWrites:0,publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
