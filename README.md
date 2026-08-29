# pharmTech

텍사스 **Pharmacy Technician(약국 테크니션)** 자격증 취득과 취업을 위한 한국어 가이드 사이트.

- 사이트: <https://pharmtech.metacog.co.kr>
- 테마: [Hextra](https://github.com/imfing/hextra) (Hugo Module)
- 호스팅: GitHub Pages (`.github/workflows/hugo.yml`에서 자동 배포)

## 다루는 내용

| 섹션 | 내용 |
|---|---|
| `content/docs/roadmap.md` | 트레이니 등록부터 취업까지 전체 로드맵 |
| `content/docs/certification/` | PTCE(PTCB), ExCPT(NHA), 텍사스 TSBP 등록, 8주 학습 계획 |
| `content/docs/study/` | PTCE 2026 출제 범위 기준 도메인별 학습 노트, Top 약물, 계산, 약어, 연습 문제 |
| `content/docs/jobs/` | 텍사스 채용 시장, 고용주 유형, 이력서, 면접, 지원처 |
| `content/docs/resources/` | 공식 링크, 체크리스트, 용어집, FAQ |

## 로컬 실행

Hugo **extended** 0.148.0 이상과 Go 1.21 이상이 필요합니다(테마를 Hugo Module로 가져오기 때문).

```bash
# 개발 서버
hugo server -D

# 정적 파일 빌드 (public/)
hugo --gc --minify
```

테마 업데이트:

```bash
hugo mod get -u github.com/imfing/hextra
hugo mod tidy
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 빌드해 GitHub Pages로 배포합니다.

- 커스텀 도메인: `static/CNAME` (`pharmtech.metacog.co.kr`)
- 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정해야 합니다
- DNS: `pharmtech` CNAME → `jeonck.github.io`

## 내용에 대한 주의

수수료·요건·시험 출제 범위는 기관 정책에 따라 바뀝니다. 각 문서의 수치는 작성 시점의 공개 정보를 정리한 참고값이며,
실제 신청 전에는 [PTCB](https://www.ptcb.org/)와 [TSBP](https://www.pharmacy.texas.gov/) 공식 페이지에서 확인해야 합니다.
