#!/usr/bin/env bash
# init.sh — Verificacion e inicializacion del entorno DEVOOPS Agents
#
# Este script lo ejecuta el agente al COMENZAR una sesion y antes de
# declarar cualquier tarea como `done`. Si falla, la sesion no debe avanzar.

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "--- 1. Verificando entorno ---"

# Python disponible
PYTHON=""
for candidate in python py python3; do
  if command -v "$candidate" >/dev/null 2>&1; then
    VERSION=$("$candidate" --version 2>&1 | tr -d '\r')
    case "$VERSION" in
      "Python"*) PYTHON="$candidate"; break ;;
    esac
  fi
done
if [ -z "$PYTHON" ]; then
  fail "Python no esta instalado (busque python, py, python3)"
  exit 1
fi
ok "$PYTHON -> $($PYTHON --version 2>&1 | tr -d '\r')"

# Git disponible
if ! command -v git >/dev/null 2>&1; then
  fail "git no esta instalado"
  exit 1
fi
ok "git -> $(git --version 2>&1 | tr -d '\r')"

# Verificar que estamos en devoops-agents
if [ "$(basename "$(pwd)")" != "devoops-agents" ]; then
  warn "No parece que estemos en devoops-agents (pwd=$(pwd))"
fi

echo ""
echo "--- 2. Verificando archivos base del arnes ---"

for f in AGENTS.md feature_list.json progress/current.md docs/architecture.md docs/conventions.md docs/verification.md CHECKPOINTS.md; do
  if [ ! -f "$f" ]; then
    fail "Falta archivo base: $f"
    EXIT_CODE=1
  else
    ok "Existe $f"
  fi
done

echo ""
echo "--- 3. Validando feature_list.json ---"

$PYTHON - <<'PY'
import json, sys
try:
    data = json.load(open("feature_list.json"))
    valid = {"pending", "in_progress", "done", "blocked"}
    in_progress = [f for f in data["features"] if f["status"] == "in_progress"]
    if len(in_progress) > 1:
        print(f"[FAIL]  Hay {len(in_progress)} features en in_progress (maximo 1)")
        sys.exit(1)
    for f in data["features"]:
        if f["status"] not in valid:
            print(f"[FAIL]  Estado invalido en feature {f['id']}: {f['status']}")
            sys.exit(1)
    print(f"[OK]    feature_list.json valido ({len(data['features'])} features)")
except Exception as e:
    print(f"[FAIL]  feature_list.json invalido: {e}")
    sys.exit(1)
PY

if [ $? -ne 0 ]; then EXIT_CODE=1; fi

echo ""
echo "--- 4. Resumen ---"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Entorno listo. Puedes empezar a trabajar."
else
  fail "Entorno NO esta listo. Resuelve los errores antes de avanzar."
fi

exit $EXIT_CODE
