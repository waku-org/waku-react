import type {
    Waku,
} from "@waku/interfaces";

export type CrateWakuHook<T extends Waku> = {
    node: null | T;
    isLoading: boolean;
    error: null | string;
};
