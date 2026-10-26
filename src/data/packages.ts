import { ResourcePackage } from "@/types/resource";

export const packages: ResourcePackage[] = [
  {
    id: "new-semester-safety",
    title: "신학기 미리 하면 좋은 설정 모음",
    description:
      "새 학기 단체방, 프로필 노출, 낯선 연락처럼 학기 초에 자주 생기는 온라인 접점을 미리 점검하세요.",
    keywords: ["신학기", "새학기", "단톡방", "프로필", "카카오톡", "카톡", "학교"],
    resourceIds: [
      "kakao-groupchat-safety-settings",
      "kakao-profile-photo-visibility",
      "kakao-profile-photo-private-only",
      "kakao-phone-number-friend-block",
      "kakao-quiet-chatroom-setting",
    ],
  },
  {
    id: "before-youtube-start",
    title: "유튜브 주기 전 먼저 체크할 설정",
    description:
      "아이에게 유튜브 사용을 허용하기 전에 추천 영상, 쇼츠, 제한모드처럼 기본 시청 환경을 먼저 정리하세요.",
    keywords: ["유튜브", "쇼츠", "제한모드", "알고리즘", "시청기록", "처음"],
    resourceIds: [
      "youtube-restricted-mode",
      "youtube-watch-history-reset",
      "youtube-shorts-hide-30days",
      "youtube-shorts-feed-limit",
      "youtube-feedback-controls",
    ],
  },
  {
    id: "before-kakao-start",
    title: "카카오톡 처음 쓰기 전 점검할 설정",
    description:
      "카카오톡을 처음 쓰기 시작할 때 프로필, 친구추가, 단톡방 초대, 대화 안전 기능을 함께 확인하세요.",
    keywords: ["카카오톡", "카톡", "처음", "프로필", "친구추가", "단톡방", "톡사이렌"],
    resourceIds: [
      "kakao-talk-siren",
      "kakao-profile-photo-visibility",
      "kakao-profile-photo-private-only",
      "kakao-phone-number-friend-block",
      "kakao-groupchat-safety-settings",
    ],
  },
  {
    id: "groupchat-safety",
    title: "단톡방 문제가 걱정될 때 보는 자료",
    description:
      "반복 초대, 단체방 압박, 대화 피로감, 기록 보관처럼 단톡방 안에서 생길 수 있는 문제를 예방하고 대처하세요.",
    keywords: ["단톡방", "단체방", "그룹채팅", "괴롭힘", "초대", "캡처", "학폭"],
    resourceIds: [
      "kakao-groupchat-safety-settings",
      "kakao-chat-input-lock",
      "kakao-quiet-chatroom-setting",
      "kakao-chat-capture-export",
      "school-violence-checklist",
      "school-violence-victim-guide",
    ],
  },
  {
    id: "sns-account-start",
    title: "인스타그램 필수 기본 설정",
    description:
      "인스타그램 계정 공개 범위, 태그·언급, 댓글, DM 허용 범위 등 안전을 위한 기본 설정을 점검하세요.",
    keywords: ["SNS", "인스타그램", "카카오톡", "카톡", "태그", "댓글", "프로필", "개인정보", "DM"],
    resourceIds: [
      "instagram-private-account",
      "instagram-tag-mention-limit",
      "instagram-comment-filter",
      "instagram-dm-filtering",
    ],
  },
  {
    id: "game-chat-safety",
    title: "게임 채팅이 걱정될 때 먼저 볼 자료",
    description:
      "음성 채팅 앱 '디스코드' 내에서 낯선 위험을 막는 설정과 '온라인 관계'에서 나를 지킬 체크리스트를 확인하세요.",
    keywords: ["게임", "디스코드", "DM", "채팅", "민감 콘텐츠", "낯선 사람"],
    resourceIds: [
      "discord-sensitive-content-filter",
      "discord-dm-filtering",
      "grooming-checklist",
      "gaslighting-checklist"
    ],
  },
  {
    id: "online-spending-risk",
    title: "온라인 결제와 현질이 걱정될 때",
    description:
      "게임 결제, 충동 구매, 도박성 요소가 걱정될 때 가족이 먼저 확인하고 약속할 자료를 모았습니다.",
    keywords: ["현질", "온라인 결제", "게임 결제", "충동 결제", "도박", "가족 약속"],
    resourceIds: [
      "game-minimum-checklist",
      "online-spending-rule-contract",
      "gambling-warning-checklist",
    ],
  },
  {
    id: "stranger-dm-safety",
    title: "낯선 사람 연락이나 DM이 걱정될 때",
    description:
      "카카오톡, 인스타그램, 디스코드에서 낯선 사람과 연결되는 접점을 줄이고 위험 신호를 살펴보는 자료입니다.",
    keywords: ["DM", "낯선 사람", "카카오톡", "인스타그램", "디스코드", "그루밍"],
    resourceIds: [
      "kakao-talk-siren",
      "kakao-phone-number-friend-block",
      "discord-dm-filtering",
      "instagram-private-account",
      "instagram-dm-filtering",
      "grooming-checklist",
    ],
  },
  {
    id: "harmful-content-ad-safety",
    title: "유해 콘텐츠와 광고 노출을 줄이고 싶을 때",
    description:
      "영상, 이미지, 광고가 과하게 노출되지 않도록 플랫폼 설정과 콘텐츠 판단 기준을 함께 확인합니다.",
    keywords: ["유해 콘텐츠", "광고", "제한모드", "디스코드", "브라우저", "미디어 기준"],
    resourceIds: [
      "youtube-restricted-mode",
      "youtube-feedback-controls",
      "discord-sensitive-content-filter",
      "browser-ad-blocker-install",
      "media-yellow-list",
    ],
  },
  {
    id: "school-violence-response",
    title: "학교폭력과 사이버폭력 대응이 필요할 때",
    description:
      "단톡방 괴롭힘, 사이버폭력, 피해 호소가 있을 때 기록 보관과 대처 순서를 차분히 확인하는 자료입니다.",
    keywords: ["학교폭력", "사이버폭력", "단톡방", "괴롭힘", "증거", "대처"],
    resourceIds: [
      "school-violence-checklist",
      "school-violence-victim-guide",
      "kakao-chat-capture-export",
      "kakao-groupchat-safety-settings",
      "kakao-quiet-chatroom-setting",
    ],
  },
  {
    id: "family-media-rule-start",
    title: "가족 미디어 규칙을 처음 만들 때",
    description:
      "시간 제한보다 먼저 가족이 함께 기준을 세우고, 콘텐츠 선택과 게임 사용 약속을 정리하는 자료입니다.",
    keywords: ["가족 규칙", "미디어 약속", "게임 규칙", "쇼츠", "콘텐츠 선택", "WMQI"],
    resourceIds: [
      "family-media-rule-contract",
      "smartphone-charging-zone",
      "game-minimum-checklist",
      "wmqi-content-evaluation-sheet",
      "wmqi-youtuber-selection",
    ],
  },
  {
    id: "shortform-overuse-settings",
    title: "숏폼을 너무 많이 보는 아이를 위한 설정들",
    description:
      "쇼츠가 계속 이어지는 흐름을 잠시 끊고, 추천 알고리즘과 시청 기록을 정리해 아이가 스스로 멈출 수 있는 환경을 만드는 설정 모음입니다.",
    keywords: ["숏폼", "쇼츠", "유튜브", "시청기록", "알고리즘", "피드 제한"],
    resourceIds: [
      "youtube-shorts-hide-30days",
      "youtube-shorts-feed-limit",
      "youtube-watch-history-reset",
    ],
  },
  {
    id: "healthy-media-habits",
    title: "건강한 미디어 이용 습관으로 시작하고 싶어요",
    description:
      "스마트폰을 내려놓는 환경, 좋은 콘텐츠를 고르는 기준, 알고리즘 조정, 짧은 시청 기록까지 건강한 이용 습관을 만드는 자료입니다.",
    keywords: ["미디어 습관", "콘텐츠 평가", "유튜버 선택", "스마트폰존", "3줄 일지", "알고리즘"],
    resourceIds: [
      "smartphone-charging-zone",
      "wmqi-youtuber-selection",
      "wmqi-content-evaluation-sheet",
      "youtube-feedback-controls",
      "three-line-media-journal",
    ],
  },
];
