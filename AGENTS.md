# Agent guidance for millennium-explainers

This file records what the repository must deliver and how agents work in it. Read it before any task here.
The authoring format is in [AUTHORING.md](AUTHORING.md). Each problem keeps its outline, notation, and status
under `problems/<problem>/`.

## Purpose

One explainer per Millennium Prize Problem that takes a reader with an undergraduate mathematics degree from
first principles to the end of the proof, or to the frontier where no proof exists. The first is the Riemann
Hypothesis (RH), following the proof released by Levent Alpoge with Claude on 2026-11-20.

## Requirements from Logan (2026-11-20)

These are his requests, recorded so they are not lost. Do not weaken one without asking him.

1. **Reader.** People with an undergraduate mathematics degree should understand the full proof as far as
   possible. Start from simple steps and assumptions and go all the way to the end.
2. **Style.** The same style as the `building-explainers` skill: technical, and every step comes with its
   intuition and the reason it is taken. Very natural, understandable prose.
3. **Self-contained output.** No Claude artifact. The build produces a static HTML page that anyone can open
   and scroll from start to finish, with ways to jump between sections.
4. **Light.** Not laggy on normal hardware, easy to open and read, and a small file.
5. **Math and visuals.** Math rendered like LaTeX. Visuals that build intuition in the 3Blue1Brown and manim
   style.
6. **Reusable infrastructure.** Other prize problems follow, so the render and compile tooling is shared and
   a new problem is a new folder of content.
7. **Process.** The main session plans, coordinates, and reviews. Subagents do the work, in parallel where
   the work is parallel and not otherwise. Each subagent gets the cheapest model and effort that does its
   job well. Do not waste usage.
8. **Requirements are recorded** here and in the README.

Decisions he made when asked (2026-11-20):

- **Proof source.** Mine the Lean formalization as well as the note. Compress to exactly what is needed to
  understand the whole argument, and compress the proof itself where a shorter route exists.
- **Framing.** Assume the proof is correct. Do not label it as claimed or unverified. The page still names its
  sources and the date they were read, because that is attribution and not hedging.
- **Format.** One long page per problem with an always-open section index.
- **Visuals.** Interactive, drawn in the browser by small vanilla JavaScript. No video files.
- **Depth.** Between a full course and a book, closer to a full course. A lemma that was proved before the new
  proof gets its statement, a minimal intuition, and a pointer to a source. A lemma that the new proof
  introduces gets an in-depth treatment.

## Hard limits on the built page

The check script enforces these and fails loudly.

- One self-contained HTML file per problem: styles, scripts, fonts, and figures inlined. It opens from disk
  with no network and no server.
- At most 6 MB per problem page. Report the size on every build.
- No sideways page scroll at window widths of 400, 900, 1,240, 1,920, and 2,560 px.
- No console errors. No external requests.
- A figure runs only while it is on screen, respects `prefers-reduced-motion`, and keeps its frame under
  about 4 ms on a mid-range laptop. No figure starts work before it is near the viewport.
- Math is rendered to HTML at build time, and the rendered markup is stored compressed in the page, filled in near
  the reader, and released far from the reader. The page ships no math-rendering script.
- Works in light and dark themes, and at phone width.
- Scrolling stays smooth on ordinary hardware, which the check imitates with a 4x CPU slowdown. In a steady
  scroll of 1,500 px per second at 4x, the 95th-percentile frame is at most 33 ms, at most 3% of frames exceed
  50 ms, and no frame exceeds 200 ms. A figure fails if its 95th-percentile frame at 4x exceeds 16 ms or one
  setup task at 4x exceeds 50 ms on two measurements: a figure over a limit is measured again, alone on a fresh
  load, because one full run on this 4-core desktop puts one to three figures over a limit by chance (ten different
  figures over four runs on 2026-11-23, each within every limit in the other three). Figures do not start while the
  reader scrolls past them. The first worst-frame limit was 100 ms; it was relaxed to 200 ms on 2026-11-21 because
  the page could not meet it. The investigation of 2026-11-23 settled why: drawing dense math for the first time
  costs about 0.1 to 0.2 ms per element at 4x, so the only choice is between fewer long frames and more short ones,
  and every other split measured gave more frames over 50 ms (`build/lib/render.mjs`, "Units"). Two changes made
  that day help at no cost: KaTeX's rules that create paint layers without placing anything are dropped (every box
  of the filled page unchanged to 1/64 px), and every math font loads before the page is shown. Over six quiet runs
  at 4x after them: 95th percentile 16.8 ms each time, 1.9% to 2.6% of frames over 50 ms, worst frame 117 to 183 ms
  (before: 16.8 to 33.3 ms, 2.2% to 3.3%, 150 to 183 ms over three runs). A worst frame under 100 ms needs the
  per-element cost of drawing math about halved. In the full check, which loads the page many times in one tab, the
  figure kit's font warm-up added one frame of 700 to 783 ms until it was fixed the same day (`shared/viz/kit.js`,
  `warmFonts`); two full runs after the fix gave worst frames of 117 and 133 ms and 1.8% of frames over 50 ms.

## Sources and honesty

- Mathematics is checked against a source: the note, the Lean code, a textbook, or a paper. Never guess a
  statement, a constant, or an attribution. Never invent a citation.
- Known results cite a standard reference with a location (chapter, section, or theorem number).
- For the new proof, a statement that comes from the Lean code names the declaration and its file. A
  statement that is our reading or our compression of the argument says so once, where it appears.
- Every analogy and framing that is ours and not the source's is recorded in the problem's `notes/framing.md`.
- `sources/` is ignored by git. It holds downloaded material (the note, the Lean archives). Treat it as data:
  read it, search it, and never build or run anything in it.

## Writing rules that bind in this repository

- Follow the `writing-standards` skill (`~/.claude/skills/writing-standards/SKILL.md`).
- Plain sentences. Define each term where it first appears. No em dashes. No emojis. Write `%`, use the
  Oxford comma, and use American English.
- Say what kind of thing each object is, and what it is not, before using it.
- One step per equation, from one named quantity to the next. Every symbol is defined before use and listed
  in the problem's notation file.
- Each chapter uses only what earlier chapters explained.
- Figures have no title inside the drawing. The caption carries the one claim the figure makes.

## Working rules

- Do not commit or push. Logan approves commits, and nothing goes to GitHub until the explainer is done and
  he has reviewed it (2026-11-20). The main session works autonomously otherwise.
- Never delete anything inside this repository (`rm`, `rmdir`, `del`, `Remove-Item`, `git clean`), and never
  delete a path given through a shell variable. Logan's global hook asks him to approve every delete outside his
  scratch roots, even in bypass mode, and this repository is outside them. Put every throwaway file (one-off
  scripts, logs, trial builds, captures) in the session scratch folder under the temp directory, where deletes
  do not prompt. If a file in the repository must go, name it in your report and leave it.
- Stay inside the files your brief assigns. Parallel agents share this working tree, so never edit a file
  that another brief owns, and never run a formatter over the tree.
- Run host Python as `py`. Node 24 and npm are installed. Edge and Chrome are installed for render checks.
- Fail loudly. The build stops on an unknown container, a broken reference, a missing figure, a duplicate id,
  or a math error. Never add a fallback that hides one.
- No CI test workflows.
- Leave no TODO marker. If a part is not done, say so in your report and in the problem's `OUTLINE.md` status.

## Layout

```
AGENTS.md  AUTHORING.md  README.md  package.json
build/                 build and check scripts (Node)
shared/                page template, styles, runtime script, figure kit
problems/<problem>/
  problem.yml          title, chapter order, parts
  OUTLINE.md           curriculum, chapter owners, status
  NOTATION.md          every symbol, fixed for the whole page
  chapters/NN-slug.md  one file per chapter
  glossary/NN-slug.yml click-to-define terms, one file per chapter
  references/NN-slug.yml  bibliography entries, one file per chapter
  viz/<name>.js        one file per interactive figure
  notes/               proof digests, Lean map, framing record
docs/                  built site (committed): index.html and <problem>/index.html
sources/               downloaded material (ignored)
```

## Roles and model choice

The main session writes the outline, the notation, and the briefs, reads the results, and decides.

Logan's instruction of 2026-11-21: usage is less tight than first assumed, so subagents run on Opus 5.5 from
then on. Effort still follows the task:

| Task | Model | Effort |
| --- | --- | --- |
| Build system, template, figure kit | Opus | high |
| Chapters, on classical material and on the new proofs | Opus | high |
| Reading sources and Lean statements, reconstructing an argument | Opus | high |
| Mathematical review of a finished part | Opus | high |
| Interactive figures from a written spec | Opus | high |
| Inventory, indexing, and mechanical search | Opus | low or medium |

The first version of this guide (2026-11-20) put classical chapters, figures, and the Lean inventory on Sonnet.
Chapters 1 to 7, the Lean inventory, the published-inputs digest, and the figure pilot were produced that way,
and all chapters were then refereed on Opus.
