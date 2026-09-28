(() => {
  const section = document.querySelector('.product-tour');
  const stage = section.querySelector('.tour-sticky');
  const images = [...section.querySelectorAll('.tour-screen')];
  const steps = [...section.querySelectorAll('.tour-step')];
  const copy = section.querySelector('.tour-copy');
  const heading = section.querySelector('#tour-heading');
  const description = section.querySelector('#tour-description');
  const hint = section.querySelector('#tour-hint');
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

  function render() {
    // Long still intervals separate the two dissolves. The last 18% is an exit.
    section.style.setProperty('--zoom', reduced.matches ? '1' : String(smooth(0, .15, current)));
    section.style.setProperty('--exit', reduced.matches ? '0' : String(smooth(.82, 1, current)));
    images[0].style.opacity = '1';
    images[1].style.opacity = String(smooth(.30, .40, current));
    images[2].style.opacity = String(smooth(.56, .66, current));
    label(current < .35 ? 0 : current < .61 ? 1 : 2);
  }

  function tick(time) {
    const dt = Math.min(50, previousTime ? time - previousTime : 16);
    previousTime = time;
    current = reduced.matches ? target : current + (target - current) * (1 - Math.exp(-dt / 220));
    if (Math.abs(target - current) < .0002) current = target;
    render();
    if (current !== target) frame = requestAnimationFrame(tick);
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
  images.forEach(image => image.decode?.().catch(() => {}));
  render();
})();
