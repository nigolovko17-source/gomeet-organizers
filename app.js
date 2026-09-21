(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qs = (s) => document.querySelector(s);
  const qsa = (s) => [...document.querySelectorAll(s)];
  const progress = qs('.reading-progress');
  const hero = qs('.hero');
  const wordsElement = qs('[data-word-reveal]');
  let words = [];
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-enabled');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('visible');reveal.unobserve(entry.target);}
    }), {threshold: .12});
    qsa('.reveal').forEach(el => reveal.observe(el));
    const sentence = wordsElement.textContent.trim();
    wordsElement.setAttribute('aria-label', sentence);
    wordsElement.replaceChildren(...sentence.split(' ').flatMap((word, index) => {
      const span = document.createElement('span');span.className='word';span.textContent=word;span.setAttribute('aria-hidden','true');
      words.push(span);return index ? [document.createTextNode(' '),span] : [span];
    }));
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      hero.addEventListener('pointermove', e => {
        const rect=hero.getBoundingClientRect();
        hero.style.setProperty('--pointer-x', ((e.clientX-rect.left)/rect.width-.5)*2);
        hero.style.setProperty('--pointer-y', ((e.clientY-rect.top)/rect.height-.5)*2);
      },{passive:true});
      hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--pointer-x',0);hero.style.setProperty('--pointer-y',0);});
    }
  }
  const screens = {
    audience: {src:'assets/audience.png',alt:'Новые и постоянные гости в аналитике GOMEET',label:'Ваша аудитория в одном экране'},
    growth: {src:'assets/home.png',alt:'Лента событий в приложении GOMEET',label:'Ваше событие в ленте GOMEET'},
    events: {src:'assets/create.png',alt:'Создание события в приложении GOMEET',label:'События под вашим контролем'}
  };
  let productTimer;
  function changeImage(img, src, alt, timerKey) {
    img.src=src;img.alt=alt;
  }
  const tabs=qsa('[role="tab"]');
  function selectTab(tab,focus=false) {
    tabs.forEach(t=>{const active=t===tab;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;qs('#'+t.getAttribute('aria-controls')).hidden=!active;});
    const screen=screens[tab.dataset.tab], image=qs('#product-screen');
    qs('#screen-label').textContent=screen.label;
    clearTimeout(productTimer);
    if(reduced.matches){changeImage(image,screen.src,screen.alt);}
    else {image.classList.add('switching');productTimer=setTimeout(()=>{changeImage(image,screen.src,screen.alt);image.classList.remove('switching');},180);}
    if(focus)tab.focus();
  }
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectTab(tab));
    tab.addEventListener('keydown',e=>{
      let next;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tabs.length;
      if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;
      if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;
      if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}
    });
  });
  let ticking=false;
  function updateScroll(){
    const height=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,window.scrollY/height)):0})`;
    if(words.length){const rect=wordsElement.getBoundingClientRect();const pct=Math.min(1,Math.max(0,(window.innerHeight*.86-rect.top)/(rect.height+window.innerHeight*.28)));words.forEach((word,i)=>word.classList.toggle('lit',i/words.length<pct));}
    ticking=false;
  }
  function onScroll(){if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}}
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});
  reduced.addEventListener('change',()=>{if(reduced.matches){document.body.classList.remove('motion-enabled');words.forEach(w=>w.classList.add('lit'));hero.style.setProperty('--pointer-x',0);hero.style.setProperty('--pointer-y',0);}});
  updateScroll();
})();
