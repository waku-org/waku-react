import type { ProtocolCreateOptions, Protocols, Waku } from "@waku/interfaces";
import type { relay, waku } from "@waku/sdk";

export type HookState = {
  isLoading: boolean;
  error: undefined | string;
};

export type CrateNodeResult<T extends Waku> = HookState & {
  node: undefined | T;
};

export type BootstrapNodeOptions<T = {}> = {
  options?: T;
  protocols?: Protocols[];
};

export type LightNodeOptions = ProtocolCreateOptions & waku.WakuOptions;
export type RelayNodeOptions = ProtocolCreateOptions &
  waku.WakuOptions &
  Partial<relay.RelayCreateOptions>;

export type ContentPair = {
  encoder: waku.Encoder;
  decoder: waku.Decoder;
};

export type ReactChildrenProps = {
  children?: React.ReactNode;
};
