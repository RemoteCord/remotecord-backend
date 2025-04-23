export interface DownloadAppResponse {
    version: string;
    notes: string;
    pub_date: Date;
    platforms: Platforms;
}

export type Platforms = Record<PlattformsKeys, DownloadValues>
export type PlatformsRedis = Record<PlattformsKeys, string>

export type PlatformsKeys = "windows-x86_64";

export interface DownloadValues {
    signature: string;
    url: string;
}

