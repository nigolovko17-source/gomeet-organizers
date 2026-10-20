# coding: utf-8
from pathlib import Path
import json,hashlib
root=Path(__file__).resolve().parents[2]
source=root/'maintenance/organizer-entry-team-20261020/r4'
old_dir='maintenance/organizer-entry-team-release-20261020/ui-ccbbde3794bc0451'
def revise(s,production=False):
 for name,end in [('scanner','camera'),('manual','resultInfo'),('history','offline')]:
  a=s.index('function '+name+'(')
  b=s.index('function '+end+'(',a) if end!='resultInfo' else s.index('const resultInfo',a)
  segment=s[a:b]
  assert '+context()+' in segment,name
  segment=segment.replace('+context()+','+')
  s=s[:a]+segment+s[b:]
 for text in ['<p class="muted">Проверяем билет только этого события.</p>','<p class="muted">Для группового билета можно выбрать, сколько гостей проходит сейчас.</p>', '<p class="muted">${s.role===\'member\'?\'Ваши проверки по выбранному событию.\':\'Проверки по выбранному событию и очередь этого устройства.\'}</p>', '<p class="muted division">Владелец сможет видеть журнал команды. Сотрудник — только свои проверки. В концепте все записи условные.</p>']:
  assert s.count(text)==1,text
  s=s.replace(text,'')
 old="btn('Проверить билет','manual','secondary')";assert s.count(old)==1;s=s.replace(old,"btn('Проверить билет','scanner','secondary')")
 a=s.index('out+=`<section class="panel flat">');b=s.index('`;return out}',a)
 assert 'Если пропадёт сеть' in s[a:b]
 s=s[:a]+s[b+2:]
 if production:
  banner="${notice('Демонстрационный режим','Событие, билеты и команда — примеры. Реальные проходы не отмечаются, приглашения не отправляются.')}"
  assert s.count(banner)==1;s=s.replace(banner,'')
 return s
css='\n/* Equal scanner controls, including when the torch label wraps. */\n.scanner-tools{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:stretch}.scanner-tools>button,.scanner-tools>button+button{width:100%;min-width:0;height:100%;min-height:50px;margin:0;line-height:20px}\n'
p=source/'app.js';p.write_text(revise(p.read_text()))
p=source/'style.css';p.write_text(p.read_text()+css)
p=source/'index.html';p.write_text(p.read_text().replace('локально r3','локально r4'))
files={n:(root/old_dir/n).read_text() for n in ['app.html','app.js','style.css','model.js','cases.js']}
files['app.js']=revise(files['app.js'],True);files['style.css']+=css
sha=lambda b:hashlib.sha256(b.encode()).hexdigest()
asset='maintenance/organizer-entry-copy-20261020/ui-'+sha(''.join(n+s for n,s in files.items()))[:16]
(root/asset).mkdir(parents=True,exist_ok=True)
for n,s in files.items():(root/asset/n).write_text(s)
report={'baseCommit':'7060b14c867609ee6890e9068d42937dfd3481d8','previousAssets':old_dir,'assetDir':asset,'assetHashes':{n:sha(s) for n,s in files.items()},'changedAssetFiles':['app.js','style.css'],'unchangedAssetFiles':['app.html','model.js','cases.js'],'published':False,'realCheckins':False,'serverWrites':0}
(root/'maintenance/organizer-entry-copy-20261020/ASSETS.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(asset)
