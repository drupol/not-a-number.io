#!/usr/bin/env python3
from __future__ import annotations

import argparse
import math
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

Matrix = tuple[float, float, float, float, float, float]
Point = tuple[float, float]

I: Matrix = (1.0, 0.0, 0.0, 0.0, 1.0, 0.0)


def mmul(a: Matrix, b: Matrix) -> Matrix:
    return (
        a[0] * b[0] + a[1] * b[3],
        a[0] * b[1] + a[1] * b[4],
        a[0] * b[2] + a[1] * b[5] + a[2],
        a[3] * b[0] + a[4] * b[3],
        a[3] * b[1] + a[4] * b[4],
        a[3] * b[2] + a[4] * b[5] + a[5],
    )


def transform_point(m: Matrix, p: Point) -> Point:
    x, y = p
    return (
        m[0] * x + m[1] * y + m[2],
        m[3] * x + m[4] * y + m[5],
    )


def rotate(degrees: float) -> Matrix:
    a = math.radians(degrees)
    c, s = math.cos(a), math.sin(a)
    return (c, -s, 0.0, s, c, 0.0)


def translate(x: float, y: float) -> Matrix:
    return (1.0, 0.0, x, 0.0, 1.0, y)


def move(p: Point, q: Point) -> Matrix:
    return translate(q[0] - p[0], q[1] - p[1])


R = math.sqrt(3.0) / 2.0
SPECTRE: tuple[Point, ...] = (
    (0.0, 0.0),
    (1.0, 0.0),
    (1.5, -R),
    (1.5 + R, 0.5 - R),
    (1.5 + R, 1.5 - R),
    (2.5 + R, 1.5 - R),
    (3.0 + R, 1.5),
    (3.0, 2.0),
    (3.0 - R, 1.5),
    (2.5 - R, 1.5 + R),
    (1.5 - R, 1.5 + R),
    (0.5 - R, 1.5 + R),
    (-R, 1.5),
    (0.0, 1.0),
)

BASE_QUAD: tuple[Point, ...] = tuple(SPECTRE[i] for i in (3, 5, 7, 11))

NAMES = ("Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi")

RULES: dict[str, tuple[str | None, ...]] = {
    "Gamma":  ("Pi",  "Delta", None,  "Theta", "Sigma", "Xi",  "Phi",    "Gamma"),
    "Delta":  ("Xi",  "Delta", "Xi",  "Phi",   "Sigma", "Pi",  "Phi",    "Gamma"),
    "Theta":  ("Psi", "Delta", "Pi",  "Phi",   "Sigma", "Pi",  "Phi",    "Gamma"),
    "Lambda": ("Psi", "Delta", "Xi",  "Phi",   "Sigma", "Pi",  "Phi",    "Gamma"),
    "Xi":     ("Psi", "Delta", "Pi",  "Phi",   "Sigma", "Psi", "Phi",    "Gamma"),
    "Pi":     ("Psi", "Delta", "Xi",  "Phi",   "Sigma", "Psi", "Phi",    "Gamma"),
    "Sigma":  ("Xi",  "Delta", "Xi",  "Phi",   "Sigma", "Pi",  "Lambda", "Gamma"),
    "Phi":    ("Psi", "Delta", "Psi", "Phi",   "Sigma", "Pi",  "Phi",    "Gamma"),
    "Psi":    ("Psi", "Delta", "Psi", "Phi",   "Sigma", "Psi", "Phi",    "Gamma"),
}


@dataclass(frozen=True)
class Node:
    children: tuple[tuple["Node", Matrix], ...] = ()
    quad: tuple[Point, ...] = BASE_QUAD
    label: str | None = None


def base_system() -> dict[str, Node]:
    system = {name: Node(label=name) for name in NAMES if name != "Gamma"}

    gamma1 = Node(label="Gamma1")
    gamma2 = Node(label="Gamma2")
    gamma2_transform = mmul(translate(*SPECTRE[8]), rotate(30.0))

    system["Gamma"] = Node(
        children=((gamma1, I), (gamma2, gamma2_transform))
    )
    return system


def build_supertiles(system: dict[str, Node]) -> dict[str, Node]:
    quad = system["Delta"].quad
    reflection: Matrix = (-1.0, 0.0, 0.0, 0.0, 1.0, 0.0)

    placement_steps = (
        (60, 3, 1),
        (0, 2, 0),
        (60, 3, 1),
        (60, 3, 1),
        (0, 2, 0),
        (60, 3, 1),
        (-120, 3, 3),
    )

    placements: list[Matrix] = [I]
    angle = 0.0
    rotation = I

    for delta_angle, source_vertex, target_vertex in placement_steps:
        if delta_angle:
            angle += delta_angle
            rotation = rotate(angle)

        rotated_quad = tuple(transform_point(rotation, p) for p in quad)
        align = move(
            rotated_quad[target_vertex],
            transform_point(placements[-1], quad[source_vertex]),
        )
        placements.append(mmul(align, rotation))

    placements = [mmul(reflection, p) for p in placements]

    super_quad = (
        transform_point(placements[6], quad[2]),
        transform_point(placements[5], quad[1]),
        transform_point(placements[3], quad[2]),
        transform_point(placements[0], quad[1]),
    )

    result: dict[str, Node] = {}
    for label, substitutions in RULES.items():
        children = tuple(
            (system[name], transform)
            for name, transform in zip(substitutions, placements)
            if name is not None
        )
        result[label] = Node(children=children, quad=super_quad)

    return result


def collect(node: Node, transform: Matrix = I) -> list[tuple[str, Matrix]]:
    out: list[tuple[str, Matrix]] = []

    def walk(n: Node, t: Matrix) -> None:
        if n.label is not None:
            out.append((n.label, t))
            return

        for child, local_transform in n.children:
            walk(child, mmul(t, local_transform))

    walk(node, transform)
    return out


def bbox(tiles: Iterable[tuple[str, Matrix]]) -> tuple[float, float, float, float]:
    xs: list[float] = []
    ys: list[float] = []

    for _, transform in tiles:
        for p in SPECTRE:
            x, y = transform_point(transform, p)
            xs.append(x)
            ys.append(y)

    return min(xs), min(ys), max(xs), max(ys)


def svg_matrix(m: Matrix) -> str:
    return (
        f"matrix({m[0]:.8f} {m[3]:.8f} "
        f"{m[1]:.8f} {m[4]:.8f} {m[2]:.8f} {m[5]:.8f})"
    )


def make_svg(
    tiles: list[tuple[str, Matrix]],
    *,
    aspect: float,
    crop: float,
    offset_x: float,
    offset_y: float,
    background: str,
    stroke: str,
    fill: str,
    stroke_opacity: float,
    fill_opacity: float,
    stroke_width: float,
    transparent: bool,
) -> str:
    xmin, ymin, xmax, ymax = bbox(tiles)

    full_w = xmax - xmin
    full_h = ymax - ymin

    crop_h = full_h * crop
    crop_w = crop_h * aspect

    if crop_w > full_w * crop:
        crop_w = full_w * crop
        crop_h = crop_w / aspect

    cx = (xmin + xmax) / 2.0 + offset_x
    cy = (ymin + ymax) / 2.0 + offset_y

    vx = cx - crop_w / 2.0
    vy = cy - crop_h / 2.0

    points = " ".join(f"{x:.8f},{y:.8f}" for x, y in SPECTRE)

    bg = ""
    if not transparent:
        bg = (
            f'  <rect x="{vx:.8f}" y="{vy:.8f}" '
            f'width="{crop_w:.8f}" height="{crop_h:.8f}" '
            f'fill="{background}"/>\n'
        )

    uses = []
    for label, transform in tiles:
        cls = "tile accent" if label == "Gamma2" else "tile"
        uses.append(
            f'    <use href="#monotile" class="{cls}" '
            f'transform="{svg_matrix(transform)}"/>\n'
        )

    return f'''<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="{vx:.8f} {vy:.8f} {crop_w:.8f} {crop_h:.8f}"
  preserveAspectRatio="xMidYMid slice"
  aria-hidden="true">
  <defs>
    <polygon id="monotile" points="{points}"/>
  </defs>

  <style>
    .tile {{
      fill: {fill};
      fill-opacity: {fill_opacity};
      stroke: {stroke};
      stroke-opacity: {stroke_opacity};
      stroke-width: {stroke_width};
      vector-effect: non-scaling-stroke;
    }}

    .accent {{
      fill-opacity: {fill_opacity};
    }}
  </style>

{bg}  <g>
{''.join(uses)}  </g>
</svg>
'''


def parse_aspect(value: str) -> float:
    if ":" in value:
        w, h = value.split(":", 1)
        return float(w) / float(h)
    return float(value)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate an aperiodic Spectre/Tile(1,1) SVG background."
    )
    parser.add_argument("-o", "--output", default="spectre-background.svg")
    parser.add_argument(
        "-d", "--depth", type=int, default=4, choices=range(1, 7),
        metavar="1..6",
        help="Substitution depth; 4 is a good website default."
    )
    parser.add_argument(
        "--seed", choices=NAMES, default="Delta",
        help="Which supertile family to render."
    )
    parser.add_argument(
        "--aspect", type=parse_aspect, default=16 / 9,
        help='Output aspect ratio, e.g. "16:9", "4:3", or "1.777".'
    )
    parser.add_argument("--crop", type=float, default=0.72)
    parser.add_argument("--offset-x", type=float, default=0.0)
    parser.add_argument("--offset-y", type=float, default=0.0)

    parser.add_argument("--background", default="#ffffff")
    parser.add_argument("--stroke", default="#64748b")
    parser.add_argument("--fill", default="#64748b")
    parser.add_argument("--stroke-opacity", type=float, default=0.16)
    parser.add_argument("--fill-opacity", type=float, default=0.025)
    parser.add_argument("--stroke-width", type=float, default=0.7)
    parser.add_argument("--transparent", action="store_true")

    args = parser.parse_args()

    if not 0.05 <= args.crop <= 1.0:
        parser.error("--crop must be between 0.05 and 1.0")

    system = base_system()
    for _ in range(args.depth):
        system = build_supertiles(system)

    tiles = collect(system[args.seed])

    svg = make_svg(
        tiles,
        aspect=args.aspect,
        crop=args.crop,
        offset_x=args.offset_x,
        offset_y=args.offset_y,
        background=args.background,
        stroke=args.stroke,
        fill=args.fill,
        stroke_opacity=args.stroke_opacity,
        fill_opacity=args.fill_opacity,
        stroke_width=args.stroke_width,
        transparent=args.transparent,
    )

    path = Path(args.output)
    path.write_text(svg, encoding="utf-8")

    print(f"Wrote {path} ({len(tiles)} monotiles, {path.stat().st_size / 1024:.1f} KiB)")


if __name__ == "__main__":
    main()
