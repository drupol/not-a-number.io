(() => {
  const mount = document.getElementById("background-canvas");
  if (!mount) return;

  mount.replaceChildren();

  const SVG_NS = "http://www.w3.org/2000/svg";
  const IDENTITY = Object.freeze([1, 0, 0, 0, 1, 0]);
  const RADIUS = Math.sqrt(3) / 2;

  const SPECTRE = [
    [0, 0],
    [1, 0],
    [1.5, -RADIUS],
    [1.5 + RADIUS, 0.5 - RADIUS],
    [1.5 + RADIUS, 1.5 - RADIUS],
    [2.5 + RADIUS, 1.5 - RADIUS],
    [3 + RADIUS, 1.5],
    [3, 2],
    [3 - RADIUS, 1.5],
    [2.5 - RADIUS, 1.5 + RADIUS],
    [1.5 - RADIUS, 1.5 + RADIUS],
    [0.5 - RADIUS, 1.5 + RADIUS],
    [-RADIUS, 1.5],
    [0, 1],
  ];
  const BASE_QUAD = [SPECTRE[3], SPECTRE[5], SPECTRE[7], SPECTRE[11]];
  const NAMES = ["Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi"];
  const RULES = {
    Gamma: ["Pi", "Delta", null, "Theta", "Sigma", "Xi", "Phi", "Gamma"],
    Delta: ["Xi", "Delta", "Xi", "Phi", "Sigma", "Pi", "Phi", "Gamma"],
    Theta: ["Psi", "Delta", "Pi", "Phi", "Sigma", "Pi", "Phi", "Gamma"],
    Lambda: ["Psi", "Delta", "Xi", "Phi", "Sigma", "Pi", "Phi", "Gamma"],
    Xi: ["Psi", "Delta", "Pi", "Phi", "Sigma", "Psi", "Phi", "Gamma"],
    Pi: ["Psi", "Delta", "Xi", "Phi", "Sigma", "Psi", "Phi", "Gamma"],
    Sigma: ["Xi", "Delta", "Xi", "Phi", "Sigma", "Pi", "Lambda", "Gamma"],
    Phi: ["Psi", "Delta", "Psi", "Phi", "Sigma", "Pi", "Phi", "Gamma"],
    Psi: ["Psi", "Delta", "Psi", "Phi", "Sigma", "Psi", "Phi", "Gamma"],
  };

  const multiply = (a, b) => [
    a[0] * b[0] + a[1] * b[3],
    a[0] * b[1] + a[1] * b[4],
    a[0] * b[2] + a[1] * b[5] + a[2],
    a[3] * b[0] + a[4] * b[3],
    a[3] * b[1] + a[4] * b[4],
    a[3] * b[2] + a[4] * b[5] + a[5],
  ];

  const point = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2], m[3] * v[0] + m[4] * v[1] + m[5]];

  const rotate = (deg) => {
    const rad = (deg * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return [c, -s, 0, s, c, 0];
  };

  const translate = (x, y) => [1, 0, x, 0, 1, y];
  const move = (from, to) => [1, 0, to[0] - from[0], 0, 1, to[1] - from[1]];

  function baseSystem() {
    const system = {};
    for (let i = 0; i < NAMES.length; i++) {
      const name = NAMES[i];
      if (name !== "Gamma") {
        system[name] = { children: [], quad: BASE_QUAD, label: name };
      }
    }
    system.Gamma = {
      children: [
        [{ children: [], quad: BASE_QUAD, label: "Gamma1" }, IDENTITY],
        [
          { children: [], quad: BASE_QUAD, label: "Gamma2" },
          multiply(translate(SPECTRE[8][0], SPECTRE[8][1]), rotate(30)),
        ],
      ],
      quad: BASE_QUAD,
    };
    return system;
  }

  function buildSupertiles(system) {
    const quad = system.Delta.quad;
    const REFLECTION = [-1, 0, 0, 0, 1, 0];
    const steps = [
      [60, 3, 1],
      [0, 2, 0],
      [60, 3, 1],
      [60, 3, 1],
      [0, 2, 0],
      [60, 3, 1],
      [-120, 3, 3],
    ];
    const placements = [IDENTITY];
    let angle = 0;
    let rotation = IDENTITY;

    for (let i = 0; i < steps.length; i++) {
      const [deltaAngle, srcV, tgtV] = steps[i];
      if (deltaAngle) {
        angle += deltaAngle;
        rotation = rotate(angle);
      }
      const rotatedQuad = quad.map((v) => point(rotation, v));
      const alignment = move(rotatedQuad[tgtV], point(placements[placements.length - 1], quad[srcV]));
      placements.push(multiply(alignment, rotation));
    }

    const reflected = placements.map((v) => multiply(REFLECTION, v));
    const superQuad = [
      point(reflected[6], quad[2]),
      point(reflected[5], quad[1]),
      point(reflected[3], quad[2]),
      point(reflected[0], quad[1]),
    ];

    const result = {};
    for (let i = 0; i < NAMES.length; i++) {
      const label = NAMES[i];
      const children = [];
      const rule = RULES[label];
      for (let j = 0; j < rule.length; j++) {
        const name = rule[j];
        if (name) children.push([system[name], reflected[j]]);
      }
      result[label] = { children, quad: superQuad };
    }
    return result;
  }

  function collectTilesAndBounds(rootNode) {
    const tiles = [];
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    function walk(current, currentTransform) {
      if (current.label) {
        tiles.push([current.label, currentTransform]);
        // Calcul des min/max directement ici
        for (let i = 0; i < SPECTRE.length; i++) {
          const pt = SPECTRE[i];
          const x = currentTransform[0] * pt[0] + currentTransform[1] * pt[1] + currentTransform[2];
          const y = currentTransform[3] * pt[0] + currentTransform[4] * pt[1] + currentTransform[5];
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
        return;
      }
      const children = current.children;
      for (let i = 0; i < children.length; i++) {
        const [child, localTransform] = children[i];
        walk(child, multiply(currentTransform, localTransform));
      }
    }

    walk(rootNode, IDENTITY);
    return { tiles, bounds: [minX, minY, maxX, maxY] };
  }

  let system = baseSystem();
  for (let depth = 0; depth < 4; depth++) {
    system = buildSupertiles(system);
  }

  const {
    tiles,
    bounds: [xmin, ymin, xmax, ymax],
  } = collectTilesAndBounds(system.Delta);
  const fullWidth = xmax - xmin;
  const fullHeight = ymax - ymin;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

  const pointsStr = SPECTRE.map(([x, y]) => `${x},${y}`).join(" ");
  let usesHtml = "";
  for (let i = 0; i < tiles.length; i++) {
    const [label, t] = tiles[i];
    const cls = label === "Gamma2" ? "tile accent" : "tile";
    usesHtml += `<use href="#monotile" class="${cls}" transform="matrix(${t[0]} ${t[3]} ${t[1]} ${t[4]} ${t[2]} ${t[5]})" />`;
  }

  svg.innerHTML = `<defs><polygon id="monotile" points="${pointsStr}"/></defs><g>${usesHtml}</g>`;
  mount.appendChild(svg);

  let ticking = false;
  function updateViewBox() {
    const aspect = window.innerWidth / window.innerHeight;
    let w = fullHeight * 0.72 * aspect;
    let h = fullHeight * 0.72;
    if (w > fullWidth * 0.72) {
      w = fullWidth * 0.72;
      h = w / aspect;
    }
    svg.setAttribute("viewBox", `${(xmin + xmax - w) / 2} ${(ymin + ymax - h) / 2} ${w} ${h}`);
    ticking = false;
  }

  function onResize() {
    if (!ticking) {
      requestAnimationFrame(updateViewBox);
      ticking = true;
    }
  }

  updateViewBox();
  window.addEventListener("resize", onResize, { passive: true });
})();
