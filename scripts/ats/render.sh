#!/usr/bin/env bash
# Regenera los PDF ATS (una columna, sin foto ni íconos) desde el HTML de esta carpeta.
# No usa cv-data.js. Escribe en la raíz del repo, con nombres distintos a los PDF diseñados.
set -euo pipefail
cd "$(dirname "$0")"
ROOT="$(cd ../.. && pwd)"
CHROME="${CHROME_PATH:-google-chrome}"

# Chrome headless a veces deja el proceso vivo después de escribir el PDF.
render_one() {
  local out="$1" src="$2"
  rm -f "$out"
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --no-first-run --disable-extensions \
    --print-to-pdf="$out" --no-margins "file://$PWD/$src" >/dev/null 2>&1 &
  local pid=$! last=-1 stable=0 sz
  for _ in $(seq 1 60); do
    if [[ -f "$out" ]]; then
      sz=$(stat -c%s "$out" 2>/dev/null || echo 0)
      if [[ "$sz" -gt 1000 && "$sz" == "$last" ]]; then
        stable=$((stable + 1))
        if [[ "$stable" -ge 4 ]]; then
          kill "$pid" 2>/dev/null || true
          wait "$pid" 2>/dev/null || true
          return 0
        fi
      else
        stable=0
      fi
      last=$sz
    fi
    sleep 0.2
  done
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [[ -s "$out" ]]
}

render_one "$ROOT/Nicolas-de-Lara-CV-ATS-EN.pdf" cv-en.html
render_one "$ROOT/Nicolas-de-Lara-CV-ATS-ES.pdf" cv-es.html
echo "OK: Nicolas-de-Lara-CV-ATS-EN.pdf  Nicolas-de-Lara-CV-ATS-ES.pdf"
