# Modular Scoreboard (Blackjack / Poker)

A simple static web scoreboard meant to be used as a GitHub Pages site. It supports:

- Add / remove players (minimum 2, maximum 8)
- Manually select a dealer
- Start a game with a configurable initial points (default 5000)
- A pot that automatically collects a configurable round minimum (ante) from every player
- Assign the pot to a winner (button) — after awarding, the pot is reset and the next ante is collected automatically
- Two simple modes: Blackjack and Poker (visual mode only)
- Local persistence using localStorage so your table survives refresh

## How to use

1. Open `index.html` (or deploy to GitHub Pages via the repository settings -> Pages -> Source: `main` branch, `/ (root)`).
2. Use the controls at the top to set Mode, Initial Points, and Round Minimum.
3. Add up to 8 players. You must have at least 2 players.
4. Choose the dealer by clicking "Dealer" on a player's card.
5. Click "Start Game" to set everyone to the initial points and collect the first ante.
6. Press a player's "Win Round" button to award the pot to them — the pot will then be collected again automatically for the next round.

## Development / Customization

This is plain HTML/CSS/JavaScript — drop it into any GitHub repository and enable GitHub Pages on the `main` branch root to publish.

Files:
- `index.html` — UI
- `styles.css` — styling
- `app.js` — application logic

## Notes

- Scores can go negative if a player doesn't have enough for the ante (this is by design for simplicity; you can change the logic in `collectAnte()` in `app.js` if you'd prefer to cap at zero).
- The modes (`blackjack`/`poker`) are currently labels only — the scoring rules are the same by design to keep the app simple and generic.

---

If you'd like, I can add exporting CSV, a compact printable layout, or other features — let me know which you prefer.

## Auto-deploy to GitHub Pages ✅

A GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) is included to automatically publish the repository root to the `gh-pages` branch on every push to `main`.

After the first successful workflow run, enable Pages for the repository in Settings → Pages and set the source branch to **gh-pages** (the action will commit the built site to that branch). The site URL will be `https://<your-username>.github.io/<repo-name>/` — for this repo it will be:

`https://benjaminketchum.github.io/blackjackkeeperofscoresfr/`

If you'd like, I can also add a status badge to the README or adjust the workflow to publish only a `dist/` folder if you later add a build step.