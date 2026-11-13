(() => {
  const canvas = document.getElementById("mars-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.min(70, Math.round((width * height) / 18000));
    while (particles.length < count) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.22 + 0.06,
        alpha: Math.random() * 0.42 + 0.12,
      });
    }
    particles.length = count;
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    for (const particle of particles) {
      context.beginPath();
      context.fillStyle = `rgba(255, ${Math.round(115 + particle.radius * 24)}, 78, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      if (!reducedMotion) {
        particle.y -= particle.speed;
        particle.x += Math.sin(particle.y / 55) * 0.12;
        if (particle.y < -4) {
          particle.y = height + 4;
          particle.x = Math.random() * width;
        }
      }
    }

    if (!reducedMotion) frame = window.requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(frame);
    resize();
    draw();
  }, { passive: true });
})();
