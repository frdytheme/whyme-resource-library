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
      "인스타그램 게시물, 태그, 댓글, 프로필 사진 노출 등 안전을 위한 기본 설정을 점검하세요.",
    keywords: ["SNS", "인스타그램", "카카오톡", "카톡", "태그", "댓글", "프로필", "개인정보"],
    resourceIds: [
      "instagram-private-account",
      "instagram-tag-mention-limit",
      "instagram-comment-filter",
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
];
