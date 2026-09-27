(() => {
 const section=document.querySelector('.product-tour'),stage=document.querySelector('.tour-sticky');
 const images=[...document.querySelectorAll('.tour-screen')],steps=[...document.querySelectorAll('.tour-step')];
 const copy=document.querySelector('.tour-copy'),heading=document.querySelector('#tour-heading'),description=document.querySelector('#tour-description'),hint=document.querySelector('#tour-hint');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scenes=[{title:'Все события.<br><em>Перед глазами.</em>',description:'Билеты, заполненность и статус каждой встречи.'},{title:'Как идут<br><em>продажи?</em>',description:'Общая картина и динамика по дням — в одной сводке.'},{title:'Кто пришёл.<br><em>Кто вернулся.</em>',description:'Новые и постоянные покупатели вашей встречи.'}];
 let current=0,target=0,raf=0,lastTime=0,selected=0,copyTimer;
 const clamp=v=>Math.max(0,Math.min(1,v));
 const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
 function scrollProgress(){const r=section.getBoundingClientRect();return clamp(-r.top/Math.max(1,section.offsetHeight-stage.offsetHeight))}
 function label(index){if(index===selected)return;selected=index;steps.forEach((step,i)=>step.setAttribute('aria-pressed',String(i===index)));images.forEach((img,i)=>img.setAttribute('aria-hidden',String(i!==index)));
  clearTimeout(copyTimer);copy.classList.add('is-changing');
  if(reduced.matches){heading.innerHTML=scenes[index].title;description.textContent=scenes[index].description;copy.classList.remove('is-changing');return}
  copyTimer=setTimeout(()=>{heading.innerHTML=scenes[index].title;description.textContent=scenes[index].description;copy.classList.remove('is-changing')},170);
 }
 function render(){const zoom=reduced.matches?1:smooth(0,.36,current);section.style.setProperty('--zoom',String(zoom));
  const sales=smooth(.33,.53,current),audience=smooth(.65,.85,current);
  // Stable base prevents a dark flash while the next crisp screen dissolves over it.
  images[0].style.opacity='1';images[1].style.opacity=String(sales);images[2].style.opacity=String(audience);
  label(current<.43?0:current<.75?1:2);
 }
 function tick(time){const dt=Math.min(50,lastTime?time-lastTime:16);lastTime=time;current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/220));if(Math.abs(target-current)<.0003)current=target;render();if(current!==target)raf=requestAnimationFrame(tick);else{raf=0;lastTime=0}}
 function schedule(){if(!reduced.matches)target=scrollProgress();if(!raf)raf=requestAnimationFrame(tick)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
 const stops=[.20,.57,.90];
 steps.forEach((step,i)=>step.addEventListener('click',()=>{if(reduced.matches){current=target=stops[i];render()}else scrollTo({top:section.offsetTop+(section.offsetHeight-stage.offsetHeight)*stops[i],behavior:'smooth'})}));
 reduced.addEventListener('change',()=>{target=reduced.matches?stops[selected]:scrollProgress();current=target;hint.textContent=reduced.matches?'Выберите раздел':'Листайте вниз — экраны меняются вместе с прокруткой ↓';render()});
 if(reduced.matches){current=target=stops[0];hint.textContent='Выберите раздел'}else current=target=scrollProgress();
 images.forEach(img=>img.decode?.().catch(()=>{}));render();
})();
