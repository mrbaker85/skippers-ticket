# Skipper Ready

A click-through web course for Year 12 Marine, built from the WA Recreational Skipper's Ticket Workbook (Department of Transport, 8th edition, November 2024). Each chapter is broken into short pages of reading, animations and activities, and ends with the workbook's own self-test questions.

## Use

Open `index.html` (or the Vercel site). Chapters unlock in order and progress is saved in the browser. Add `?teacher` to the URL to open every chapter.

## Structure

- `index.html`: styles and script tags. No build step.
- `js/art.js`: shared illustration library (boats, signs, water, people).
- `js/engine.js`: home chart, page types (learn, watch, try, check, recap, review), progress.
- `js/chNN.js`: one file per chapter.
- `vendor/`: GSAP 3.13 with MotionPath, Draggable and DrawSVG.

## Status

Phase 1: engine, Chapter 1 (The RST) and Chapter 2 (Rules and Regulations). Chapters 3 to 11 and the practice theory test follow in later phases.
