document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector("h1");

  if (!title) {
    return;
  }

  title.classList.add("data-scramble");

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !window.gsap ||
    !window.ScrambleTextPlugin
  ) {
    return;
  }

  window.gsap.registerPlugin(window.ScrambleTextPlugin);
  window.gsap.to(title, {
    duration: 1,
    ease: "none",
    scrambleText: {
      text: title.textContent.trim(),
      chars: "upperAndLowerCase",
      revealDelay: .5,
    },
  });
});
