import {
    useState,
    useEffect,
} from "react";
import {
    createLightNode,
    createRelayNode,
    createFullNode,
    CreateOptions,
} from "@waku/create";
import type {
    Waku,
    FullNode,
    LightNode,
    RelayNode,
} from "@waku/interfaces";
import type { WakuOptions, RelayCreateOptions } from "@waku/core";
import type { CrateWakuHook } from "./types";

type NodeFactory<N, T = {}> = (options?: T) => Promise<N>;

const useCreateNode = <N extends Waku, T = {}>(factory: NodeFactory<N, T>, options?: T): CrateWakuHook<N> => {
    const [node, setNode] = useState<N | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<null | string>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        factory(options)
            .then(async (node) => {
                if (cancelled) {
                    return;
                }

                await node.start();

                setNode(node);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(`Failed at creating node: ${error?.message || "no message"}`);
            });

        return () => {
            cancelled = true;
        };
    }, [factory, options, setNode, setLoading, setError]);

    return {
        node,
        error,
        isLoading,
    };
};

export type LightNodeOptions = CreateOptions & WakuOptions;
/**
 * Create Light Node helper hook. 
 * @param {LightNodeOptions} options - optional param to configure Light Node
 * @returns {LightNode}
 */
export const useCreateLightNode = (options?: LightNodeOptions) => {
    return useCreateNode<LightNode, LightNodeOptions>(createLightNode, options);
};

export type RelayNodeOptions = CreateOptions & WakuOptions & Partial<RelayCreateOptions>;
/**
 * Create Relay Node helper hook. 
 * @param {RelayNodeOptions} options - optional param to configure Relay Node
 * @returns {RelayNode}
 */
export const useCreateRelayNode = (options?: RelayNodeOptions) => {
    return useCreateNode<RelayNode, RelayNodeOptions>(createRelayNode, options);
};

export type FullNodeOptions = CreateOptions & WakuOptions & Partial<RelayCreateOptions>;
/**
 * Create Full Node helper hook. 
 * @param {FullNodeOptions} options - optional param to configure Full Node
 * @returns {FullNode}
 */
export const useCreateFullNode = (options?: FullNodeOptions) => {
    return useCreateNode<FullNode, FullNodeOptions>(createFullNode, options);
};
