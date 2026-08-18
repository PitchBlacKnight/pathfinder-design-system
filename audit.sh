#!/usr/bin/env bash
# Token-purity audit for whatever is on the stage right now.
# Run after any generation: ./audit.sh   (exit 1 on any violation)
F="${1:-stage/app.html}"
echo ""
echo "  PATHFINDER AUDIT — $F"
echo "  ─────────────────────────────────────────────"
fail=0
hex=$(grep -oE '#[0-9a-fA-F]{3,8}\b' "$F" | wc -l | tr -d ' ')
if [ "$hex" = "0" ]; then echo "  ✓ hardcoded hex colors          0"
else echo "  ✗ hardcoded hex colors          $hex"; grep -nE '#[0-9a-fA-F]{3,8}\b' "$F" | head -5 | sed 's/^/      /'; fail=1; fi
rgb=$(grep -oE '(rgb|hsl)a?\(' "$F" | wc -l | tr -d ' ')
if [ "$rgb" = "0" ]; then echo "  ✓ raw rgb()/hsl() values        0"
else echo "  ✗ raw rgb()/hsl() values        $rgb"; fail=1; fi
fonts=$(grep -oE 'font-family:[^;"]*' "$F" | grep -cv 'var(--pf' | tr -d ' ')
if [ "$fonts" = "0" ]; then echo "  ✓ non-token font-family         0"
else echo "  ✗ non-token font-family         $fonts"; fail=1; fi
inline=$(grep -oE 'var\(--pf[A-Za-z_0-9-]+' "$F" | wc -l | tr -d ' ')
cls=$(grep -oE 'class="[^"]*"' "$F" | grep -oE 'pf-[a-z-]+' | sort -u | wc -l | tr -d ' ')
csstok=$(grep -c "var(--pf" css/pathfinder.css 2>/dev/null | tr -d ' ')
deftok=$(grep -c -- "--pf" tokens/pathfinder.tokens.css 2>/dev/null | tr -d ' ')
echo "  ─────────────────────────────────────────────"
echo "  RESOLUTION CHAIN"
echo "    markup      $cls system classes, $inline inline styles"
echo "    components  $csstok token references"
echo "    tokens      $deftok definitions"
if [ "$fail" = "0" ]; then echo "  RESULT: PASS — every visual value is a token reference"
else echo "  RESULT: FAIL — the file above violates the system"; fi
echo ""
exit $fail
