(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function preload(sources) {
    sources.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }

  function showPauseState(button, paused) {
    const icon = button.querySelector("i");
    const label = paused ? "Play" : "Pause";
    icon.classList.toggle("fa-pause", !paused);
    icon.classList.toggle("fa-play", paused);
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  // One piece of art with its own pause and rain buttons
  document.querySelectorAll("[data-sprite]").forEach((block) => {
    const img = block.querySelector("img[data-frames]");
    const normalFrames = img.dataset.frames.split(" ");
    const rainFrames = img.dataset.framesRain
      ? img.dataset.framesRain.split(" ")
      : normalFrames;
    const pauseButton = block.querySelector('[data-action="pause"]');
    const rainButton = block.querySelector('[data-action="rain"]');
    let frame = 0;
    let rain = false;
    let paused = reduceMotion;
    let timer = null;

    preload(normalFrames.concat(rainFrames));

    function draw() {
      const frames = rain ? rainFrames : normalFrames;
      img.src = frames[frame % frames.length];
    }

    function run() {
      clearInterval(timer);
      if (!paused && normalFrames.length > 1) {
        timer = setInterval(() => {
          frame += 1;
          draw();
        }, 1000 / 3);
      }
      if (pauseButton) showPauseState(pauseButton, paused);
    }

    if (pauseButton) {
      pauseButton.addEventListener("click", () => {
        paused = !paused;
        run();
      });
    }

    if (rainButton) {
      rainButton.addEventListener("click", () => {
        rain = !rain;
        rainButton.setAttribute("aria-pressed", String(rain));
        draw();
      });
    }

    run();
  });

  // Sprites played back to back, with the one on screen highlighted
  document.querySelectorAll("[data-seq]").forEach((seq) => {
    const img = seq.querySelector("[data-seq-img]");
    const pauseButton = seq.querySelector('[data-action="pause"]');
    const steps = Array.from(seq.querySelectorAll("[data-step]"));
    const queue = [];
    let position = 0;
    let paused = reduceMotion;
    let timer = null;

    steps.forEach((step, index) => {
      const frames = step.dataset.frames.split(" ");
      const ms = 1000 / Number(step.dataset.fps);
      const loops = Number(step.dataset.loops || 1);
      const duration = Number(step.dataset.duration || 0);
      preload(frames);
      if (duration) {
        let remaining = duration;
        for (let n = 0; remaining > 0; n += 1) {
          const shown = Math.min(ms, remaining);
          queue.push({ src: frames[n % frames.length], ms: shown, index });
          remaining -= shown;
        }
        return;
      }
      for (let n = 0; n < loops; n += 1) {
        frames.forEach((src) => queue.push({ src, ms, index }));
      }
    });

    function show() {
      const current = queue[position];
      img.src = current.src;
      steps.forEach((step, index) => {
        step.classList.toggle("is-playing", index === current.index);
      });
    }

    function next() {
      clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(() => {
        position = (position + 1) % queue.length;
        show();
        next();
      }, queue[position].ms);
    }

    if (pauseButton) {
      showPauseState(pauseButton, paused);
      pauseButton.addEventListener("click", () => {
        paused = !paused;
        showPauseState(pauseButton, paused);
        next();
      });
    }

    show();
    next();
  });
})();
