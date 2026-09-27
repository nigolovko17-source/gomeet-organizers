(() => {
 const section=document.querySelector('.product-tour'),stage=document.querySelector('.tour-sticky');
 const images=[...document.querySelectorAll('.tour-screen')],steps=[...document.querySelectorAll('.tour-step')];
 const frame=document.querySelector('#tour-demo'),tryButton=document.querySelector('#tour-try'),closeButton=document.querySelector('#tour-close'),loading=document.querySelector('#tour-loading');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scenes=[{title:'Все события.<br><em>Перед глазами.</em>',description:'Билеты, заполненность и статус каждой встречи.',id:'events'},{title:'Как идут<br><em>продажи?</em>',description:'Общая картина и динамика по дням — в одной сводке.',id:'sales'},{title:'Кто пришёл.<br><em>Кто вернулся.</em>',description:'Новые и постоянные покупатели вашей встречи.',id:'audience'}];
 let current=0,target=0,raf=0,lastTime=0,selected=0,interactive=false,ready=false,toastTimer,loadTimer;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
 function scrollProgress(){const r=section.getBoundingClientRect();return clamp(-r.top/Math.max(1,section.offsetHeight-stage.offsetHeight))}
 function label(index){if(index===selected)return;selected=index;document.querySelector('#tour-heading').innerHTML=scenes[index].title;document.querySelector('#tour-description').textContent=scenes[index].description;steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));images.forEach((img,i)=>img.setAttribute('aria-hidden',String(i!==index)));}
 function render(){const zoom=reduced.matches?1:smooth(0,.32,current);section.style.setProperty('--zoom',String(zoom));if(interactive)return;
  const sales=smooth(.38,.45,current),audience=smooth(.70,.77,current);
  // Stable base prevents a dark flash while the next crisp screen dissolves over it.
  images[0].style.opacity='1';images[1].style.opacity=String(sales);images[2].style.opacity=String(audience);
  label(current<.415?0:current<.735?1:2);
 }
 function tick(time){const dt=Math.min(50,lastTime?time-lastTime:16);lastTime=time;current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/65));if(Math.abs(target-current)<.0003)current=target;render();if(current!==target)raf=requestAnimationFrame(tick);else{raf=0;lastTime=0}}
 function schedule(){if(!reduced.matches)target=scrollProgress();if(!raf)raf=requestAnimationFrame(tick)}
 function size(){section.style.setProperty('--frame-scale',String(document.querySelector('.tour-viewport').clientWidth/390));schedule()}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',size,{passive:true});new ResizeObserver(size).observe(document.querySelector('.tour-viewport'));
 const stops=[.20,.57,.90];
 steps.forEach((step,i)=>step.addEventListener('click',()=>{if(reduced.matches){current=target=stops[i];render()}else scrollTo({top:section.offsetTop+(section.offsetHeight-stage.offsetHeight)*stops[i],behavior:'smooth'})}));
 function notice(message){const toast=document.querySelector('.tour-toast');clearTimeout(toastTimer);toast.textContent=message;toast.hidden=false;toastTimer=setTimeout(()=>toast.hidden=true,5500)}
 function sendScene(){frame.contentWindow?.postMessage({type:'gomeet-tour-scene',scene:scenes[selected].id},location.origin)}
 function activate(){interactive=true;section.classList.add('is-interactive');tryButton.hidden=true;closeButton.hidden=false;steps.forEach(s=>s.disabled=true);frame.hidden=false;frame.tabIndex=0;
  document.querySelector('#tour-hint').textContent='Листайте кабинет и переключайте разделы. Изменение данных отключено.';
  if(!reduced.matches)scrollTo({top:section.offsetTop+(section.offsetHeight-stage.offsetHeight)*Math.max(.34,scrollProgress()),behavior:'smooth'});
  if(!frame.src){loading.hidden=false;frame.src='demo/';loadTimer=setTimeout(()=>{loading.hidden=true;notice('Кабинет загружается дольше обычного. Можно закрыть его и продолжить просмотр.');},12000)}else if(ready){sendScene();frame.focus()}
 }
 function close(){interactive=false;section.classList.remove('is-interactive');frame.hidden=true;frame.tabIndex=-1;tryButton.hidden=false;closeButton.hidden=true;steps.forEach(s=>s.disabled=false);loading.hidden=true;clearTimeout(loadTimer);document.querySelector('#tour-hint').textContent=reduced.matches?'Выберите раздел над кнопкой':'Листайте вниз — экраны меняются вместе с прокруткой ↓';render();tryButton.focus({preventScroll:true})}
 tryButton.addEventListener('click',activate);closeButton.addEventListener('click',close);
 addEventListener('keydown',e=>{if(e.key==='Escape'&&interactive)close()});
 addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow)return;
  if(e.data?.type==='gomeet-demo-ready'){ready=true;clearTimeout(loadTimer);loading.hidden=true;if(interactive){sendScene();frame.focus()}}
  if(e.data?.type==='gomeet-demo-close'&&interactive)close();
  if(e.data?.type==='gomeet-demo-notice')notice(String(e.data.message));
 });
 reduced.addEventListener('change',()=>{target=reduced.matches?stops[selected]:scrollProgress();current=target;document.querySelector('#tour-hint').textContent=reduced.matches?'Выберите раздел над кнопкой':'Листайте вниз — экраны меняются вместе с прокруткой ↓';render()});
 if(reduced.matches){current=target=stops[0];document.querySelector('#tour-hint').textContent='Выберите раздел над кнопкой'}else current=target=scrollProgress();
 images.forEach(img=>img.decode?.().catch(()=>{}));size();render();
})();
