import type {
    Waku,
} from "@waku/interfaces";

export type CrateWakuHook<T extends Waku> = {
    node: null | T;
    loading: boolean;
    error: null | string;
};
