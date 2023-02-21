import React from "react";
import { waitForRemotePeer } from "@waku/core";
import { createFullNode, createLightNode, createRelayNode } from "@waku/create";
import type { FullNode, LightNode, RelayNode, Waku } from "@waku/interfaces";

import type {
  BootstrapNodeOptions,
  CrateWakuHook,
  FullNodeOptions,
  LightNodeOptions,
  RelayNodeOptions,
} from "./types";

type NodeFactory<N, T = {}> = (options?: T) => Promise<N>;

type CreateNodeParams<N extends Waku, T = {}> = BootstrapNodeOptions<T> & {
  factory: NodeFactory<N, T>;
};

const useCreateNode = <N extends Waku, T = {}>(
  params: CreateNodeParams<N, T>,
): CrateWakuHook<N> => {
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
  }, [factory, options, protocols, setNode, setLoading, setError]);

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
  params?: BootstrapNodeOptions<LightNodeOptions>,
) => {
  return useCreateNode<LightNode, LightNodeOptions>({
    ...params,
    factory: createLightNode,
  });
};

/**
 * Create Relay Node helper hook.
 * @param {Object} params - optional params to configure & bootstrap node
 * @returns {CrateWakuHook} node, loading state and error
 */
export const useCreateRelayNode = (
  params?: BootstrapNodeOptions<RelayNodeOptions>,
) => {
  return useCreateNode<RelayNode, RelayNodeOptions>({
    ...params,
    factory: createRelayNode,
  });
};

/**
 * Create Full Node helper hook.
 * @param {Object} params - optional params to configure & bootstrap node
 * @returns {CrateWakuHook} node, loading state and error
 */
export const useCreateFullNode = (
  params?: BootstrapNodeOptions<FullNodeOptions>,
) => {
  return useCreateNode<FullNode, FullNodeOptions>({
    ...params,
    factory: createFullNode,
  });
};
