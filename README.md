# KPI Pilot

정적 HTML/CSS/JS로 만든 KPI 대시보드 샘플입니다.

## 실행

`outputs/index.html`을 브라우저에서 직접 열거나, 개발 서버에서 `outputs` 폴더를 정적 파일 루트로 제공하면 됩니다. ES module을 안정적으로 실행하려면 다음처럼 실행하세요.

```powershell
python -m http.server 4173 --directory outputs
```

그 후 `http://localhost:4173`에 접속합니다.

## 구조

- `index.html`: 화면 마크업
- `styles.css`: 반응형 스타일
- `app.js`: 필터·계산·렌더링·입력 상호작용
- `data.js`: 데이터 접근 경계와 샘플 메모리 저장소

`data.js`의 `kpiRepository`를 Supabase 조회/저장 구현으로 교체하면 화면 코드는 그대로 유지할 수 있습니다. 현재 샘플 입력은 브라우저 메모리에만 반영되고 실제 DB에는 저장되지 않습니다.
