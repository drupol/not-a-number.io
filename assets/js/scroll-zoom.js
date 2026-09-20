(() => {
  const MAX_ZOOM = 1.5;

  function init() {
    const container = document.getElementById("background-canvas");
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) {
      requestAnimationFrame(init);
      return;
    }

    svg.style.transformOrigin = "center center";
    svg.style.willChange = "transform";

    let ticking = false;

    function onScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
      const scale = 1 + progress * (MAX_ZOOM - 1);

      svg.style.transform = `scale(${scale})`;

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
