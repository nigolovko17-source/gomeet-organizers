import{NOW,clone,baseEvent,liveEvent,pastEvent,cancelledEvent,setup,phase,archived,canEdit,label,duration,dateTime,formOf,dirty,validate,applyForm,quotaError,money}from'./model.mjs';
const params=new URLSearchParams(location.search), initial=setup(params.get('case')||'K01');
let event=initial.event,form=initial.form,flags=initial.flags,view=initial.scenario.view,now=NOW,errors={},message='',messageType='success',operation=null,quotaOperation=false,quotaMessage='',quotaValue=String(flags.quotaValue??event.quota??''),unlimited=event.quota==null,quotaFailure=false,lastTab='current',listScroll={current:0,archive:0},exitTarget=null,coverError='',pendingIntent=null,opId=0;
const records=new Map([baseEvent,liveEvent,pastEvent,cancelledEvent].map(e=>[e.id,clone(e)]));records.set(event.id,clone(event));
let editingBase=clone(event),startingForm=clone(form),allowUnload=false,quotaId=0;
lastTab=archived(event,now)?'archive':'current';
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svgPaths={back:'m15 5-7 7 7 7',arrow:'m9 5 7 7-7 7',pin:'M19 9c0 5-7 12-7 12S5 14 5 9a7 7 0 1 1 14 0 M14 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0',users:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21a8 8 0 0 1 16 0',scan:'M8 3H4v4 M16 3h4v4 M4 17v4h4 M20 17v4h-4 M3 12h18',image:'M3 3h18v18H3z M3 17l6-6 4 4 3-3 5 5 M16 7h.01',info:'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',clock:'M12 7v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',edit:'m15 4 5 5 M4 20l4-1L21 6l-4-4L4 15z',lock:'M6 11h12v10H6z M8 11V7a4 4 0 0 1 8 0v4'};
const icon=name=>`<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${svgPaths[name]||svgPaths.info}"/></svg>`;
const button=(text,action,cls='primary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${text}</button>`;
const isDirty=()=>dirty(form,event);
const busy=()=>!!operation;
const footer=html=>`<footer class="fixed-footer">${html}</footer>`;
function report(){parent.postMessage({type:'workspace-state',view,case:initial.scenario.id,phase:phase(event,now),dirty:isDirty()||!quotaUnchanged(),saving:!!operation,quotaSaving:quotaOperation,title:event.title},location.origin)}
function boundary(name){parent.postMessage({type:'workspace-boundary',name},location.origin)}
function setMessage(text,type='success'){message=text;messageType=type}
function header(title){return `<header class="page-head">${button(icon('back'),'back','back','aria-label="Назад"')}<h1 tabindex="-1">${title}</h1></header>`}
function callout(text,type='warn',action='',actionText='Повторить'){return `<aside class="callout ${type}" role="status"><p>${text}</p>${action?button(actionText,action,''):''}</aside>`}
function poster(){return event.cover?`<img class="poster" src="${esc(event.cover)}" alt="" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="poster no-poster" hidden aria-hidden="true">g</span>`:'<span class="poster no-poster" aria-hidden="true">g</span>'}
function action(title,sub,action,iconName='arrow',disabled=false){return `<button class="action" type="button" data-action="${action}" ${disabled?'disabled':''}>${icon(iconName)}<span class="body"><b>${title}</b><small>${sub}</small></span>${icon('arrow')}</button>`}
function status(){const p=phase(event,now);return `<span class="status ${p}">${label[p]}</span>`}
function unavailable(title,text,actionName='list',actionText='К событиям',loading=false){return `<section class="empty">${loading?'<div class="spinner" role="status" aria-label="Загрузка"></div>':`<div class="empty-icon">${icon('lock')}</div>`}<h2>${title}</h2><p>${text}</p>${!loading?button(actionText,actionName):''}</section>`}
function metrics(){
 const unavailable=flags.metricsError||flags.metricsLoading, tickets=unavailable?'—':event.tickets, value=unavailable?'—':event.free?'Бесплатно':money(event.revenue),p=phase(event,now);
 return `<section class="section"><h2 class="section-title">${event.free?'Участники':'Билеты и выручка'}</h2><div class="panel" ${flags.metricsLoading?'aria-busy="true"':''}><div class="metrics ${!event.free&&money(event.revenue).length>14?'large-money':''}"><div class="metric"><label>${event.free?'Регистрации':'Билеты'}</label><b>${tickets??'—'}</b></div><div class="metric"><label>${event.free?'Участие':'Выручка от билетов'}${!event.free?button(icon('info'),'money-info','info','aria-label="Как считается выручка"'):''}</label><b>${value}</b></div></div>${p==='live'?`<div class="arrivals"><span>Пришли</span><b>${unavailable?'—':event.arrived??'—'}</b></div>`:''}${flags.metricsLoading?'<p class="sales-note" role="status">Загружаем показатели…</p>':flags.metricsError?'<p class="sales-note">Статистика пока недоступна.</p>'+button('Повторить загрузку','retry-metrics','inline-retry'):flags.metricsStale?'<p class="sales-note">Последние загруженные показатели. Не удалось обновить.</p>'+button('Обновить','retry-metrics','inline-retry'):''}${!unavailable&&!archived(event,now)?`<p class="sales-note">${flags.noTicketTypes?'Типов билетов пока нет.':event.saleState==='notyet'?'Продажи ещё не начались.':event.saleState==='closed'?'Продажи закрыты.':event.quota==null?'Количество билетов не ограничено.':event.allocated>=event.quota?'Все билеты распределены.':`Доступно билетов: ${Math.max(0,event.quota-event.allocated)}.`}${event.mixed?' Есть платные и бесплатные типы.':''}</p>`:''}${event.refundNote?`<p class="sales-note">${esc(event.refundNote)}</p>`:''}</div></section>`;
}
function workspace(){
 const p=phase(event,now),a=archived(event,now),pre=['draft','pending'].includes(p)&&event.tickets===0;
 return `${message?callout(esc(message),messageType):''}${flags.mutationDenied?callout('Управление событием временно ограничено. Просмотр сведений доступен.','warn'):''}<section class="hero"><div class="hero-row">${poster()}<div class="head-text">${status()}<h2>${esc(event.title)}</h2><div class="date">${dateTime(event.start)}</div>${event.venue?`<div class="place">${icon('pin')}<span>${esc(event.venue)}</span></div>`:''}</div></div>${p==='upcoming'?`<div class="timing">${icon('clock')}<span>До начала · ${duration(event.start-now)}</span></div>`:''}${canEdit(event,flags,now)?button(p==='draft'?'Продолжить редактирование':'Править событие','edit','primary wide'):''}${a?'<p class="readonly">Событие в архиве. Сведения доступны для просмотра.</p>':''}</section>
 ${p==='pending'?callout('Событие на проверке. Оно появится в афише после одобрения.',''):''}${p==='removed'?callout(`Событие снято с публикации.${event.reason?' '+esc(event.reason):' Причина пока недоступна.'}`,'warn'):''}${p==='unknown'?callout('Не удалось определить актуальное состояние события. Обновите сведения, прежде чем менять их.','warn','retry-event','Обновить'):''}
 ${pre?callout(p==='draft'?'Продажи ещё не открыты. Сначала заполните сведения о событии.':'Статистика продаж появится после публикации.',''):metrics()}
 <section class="section"><h2 class="section-title">${a?'История события':'Вход и гости'}</h2><div class="actions">${event.guestList?action('Список гостей',a?'Сохранённый список участников':'Имена и отметки на входе','guests','users'):!a?action('Настроить список гостей','Включить в сведениях о событии','edit','users',!canEdit(event,flags,now)):''}${!a?action('Проверка билетов',flags.scanDenied||flags.mutationDenied?'Недоступна для текущего доступа':'Открыть сканер организатора','scan','scan',flags.scanDenied||flags.mutationDenied||['draft','pending','removed','unknown'].includes(p)):''}${a&&!event.guestList?'<p class="caption" style="padding:0 16px 14px">Список гостей для этого события не включался.</p>':''}</div></section>
 <section class="section"><h2 class="section-title">Сведения о событии</h2><div class="panel">${event.description?`<p style="margin:0">${esc(event.description)}</p>`:'<p class="muted" style="margin:0">Описание пока не заполнено.</p>'}<p class="caption">${event.age?'Возрастное ограничение: '+esc(event.age):'Возрастное ограничение пока не указано.'}</p>${event.end!=null?`<p class="caption">Окончание: ${dateTime(event.end)}</p>`:'<p class="caption">Время окончания не указано.</p>'}${event.address?`<p class="caption">${esc(event.address)}</p>`:''}</div></section>
 <div class="actions">${action('Посмотреть афишу',p==='draft'||p==='pending'||p==='removed'?'Предпросмотр события':'Как событие видят посетители','poster','image')}</div>${a?'<p class="caption">Показатели могут обновляться по мере подтверждения возвратов.</p>':''}`;
}
function field(key,title,placeholder='',area=false){const error=errors[key];return `<label class="field"><span>${title}</span><${area?'textarea':'input'} ${area?'rows="5"':`type="text" value="${esc(form[key])}"`} name="${key}" data-field="${key}" placeholder="${placeholder}" ${busy()?'disabled':''} aria-invalid="${!!error}" ${error?`aria-describedby="error-${key}"`:''}>${area?esc(form[key])+'</textarea>':''}${error?`<small class="field-error" id="error-${key}">${error}</small>`:''}</label>`}
function quotas(){
 let inner=flags.quotasLoading?'<div class="spinner" role="status" aria-label="Загрузка лимитов"></div>':flags.quotasError?callout('Не удалось загрузить лимиты билетов.','error','retry-quotas'):flags.noTicketTypes?'<p class="caption">Типов билетов пока нет.</p>':`<div class="quota-row"><div class="quota-heading"><b>${event.free?'Регистрация':'Входной билет'}</b><small>${event.free?'Бесплатно':'Платный'}</small></div><p class="quota-counts">Распределено: ${event.allocated??'—'}. Остаток: ${event.quota==null?'без лимита':event.allocated==null?'—':Math.max(0,event.quota-event.allocated)}.</p><label class="switch-row"><span><b>Без лимита</b></span><input type="checkbox" data-quota-unlimited aria-label="Без лимита билетов" ${unlimited?'checked':''} ${quotaOperation||flags.quotaDenied||busy()?'disabled':''}></label>${!unlimited?`<label class="field"><span>Общий лимит</span><input type="text" inputmode="numeric" data-quota-value aria-label="Общий лимит билетов" value="${esc(quotaValue)}" ${quotaOperation||flags.quotaDenied||busy()?'disabled':''}></label>`:''}${button(quotaOperation?'Сохраняем лимит…':'Сохранить лимит','save-quota','secondary wide',quotaOperation||flags.quotaDenied||busy()||quotaUnchanged()?'disabled':'')}${quotaMessage?`<p class="quota-status ${quotaFailure?'quota-error':''}" role="status">${esc(quotaMessage)}</p>`:''}${event.mixed?'<div class="quota-row"><div class="quota-heading"><b>Гостевой билет</b><small>Бесплатный</small></div><p class="caption">Без лимита. Цена и состав типов здесь не меняются.</p></div>':''}`;
 return `<section class="form-section"><h2>Лимиты билетов</h2><div class="panel"><p class="caption" style="margin:0 0 15px">Лимит сохраняется отдельно от сведений события. Цена билетов здесь не меняется.</p>${inner}</div></section>`;
}
function quotaUnchanged(){return unlimited===(event.quota==null)&&(unlimited||Number(quotaValue)===event.quota)}
function editor(){
 if(archived(event,now))return (message?callout(esc(message),messageType):'')+unavailable('Событие в архиве','Правки закрыты. Афиша и показатели доступны для просмотра.','open-workspace','Посмотреть событие');
 if(!canEdit(event,flags,now))return unavailable('Редактирование недоступно','Не удалось подтвердить возможность правки. Можно вернуться к просмотру события.','open-workspace','К событию');
 const p=phase(event,now),showValidation=Object.keys(errors).length>0;
 return `${message?callout(esc(message),messageType):''}${showValidation?'<div class="form-summary-error" role="alert">Проверьте отмеченные поля. Остальные изменения сохранены в форме.</div>':''}${operation?.kind==='unknown'?callout('Ответ о сохранении не получен. Сначала проверьте результат, чтобы не отправить правки повторно.','warn','check-result','Проверить результат'):''}${operation?.kind==='saving'?`<div class="callout" role="status">${operation.stage==='upload'?'Загружаем новую афишу…':'Сохраняем изменения…'}</div>`:''}
 <form id="event-form" novalidate><section class="form-section"><h2>Афиша</h2><button type="button" class="cover-edit" data-action="choose-cover" ${busy()?'disabled':''}>${form.cover?`<img src="${esc(form.cover)}" alt="Текущая афиша">`:'<span class="no-poster">g</span>'}<span><b>${form.cover?'Сменить афишу':'Добавить афишу'}</b><small>Вертикальное изображение</small>${form.cover!==event.cover?'<span class="cover-change">Новая афиша · ещё не сохранена</span>':''}</span>${icon('arrow')}</button>${errors.cover||coverError?`<p class="field-error" role="alert">${esc(errors.cover||coverError)}</p>`:''}${form.cover!==event.cover?button('Вернуть прежнюю афишу','restore-cover','inline-retry',busy()?'disabled':''):''}</section>
 <section class="form-section"><h2>Основное</h2>${field('title','Название события','Как называется встреча')}${field('description','Описание','Что будет и для кого',true)}<label class="field"><span>Возрастное ограничение</span></label><div class="chips" role="group" aria-label="Возрастное ограничение">${['0+','6+','12+','16+','18+'].map(a=>button(a,'age','chip',`data-age="${a}" aria-pressed="${form.age===a}" ${busy()?'disabled':''}`)).join('')}</div>${errors.age?`<p class="field-error">${errors.age}</p>`:''}</section>
 <section class="form-section"><h2>Когда</h2><p class="caption" style="margin:-4px 0 16px">Время московское (МСК)</p><div class="form-row">${field('date','Дата начала','ДД.ММ.ГГГГ')}${field('time','Начало','ЧЧ:ММ')}</div><div class="form-row">${field('endDate','Дата окончания','Необязательно')}${field('endTime','Окончание','ЧЧ:ММ')}</div><p class="caption" style="margin-top:-5px">Если встреча заканчивается после полуночи, укажите следующий день. Без окончания точное время завершения не определено.</p></section>
 <section class="form-section"><h2>Где</h2>${field('venue','Площадка','Название площадки')}${field('address','Адрес · необязательно','Улица и дом')}</section>
 <section class="form-section"><h2>Список гостей</h2><div class="panel"><label class="switch-row"><span><b>Поимённый список</b><small>Для управления входом. Эта настройка не делает список участников публичным.</small></span><input type="checkbox" data-field="guestList" name="guestList" aria-label="Поимённый список гостей" ${form.guestList?'checked':''} ${busy()?'disabled':''}></label></div></section>
 <section class="form-section"><h2>Публикация</h2><div class="panel"><div class="editor-status">${status()}</div><p class="status-note">${p==='pending'?'Правки не одобряют событие автоматически. Статус проверки сохраняется.':p==='removed'?'Исправьте замечания и отправьте событие на проверку.':p==='draft'?'Сохраните черновик или отправьте заполненное событие на проверку.':'Сохранение сведений и снятие с афиши — разные действия.'}</p>${p==='published'||p==='upcoming'||p==='live'?button('Снять с афиши','unpublish','danger-link',busy()?'disabled':''):p==='draft'||p==='removed'?button('Отправить на проверку','submit-review','secondary wide',busy()?'disabled':''):''}</div></section>${quotas()}</form>`;
}
function editorFooter(){
 const allowed=canEdit(event,flags,now),changed=isDirty();
 if(!allowed)return '';
 return footer(`${button('Отмена','back','secondary',operation||quotaOperation?'disabled':'')}${operation?`<div class="primary wide" role="status">${operation.kind==='unknown'?'Проверяем результат':`<span class="saving-indicator"><span class="spinner"></span>Сохраняем…</span>`}</div>`:button('Сохранить','save','primary',!changed||quotaOperation?'disabled':'')}`);
}
function render(){
 const a=archived(event,now);if(view==='workspace'||view==='archive')view=a?'archive':'workspace';
 if(view==='list'){document.querySelector('#app').innerHTML='<iframe class="list-frame" id="event-list" src="list/page.html?scenario=overview" title="Принятый список событий"></iframe>';document.querySelector('#event-list').onload=sendList;report();return}
 let content;
 if(flags.authLoading)content=unavailable('Проверяем доступ','Это займёт немного времени.','','',true);
 else if(flags.signedOut)content=unavailable('Войдите в свой аккаунт','Управление событием доступно его организатору.','login','Войти');
 else if(flags.loading)content=unavailable('Загружаем событие','Подождите немного.','','',true);
 else if(flags.loadError)content=unavailable('Не удалось загрузить событие','Проверьте соединение и попробуйте ещё раз.','retry-event','Повторить');
 else if(flags.noAccess||flags.notFound)content=unavailable('Событие недоступно','Не удалось открыть событие для этого аккаунта.','list','К событиям');
 else content=view==='edit'?editor():workspace();
 document.querySelector('#app').innerHTML=`<main class="workspace ${view==='edit'?'editor':''} ${a?'archive':''}">${header(view==='edit'?'Правка события':'Моё событие')}${content}</main>${view==='edit'&&!flags.signedOut&&!flags.noAccess&&!flags.loading&&!flags.loadError?editorFooter():''}`;
 document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.style.display='none';const next=img.nextElementSibling;if(next?.classList.contains('no-poster'))next.hidden=false}));
 report();
}
function navigate(next,{replace=false,discard=false}={}){
 if(operation||quotaOperation){openModal('Изменения обрабатываются','<p>Дождитесь результата или проверьте сохранение. Повторная отправка сейчас недоступна.</p>',[{text:'Остаться',action:'close-modal'}]);return}
 if(view==='edit'&&(isDirty()||!quotaUnchanged())&&!discard&&next!=='edit'){exitTarget=next;openModal('Оставить изменения?',`<p>${!quotaUnchanged()?'Есть несохранённые изменения лимита билетов.':'В сведениях события есть несохранённые правки.'}${isDirty()&&!quotaUnchanged()?' Сведения события тоже изменены.':''}${quotaMessage&&!quotaFailure?' Уже сохранённый лимит билетов останется изменённым.':''}</p>`,[{text:'Продолжить редактирование',action:'close-modal',cls:'primary'},{text:'Выйти без сохранения',action:'discard-exit',cls:'secondary'}]);return}
 if(operation){openModal('Изменения обрабатываются','<p>Дождитесь результата или проверьте сохранение. Повторная отправка сейчас недоступна.</p>',[{text:'Остаться',action:'close-modal'}]);return}
 view=next;if(next==='edit'){editingBase=clone(event);form=formOf(event);errors={};coverError=''}
 if(next!=='edit'){message=message||'';errors={}}
 const url=new URL(location.href);url.hash=view;(replace?history.replaceState:history.pushState).call(history,{view},'',url);
 render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});
}
function openModal(title,html,actions=[]){document.querySelector('#modal-body').innerHTML=`<h2>${title}</h2>${html}<div class="dialog-actions">${actions.map(a=>button(a.text,a.action,a.cls||'primary')).join('')}</div>`;const el=document.querySelector('#modal');if(!el.open)el.showModal()}
const closeModal=()=>document.querySelector('#modal').close();
function commit(formToSave,status,notice='Изменения сохранены.'){
 const quotaUnsaved=!quotaUnchanged();event=applyForm(event,formToSave,status);records.set(event.id,clone(event));form=formOf(event);editingBase=clone(event);errors={};operation=null;setMessage(quotaUnsaved?'Сведения сохранены. Лимит билетов нужно сохранить отдельно.':notice);view=quotaUnsaved?'edit':archived(event,now)?'archive':'workspace';history.replaceState({view},'','#'+view);render();window.scrollTo(0,0);document.querySelector('h1')?.focus({preventScroll:true});
}
function beginSave(target=event.status,confirmed=false){
 if(operation||quotaOperation||(!isDirty()&&target===event.status))return;if(!canEdit(event,flags,now)){render();return}
 errors=validate(form,target);if(Object.keys(errors).length){render();document.querySelector('[aria-invalid="true"]')?.focus();return}
 const critical=event.tickets>0&&(form.date!==formOf(event).date||form.time!==formOf(event).time||form.venue!==event.venue||form.address!==event.address);
 if(critical&&!confirmed){pendingIntent=target;openModal('Изменились условия встречи','<p>У события уже есть билеты. Проверьте новую дату, время и площадку перед сохранением.</p><p>Сохранение не означает автоматическую рассылку или возврат денег.</p>',[{text:'Проверить правки',action:'close-modal',cls:'secondary'},{text:'Сохранить изменения',action:'confirm-save'}]);return}
 message='';coverError='';operation={kind:'saving',stage:form.cover!==event.cover?'upload':'update',form:clone(form),target,version:event.version,id:++opId};render();
 if(!flags.holdSaving){const id=operation.id;setTimeout(()=>{if(operation?.id===id)completeSave()},650)}
}
function completeSave(){
 if(operation?.kind!=='saving')return;const op=operation,outcome=flags.outcome||'success';
 if(archived(event,now)||outcome==='archive'){event.serverArchived=true;records.set(event.id,clone(event));operation=null;setMessage('Событие уже в архиве. Правки не сохранены. Можно посмотреть доступные сведения.','warn');render();return}
 if(outcome==='upload-error'&&op.form.cover!==event.cover){operation=null;coverError='Афиша не загрузилась. Прежнее изображение сохранено. Попробуйте ещё раз.';setMessage('Не удалось загрузить новую афишу. Правки остались в форме.','error');render();return}
 if(outcome==='error'){operation=null;setMessage('Не удалось сохранить. Правки остались в форме. Попробуйте ещё раз.','error');render();return}
 if(outcome==='unknown'){operation={...op,kind:'unknown'};render();return}
 if(outcome==='access'){operation=null;flags.noAccess=true;render();return}
 if(outcome==='conflict'||op.version!==event.version){operation=null;openModal('Событие уже изменилось','<p>Данные изменились в другом окне или во время проверки. Ваши правки пока не сохранены.</p><p>Загрузка актуальной версии заменит введённые здесь значения.</p>',[{text:'Остаться в редакторе',action:'close-modal',cls:'secondary'},{text:'Загрузить актуальную версию',action:'reload-conflict'}]);return}
 const result=outcome==='pending'?'pending':op.target;
 commit(op.form,result,result==='pending'?'Изменения сохранены. Событие на проверке.':result==='draft'?'Черновик сохранён.':'Изменения сохранены.');
}
function sendList(){const frame=document.querySelector('#event-list');frame?.contentWindow.postMessage({type:'workspace-list-data',events:[...records.values()],tab:lastTab,now,scrollY:listScroll[lastTab]||0},location.origin)}
function saveQuota(){
 if(operation||quotaOperation||flags.quotaDenied)return;const error=quotaError(quotaValue,unlimited,event.allocated);if(error){quotaFailure=true;quotaMessage=error;render();return}
 quotaOperation=true;quotaMessage='';const id=++quotaId;render();if(!flags.holdQuota)setTimeout(()=>{if(quotaOperation&&quotaId===id)completeQuota()},500);
}
function completeQuota(){if(!quotaOperation)return;quotaOperation=false;quotaFailure=true;
 if(archived(event,now)||flags.noAccess||flags.signedOut||flags.mutationDenied){quotaMessage='Событие или доступ изменились. Лимит не сохранён.';setMessage(quotaMessage,'warn');render();return}
 if(flags.quotaOutcome==='access'){flags.quotaDenied=true;quotaMessage='Изменение лимита сейчас недоступно для вашего доступа.'}
 else if(flags.quotaOutcome==='race'){event.allocated=90;quotaMessage='Места успели распределить. Уже распределено 90 билетов. Проверьте новый лимит.'}
 else if(flags.quotaOutcome==='error')quotaMessage='Не удалось сохранить лимит. Проверьте связь и повторите.';
 else{event.quota=unlimited?null:Number(quotaValue);records.set(event.id,clone(event));quotaFailure=false;quotaMessage='Лимит сохранён.'+(isDirty()?' Остальные правки ещё не сохранены.':'');if(message==='Сведения сохранены. Лимит билетов нужно сохранить отдельно.')message='Сведения и лимит сохранены.'}
 render();
}
function chooseCover(){if(busy())return;if(flags.coverOutcome==='permission'){coverError='Нет доступа к фотографиям. Проверьте разрешение в настройках устройства.';render();return}if(flags.coverOutcome==='invalid'){coverError='Не удалось прочитать изображение. Выберите другой файл.';render();return}
 openModal('Выбрать афишу',`<div class="gallery">${['party.jpg','concert.jpg','collage.jpg'].map((name,i)=>`<button type="button" data-action="select-cover" data-cover="/demo-covers/${name}" aria-label="Афиша ${i+1}"><img src="/demo-covers/${name}" alt=""></button>`).join('')}</div><p class="current-cover-note">Прежняя афиша сохранится до подтверждения правок.</p>`,[{text:'Отмена',action:'close-modal',cls:'secondary'}]);
}
function inputChanged(target){const key=target.dataset.field;if(key){form[key]=target.type==='checkbox'?target.checked:target.value;delete errors[key];const related=key==='time'?'date':key==='endTime'?'endDate':key;delete errors[related];document.querySelector(`[data-field="${related}"]`)?.setAttribute('aria-invalid','false');document.getElementById('error-'+related)?.remove();if(!Object.keys(errors).length)document.querySelector('.form-summary-error')?.remove();target.setAttribute('aria-invalid','false');target.parentElement.querySelector('.field-error')?.remove();document.querySelector('.fixed-footer')?.remove();document.querySelector('#app').insertAdjacentHTML('beforeend',editorFooter());report()}
 if(target.hasAttribute('data-quota-value')){quotaValue=target.value;document.querySelector('[data-action="save-quota"]').disabled=quotaUnchanged()||quotaOperation;quotaMessage=''}
}
document.addEventListener('input',e=>inputChanged(e.target));
document.addEventListener('change',e=>{if(e.target.hasAttribute('data-quota-unlimited')){unlimited=e.target.checked;quotaMessage='';render();document.querySelector('[data-quota-unlimited]')?.focus({preventScroll:true})}else if(e.target.dataset.field&&e.target.type==='checkbox')inputChanged(e.target)});
document.addEventListener('submit',e=>{e.preventDefault();beginSave()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;
 if(a==='back')navigate(view==='edit'?'workspace':'list');
 else if(a==='list')navigate('list');
 else if(a==='edit')navigate('edit');
 else if(a==='open-workspace'){operation=null;form=formOf(event);navigate('workspace',{discard:true})}
 else if(a==='close-modal')closeModal();
 else if(a==='discard-exit'){closeModal();form=formOf(event);quotaValue=String(event.quota??'');unlimited=event.quota==null;operation=null;navigate(exitTarget||'workspace',{discard:true})}
 else if(a==='money-info')openModal('Выручка от билетов','<p>Подтверждённые оплаты за билеты с учётом подтверждённых возвратов. Сервисный сбор не включён.</p><p>Эта сумма не означает, что деньги уже выплачены организатору.</p>',[{text:'Понятно',action:'close-modal'}]);
 else if(['guests','scan','poster','login'].includes(a))boundary({guests:'Список гостей',scan:'Проверка билетов',poster:'Публичная афиша',login:'Вход в аккаунт'}[a]);
 else if(a==='retry-event'){flags.loading=false;flags.loadError=false;flags.authLoading=false;if(event.status==='legacy'){event={...clone(baseEvent),id:event.id};form=formOf(event)}render()}
 else if(a==='retry-metrics'){flags.metricsError=false;flags.metricsLoading=false;flags.metricsStale=false;flags.metricsMismatch=false;render()}
 else if(a==='retry-quotas'){flags.quotasError=false;flags.quotasLoading=false;render()}
 else if(a==='save')beginSave();
 else if(a==='confirm-save'){closeModal();beginSave(pendingIntent,true)}
 else if(a==='choose-cover')chooseCover();
 else if(a==='select-cover'){form.cover=b.dataset.cover;coverError='';delete errors.cover;closeModal();render();document.querySelector('.cover-edit')?.focus({preventScroll:true})}
 else if(a==='restore-cover'){form.cover=event.cover;coverError='';render()}
 else if(a==='age'){form.age=form.age===b.dataset.age&&event.status==='draft'?'':b.dataset.age;delete errors.age;render();document.querySelector(`[data-age="${b.dataset.age}"]`)?.focus({preventScroll:true})}
 else if(a==='submit-review')beginSave('pending');
 else if(a==='unpublish')openModal('Снять событие с афиши?','<p>Событие перестанет показываться в общей афише. Уже оформленные билеты сохранятся.</p><p>Это действие не отменяет событие и не запускает возвраты. Введённые правки будут сохранены вместе со сменой статуса.</p>',[{text:'Оставить в афише',action:'close-modal',cls:'secondary'},{text:'Снять с афиши',action:'confirm-unpublish'}]);
 else if(a==='confirm-unpublish'){closeModal();beginSave('draft',true)}
 else if(a==='reload-conflict'){closeModal();event={...event,title:event.title+' · актуальная версия',version:event.version+1};records.set(event.id,clone(event));form=formOf(event);editingBase=clone(event);flags.outcome='success';setMessage('Загружена актуальная версия. Прежние несохранённые правки заменены.','warn');render()}
 else if(a==='check-result'&&operation?.kind==='unknown'){const op=operation;if(flags.unknownResult==='not-saved'){operation=null;flags.outcome='success';setMessage('Проверка завершена: изменения не сохранились. Можно отправить их повторно.','warn');render()}else commit(op.form,op.target,'Проверка завершена: изменения были сохранены.')}
 else if(a==='save-quota')saveQuota();
});
addEventListener('message',e=>{if(e.origin!==location.origin)return;
 if(e.source===document.querySelector('#event-list')?.contentWindow){if(e.data.type==='workspace-list-scroll')listScroll[e.data.tab]=e.data.y;if(e.data.type==='concept-tab')lastTab=e.data.tab;if(e.data.type==='concept-boundary'){const name=e.data.name;if(e.data.id&&records.has(e.data.id)){event=clone(records.get(e.data.id));form=formOf(event);flags={};quotaValue=String(event.quota??'');unlimited=event.quota==null;message='';operation=null;navigate(name==='Редактирование события'?'edit':'workspace',{discard:true})}else boundary(name)}return}
 if(e.source!==parent)return;
 if(e.data.type==='workspace-reset'){allowUnload=true;parent.postMessage({type:'workspace-reset-ready'},location.origin)}
 else if(e.data.type==='workspace-clock'){now=NOW+e.data.minutes*60000;if(view==='list')sendList();else render()}
 else if(e.data.type==='workspace-outcome'){flags.outcome=e.data.outcome;flags.holdSaving=false;report()}
 else if(e.data.type==='workspace-complete'){if(operation?.kind==='saving')completeSave();else if(quotaOperation)completeQuota();else{flags.authLoading=false;flags.loading=false;flags.metricsLoading=false;flags.quotasLoading=false;render()}}
 else if(e.data.type==='workspace-recover'){flags.authLoading=false;flags.loading=false;flags.loadError=false;flags.signedOut=false;flags.noAccess=false;flags.notFound=false;flags.mutationDenied=false;flags.scanDenied=false;flags.quotaDenied=false;render()}
});
addEventListener('popstate',e=>{const next=e.state?.view||'workspace';if(view==='edit'&&(isDirty()||!quotaUnchanged()||operation||quotaOperation)){history.pushState({view},'','#edit');navigate(next)}else{view=next;render();window.scrollTo(0,0)}});
addEventListener('beforeunload',e=>{if(!allowUnload&&view==='edit'&&(isDirty()||!quotaUnchanged()||operation||quotaOperation)){e.preventDefault();e.returnValue=''}});
history.replaceState({view},'','#'+view);
if(flags.validate)errors=validate(form,flags.publishValidation?'pending':event.status);
if(flags.quotaValidate){quotaFailure=true;quotaMessage=quotaError(quotaValue,unlimited,event.allocated)||''}
if(flags.initialSaving){flags.holdSaving=true;operation={kind:'saving',stage:'update',form:clone(form),target:event.status,version:event.version,id:++opId}}
if(flags.initialUnknown)operation={kind:'unknown',form:clone(form),target:event.status,version:event.version,id:++opId};
if(flags.quotaInitialSaving){quotaOperation=true;flags.holdQuota=true}
render();
