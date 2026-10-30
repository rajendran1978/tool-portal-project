# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files open directly in a browser.

## Project Structure

- `index.html`: portal homepage with a card for the total resistance solver
- `tools/`: one page per tool (`total-resistance.html` is the first)
- `css/styles.css`: shared styles, including the light and dark colours
- `js/theme.js`: light/dark theme toggle, shared by every page
- `js/total-resistance.js`: logic for the total resistance solver
- `README.md`
- `CLAUDE.md` (this file)

Update this section as files and folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Feature Plan

A web portal where visitors try small Electrical Engineering tools, for students and hobbyists.

### Portal structure

- **Homepage** (`index.html`): portal title, a one-line intro, and a card for each tool.
- **Opening a tool:** the visitor clicks a tool's card on the homepage, which opens that tool's own page in `tools/`.
- **Getting back:** every tool page has a "Back to all tools" link to the homepage.
- **Adding a tool later:** create one new page in `tools/`, with its own script in `js/`, then add one card for it on the homepage. Shared styling stays in `css/` and the theme toggle in `js/`.

### Phases

1. **Phase 1:** the portal plus its first tool, the total resistance solver (series or parallel).
   - [x] Portal homepage with a placeholder "Tool 1 — coming soon" card that opens and closes (neutral styling for now)
   - [x] Build the total resistance solver, replacing the placeholder card and page (plain styling)
2. **Phase 2:** add more Electrical Engineering tools, one at a time.
3. **Phase 3:** make tools easier to find as the list grows (grouping, search).

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess.
