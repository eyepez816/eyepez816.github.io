# Personal Website Templates

Ready-to-edit personal websites. Your live URL is **`https://YOUR-USERNAME.github.io`**.

**Start here:** [Step by step: fork, open in Cursor, publish](WALKTHROUGH.md)

When you create your copy, name the repository **`YOUR-USERNAME.github.io`**. That is what makes the short URL work.

## Choose a template

Preview looks at [gallery/index.html](gallery/index.html). The published starter opens there too. Then put one on the homepage:

```bash
./use-template.sh editorial
./use-template.sh midnight
./use-template.sh scholar
./use-template.sh studio
./use-template.sh letter
./use-template.sh atlas
./use-template.sh frame
./use-template.sh newsprint
./use-template.sh blueprint
./use-template.sh quartz
./use-template.sh ledger
./use-template.sh nova
./use-template.sh archive
./use-template.sh workbench
./use-template.sh summit
```

| Template | Best if you want |
|---|---|
| Editorial | A warm magazine-style portfolio |
| Midnight | A dark, technical developer site |
| Scholar | An academic CV homepage |
| Studio | Bold type and visual project blocks |
| Letter | A quiet one-column page |
| Atlas | A Swiss grid for product and systems work |
| Frame | A visual portfolio of large picture frames |
| Newsprint | A newspaper masthead for writing |
| Blueprint | Technical drawings for engineering |
| Quartz | Minimal luxury with lots of space |
| Ledger | A tabular CV for data and finance |
| Nova | A colorful dark site for creative tech |
| Archive | A museum catalog for history and curation |
| Workbench | An industrial maker / hardware look |
| Summit | Outdoor field notes and landscape |

## Your website URL

Edit [`site-config.js`](site-config.js):

```js
siteUrl: "https://YOUR-USERNAME.github.io",
template: "editorial"
```

Then publish with GitHub Pages from `main` / `/ (root)`. Share:

`https://YOUR-USERNAME.github.io`

## What to edit

1. `site-config.js` — your public URL
2. Root `index.html` — name, about, projects, contact
3. `assets/images/favicon.svg` — initials

## Project map

```text
.
├── WALKTHROUGH.md             # Fork and Cursor steps
├── site-config.js             # Your public URL
├── index.html                 # Your homepage
├── use-template.sh            # Put a look on the homepage
├── gallery/                   # Preview all fifteen looks
└── templates/                 # Fifteen self-contained site looks
```

## License

MIT. Copy, edit, and republish this starter.
