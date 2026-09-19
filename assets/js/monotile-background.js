(() => {
  const mount = document.getElementById("background-canvas");
  if (!mount) return;

  mount.querySelector("img")?.remove();
  mount.querySelector("div")?.remove();

  const SVG_NS = "http://www.w3.org/2000/svg";
  const identity = [1, 0, 0, 0, 1, 0];
  const radius = Math.sqrt(3) / 2;
  const spectre = [
    [0, 0], [1, 0], [1.5, -radius],
    [1.5 + radius, 0.5 - radius], [1.5 + radius, 1.5 - radius],
    [2.5 + radius, 1.5 - radius], [3 + radius, 1.5], [3, 2],
    [3 - radius, 1.5], [2.5 - radius, 1.5 + radius],
    [1.5 - radius, 1.5 + radius], [0.5 - radius, 1.5 + radius],
    [-radius, 1.5], [0, 1],
  ];
  const baseQuad = [spectre[3], spectre[5], spectre[7], spectre[11]];
  const names = ["Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi"];
  const rules = {
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
  const point = (matrix, value) => [
    matrix[0] * value[0] + matrix[1] * value[1] + matrix[2],
    matrix[3] * value[0] + matrix[4] * value[1] + matrix[5],
  ];
  const rotate = (degrees) => {
    const angle = (degrees * Math.PI) / 180;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    return [cosine, -sine, 0, sine, cosine, 0];
  };
  const translate = (x, y) => [1, 0, x, 0, 1, y];
  const move = (from, to) => translate(to[0] - from[0], to[1] - from[1]);

  function baseSystem() {
    const system = {};
    names.filter((name) => name !== "Gamma").forEach((name) => {
      system[name] = { children: [], quad: baseQuad, label: name };
    });
    system.Gamma = {
      children: [
        [{ children: [], quad: baseQuad, label: "Gamma1" }, identity],
        [
          { children: [], quad: baseQuad, label: "Gamma2" },
          multiply(translate(spectre[8][0], spectre[8][1]), rotate(30)),
        ],
      ],
      quad: baseQuad,
    };
    return system;
  }

  function buildSupertiles(system) {
    const quad = system.Delta.quad;
    const reflection = [-1, 0, 0, 0, 1, 0];
    const placementSteps = [[60, 3, 1], [0, 2, 0], [60, 3, 1], [60, 3, 1],
      [0, 2, 0], [60, 3, 1], [-120, 3, 3]];
    const placements = [identity];
    let angle = 0;
    let rotation = identity;

    placementSteps.forEach(([deltaAngle, sourceVertex, targetVertex]) => {
      if (deltaAngle) {
        angle += deltaAngle;
        rotation = rotate(angle);
      }
      const rotatedQuad = quad.map((value) => point(rotation, value));
      const alignment = move(
        rotatedQuad[targetVertex],
        point(placements[placements.length - 1], quad[sourceVertex]),
      );
      placements.push(multiply(alignment, rotation));
    });

    const reflected = placements.map((value) => multiply(reflection, value));
    const superQuad = [
      point(reflected[6], quad[2]), point(reflected[5], quad[1]),
      point(reflected[3], quad[2]), point(reflected[0], quad[1]),
    ];
    const result = {};

    names.forEach((label) => {
      result[label] = {
        children: rules[label]
          .map((name, index) => name ? [system[name], reflected[index]] : null)
          .filter(Boolean),
        quad: superQuad,
      };
    });
    return result;
  }

  function collect(node, transform = identity) {
    const tiles = [];
    function walk(current, currentTransform) {
      if (current.label) {
        tiles.push([current.label, currentTransform]);
        return;
      }
      current.children.forEach(([child, localTransform]) => {
        walk(child, multiply(currentTransform, localTransform));
      });
    }
    walk(node, transform);
    return tiles;
  }

  function bounds(tiles) {
    const xs = [];
    const ys = [];
    tiles.forEach(([, transform]) => {
      spectre.forEach((value) => {
        const [x, y] = point(transform, value);
        xs.push(x);
        ys.push(y);
      });
    });
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }

  function matrix(value) {
    return `matrix(${value[0]} ${value[3]} ${value[1]} ${value[4]} ${value[2]} ${value[5]})`;
  }

  const system = (() => {
    let current = baseSystem();
    for (let depth = 0; depth < 4; depth += 1) current = buildSupertiles(current);
    return current;
  })();
  const tiles = collect(system.Delta);
  const [xmin, ymin, xmax, ymax] = bounds(tiles);
  const fullWidth = xmax - xmin;
  const fullHeight = ymax - ymin;
  const svg = document.createElementNS(SVG_NS, "svg");
  const defs = document.createElementNS(SVG_NS, "defs");
  const polygon = document.createElementNS(SVG_NS, "polygon");
  const group = document.createElementNS(SVG_NS, "g");

  polygon.setAttribute("id", "monotile");
  polygon.setAttribute("points", spectre.map(([x, y]) => `${x},${y}`).join(" "));
  defs.appendChild(polygon);
  svg.appendChild(defs);
  tiles.forEach(([label, transform]) => {
    const use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#monotile");
    use.setAttribute("class", label === "Gamma2" ? "tile accent" : "tile");
    use.setAttribute("transform", matrix(transform));
    group.appendChild(use);
  });
  svg.appendChild(group);
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  mount.appendChild(svg);

  function resize() {
    const aspect = window.innerWidth / window.innerHeight;
    let width = fullHeight * 0.72 * aspect;
    let height = fullHeight * 0.72;
    if (width > fullWidth * 0.72) {
      width = fullWidth * 0.72;
      height = width / aspect;
    }
    svg.setAttribute("viewBox", `${(xmin + xmax - width) / 2} ${(ymin + ymax - height) / 2} ${width} ${height}`);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
})();
