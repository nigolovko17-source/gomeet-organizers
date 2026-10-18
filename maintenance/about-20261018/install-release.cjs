const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../..'),report=JSON.parse(fs.readFileSync(path.join(__dirname,'RELEASE-BUILD.json'),'utf8')),built=fs.readFileSync(path.join(__dirname,'candidate.js'));
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');if(sha(built)!==report.sha256)throw Error('Candidate changed');
const activationFiles=['404.html','profile/index.html','index.html'];
for(const file of activationFiles){const source=fs.readFileSync(path.join(root,file),'utf8');if(file!=='index.html'&&!source.includes('/'+report.baseFile))throw Error('Unexpected active entry '+file);if(file==='index.html'&&!source.includes('blocked-20261018'))throw Error('Unexpected root redirect');}
fs.writeFileSync(path.join(root,report.releaseBundle),built);
for(const file of activationFiles){const source=fs.readFileSync(path.join(root,file),'utf8'),next=file==='index.html'?source.replaceAll('blocked-20261018','about-20261018'):source.replaceAll('/'+report.baseFile,'/'+report.releaseBundle);fs.writeFileSync(path.join(root,file),next);}
const install={task:'UI-ABOUT-20261018',baseCommit:report.baseCommit,releaseBundle:report.releaseBundle,sha256:report.sha256,activationFiles,rollback:'94d8d1e and original hashed bundle retained',publication:'PENDING'};fs.writeFileSync(path.join(__dirname,'INSTALL.json'),JSON.stringify(install,null,2)+'\n');console.log(JSON.stringify(install));
