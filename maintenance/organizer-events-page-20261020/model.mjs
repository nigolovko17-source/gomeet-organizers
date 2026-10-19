// Isolated local concept. Never import fixtures into a production build.
export const NOW = Date.parse('2026-10-20T12:00:00+03:00');
export const zone = 'Europe/Moscow';
export const rub = n => n == null ? '—' : new Intl.NumberFormat('ru-RU',{style:'currency',currency:'RUB',maximumFractionDigits:0}).format(n / 100);
const plural = (n, words) => words[n%100>=11&&n%100<=14?2:n%10===1?0:n%10>=2&&n%10<=4?1:2];
export function remaining(ms) {
  const mins=Math.max(1,Math.ceil(ms/60000)), days=Math.floor(mins/1440), hours=Math.floor(mins%1440/60), m=mins%60;
  return days ? `${days} ${plural(days,['день','дня','дней'])}${hours?` ${hours} ч`:''}` : hours ? `${hours} ч${m?` ${m} мин`:''}` : `${mins} мин`;
}
export function phase(e, now=NOW) {
  if(e.status==='cancelled') return {key:'cancelled',label:'Отменено',archive:true};
  if(e.status==='draft') return {key:'draft',label:'Черновик',archive:false};
  if(e.status==='pending') return {key:'pending',label:'На проверке',archive:false};
  if(e.status==='removed') return {key:'removed',label:'Снято с публикации',archive:false};
  if(e.end!=null && now>=e.end) return {key:'ended',label:'Завершено',archive:true};
  if(e.start==null) return {key:'unknown',label:'Дата не указана',archive:false};
  if(now<e.start) return {key:'upcoming',label:'Опубликовано',archive:false,time:`До начала · ${remaining(e.start-now)}`};
  if(e.end==null) return {key:'unknown',label:'Начало в прошлом',archive:false,time:'Окончание не указано'};
  return {key:'live',label:'Идёт сейчас',archive:false};
}
export function partition(events, now=NOW) {
  const current=events.filter(e=>!phase(e,now).archive), archive=events.filter(e=>phase(e,now).archive);
  current.sort((a,b)=>Number(phase(b,now).key==='live')-Number(phase(a,now).key==='live') || (a.start??Infinity)-(b.start??Infinity) || a.id.localeCompare(b.id));
  archive.sort((a,b)=>(b.start??0)-(a.start??0));
  return {current,archive};
}
export function date(e) {
  if(e.start==null) return 'Дата пока не указана';
  const year=new Date(e.start).getUTCFullYear()!==new Date(NOW).getUTCFullYear()?'numeric':undefined;
  return new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year,hour:'2-digit',minute:'2-digit',timeZone:zone}).format(e.start).replace(' в ', ' · ')+' мск';
}
const base={status:'published',title:'Новый круг знакомств',cover:'/demo-posters/20261009/01.jpg',start:NOW+14*864e5,end:NOW+14*864e5+3*36e5,tickets:78,revenue:8320000,arrived:0};
const event=(id,patch={})=>({...base,id,...patch});
export const upcoming=event('next');
export const live=event('live',{title:'Встреча, которая сближает',cover:'/demo-covers/party.jpg',start:NOW-40*6e4,end:NOW+140*6e4,arrived:24});
const past=event('past',{title:'Вечер новых знакомств',cover:'/demo-covers/cocktail.jpg',start:NOW-7*864e5,end:NOW-7*864e5+3*36e5,tickets:112,revenue:13440000,arrived:91});
const cancelled=event('cancelled',{title:'Городские встречи',cover:'/demo-covers/people.jpg',status:'cancelled',start:NOW+2*864e5,end:NOW+2*864e5+3*36e5,tickets:0,revenue:0,arrived:10,refundNote:'Все подтверждённые возвраты учтены'});
const draft=event('draft',{title:'Новая встреча',status:'draft',cover:null,start:null,end:null,tickets:null,revenue:null});
export const scenarios=[
  {id:'overview',label:'Вся страница',note:'Идущее событие первым, затем ближайшие. Архив содержит завершённое и отменённое события.',events:[upcoming,live,past,cancelled]},
  {id:'upcoming',label:'Через две недели',note:'Точная дата и обратный отсчёт. «Пришли» до начала не показываем.',events:[upcoming,past]},
  {id:'today',label:'Сегодня / через час',note:'Отсчёт до старта, затем автоматическая смена состояния.',events:[event('today',{start:NOW+36e5,end:NOW+4*36e5}),past]},
  {id:'live',label:'Событие идёт',note:'Отдельное состояние. «Пришли» доступно только здесь.',events:[live,past]},
  {id:'archive',label:'Архив: единый вид',tab:'archive',note:'У завершённых и отменённых одна структура. Билеты и выручка, без «Пришли», отсчёта и редактирования.',events:[upcoming,past,cancelled,event('older',{...past,id:'older',title:'Знакомства за ужином',start:NOW-20*864e5,end:NOW-20*864e5+3*36e5,tickets:64,revenue:7040000,cover:'/demo-covers/concert.jpg'})]},
  {id:'draft',label:'Черновик',note:'Без выручки и счётчиков продаж. Продолжение редактирования.',events:[draft]},
  {id:'pending',label:'На проверке',note:'До публикации не показываем обратный отсчёт продаж или статистику.',events:[event('pending',{status:'pending',tickets:null,revenue:null})]},
  {id:'removed',label:'Снято с публикации',note:'Существующие подтверждённые продажи сохранены. Возобновление публикации не имитируется.',events:[event('removed',{status:'removed'})]},
  {id:'free',label:'Бесплатное событие',note:'Регистрации вместо проданных билетов. Бесплатно вместо суммы выручки.',events:[event('free',{free:true,tickets:42,revenue:0})]},
  {id:'no-sales',label:'Продаж ещё нет',note:'Подтверждённый ноль отличается от недоступных данных.',events:[event('zero',{tickets:0,revenue:0})]},
  {id:'unknown',label:'Статистика недоступна',note:'Знак «—», пояснение и повтор загрузки. Не заменяем отсутствие данных нулём.',events:[event('unknown',{tickets:null,revenue:null})]},
  {id:'refund',label:'Архив / возвраты',tab:'archive',note:'Учтены только подтверждённые возвраты. Незавершённый возврат не вычитается авансом.',events:[event('refund',{...cancelled,id:'refund',tickets:12,revenue:1440000,refundNote:'Есть возвраты в обработке'})]},
  {id:'missing',label:'Длинное название / нет афиши',note:'Заголовок переносится полностью; нейтральная обложка. Время окончания неизвестно — статус «идёт» не придумываем.',events:[event('missing',{title:'Большая встреча для тех, кто хочет найти свой круг и познакомиться с новыми людьми в городе',cover:null,start:NOW-36e5,end:null})]},
  {id:'empty',label:'Первое событие',note:'Первая встреча: понятный следующий шаг.',events:[]},
  {id:'empty-current',label:'Сейчас пусто',note:'Завершённые события остаются в архиве.',events:[past]},
  {id:'empty-archive',label:'Архив пуст',tab:'archive',note:'История появится после завершения или отмены события.',events:[upcoming]},
  {id:'loading',label:'Загрузка',note:'Скелетон без вымышленных счётчиков и сумм.',events:[],loading:true},
  {id:'error',label:'Ошибка / повтор',note:'Повтор — локальный сценарий восстановления, без запросов к серверу.',events:[],error:true},
  {id:'stale',label:'Ошибка обновления',note:'Последние данные остаются видимыми с предупреждением.',events:[upcoming,past],stale:true}
];
