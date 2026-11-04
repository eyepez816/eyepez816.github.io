#!/bin/sh
set -e

NAME="${1:-editorial}"
ROOT="$(cd "$(dirname "$0")" && pwd)"
SRC="$ROOT/templates/$NAME"

if [ ! -d "$SRC" ]; then
  echo "Unknown template: $NAME"
  echo "Use one of: editorial midnight scholar studio letter atlas frame newsprint blueprint quartz ledger nova archive workbench summit"
  exit 1
fi

mkdir -p "$ROOT/assets/css" "$ROOT/assets/js" "$ROOT/assets/images"
cp "$SRC/index.html" "$ROOT/index.html"
cp "$SRC/404.html" "$ROOT/404.html"
cp "$SRC/assets/css/styles.css" "$ROOT/assets/css/styles.css"
cp "$SRC/assets/js/main.js" "$ROOT/assets/js/main.js"
cp "$SRC/assets/images/"* "$ROOT/assets/images/"

python3 - "$ROOT/site-config.js" "$NAME" "$ROOT" <<'PY'
import pathlib
import sys

config = pathlib.Path(sys.argv[1])
name = sys.argv[2]
root = pathlib.Path(sys.argv[3])
text = config.read_text()
for option in ("editorial", "midnight", "scholar", "studio", "letter", "atlas", "frame", "newsprint", "blueprint", "quartz", "ledger", "nova", "archive", "workbench", "summit"):
    text = text.replace(f'template: "{option}"', f'template: "{name}"')
config.write_text(text)

# Template files use ../../ paths so they work under /templates/name/.
# After copy, rewrite those to root-relative paths.
replacements = (
    ('../../gallery/', 'gallery/'),
    ('../../site-config.js', 'site-config.js'),
    ('../../assets/js/apply-site-url.js', 'assets/js/apply-site-url.js'),
    ('href="/gallery/"', 'href="gallery/"'),
    ('src="/site-config.js"', 'src="site-config.js"'),
    ('src="/assets/js/apply-site-url.js"', 'src="assets/js/apply-site-url.js"'),
)
for filename in ("index.html", "404.html"):
    path = root / filename
    html = path.read_text()
    for old, new in replacements:
        html = html.replace(old, new)
    path.write_text(html)
PY

echo "Homepage now uses the $NAME template."
echo "Your public URL will be https://YOUR-USERNAME.github.io"
