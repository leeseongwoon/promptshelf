/** Fallback prompt bodies keyed by title (for legacy/incomplete records). */
export const PROMPT_BODY_BY_TITLE: Record<string, string> = {
  "코드 리뷰어 (버그·성능·보안만)": `너는 엄격하지만 친절한 시니어 코드 리뷰어야. 아래 코드를 리뷰해줘.

규칙:
- 가장 중요한 이슈 **5개만**
- 각 이슈: 심각도(High/Med/Low) / 문제 설명 / 수정 방법(가능하면 코드 스니펫)
- 스타일 취향, 네이밍 취향은 제외
- 버그, 성능, 유지보수성, 보안 중심

출력 형식:
## 한 줄 요약
## 이슈 목록
## (선택) 리팩터링 제안 1개

코드:
\`\`\`
(여기에 코드 붙여넣기)
\`\`\``,

  "버그 리포트 (재현 가능한 형태)": `너는 시니어 QA 엔지니어야. 아래 메모를 개발자가 바로 재현/수정할 수 있는 버그 리포트로 작성해줘.

입력(있는 것만 채워도 됨):
- 제품/기능:
- 기대 동작:
- 실제 동작:
- 재현 단계:
- 환경(브라우저/OS/버전):
- 빈도(항상/가끔):
- 로그/에러 메시지:
- 영향도:

출력 형식:
## 요약 (1문장)
## 재현 단계 (번호)
## 기대 vs 실제
## 환경
## 영향도/우선순위 제안
## 임시 우회 방법(있으면)`,

  "PR 설명 자동 작성 (리뷰어 친화)": `너는 시니어 엔지니어야. 아래 변경 내용을 바탕으로 PR 설명을 작성해줘.

입력:
- 변경 목적:
- 주요 변경 파일/모듈:
- diff 요약(또는 변경 내용 붙여넣기):
- 테스트한 방법:
- 알려진 제한/리스크:

출력 형식:
## What (무엇을 바꿨나)
## Why (왜 바꿨나)
## How (어떻게 구현했나)
## Test plan (체크리스트)
## Risk & rollback
## Screenshots/Notes (해당 시)

톤: 짧고 명확하게. 리뷰어가 2분 안에 이해할 수 있게.`,

  "회의록 → 실행 항목 (액션 아이템)": `너는 프로덕트 매니저야. 아래 회의 메모를 실행 가능한 액션 아이템으로 정리해줘.

규칙:
- 모호한 표현은 구체적인 행동으로 바꾸기
- 담당자/기한이 없으면 [TBD]로 표시
- 중복 항목은 합치기
- 결정 사항(Decisions)과 미결(Open questions)을 분리

회의 메모:
"""
(여기에 회의록 붙여넣기)
"""

출력 형식:
## 핵심 결정 (Decisions)
## 액션 아이템 (표: 우선순위 | 할 일 | 담당 | 기한)
## 미결 사항 (Open questions)
## 다음 회의 전 체크리스트`,

  "랜딩 페이지 카피 3안 (전환 중심)": `너는 전환율에 강한 B2B SaaS 카피라이터야. 아래 제품 정보로 랜딩 페이지 카피 3안을 작성해줘.

입력:
- 제품명:
- 타깃 사용자:
- 핵심 문제:
- 핵심 가치(차별점):
- 가격/플랜(있으면):
- 경쟁 대비 강점:

출력(각 안마다):
1) 톤 라벨 (예: 직설형 / 친근형 / 프리미엄)
2) Hero 헤드라인 (12단어 내)
3) 서브카피 (1~2문장)
4) CTA 문구 2개
5) 핵심 혜택 3개 (아이콘용 한 줄)
6) FAQ 2개

금지: 과장된 유행어, 근거 없는 수치, 모호한 표현.`,

  "STAR 면접 답변 코치 (경험 1개)": `너는 대기업/스타트업 채용을 모두 겪어본 커리어 코치야. 아래 경험을 STAR 면접 답변으로 다듬어줘.

입력:
- 지원 포지션:
- 회사/팀 맥락(선택):
- 내 경험(자유 서술):
- 강조하고 싶은 역량(예: 리더십, 문제해결, 협업):

출력:
## STAR 초안
- Situation:
- Task:
- Action:
- Result: (가능하면 수치/임팩트)

## 1분 답변 (말하기용, 120~150단어)
## 3분 답변 (말하기용)
## 예상 꼬리질문 3개 + 답변 힌트
## 피해야 할 표현/약점 보완 팁`,

  "썸네일·일러스트 프롬프트 (Claude)": `너는 상업용 일러스트 디렉터야. 아래 정보로 이미지 생성 AI에 넣을 프롬프트를 영어로 작성해줘.

입력:
- 주제/오브젝트:
- 스타일(예: flat, 3D, watercolor):
- 분위기/색감:
- 구도(클로즈업/와이드 등):
- 금지 요소:

출력:
1) Positive prompt (1문단, 쉼표 구분 키워드 포함)
2) Negative prompt
3) 권장 비율 (1:1 / 16:9 등)
4) 한국어로 의도 설명 2문장`,

  "유튜브 숏폼 대본 (Gemini)": `너는 60초 숏폼 전문 작가야. 아래 주제로 유튜브 Shorts 대본을 작성해줘.

입력:
- 주제:
- 타깃 시청자:
- 핵심 메시지 1개:
- 톤(정보형/유머/감성):

출력 형식:
## 훅 (0~3초, 1문장)
## 본문 (3~50초, 4~6컷, 컷마다 나레이션)
## CTA (마지막 5초)
## 자막용 한 줄 요약 3개
## 추천 B-roll 키워드`,

  "SQL 분석 질문 → 쿼리 (GPT)": `너는 시니어 데이터 애널리스트야. 아래 질문을 해결하는 SQL을 작성해줘.

입력:
- DB 종류(PostgreSQL/MySQL/BigQuery 등):
- 테이블 스키마(컬럼명/타입):
- 분석 질문:
- 기간/필터 조건:

규칙:
- 읽기 쉬운 SQL (CTE 활용 가능)
- 성능을 고려한 WHERE/JOIN
- 결과 컬럼 alias는 한국어 주석으로 설명

출력:
## 가정
## SQL
## 결과 해석 가이드 (2~3문장)`,
};

export function resolvePromptBody(input: {
  title?: unknown;
  description?: unknown;
  prompt?: unknown;
  content?: unknown;
  body?: unknown;
}): string {
  const legacy = [input.prompt, input.content, input.body].find(
    (v) => typeof v === "string" && v.trim().length > 0,
  );
  if (typeof legacy === "string") return legacy.trim();

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (title && PROMPT_BODY_BY_TITLE[title]) return PROMPT_BODY_BY_TITLE[title];

  const description = typeof input.description === "string" ? input.description.trim() : "";
  if (title && description) {
    return `다음 주제에 맞는 실전형 AI 프롬프트를 작성해줘.\n\n제목: ${title}\n설명: ${description}\n\n출력: 바로 복사해 쓸 수 있는 프롬프트 본문 1개`;
  }

  return title
    ? `제목 "${title}"에 맞는 실용적인 AI 프롬프트를 작성해줘.`
    : "실용적인 AI 프롬프트를 작성해줘.";
}
