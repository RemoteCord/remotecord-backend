export interface PosthogWebResult {
    cache_key: string;
    cache_target_age: Date;
    calculation_trigger: null;
    dateFrom: Date;
    dateTo: Date;
    error: null;
    hogql: null;
    is_cached: boolean;
    last_refresh: Date;
    modifiers: Modifiers;
    next_allowed_client_refresh: Date;
    query_status: null;
    results: Result[];
    samplingRate: SamplingRate;
    timezone: string;
    timings: null;
}

export interface Modifiers {
    bounceRateDurationSeconds: null;
    bounceRatePageViewMode: string;
    customChannelTypeRules: null;
    dataWarehouseEventsModifiers: null;
    debug: null;
    inCohortVia: string;
    materializationMode: string;
    optimizeJoinedFilters: boolean;
    personsArgMaxVersion: string;
    personsJoinMode: null;
    personsOnEventsMode: string;
    propertyGroupsMode: string;
    s3TableUseInvalidColumns: null;
    sessionTableVersion: string;
    sessionsV2JoinMode: string;
    useMaterializedViews: boolean;
    usePresortedEventsTable: boolean;
}

export interface Result {
    changeFromPreviousPct: number | null;
    isIncreaseBad: boolean | null;
    key: string;
    kind: string;
    previous: number | null;
    value: number | null;
}

export interface SamplingRate {
    denominator: null;
    numerator: number;
}
