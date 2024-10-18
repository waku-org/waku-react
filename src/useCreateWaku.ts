import React from "react";
import type { IWaku, LightNode } from "@waku/interfaces";
import { createLightNode, waitForRemotePeer } from "@waku/sdk";

import type {
  BootstrapNodeOptions,
  CreateNodeResult,
  CreateWakuNodeOptions,
} from "./types";

type NodeFactory<N, T = {}> = (options?: T) => Promise<N>;

type CreateNodeParams<N extends IWaku, T = {}> = BootstrapNodeOptions<T> & {
  factory: NodeFactory<N, T>;
};

const useCreateNode = <N extends IWaku, T = {}>(
  params: CreateNodeParams<N, T>,
): CreateNodeResult<N> => {
  const { factory, options, protocols = [] } = params;

  const [node, setNode] = React.useState<N | undefined>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<undefined | string>(undefined);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    factory(options)
      .then(async (node) => {
        if (cancelled) {
          return;
        }

        await node.start();
        await waitForRemotePeer(node, protocols);

        setNode(node);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(`Failed at creating node: ${err?.message || "no message"}`);
      });

    return () => {
      cancelled = true;
    };
    // TODO: missing any dependencies, it will prevent consecutive update if options change
  }, []);

  return {
    node,
    error,
    isLoading,
  };
};

/**
 * Create Light Node helper hook.
 * @param {Object} params - optional params to configure & bootstrap node
 * @returns {CrateWakuHook} node, loading state and error
 */
export const useCreateLightNode = (
  params?: BootstrapNodeOptions<CreateWakuNodeOptions>,
) => {
  return useCreateNode<LightNode, CreateWakuNodeOptions>({
    ...params,
    factory: createLightNode,
  });
};
