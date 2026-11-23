# millennium-explainers

Step-by-step explainers of the Millennium Prize Problems for readers with an undergraduate mathematics
degree. Each one is a single web page that starts from first principles and goes to the end of the proof,
with the intuition and the reason behind every step, rendered math, and interactive figures.

| Problem | Page | Status |
| --- | --- | --- |
| Riemann Hypothesis | `docs/riemann/index.html` | complete (2026-11-23) |

## Reading

Open the page for a problem in any browser. Each page is one self-contained file: it needs no network, no
server, and no install. The section index stays open beside the text, and every figure can be played or
moved.

## What every explainer must be

- Understandable, as far as the mathematics allows, to someone with an undergraduate mathematics degree.
- Complete from simple starting assumptions to the end of the proof.
- Technical, with the intuition and the reason for each step in natural prose.
- One static page: scroll from start to finish, or jump between sections.
- Light: at most 6 MB, quick to open, and smooth on ordinary hardware.
- Math rendered as in LaTeX, and visuals in the 3Blue1Brown style that the reader can interact with.
- Sourced: known results cite the literature, and new results cite the proof they come from.

The full requirements, the working rules for agents, and the model guide are in [AGENTS.md](AGENTS.md). The
chapter and figure format is in [AUTHORING.md](AUTHORING.md).

## Building

```
npm install
npm run build          # every problem, into docs/
npm run build riemann  # one problem
npm run check riemann  # size, overflow, console errors, and screenshots
```

Content lives in `problems/<problem>/`: chapters in Markdown with LaTeX math, one JavaScript file per
figure, and YAML for the glossary and the references. The shared template, styles, and figure kit are in
`shared/`, and the build scripts are in `build/`. Adding a problem means adding a folder.

## Sources for the Riemann Hypothesis

- Levent Alpoge with Claude, a four-page remark and a Lean 4 formalization, released 2026-11-20:
  https://alpo.ge/remark.pdf
- Alessandro Maria Masullo, "The Music of the Primes", draft released 2026-11-20:
  https://math216.wordpress.com/2026/11/20/hurried-announcement-alessandro-masullo-grh/
