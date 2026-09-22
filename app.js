(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qs = selector => document.querySelector(selector);
  const qsa = selector => [...document.querySelectorAll(selector)];
  const progress = qs('.reading-progress');
  let observer;

  function configureMotion() {
    observer?.disconnect();
    document.body.classList.toggle('motion-enabled', !reduced.matches);
    if (reduced.matches || !('IntersectionObserver' in window)) {
      qsa('.reveal').forEach(element => element.classList.add('visible'));
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    qsa('.reveal:not(.visible)').forEach(element => observer.observe(element));
  }
  configureMotion();

  const screens = {
    audience: { src: 'assets/audience.png', alt: 'Новые и постоянные гости в аналитике GOMEET', label: 'Ваша аудитория в одном экране' },
    growth: { src: 'assets/home.png', alt: 'Лента событий в приложении GOMEET', label: 'Ваше событие в ленте GOMEET' },
    events: { src: 'assets/create.png', alt: 'Создание события в приложении GOMEET', label: 'События под вашим контролем' },
  };
  const tabs = qsa('[role="tab"]');
  const image = qs('#product-screen');
  let imageTimer;
  let selection = 0;

  function selectTab(tab, focus = false) {
    if (tab.getAttribute('aria-selected') === 'true') {
      if (focus) tab.focus();
      return;
    }
    const version = ++selection;
    clearTimeout(imageTimer);
    tabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(item.getAttribute('aria-controls'));
      panel.hidden = !active;
      panel.classList.toggle('is-entering', active && !reduced.matches);
    });
    const screen = screens[tab.dataset.tab];
    qs('#screen-label').textContent = screen.label;
    const showImage = () => {
      if (version !== selection) return;
      image.src = screen.src;
      image.alt = screen.alt;
      const revealImage = () => {
        if (version === selection) image.classList.remove('switching');
      };
      if (typeof image.decode === 'function') image.decode().catch(() => {}).then(revealImage);
      else revealImage();
    };
    if (reduced.matches) {
      image.classList.remove('switching');
      showImage();
    } else {
      image.classList.add('switching');
      imageTimer = setTimeout(showImage, 160);
    }
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectTab(tabs[next], true);
      }
    });
  });

  // Screenshot-based demo: native scrolling, no login or real transactions.
  const demoButtons = qsa('[data-demo]');
  const demoViewport = qs('.demo-viewport');
  const demoScroll = qs('#demo-scroll');
  const demoNames = { home: 'Лента событий', event: 'Событие', chat: 'Чат события', audience: 'Аудитория', create: 'Создание события' };
  function updateDemoScroll() {
    const overflow = demoViewport.scrollHeight - demoViewport.clientHeight;
    demoScroll.disabled = overflow < 2;
    demoScroll.textContent = demoViewport.scrollTop >= overflow - 2 && overflow > 0 ? 'К началу ↑' : 'Листать ↓';
  }
  function selectDemo(name, focus = false) {
    if (!Object.hasOwn(demoNames, name)) return;
    demoButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.demo === name)));
    qsa('.demo-screen').forEach(screen => {
      screen.hidden = screen.dataset.screen !== name;
      screen.classList.toggle('is-entering', !screen.hidden && !reduced.matches);
    });
    demoViewport.scrollTop = 0;
    demoViewport.setAttribute('aria-label', `${demoNames[name]} — прокручиваемый экран`);
    demoScroll.setAttribute('aria-controls', `demo-${name}`);
    qs('#demo-status').textContent = `0${Object.keys(demoNames).indexOf(name) + 1} / 05 · ${demoNames[name]}`;
    if (focus) demoViewport.focus({ preventScroll: true });
    updateDemoScroll();
  }
  demoButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectDemo(button.dataset.demo));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % demoButtons.length;
      if (event.key === 'ArrowLeft') next = (index + demoButtons.length - 1) % demoButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = demoButtons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        demoButtons[next].focus();
        selectDemo(demoButtons[next].dataset.demo);
      }
    });
  });
  qsa('[data-demo-go]').forEach(button => button.addEventListener('click', () => selectDemo(button.dataset.demoGo, true)));
  demoScroll.addEventListener('click', () => {
    const end = demoViewport.scrollHeight - demoViewport.clientHeight;
    const top = demoViewport.scrollTop >= end - 2 ? 0 : Math.min(end, demoViewport.scrollTop + demoViewport.clientHeight * .7);
    demoViewport.scrollTo({ top, behavior: reduced.matches ? 'instant' : 'smooth' });
  });
  demoViewport.addEventListener('scroll', updateDemoScroll, { passive: true });
  window.addEventListener('resize', updateDemoScroll, { passive: true });
  qsa('.demo-screen img').forEach(img => img.addEventListener('load', updateDemoScroll));
  updateDemoScroll();

  let ticking = false;
  function updateScroll() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
    ticking = false;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  reduced.addEventListener('change', () => { configureMotion(); onScroll(); });
  updateScroll();
})();
