module.exports=function(Format,Archive){
const clone = x => structuredClone(x);
const money = n => n == null ? '—' : new Intl.NumberFormat('ru-RU', {
  minimumFractionDigits: n % 100 ? 2 : 0,
  maximumFractionDigits: 2
}).format(n / 100) + ' ₽';
function duration(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000)),
    d = Math.floor(m / 1440),
    h = Math.floor(m % 1440 / 60),
    n = m % 60;
  return d ? `${d} ${d % 10 === 1 && d % 100 !== 11 ? 'день' : d % 10 >= 2 && d % 10 <= 4 && !(d % 100 >= 12 && d % 100 <= 14) ? 'дня' : 'дней'}${h ? ` ${h} ч` : ''}` : h ? `${h} ч${n ? ` ${n} мин` : ''}` : `${m} мин`;
}
const dateTime = t => t == null ? 'Дата не указана' : new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Moscow'
}).format(t) + ' мск';
function parts(t) {
  if (t == null) return {
    date: '',
    time: ''
  };
  const d = new Date(t + 3 * 36e5);
  return {
    date: `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`,
    time: `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
  };
}
function parseDate(date, time) {
  const a = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date.trim()),
    b = /^(\d{2}):(\d{2})$/.exec(time.trim());
  if (!a || !b) return null;
  const [dd, mm, yy] = a.slice(1).map(Number),
    [hh, mi] = b.slice(1).map(Number);
  if (hh > 23 || mi > 59 || mm < 1 || mm > 12) return null;
  const t = Date.UTC(yy, mm - 1, dd, hh - 3, mi),
    p = parts(t);
  return p.date === date.trim() && p.time === time.trim() ? t : null;
}
function formOf(e) {
  const s = parts(e.start),
    n = parts(e.end);
  return {
    title: e.title,
    date: s.date,
    time: s.time,
    endDate: n.date,
    endTime: n.time,
    venue: e.venue,
    address: e.address,
    description: e.description,
    age: e.age,
    guestList: e.guestList,
    cover: e.cover
  };
}
const dirty = (form, base) => JSON.stringify(form) !== JSON.stringify(formOf(base));
function validate(f, target = 'draft') {
  const errors = {};
  if (f.title.trim().length < 2) errors.title = 'Введите название — хотя бы два знака.';
  const start = parseDate(f.date, f.time),
    end = parseDate(f.endDate, f.endTime);
  if ((f.date || f.time || target !== 'draft') && !start) errors.date = 'Проверьте дату и время начала.';
  if ((f.endDate || f.endTime) && !end) errors.endDate = 'Укажите дату и время окончания целиком.';else if (end && start && end <= start) errors.endDate = 'Окончание должно быть позже начала. Для ночного события укажите следующий день.';
  if (target !== 'draft') {
    if (!f.cover) errors.cover = 'Добавьте афишу.';
    if (!f.venue.trim()) errors.venue = 'Укажите площадку.';
    if (!f.description.trim()) errors.description = 'Расскажите, что будет на событии.';
    if (!f.age) errors.age = 'Выберите возрастное ограничение.';
  }
  return errors;
}
function quotaError(value, unlimited, allocated) {
  if (unlimited) return null;
  const n = Number(value);
  if (!/^\d+$/.test(String(value).trim()) || !Number.isSafeInteger(n) || n > 2147483647) return 'Введите целое число от 0 до 2 147 483 647.';
  if (allocated != null && n < allocated) return `Уже распределено ${allocated} билетов. Лимит не может быть меньше.`;
  return null;
}
function normalize(row){return {id:row.id,title:row.title||'',status:row.status||'draft',start:row.starts_at?Date.parse(row.starts_at):null,end:row.ends_at?Date.parse(row.ends_at):null,cover:row.cover_url||null,venue:row.venues?.name||'',venueId:row.venue_id||null,address:row.venues?.address||'',city:row.city||'',description:row.description||'',age:row.age_limit||'',guestList:!!row.guest_list_enabled};}
function dates(e){return {startsAt:Number.isFinite(e.start)?new Date(e.start).toISOString():null,endsAt:Number.isFinite(e.end)?new Date(e.end).toISOString():null,status:e.status}}
function archived(e){return Archive.isEventArchived(dates(e));}
function phase(e,now=Date.now()){if(e.status==='cancelled')return'cancelled';const end=Format.eventEndMs(dates(e).startsAt,dates(e).endsAt);if(end!==null&&end<=now)return'ended';if(['draft','pending','removed'].includes(e.status))return e.status;if(e.status!=='published'||!Number.isFinite(e.start))return'unknown';if(now<e.start)return'upcoming';return Number.isFinite(e.end)&&e.end>e.start?'live':'unknown';}
const labels={upcoming:'Опубликовано',live:'Идёт сейчас',ended:'Завершено',cancelled:'Отменено',draft:'Черновик',pending:'На проверке',removed:'Снято с публикации',unknown:'Время требует уточнения'};
function canEdit(e,allowed){return !!allowed&&!archived(e)&&phase(e)!=='unknown';}
function fingerprint(e){return JSON.stringify([e.id,e.title,e.start,e.end,e.cover,e.venueId,e.venue,e.address,e.city,e.description,e.age,e.guestList,e.status]);}
function patchOf(e,f,venueId,coverUrl,status){return {id:e.id,title:f.title.trim(),startsAt:f.date===parts(e.start).date&&f.time===parts(e.start).time?dates(e).startsAt:parseDate(f.date,f.time)!=null?new Date(parseDate(f.date,f.time)).toISOString():null,endsAt:f.endDate===parts(e.end).date&&f.endTime===parts(e.end).time?dates(e).endsAt:parseDate(f.endDate,f.endTime)!=null?new Date(parseDate(f.endDate,f.endTime)).toISOString():null,venueId,city:e.city,description:f.description.trim(),ageLimit:f.age||null,coverUrl,guestList:f.guestList,status};}
function matches(e,p){return e.title===p.title&&e.start===(p.startsAt?Date.parse(p.startsAt):null)&&e.end===(p.endsAt?Date.parse(p.endsAt):null)&&e.venueId===p.venueId&&e.description===p.description&&e.age===(p.ageLimit||'')&&e.cover===(p.coverUrl||null)&&e.guestList===p.guestList&&(p.status==='published'?['published','pending'].includes(e.status):e.status===p.status);}
return {clone,money,duration,dateTime,parts,parseDate,formOf,dirty,validate,quotaError,normalize,dates,archived,phase,labels,canEdit,fingerprint,patchOf,matches};

};
