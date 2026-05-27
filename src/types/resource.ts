export type ResourceCategory = "platform_safety" | "checklist_contract" | "healthy_media_culture";

export type ResourceSubCategory =
  | "youtube"
  | "instagram"
  | "kakao"
  | "discord"
  | "ad_block"
  | "digital_sex_crime"
  | "school_violence"
  | "gambling"
  | "game_control"
  | "media_rules"
  | "media_literacy"
  | "wmqi";

export type ResourceType =
  | "setting_guide"
  | "checklist"
  | "contract"
  | "response_guide"
  | "culture_guide";

export type ResourceDifficulty = "easy" | "normal" | "advanced";

export type ConcernId =
  | "harmful_content"
  | "shorts_overuse"
  | "comment_influence"
  | "sns_exposure"
  | "digital_sex_crime"
  | "game_chat_risk"
  | "stranger_contact"
  | "game_conflict"
  | "family_media_rules"
  | "content_quality"
  | "youtube_choice"
  | "unwanted_tagging"
  | "groupchat_bullying"
  | "paid_game_spending"
  | "online_privacy"
  | "evidence_capture"
  | "school_violence"
  | "grooming_risk"
  | "gambling_risk"
  | "ad_exposure";

export type Resource = {
  id: string;
  title: string;
  category: ResourceCategory;
  subCategory: ResourceSubCategory;
  type: ResourceType;
  description: string;
  keywords: string[];
  tags: string[];
  relatedConcerns: ConcernId[];
  isHidden?: boolean;
  isRecommended?: boolean;
  difficulty: ResourceDifficulty;
  estimatedTime: string;
  recommendedAge: string[];
  image?: string;
  imageGuideGroups?: ImageGuideGroup[];
  videoGuides?: VideoGuide[];
  youtubeId?: string;
  downloadUrl?: string;
};

export type ImageGuideGroup = {
  id: string;
  label: string;
  directory: string;
};

export type VideoGuide = {
  title: string;
  url: string;
  description?: string;
};

export type Concern = {
  id: ConcernId;
  title: string;
  description: string;
  keywords: string[];
  resourceIds: string[];
};

export type PackageId =
  | "new-semester-safety"
  | "before-youtube-start"
  | "before-kakao-start"
  | "groupchat-safety"
  | "sns-account-start"
  | "game-chat-safety";

export type ResourcePackage = {
  id: PackageId;
  title: string;
  description: string;
  keywords: string[];
  resourceIds: string[];
};
