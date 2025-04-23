export interface PatreonWebhookResponse {
    data: Data;
    included: Included[];
    links: WebhookResponseLinks;
}

export interface Data {
    attributes: DataAttributes;
    id: string;
    relationships: Relationships;
    type: string;
}

export interface DataAttributes {
    campaign_lifetime_support_cents: number;
    currently_entitled_amount_cents: number;
    email: string;
    full_name: string;
    is_follower: boolean;
    is_free_trial: boolean;
    is_gifted: boolean;
    last_charge_date: null;
    last_charge_status: null;
    lifetime_support_cents: number;
    next_charge_date: Date;
    note: string;
    patron_status: string;
    pledge_cadence: number;
    pledge_relationship_start: Date;
    will_pay_amount_cents: number;
}

export interface Relationships {
    address: Address;
    campaign: Campaign;
    currently_entitled_tiers: Address;
    user: Campaign;
}

export interface Address {
    data: DAT[] | null;
}

export interface DAT {
    id: string;
    type: string;
}

export interface Campaign {
    data: DAT;
    links: CampaignLinks;
}

export interface CampaignLinks {
    related: string;
}

export interface Included {
    attributes: IncludedAttributes;
    id: string;
    type: string;
}

export interface IncludedAttributes {
    created_at?: Date;
    creation_name?: string;
    discord_server_id?: null;
    google_analytics_id?: null;
    has_rss?: boolean;
    has_sent_rss_notify?: boolean;
    image_small_url?: string;
    image_url: null | string;
    is_charged_immediately?: boolean;
    is_monthly?: boolean;
    is_nsfw?: boolean;
    main_video_embed?: null;
    main_video_url?: null;
    one_liner?: string;
    patron_count?: number;
    pay_per_name?: string;
    pledge_url?: string;
    published_at?: Date;
    rss_artwork_url?: null;
    rss_feed_title?: null;
    summary?: null;
    thanks_embed?: string;
    thanks_msg?: string;
    thanks_video_url?: string;
    url: string;
    vanity?: string;
    about?: string;
    created?: Date;
    first_name?: string;
    full_name?: string;
    hide_pledges?: boolean;
    is_creator?: boolean;
    last_name?: string;
    like_count?: number;
    social_connections?: SocialConnections;
    thumb_url?: string;
    amount_cents?: number;
    description?: string;
    discord_role_ids?: null;
    edited_at?: Date;
    post_count?: number;
    published?: boolean;
    remaining?: null;
    requires_shipping?: boolean;
    title?: string;
    unpublished_at?: null;
    user_limit?: null;
}

export interface SocialConnections {
    discord: null;
    facebook: null;
    google: null;
    instagram: null;
    reddit: null;
    spotify: null;
    spotify_open_access: null;
    tiktok: null;
    twitch: null;
    twitter: null;
    twitter2: null;
    vimeo: null;
    youtube: null;
}

export interface WebhookResponseLinks {
    self: string;
}
