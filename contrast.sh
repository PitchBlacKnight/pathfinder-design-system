#!/usr/bin/env bash
# WCAG contrast audit across both resolved modes.
#   ./contrast.sh            report + exit 1 on any failure
#   ./contrast.sh --report   report only, always exit 0
#   ./contrast.sh --verbose  also print composited RGB per side
cd "$(dirname "$0")" || exit 1
exec node tools/contrast.mjs "$@"
