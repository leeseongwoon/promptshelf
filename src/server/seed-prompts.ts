import { randomUUID } from "node:crypto";

import type { Prompt } from "@/types/prompt";

export function createSeedPrompts(): Prompt[] {
  const now = new Date().toISOString();

  return [
    {
      id: randomUUID(),
      title: "코드 리뷰어 (버그·성능·보안만)",
      description: "취향 논쟁은 빼고, 바로 고칠 수 있는 이슈 5개만 뽑아주는 리뷰 프롬프트",
      prompt: `너는 엄격하지만 친절한 시니어 코드 리뷰어야. 아래 코드를 리뷰해줘.

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
      tags: ["code-review", "refactor", "security"],
      category: "Coding",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 42,
    },
    {
      id: randomUUID(),
      title: "버그 리포트 (재현 가능한 형태)",
      description: "개발자가 바로 재현·수정할 수 있는 버그 리포트로 정리해주는 템플릿",
      prompt: `너는 시니어 QA 엔지니어야. 아래 메모를 개발자가 바로 재현/수정할 수 있는 버그 리포트로 작성해줘.

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
      tags: ["qa", "bug-report", "template"],
      category: "Product",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 28,
    },
    {
      id: randomUUID(),
      title: "PR 설명 자동 작성 (리뷰어 친화)",
      description: "변경 요약·테스트·리스크·롤백까지 포함한 PR 본문을 빠르게 만드는 프롬프트",
      prompt: `너는 시니어 엔지니어야. 아래 변경 내용을 바탕으로 PR 설명을 작성해줘.

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
      tags: ["pr", "github", "engineering"],
      category: "Coding",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 35,
    },
    {
      id: randomUUID(),
      title: "회의록 → 실행 항목 (액션 아이템)",
      description: "회의 메모를 담당자·기한·우선순위가 있는 실행 목록으로 바꿔주는 프롬프트",
      prompt: `너는 프로덕트 매니저야. 아래 회의 메모를 실행 가능한 액션 아이템으로 정리해줘.

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
      tags: ["meeting", "productivity", "pm"],
      category: "Product",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 19,
    },
    {
      id: randomUUID(),
      title: "랜딩 페이지 카피 3안 (전환 중심)",
      description: "헤드라인·서브·CTA·핵심 혜택을 전환율 관점에서 3가지 톤으로 제안",
      prompt: `너는 전환율에 강한 B2B SaaS 카피라이터야. 아래 제품 정보로 랜딩 페이지 카피 3안을 작성해줘.

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
      tags: ["marketing", "landing-page", "copywriting"],
      category: "Marketing",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 31,
    },
    {
      id: randomUUID(),
      title: "STAR 면접 답변 코치 (경험 1개)",
      description: "내 경험을 STAR 구조로 다듬고, 1분/3분 버전 답변까지 만들어주는 프롬프트",
      prompt: `너는 대기업/스타트업 채용을 모두 겪어본 커리어 코치야. 아래 경험을 STAR 면접 답변으로 다듬어줘.

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
      tags: ["career", "interview", "star"],
      category: "Career",
      authorName: "PromptShelf",
      createdAt: now,
      updatedAt: now,
      upvotes: 22,
    },
  ];
}
