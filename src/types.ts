import { RelayCreateOptions, WakuOptions } from "@waku/core";
import type { Decoder, Encoder } from "@waku/core/dist/lib/message/version_0";
import type { CreateOptions } from "@waku/create";
import type { Protocols, Waku } from "@waku/interfaces";

export type HookState = {
  isLoading: boolean;
  error: undefined | string;
};

export type CreateNodeResult<T extends Waku> = HookState & {
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

export type ContentPair = {
  encoder: Encoder;
  decoder: Decoder;
};

export type ReactChildrenProps = {
  children?: React.ReactNode;
};
