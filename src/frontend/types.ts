export interface LanguageBadge {
    name: string;
    color: string;
}

export interface FlagshipProject {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    githubUrl: string;
    mediaType: "video" | "image";
    mediaUrl: string;
    languages: LanguageBadge[];
}

export interface SecondaryRepo {
    name: string;
    description: string;
    githubUrl: string;
    language: LanguageBadge;
}

export interface ClientReview {
    id: string;
    author: string;
    handle: string;
    platform: string;
    date: string;
    rating: number;
    avatarUrl: string;
    text: string;
    externalUrl?: string;
}

export interface SocialContact {
    label: string;
    handle: string;
    url: string;
    accentColor: string;
    copyValue?: string;
}

export interface RatingSummary {
    averageScore: string;
    totalReviews: number;
    fiveStarPercentage: number;
}

export interface RuntimeAssetsManifest {
    ebay_video_url: string;
    fragment_video_url: string;
    osint_image_url: string;
}