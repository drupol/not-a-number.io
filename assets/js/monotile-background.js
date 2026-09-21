(() => {
  const mount = document.getElementById("background-canvas");
  if (!mount) return;

  mount.replaceChildren();

  const SVG_NS = "http://www.w3.org/2000/svg";
  const IDENTITY = Object.freeze([1, 0, 0, 0, 1, 0]);
  const RADIUS = Math.sqrt(3) / 2;

  const HAT = [
    [0, 4 * RADIUS],
    [0.5, 3 * RADIUS],
    [1.5, 3 * RADIUS],
    [1.5, RADIUS],
    [3, 0],
    [3.5, RADIUS],
    [4.5, RADIUS],
    [4.5, 3 * RADIUS],
    [6, 4 * RADIUS],
    [5.5, 5 * RADIUS],
    [4.5, 5 * RADIUS],
    [3.5, 5 * RADIUS],
    [3, 4 * RADIUS],
    [1.5, 5 * RADIUS],
  ];
  const BASE_QUAD = [HAT[1], HAT[3], HAT[9], HAT[13]];
  const FLIP = [-0.5, -RADIUS, 6, -RADIUS, 0.5, 8 * RADIUS];
  const RULES = [
    [60, 2, 0, false],
    [120, 2, 0, false],
    [0, 1, 1, true],
    [-120, 2, 2, false],
    [-60, 2, 0, false],
    [0, 2, 0, false],
  ];

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
    return {
      H8: { children: [[{ label: "hat" }, IDENTITY]], quad: BASE_QUAD },
      H7: {
        children: [
          [{ label: "hat" }, IDENTITY],
          [{ label: "flipped" }, FLIP],
        ],
        quad: BASE_QUAD,
      },
    };
  }

  function buildSupertiles(system) {
    const h8 = system.H8;
    const h7 = system.H7;
    const children = [[h8, IDENTITY]];
    const quads = [h8.quad];

    for (let i = 0; i < RULES.length; i++) {
      const [deg, tgtV, srcV, isH7] = RULES[i];
      const rot = deg ? rotate(deg) : IDENTITY;
      const child = isH7 ? h7 : h8;
      const rotQuad = child.quad.map((v) => point(rot, v));
      const align = move(rotQuad[tgtV], quads[i][srcV]);
      const childTransform = deg ? multiply(align, rot) : align;

      children.push([child, childTransform]);
      quads.push(child.quad.map((v) => point(childTransform, v)));
    }

    const superQuad = [quads[1][3], quads[2][0], quads[4][3], quads[6][0]];
    return {
      H8: { children, quad: superQuad },
      H7: { children: children.slice(0, 6), quad: superQuad },
    };
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
        for (let i = 0; i < HAT.length; i++) {
          const pt = HAT[i];
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
  } = collectTilesAndBounds(system.H8);
  const fullWidth = xmax - xmin;
  const fullHeight = ymax - ymin;

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");

  const pointsStr = HAT.map(([x, y]) => `${x},${y}`).join(" ");
  let usesHtml = "";
  for (let i = 0; i < tiles.length; i++) {
    const [label, t] = tiles[i];
    const cls = label === "flipped" ? "tile accent" : "tile";
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
