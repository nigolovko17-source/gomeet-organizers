export const NOW=Date.parse('2026-10-20T12:00:00+03:00');
export const clone=x=>structuredClone(x);
export const money=n=>n==null?'—':new Intl.NumberFormat('ru-RU',{minimumFractionDigits:n%100?2:0,maximumFractionDigits:2}).format(n/100)+' ₽';
export const baseEvent={id:'next',title:'Новый круг знакомств',status:'published',start:NOW+14*864e5,end:NOW+14*864e5+3*36e5,cover:'/demo-covers/party.jpg',venue:'Пространство «Свои»',address:'Москва, улица Лесная, 12',description:'Камерный вечер новых знакомств: разговоры, музыка и люди, с которыми хочется встретиться снова.',age:'18+',guestList:true,tickets:78,revenue:8320000,arrived:24,quota:140,allocated:78,free:false,version:1};
export const liveEvent={...baseEvent,id:'live',title:'Встреча, которая сближает',start:NOW-40*6e4,end:NOW+140*6e4};
export const pastEvent={...baseEvent,id:'past',title:'Вечер новых знакомств',start:NOW-7*864e5,end:NOW-7*864e5+3*36e5,cover:'/demo-covers/cocktail.jpg',tickets:112,revenue:13440000,arrived:91,serverArchived:true};
export const cancelledEvent={...baseEvent,id:'cancelled',title:'Городские встречи',status:'cancelled',start:NOW+2*864e5,end:NOW+2*864e5+3*36e5,cover:'/demo-covers/people.jpg',tickets:0,revenue:0,refundNote:'Продаж не было',serverArchived:true};
export function phase(e,now=NOW){
 if(e.status==='cancelled')return 'cancelled';
 if(e.serverArchived)return 'ended';
 if(e.start!=null&&e.end!=null&&(!Number.isFinite(e.start)||!Number.isFinite(e.end)||e.end<=e.start))return 'unknown';
 if(e.end!=null&&Number.isFinite(e.end)&&now>=e.end)return 'ended';
 if(['draft','pending','removed'].includes(e.status))return e.status;
 if(e.status!=='published'||e.start==null||!Number.isFinite(e.start))return 'unknown';
 if(now<e.start)return 'upcoming';
 if(e.end==null||!Number.isFinite(e.end)||e.end<=e.start)return 'unknown';
 return 'live';
}
export const archived=(e,now=NOW)=>['ended','cancelled'].includes(phase(e,now));
export function canEdit(e,flags={},now=NOW){return !archived(e,now)&&!flags.noAccess&&!flags.mutationDenied&&phase(e,now)!=='unknown'}
export const label={upcoming:'Опубликовано',live:'Идёт сейчас',draft:'Черновик',pending:'На проверке',removed:'Снято с публикации',ended:'Завершено',cancelled:'Отменено',unknown:'Время требует уточнения'};
export function duration(ms){const m=Math.max(1,Math.ceil(ms/60000)),d=Math.floor(m/1440),h=Math.floor(m%1440/60),n=m%60;return d?`${d} ${d%10===1&&d%100!==11?'день':d%10>=2&&d%10<=4&&!(d%100>=12&&d%100<=14)?'дня':'дней'}${h?` ${h} ч`:''}`:h?`${h} ч${n?` ${n} мин`:''}`:`${m} мин`}
export const dateTime=t=>t==null?'Дата не указана':new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'}).format(t)+' мск';
export function parts(t){if(t==null)return{date:'',time:''};const d=new Date(t+3*36e5);return{date:`${String(d.getUTCDate()).padStart(2,'0')}.${String(d.getUTCMonth()+1).padStart(2,'0')}.${d.getUTCFullYear()}`,time:`${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`}}
export function parseDate(date,time){const a=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date.trim()),b=/^(\d{2}):(\d{2})$/.exec(time.trim());if(!a||!b)return null;const [dd,mm,yy]=a.slice(1).map(Number),[hh,mi]=b.slice(1).map(Number);if(hh>23||mi>59||mm<1||mm>12)return null;const t=Date.UTC(yy,mm-1,dd,hh-3,mi),p=parts(t);return p.date===date.trim()&&p.time===time.trim()?t:null}
export function formOf(e){const s=parts(e.start),n=parts(e.end);return{title:e.title,date:s.date,time:s.time,endDate:n.date,endTime:n.time,venue:e.venue,address:e.address,description:e.description,age:e.age,guestList:e.guestList,cover:e.cover}}
export const dirty=(form,base)=>JSON.stringify(form)!==JSON.stringify(formOf(base));
export function validate(f,target='draft'){
 const errors={};if(f.title.trim().length<2)errors.title='Введите название — хотя бы два знака.';
 const start=parseDate(f.date,f.time),end=parseDate(f.endDate,f.endTime);
 if((f.date||f.time||target!=='draft')&&!start)errors.date='Проверьте дату и время начала.';
 if((f.endDate||f.endTime)&&!end)errors.endDate='Укажите дату и время окончания целиком.';
 else if(end&&start&&end<=start)errors.endDate='Окончание должно быть позже начала. Для ночного события укажите следующий день.';
 if(target!=='draft'){if(!f.cover)errors.cover='Добавьте афишу.';if(!f.venue.trim())errors.venue='Укажите площадку.';if(!f.description.trim())errors.description='Расскажите, что будет на событии.';if(!f.age)errors.age='Выберите возрастное ограничение.'}
 return errors;
}
export function applyForm(e,f,status=e.status){return{...e,title:f.title.trim(),start:parseDate(f.date,f.time),end:parseDate(f.endDate,f.endTime),venue:f.venue.trim(),address:f.address.trim(),description:f.description.trim(),age:f.age,guestList:f.guestList,cover:f.cover,status,version:e.version+1}}
export function quotaError(value,unlimited,allocated){if(unlimited)return null;const n=Number(value);if(!/^\d+$/.test(String(value).trim())||!Number.isSafeInteger(n)||n>2147483647)return 'Введите целое число от 0 до 2 147 483 647.';if(allocated!=null&&n<allocated)return `Уже распределено ${allocated} билетов. Лимит не может быть меньше.`;return null}
// C/K/E/A map directly to the 61 analysed scenario families. Additional cases expose subvariants.
const rows=[
 ['C01','Доступ проверяется','workspace',{}, {authLoading:true}],
 ['C02','Нет входа / сессия закончилась','workspace',{}, {signedOut:true}],
 ['C03','Загрузка события','workspace',{}, {loading:true}],
 ['C04','Ошибка загрузки → повтор','workspace',{}, {loadError:true}],
 ['C05','Событие не найдено','workspace',{}, {notFound:true}],
 ['C06','Чужое событие / нет доступа','workspace',{}, {noAccess:true}],
 ['C07','Действия организатора ограничены','workspace',{}, {mutationDenied:true}],
 ['C08','Неизвестный статус / неполные даты','workspace',{status:'legacy',start:null,end:null},{}],
 ['C09','Длинное название / нет афиши / большие суммы','workspace',{title:'Большая встреча для тех, кто хочет найти свой круг и познакомиться с новыми людьми в городе',cover:null,revenue:123456789050},{}],
 ['C10','Прямая ссылка / возврат в список','workspace',{}, {direct:true}],
 ['K01','Кабинет · до начала','workspace',{},{}],
 ['K02','Граница начала события','workspace',{start:NOW,end:NOW+3*36e5},{}],
 ['K03','Кабинет · идёт сейчас','workspace',{...liveEvent},{}],
 ['K04','Событие заканчивается при просмотре','workspace',{...liveEvent,end:NOW+6e4},{}],
 ['K05','Черновик · заполнить сведения','workspace',{status:'draft',start:null,end:null,cover:null,description:'',age:'',tickets:0,revenue:0,guestList:false},{}],
 ['K06','Событие на проверке','workspace',{status:'pending'},{}],
 ['K07','Снято с публикации','workspace',{status:'removed',reason:'Уточните программу и адрес площадки.'},{}],
 ['K08','Продаж ещё нет','workspace',{tickets:0,revenue:0,arrived:0},{}],
 ['K09','Бесплатное событие','workspace',{free:true,tickets:42,revenue:0},{}],
 ['K10','Все билеты распределены','workspace',{quota:78,allocated:78},{}],
 ['K11','Статистика недоступна','workspace',{}, {metricsError:true}],
 ['K12','Подтверждённые и ожидаемые возвраты','workspace',{revenue:6240050,refundNote:'Есть возвраты в обработке. Подтверждённые возвраты уже учтены.'},{}],
 ['K13','Список гостей выключен','workspace',{guestList:false},{}],
 ['K14','Проверка билетов недоступна','workspace',{...liveEvent},{scanDenied:true}],
 ['E01','Редактор · ошибка чтения','edit',{}, {loadError:true}],
 ['E02','Редактор · без изменений','edit',{},{}],
 ['E03','Несохранённые изменения → назад','edit',{}, {dirty:true}],
 ['E04','Правки события на проверке','edit',{status:'pending'},{dirty:true}],
 ['E05','Ошибка названия','edit',{}, {form:{title:''},validate:true}],
 ['E06','Неверная дата / время','edit',{}, {form:{date:'31.02.2026',time:'25:00'},validate:true}],
 ['E07','Ночное событие · следующий день','edit',{start:NOW+11*36e5,end:NOW+18*36e5},{}],
 ['E08','Многодневное событие','edit',{end:baseEvent.start+3*864e5},{}],
 ['E09','Событие завершилось при редактировании','edit',{...liveEvent,end:NOW+6e4},{dirty:true}],
 ['E10','Не заполнены сведения для публикации','edit',{status:'draft',cover:null,description:'',age:'',venue:'',address:''},{validate:true,publishValidation:true}],
 ['E11','Новая афиша / отмена выбора','edit',{}, {newCover:true,dirty:true}],
 ['E12','Афиша не загрузилась','edit',{}, {newCover:true,dirty:true,outcome:'upload-error'}],
 ['E13','Идёт сохранение','edit',{}, {dirty:true,initialSaving:true}],
 ['E14','Сохранение → на проверке','edit',{}, {dirty:true,outcome:'pending'}],
 ['E15','Результат сохранения неизвестен','edit',{}, {dirty:true,initialUnknown:true}],
 ['E16','Конфликт одновременных правок','edit',{}, {dirty:true,outcome:'conflict'}],
 ['E17','Доступ потерян при сохранении','edit',{}, {dirty:true,outcome:'access'}],
 ['E18','Снятие с афиши · есть билеты','edit',{},{}],
 ['E19','Перенос даты / места после продаж','edit',{}, {form:{venue:'Новая площадка'},dirty:true}],
 ['E20','Изменение списка гостей','edit',{}, {form:{guestList:false}}],
 ['E21','Ошибка загрузки лимитов','edit',{}, {quotasError:true}],
 ['E22','Безлимитный тип билета','edit',{quota:null},{}],
 ['E23','Лимит меньше распределённых билетов','edit',{}, {quotaValue:'50',quotaValidate:true}],
 ['E24','Ошибка сохранения лимита','edit',{}, {quotaValue:'160',quotaOutcome:'error'}],
 ['E25','Цены билетов · только просмотр','edit',{mixed:true},{}],
 ['E26','Выход / перезагрузка с правками','edit',{}, {dirty:true}],
 ['E27','Узкий экран / фокус на ошибках','edit',{}, {form:{title:''},validate:true}],
 ['A01','Архив · завершённое событие','archive',{...pastEvent},{}],
 ['A02','Архив · отменённое событие','archive',{...cancelledEvent},{}],
 ['A03','Архив · бесплатное / нет продаж','archive',{...pastEvent,free:true,tickets:0,revenue:0},{}],
 ['A04','Архив · подтверждённые возвраты','archive',{...pastEvent,revenue:10800000,refundNote:'Подтверждённые возвраты учтены в выручке.'},{}],
 ['A05','Архив · возвраты ещё обрабатываются','archive',{...cancelledEvent,tickets:78,revenue:6240000,refundNote:'Возвраты обрабатываются. Финансовые показатели могут обновиться.'},{}],
 ['A06','Архив · статистика недоступна','archive',{...pastEvent},{metricsError:true}],
 ['A07','Архив · старое событие без афиши / дат','archive',{...pastEvent,cover:null,start:null,end:null,serverArchived:true},{}],
 ['A08','Архив · старая ссылка на редактор','edit',{...pastEvent},{}],
 ['A09','Архив · гости и афиша','archive',{...pastEvent,guestList:true},{}],
 ['A10','Архив · все действия только для просмотра','archive',{...cancelledEvent,guestList:false},{}],
 ['K08-empty','Нет типов билетов','workspace',{tickets:0,revenue:0},{noTicketTypes:true}],
 ['K09-mixed','Платные и бесплатные билеты','workspace',{mixed:true},{}],
 ['K10-unlimited','Продажи без лимита','workspace',{quota:null},{}],
 ['K10-notyet','Продажи ещё не начались','workspace',{saleState:'notyet'},{}],
 ['K10-closed','Продажи закрыты до начала события','workspace',{saleState:'closed'},{}],
 ['K11-loading','Статистика загружается','workspace',{}, {metricsLoading:true}],
 ['K11-stale','Последние загруженные показатели','workspace',{}, {metricsStale:true}],
 ['K11-mismatch','Показатели другого события','workspace',{}, {metricsError:true,metricsMismatch:true}],
 ['E07-missing','Время окончания не задано','edit',{end:null},{}],
 ['E07-invalid','Неверное окончание / до начала','edit',{}, {form:{endDate:'02.11.2026',endTime:'11:00'},validate:true}],
 ['E08-equal','Начало равно окончанию','edit',{}, {form:{endDate:'03.11.2026',endTime:'12:00'},validate:true}],
 ['E12-permission','Нет доступа к фотографиям','edit',{}, {coverOutcome:'permission'}],
 ['E12-invalid','Неподходящий файл афиши','edit',{}, {coverOutcome:'invalid'}],
 ['E14-published','Успех · статус сохранён','edit',{}, {dirty:true}],
 ['E14-draft','Успех · сохранён черновик','edit',{status:'draft'},{dirty:true}],
 ['E15-error','Известная ошибка сохранения','edit',{}, {dirty:true,outcome:'error'}],
 ['E15-not-saved','Неизвестный результат → не сохранено','edit',{}, {dirty:true,initialUnknown:true,unknownResult:'not-saved'}],
 ['E21-loading','Лимиты загружаются','edit',{}, {quotasLoading:true}],
 ['E21-empty','Типов билетов нет','edit',{}, {noTicketTypes:true}],
 ['E22-zero','Нулевой лимит без распределённых мест','edit',{tickets:0,revenue:0,allocated:0,quota:10},{quotaValue:'0'}],
 ['E23-invalid','Лимит · неверное число','edit',{}, {quotaValue:'-1',quotaValidate:true}],
 ['E23-race','Места распределили во время правки','edit',{allocated:null}, {quotaValue:'80',quotaOutcome:'race'}],
 ['E24-saving','Лимит сохраняется отдельно','edit',{}, {quotaValue:'160',quotaInitialSaving:true}],
 ['E24-denied','Нет доступа к изменению лимита','edit',{}, {quotaValue:'160',quotaOutcome:'access'}],
 ['E17-archive','Архивирование во время сохранения','edit',{}, {dirty:true,outcome:'archive'}],
 ['C07-editor','Нет права редактировать','edit',{}, {mutationDenied:true}],
 ['C02-editor','Сессия истекла в редакторе','edit',{}, {dirty:true,signedOut:true}],
 ['C08-no-end','Начало прошло, окончание неизвестно','workspace',{...liveEvent,end:null},{}]
];
export const scenarios=rows.map(([id,title,view,patch,flags])=>({id,title,view,patch,flags,group:id[0]==='C'?'Общие состояния':id[0]==='K'?'Кабинет события':id[0]==='E'?'Редактирование':'Архив'}));
export function setup(id='K01'){const c=scenarios.find(x=>x.id===id)||scenarios.find(x=>x.id==='K01'),event={...clone(baseEvent),...clone(c.patch)};const form={...formOf(event),...(c.flags.dirty?{title:event.title+' · обновлено'}:{}),...(c.flags.form||{}),...(c.flags.newCover?{cover:'/demo-covers/concert.jpg'}:{})};return{scenario:clone(c),event,form,flags:clone(c.flags)}}
