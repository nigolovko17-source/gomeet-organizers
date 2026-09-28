(() => {
  const section = document.querySelector('.product-tour');
  const stage = section.querySelector('.tour-sticky');
  const images = [...section.querySelectorAll('.tour-screen')];
  const steps = [...section.querySelectorAll('.tour-step')];
  const copy = section.querySelector('.tour-copy');
  const heading = section.querySelector('#tour-heading');
  const description = section.querySelector('#tour-description');
  const device = section.querySelector('.tour-device-position');
  const backdrop = section.querySelector('.tour-backdrop');
  const navigation = section.querySelector('.tour-navigation');
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
  let start = 0, range = 1;
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
    // A restrained 5% entrance, without vertical travel or exit shrinking.
    const scale = .95 + .05 * smooth(0, .12, current);
    setStyle(device, 'transform', reduced.matches ? '' : `translate3d(-50%,0,0) scale(${scale.toFixed(5)})`);
    const exit = smooth(.82, 1, current);
    setStyle(backdrop, 'opacity', reduced.matches ? '0' : (1 - exit * .22).toFixed(4));
    setStyle(copy, 'opacity', (1 - exit * .3).toFixed(4));
    setStyle(copy, 'transform', `translate3d(0,${(-exit * 12).toFixed(3)}px,0)`);
    setStyle(navigation, 'opacity', reduced.matches ? '1' : (1 - exit * .25).toFixed(4));
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
  // Earlier tab panels can change height, moving the tour's scroll origin.
  for (const sibling of section.parentElement.children) {
    if (sibling === section) break;
    resize.observe(sibling);
  }
  document.fonts.ready.then(measure);
  reduced.addEventListener('change', () => {
    measure();
    current = target = reduced.matches ? stops[selected] : scrollProgress();
    render();
  });
  measure();
  current = target = reduced.matches ? stops[0] : scrollProgress();
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
