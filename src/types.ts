import type {
    Waku,
    Protocols,
} from "@waku/interfaces";
import type {
    CreateOptions,
} from "@waku/create";
import {
    WakuOptions,
    RelayCreateOptions,
} from "@waku/core";

export type CrateWakuHook<T extends Waku> = {
    node: null | T;
    isLoading: boolean;
    error: null | string;
};

export type BootstrapNodeOptions<T = {}> = {
    options?: T,
    protocols?: Protocols[],
};

export type LightNodeOptions = CreateOptions & WakuOptions;
export type RelayNodeOptions = CreateOptions & WakuOptions & Partial<RelayCreateOptions>;
export type FullNodeOptions = CreateOptions & WakuOptions & Partial<RelayCreateOptions>;
