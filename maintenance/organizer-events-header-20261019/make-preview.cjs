/** Local review only: auto-select the existing organizer DEMO mode. Never installs this bundle. */
const fs=require('fs'),path=require('path'),{createRequire}=require('module');
const req=createRequire('/Users/nickolaygolovko/gomeet/app/package.json'),parser=req('@babel/parser'),gen=req('@babel/generator').default;
const root=path.resolve(__dirname,'../..'),build=JSON.parse(fs.readFileSync(path.join(__dirname,'BUILD.json'))),base=fs.readFileSync(path.join(root,build.releaseBundle),'utf8');
const ast=parser.parse(base),mode=ast.program.body.find(n=>n.expression?.callee?.name==='__d'&&n.expression.arguments[1]?.value===1006).expression.arguments[0];
let count=0;function walk(n){if(!n||typeof n!=='object')return;if(n.type==='CallExpression'&&n.callee?.type==='SequenceExpression'&&n.callee.expressions.at(-1)?.property?.name==='useState'&&n.arguments[0]?.value==='guest'){n.arguments[0]=parser.parseExpression("'org'");count++;}for(const[k,v]of Object.entries(n))if(!['loc','extra'].includes(k)){if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}}
walk(mode);if(count!==1)throw Error('Unexpected preview mode anchor');
fs.writeFileSync(path.join(__dirname,'concept.js'),base.slice(0,mode.start)+gen(mode,{compact:true,comments:false}).code+base.slice(mode.end));
let html=fs.readFileSync(path.join(root,'profile/index.html'),'utf8');html=html.replace('<div id="root"></div>','<div id="root"></div><script>history.replaceState(null,"","/OrgEvents");</script>').replace('/'+build.releaseBundle,'/maintenance/organizer-events-header-20261019/concept.js?v='+build.sha256.slice(0,12));
fs.writeFileSync(path.join(__dirname,'preview.html'),html);
