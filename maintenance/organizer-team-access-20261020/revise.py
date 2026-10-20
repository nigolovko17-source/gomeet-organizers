from pathlib import Path
import shutil,json,hashlib
root=Path(__file__).resolve().parents[2]
out=Path(__file__).parent
source=root/'maintenance/organizer-entry-team-20261020/r5'
shutil.copytree(source.with_name('r4'),source)
def revise(s):
 old="'member-details','inline',`data-member="
 assert s.count(old)==1
 s=s.replace(old,"'member-details',m.status==='pending'?'inline':'secondary',`data-member=")
 old="${m.events.map(id=>s.events.find(e=>e.id===id)?.title||'Событие').join(' · ')}"
 assert s.count(old)==1
 s=s.replace(old,"${m.events.length?m.events.map(id=>s.events.find(e=>e.id===id)?.title||'Событие').join(' · '):'Нет доступа к событиям'}")
 old='<p class="muted">Только вход на назначенные события. Отзыв действует при следующем подключении; без сети — по сроку разрешения.</p>${btn(m.status===\'pending\'?\'Отменить приглашение\':\'Отозвать доступ\',\'revoke-member\',\'secondary\')}${btn(\'Оставить без изменений\',\'close-modal\',\'inline\')}'
 assert s.count(old)==1
 s=s.replace(old,"${m.status==='pending'?btn('Отменить приглашение','revoke-member','secondary'):''}${btn('Без изменений','close-modal','secondary')}")
 a=s.index("if(fixture.state==='revoke')")
 s=s[:a]+"if(fixture.state==='revoke'){act('member-details',{dataset:{member:'anna'}})}\n"
 return s
p=source/'app.js';p.write_text(revise(p.read_text()))
p=source/'index.html';p.write_text(p.read_text().replace('локально r4','локально r5'))
old_dir='maintenance/organizer-entry-copy-20261020/ui-6775ecee63c6c53b'
files={n:(root/old_dir/n).read_text() for n in ['app.html','app.js','style.css','model.js','cases.js']}
files['app.js']=revise(files['app.js'])
for where in [source]:
 p=where/'cases.js';p.write_text(p.read_text().replace('Команда · отзыв доступа','Команда · изменение доступа'))
files['cases.js']=files['cases.js'].replace('Команда · отзыв доступа','Команда · изменение доступа')
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
asset='maintenance/organizer-team-access-20261020/ui-'+sha(''.join(n+s for n,s in files.items()))[:16]
(root/asset).mkdir()
for n,s in files.items():(root/asset/n).write_text(s)
(out/'ASSETS.json').write_text(json.dumps({'previousAssets':old_dir,'assetDir':asset,'assetHashes':{n:sha(s) for n,s in files.items()},'realOperations':0},indent=2)+'\n')
print(asset)
