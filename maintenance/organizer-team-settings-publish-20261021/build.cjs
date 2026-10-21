const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict'),{createRequire}=require('module');
const req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json'),parser=req('@babel/parser'),tr=req('@babel/traverse').default;
const root=path.resolve(__dirname,'../..'),baseFile='_expo/static/js/web/index-e145af36a6954945766fa4047efa1814.js',oldFile='_expo/static/js/web/index-a8d417524b49e3e65aa64c5956dd4926.js';
const base=fs.readFileSync(path.join(root,baseFile),'utf8'),oldBase=fs.readFileSync(path.join(root,oldFile),'utf8'),source='maintenance/organizer-profile-parity-20261020/r8/current-module-1641.js',code=fs.readFileSync(path.join(root,source),'utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),defs=s=>new Map(parser.parse(s).program.body.filter(n=>n.expression?.callee?.name==='__d').map(n=>[n.expression.arguments[1].value,n]));
const before=defs(base),prior=defs(oldBase),old=before.get(1641);assert.equal(base.slice(old.start,old.end),oldBase.slice(prior.get(1641).start,prior.get(1641).end));
assert.equal(defs(code).size,1);assert(defs(code).has(1641));
const locations={};tr(parser.parse(code),{FunctionDeclaration(p){if(['ProfileEntry','SettingsSection'].includes(p.node.id.name))locations[p.node.id.name]=code.slice(p.node.start,p.node.end)}});
assert(!locations.ProfileEntry.includes('Моя команда'));assert(locations.SettingsSection.includes('Моя команда'));assert(!locations.SettingsSection.includes('Достижения'));
const built=base.slice(0,old.start)+code.trim()+base.slice(old.end),after=defs(built);assert.equal(before.size,after.size);let unchanged=0;
for(const[id,n]of before){if(id===1641)continue;const a=after.get(id);assert.equal(base.slice(n.start,n.end),built.slice(a.start,a.end),'module '+id);unchanged++}
const bundle='_expo/static/js/web/index-'+crypto.createHash('md5').update(built).digest('hex')+'.js';fs.writeFileSync(path.join(root,bundle),built);
const entries=['profile/index.html','Create/index.html','OrgScan/index.html','OrgSummary/index.html','404.html'];
for(const n of entries){const p=path.join(root,n),s=fs.readFileSync(p,'utf8');assert(s.includes(baseFile));fs.writeFileSync(p,s.replace(baseFile,bundle))}
const report={baseCommit:'6afaadd58c1ba6edf1a58ef3346f45c0aa15e5a1',baseFile,baseSha256:sha(base),source,sourceSha256:sha(code),bundle,bundleSha256:sha(built),changedModules:[1641],byteIdenticalModules:unchanged,entries,teamLocation:'SettingsSection organizer group',achievementsLocation:'profile unchanged',summaryUnchanged:true,authModeAndBackendUnchanged:true,previewGuardNotIncluded:true,serverWrites:0,publication:'NOT RUN'};
fs.writeFileSync(path.join(__dirname,'BUILD.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
