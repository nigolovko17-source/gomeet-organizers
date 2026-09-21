(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qs = selector => document.querySelector(selector);
  const qsa = selector => [...document.querySelectorAll(selector)];
  const hero = qs('.hero');
  const sphere = qs('.hero-sphere');
  const progress = qs('.reading-progress');
  let observer;

  function configureMotion() {
    observer?.disconnect();
    document.body.classList.toggle('motion-enabled', !reduced.matches);
    if (reduced.matches || !('IntersectionObserver' in window)) {
      qsa('.reveal').forEach(element => element.classList.add('visible'));
      sphere.style.transform = '';
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

  let ticking = false;
  function updateScroll() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
    if (!reduced.matches && window.innerWidth > 760 && window.scrollY < hero.offsetHeight + 100) {
      sphere.style.transform = `translate3d(0,${Math.min(window.scrollY * .07, 45)}px,0)`;
    } else {
      sphere.style.transform = '';
    }
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
