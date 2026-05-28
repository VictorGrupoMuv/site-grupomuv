#!/usr/bin/env python3
"""
unify.py — Inline styles.css + components.jsx + pages.jsx + app.jsx into index.html

Usage:
    python3 scripts/unify.py            # roda a partir da raiz do projeto
    python3 scripts/unify.py --check    # só valida sem reescrever index.html

A "fonte de verdade editável" são:
    - styles.css
    - components.jsx
    - pages.jsx
    - app.jsx
    - scripts/index.template.html  (template do index.html com placeholders)

O index.html final é GERADO — não edite ele à mão, edite os arquivos source e
rode este script (ou deixa o Netlify rodar via `build` script no netlify.toml).

Para preservar escapes JavaScript (ex: "CONVOCASSO\\nItaú"), usamos str.replace,
NÃO re.sub — re.sub interpretaria \\n como newline real e quebraria as strings.
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "index.template.html"
INDEX_OUT = ROOT / "index.html"

SOURCES = {
    "css": ROOT / "styles.css",
    "components": ROOT / "components.jsx",
    "pages": ROOT / "pages.jsx",
    "app": ROOT / "app.jsx",
}


def read(p: Path) -> str:
    with p.open("r", encoding="utf-8") as f:
        return f.read()


def main(check_only: bool = False) -> int:
    missing = [str(p) for p in SOURCES.values() if not p.exists()]
    if not TEMPLATE.exists():
        missing.append(str(TEMPLATE))
    if missing:
        print("ERROR — missing source files:", file=sys.stderr)
        for m in missing:
            print(f"  - {m}", file=sys.stderr)
        return 1

    html = read(TEMPLATE)
    css = read(SOURCES["css"])
    components_jsx = read(SOURCES["components"])
    pages_jsx = read(SOURCES["pages"])
    app_jsx = read(SOURCES["app"])

    placeholders = {
        "<!-- INLINE_STYLES -->": "<style>\n" + css + "\n  </style>",
        "<!-- INLINE_SCRIPTS -->": (
            '<script type="text/babel" data-file="components.jsx">\n'
            + components_jsx
            + '\n  </script>\n\n'
            '  <script type="text/babel" data-file="pages.jsx">\n'
            + pages_jsx
            + '\n  </script>\n\n'
            '  <script type="text/babel" data-file="app.jsx">\n'
            + app_jsx
            + '\n  </script>'
        ),
    }

    for marker, content in placeholders.items():
        count = html.count(marker)
        if count != 1:
            print(f"ERROR — expected exactly 1 occurrence of {marker!r}, found {count}", file=sys.stderr)
            return 2
        html = html.replace(marker, content)

    if check_only:
        print(f"OK — template + sources resolve to {len(html)} bytes (not written)")
        return 0

    with INDEX_OUT.open("w", encoding="utf-8") as f:
        f.write(html)

    # Sanity: escape sequences preserved?
    with INDEX_OUT.open("rb") as f:
        data = f.read()
    backslash_n_ok = b'\\n' in data
    if not backslash_n_ok:
        print("WARNING — no literal \\n found in output. Escape sequences may have been corrupted.", file=sys.stderr)

    print(f"OK — wrote {INDEX_OUT.relative_to(ROOT)} ({len(html)} bytes)")
    print(f"     css={len(css)}b  components={len(components_jsx)}b  pages={len(pages_jsx)}b  app={len(app_jsx)}b")
    return 0


if __name__ == "__main__":
    check = "--check" in sys.argv
    sys.exit(main(check_only=check))
