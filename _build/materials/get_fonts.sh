#!/bin/sh
# Fetch the site fonts (Source Serif 4, JetBrains Mono) for the PDF builders. Inter is already installed.
# Usage: sh _build/materials/get_fonts.sh      → fonts land in /tmp/fonts/gf/ofl (the default FONT_DIR)
set -e
[ -d /tmp/fonts/gf/ofl/sourceserif4 ] && [ -d /tmp/fonts/gf/ofl/jetbrainsmono ] && { echo "fonts already present"; exit 0; }
mkdir -p /tmp/fonts && cd /tmp/fonts
[ -d gf ] || git clone -q --depth 1 --filter=blob:none --sparse https://github.com/google/fonts.git gf
cd gf && git sparse-checkout set ofl/sourceserif4 ofl/jetbrainsmono
ls ofl
