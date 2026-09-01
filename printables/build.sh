#!/usr/bin/env bash
# 인쇄용 암기 단권화 PDF 생성
#
#   ./printables/build.sh
#
# 결과: static/pharmtech-cheat-sheet.pdf (사이트에서 다운로드되는 파일)
set -euo pipefail

cd "$(dirname "$0")"
FONT_VERSION=5.3.0

# 한글 폰트(Noto Sans KR)를 npm 레지스트리에서 받아 fonts/ 에 둔다. 저장소에는 담지 않는다.
if [ ! -f fonts/noto-sans-kr-korean-400-normal.woff2 ]; then
  echo "폰트 내려받는 중..."
  mkdir -p fonts .tmp
  curl -sSL -o .tmp/nskr.tgz \
    "https://registry.npmjs.org/@fontsource/noto-sans-kr/-/noto-sans-kr-${FONT_VERSION}.tgz"
  tar xzf .tmp/nskr.tgz -C .tmp \
    package/files/noto-sans-kr-korean-400-normal.woff2 \
    package/files/noto-sans-kr-korean-700-normal.woff2 \
    package/files/noto-sans-kr-latin-400-normal.woff2 \
    package/files/noto-sans-kr-latin-700-normal.woff2
  cp .tmp/package/files/*.woff2 fonts/
  rm -rf .tmp
fi

CHROME="${CHROME:-$(command -v chromium || command -v google-chrome || echo /opt/pw-browsers/chromium-1194/chrome-linux/chrome)}"

"$CHROME" --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=../static/pharmtech-cheat-sheet.pdf \
  "file://$(pwd)/cheat-sheet.html"

echo "생성 완료: static/pharmtech-cheat-sheet.pdf"
