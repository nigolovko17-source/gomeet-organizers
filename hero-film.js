(() => {
  const video = document.querySelector('#organizer-film');
  if (!video) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = false;

  function syncPlayback() {
    if (!visible || document.hidden || reduced.matches) {
      video.pause();
      if (reduced.matches && video.readyState >= 1) video.currentTime = 0;
      return;
    }
    video.play().catch(() => {});
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: .15 });
    observer.observe(video);
  } else {
    visible = true;
    syncPlayback();
  }
  reduced.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', syncPlayback);
})();
