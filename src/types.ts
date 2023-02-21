import { RelayCreateOptions, WakuOptions } from "@waku/core";
import type { CreateOptions } from "@waku/create";
import type { Protocols, Waku } from "@waku/interfaces";

export type HookState = {
  isLoading: boolean;
  error: undefined | string;
};

export type CrateWakuHook<T extends Waku> = HookState & {
  node: undefined | T;
};

export type BootstrapNodeOptions<T = {}> = {
  options?: T;
  protocols?: Protocols[];
};

export type LightNodeOptions = CreateOptions & WakuOptions;
export type RelayNodeOptions = CreateOptions &
  WakuOptions &
  Partial<RelayCreateOptions>;
export type FullNodeOptions = CreateOptions &
  WakuOptions &
  Partial<RelayCreateOptions>;
