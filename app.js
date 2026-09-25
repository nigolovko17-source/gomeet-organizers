(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const qs = selector => document.querySelector(selector);
  const qsa = selector => [...document.querySelectorAll(selector)];
  const progress = qs('.reading-progress');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const animated = new WeakSet();
  const running = new Set();
  const prepared = new Map();
  const entrances = qsa('.reveal, .section-meta, .mission-text, .product-visual, .product-tabs');
  const scenes = qsa('.app-demo, .product-visual');
  let observer;

  function enter(element, delay = 0, paused = false) {
    if (animated.has(element)) return;
    animated.add(element);
    if (reduced.matches || !element.animate) return;
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(12px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 600, delay, easing: 'cubic-bezier(.25,.46,.45,.94)', fill: 'both' });
    if (paused) {
      animation.pause();
      animation.currentTime = 0;
      prepared.set(element, animation);
    }
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => {
      running.delete(animation);
      prepared.delete(element);
      animation.cancel();
    });
  }

  function configureMotion() {
    observer?.disconnect();
    running.forEach(animation => animation.cancel());
    prepared.clear();
    scenes.forEach(scene => {
      scene.style.removeProperty('--tilt-x');
      scene.style.removeProperty('--tilt-y');
    });
    document.body.classList.toggle('motion-enabled', !reduced.matches);
    if (reduced.matches || !('IntersectionObserver' in window)) {
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        prepared.get(entry.target)?.play();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });
    entrances.forEach(element => {
      // Never hide content already on screen (including restored scroll positions).
      if (element.getBoundingClientRect().top < window.innerHeight) {
        animated.add(element);
        return;
      }
      enter(element, 0, true);
      observer.observe(element);
    });
    // One entrance for the headline prevents its lines from moving independently.
    qsa('#hero-title, .hero-description, .hero-actions, .app-demo').forEach((element, index) => enter(element, index * 45));
  }

  scenes.forEach(scene => {
    let pointerFrame;
    scene.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const rect = scene.getBoundingClientRect();
        scene.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - .5) * -5}deg`);
        scene.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 6}deg`);
      });
    });
    scene.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);
      scene.style.setProperty('--tilt-x', '0deg');
      scene.style.setProperty('--tilt-y', '0deg');
    });
  });

  const screens = {
    audience: { src: 'assets/audience.png', alt: 'Макет аналитики аудитории организатора GOMEET' },
    growth: { src: 'assets/event.png', alt: 'Макет события «Четверг с GOMEET»' },
    events: { src: 'assets/create.png', alt: 'Макет создания события в GOMEET' },
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
  configureMotion();
  updateScroll();
})();
