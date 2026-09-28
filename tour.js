(() => {
  const section = document.querySelector('.product-tour');
  const stage = section.querySelector('.tour-sticky');
  const images = [...section.querySelectorAll('.tour-screen')];
  const steps = [...section.querySelectorAll('.tour-step')];
  const copy = section.querySelector('.tour-copy');
  const heading = section.querySelector('#tour-heading');
  const description = section.querySelector('#tour-description');
  const hint = section.querySelector('#tour-hint');
  const device = section.querySelector('.tour-device-position');
  const backdrop = section.querySelector('.tour-backdrop');
  const navigation = section.querySelector('.tour-navigation');
  const actions = section.querySelector('.tour-actions');
  const status = section.querySelector('.tour-status');
  const ready = images.map(() => false);
  const mix = [0, 0, 0];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [
    { title: 'Все события.<br><em>Перед глазами.</em>', description: 'Билеты, заполненность и статус каждой встречи.' },
    { title: 'Как идут<br><em>продажи?</em>', description: 'Общая картина и динамика по дням — в одной сводке.' },
    { title: 'Кто пришёл.<br><em>Кто вернулся.</em>', description: 'Новые и постоянные покупатели вашей встречи.' }
  ];
  const stops = [.23, .48, .73];
  let current = 0, target = 0, frame = 0, previousTime = 0, selected = 0, copyTimer;
  let start = 0, range = 1, travel = 0, startScale = .66, exitScale = .08;
  const clamp = value => Math.max(0, Math.min(1, value));
  function smooth(from, to, value) {
    const t = clamp((value - from) / (to - from));
    return t * t * (3 - 2 * t);
  }
  const scrollProgress = () => clamp((scrollY - start) / range);

  function label(index) {
    if (selected === index) return;
    selected = index;
    steps.forEach((step, i) => step.setAttribute('aria-pressed', String(i === index)));
    images.forEach((image, i) => image.setAttribute('aria-hidden', String(i !== index)));
    clearTimeout(copyTimer);
    const update = () => {
      heading.innerHTML = scenes[index].title;
      description.textContent = scenes[index].description;
      copy.classList.remove('is-changing');
    };
    if (reduced.matches) update();
    else {
      copy.classList.add('is-changing');
      copyTimer = setTimeout(update, 170);
    }
  }

  function setStyle(element, property, value) {
    if (element.style[property] !== value) element.style[property] = value;
  }
  function render(dt = 16) {
    // One composited transform; no inherited CSS variables or layout reads per frame.
    const zoom = smooth(0, .15, current);
    const exit = smooth(.82, 1, current);
    const scale = startScale + zoom * (1 - startScale) - exit * exitScale;
    setStyle(device, 'transform', reduced.matches ? 'translate3d(-50%,0,0) scale(.8)' :
      `translate3d(-50%,${(-zoom * travel - exit * 24).toFixed(3)}px,0) scale(${scale.toFixed(5)})`);
    setStyle(backdrop, 'opacity', reduced.matches ? '0' : (zoom * (1 - exit * .22)).toFixed(4));
    setStyle(backdrop, 'transform', `scaleX(${(.72 + zoom * .28).toFixed(5)})`);
    setStyle(copy, 'opacity', (clamp(zoom * 3 - 2) * (1 - exit * .3)).toFixed(4));
    setStyle(copy, 'transform', `translate3d(0,${((1 - zoom) * 12 - exit * 12).toFixed(3)}px,0)`);
    setStyle(navigation, 'opacity', reduced.matches ? '1' : (1 - exit * .25).toFixed(4));
    setStyle(actions, 'opacity', reduced.matches ? '1' : (1 - exit).toFixed(4));
    const desired = [1, smooth(.30, .40, current), smooth(.56, .66, current)];
    let pending = false;
    for (let i = 1; i < images.length; i++) {
      const goal = ready[i] ? desired[i] : 0;
      // If an image arrives late, dissolve it in instead of exposing an empty frame.
      mix[i] = reduced.matches ? goal : mix[i] + Math.max(-dt / 260, Math.min(dt / 260, goal - mix[i]));
      setStyle(images[i], 'opacity', mix[i].toFixed(4));
      pending ||= Math.abs(goal - mix[i]) > .0001;
    }
    label(mix[2] >= .5 ? 2 : mix[1] >= .5 ? 1 : 0);
    return pending;
  }

  function tick(time) {
    const dt = Math.min(32, previousTime ? time - previousTime : 16);
    previousTime = time;
    current = reduced.matches ? target : current + (target - current) * (1 - Math.exp(-dt / 220));
    if (Math.abs(target - current) < .0002) current = target;
    const pending = render(dt);
    if (current !== target || pending) frame = requestAnimationFrame(tick);
    else { frame = 0; previousTime = 0; }
  }
  function schedule() {
    if (!reduced.matches) target = scrollProgress();
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function measure() {
    start = scrollY + section.getBoundingClientRect().top;
    range = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const style = getComputedStyle(section);
    travel = stage.offsetHeight * parseFloat(style.getPropertyValue('--travel-ratio'));
    startScale = parseFloat(style.getPropertyValue('--start-scale'));
    exitScale = parseFloat(style.getPropertyValue('--exit-scale'));
    schedule();
  }

  steps.forEach((step, index) => step.addEventListener('click', () => {
    if (reduced.matches) { current = target = stops[index]; render(); }
    else scrollTo({ top: start + range * stops[index], behavior: 'smooth' });
  }));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  const resize = new ResizeObserver(measure);
  resize.observe(stage);
  resize.observe(document.querySelector('.hero'));
  document.fonts.ready.then(measure);
  reduced.addEventListener('change', () => {
    measure();
    current = target = reduced.matches ? stops[selected] : scrollProgress();
    hint.textContent = reduced.matches ? 'Выберите раздел' : 'Листайте вниз — экраны меняются вместе с прокруткой ↓';
    render();
  });
  measure();
  current = target = reduced.matches ? stops[0] : scrollProgress();
  if (reduced.matches) hint.textContent = 'Выберите раздел';
  status.hidden = images[0].complete && images[0].naturalWidth > 0;
  images.forEach((image, index) => {
    let retried = false;
    const loaded = async () => {
      if (!image.naturalWidth) return;
      try { await image.decode(); } catch (_) { /* A loaded image remains usable. */ }
      ready[index] = true;
      if (index === 0) status.hidden = true;
      schedule();
    };
    const failed = () => {
      if (!retried && image.dataset.fallback) {
        retried = true;
        image.src = image.dataset.fallback;
      } else if (index === 0) {
        status.hidden = false;
        status.textContent = 'Не удалось загрузить экран. Проверьте соединение и обновите страницу.';
      }
    };
    image.addEventListener('load', loaded);
    image.addEventListener('error', failed);
    if (image.complete) image.naturalWidth ? loaded() : failed();
  });
  render();
})();
