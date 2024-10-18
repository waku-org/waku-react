import type { IWaku, Protocols } from "@waku/interfaces";
import type { waku } from "@waku/sdk";
export type { CreateWakuNodeOptions } from "@waku/sdk";

export type HookState = {
  isLoading: boolean;
  error: undefined | string;
};

export type CreateNodeResult<T extends IWaku> = HookState & {
  node: undefined | T;
};

export type BootstrapNodeOptions<T = {}> = {
  options?: T;
  protocols?: Protocols[];
};

export type ContentPair = {
  encoder: waku.Encoder;
  decoder: waku.Decoder;
};

export type ReactChildrenProps = {
  children?: React.ReactNode;
};
