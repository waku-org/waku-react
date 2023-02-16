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

type NodeFactory<N, T = {}> = (options?: T) => Promise<N>;
const useCreateNode = <N extends Waku, T = {}>(factory: NodeFactory<N, T>, options?: T): N | null => {
    const [node, setNode] = useState<N | null>(null);

    useEffect(() => {
        let cancelled = false;

        factory(options).then(async (node) => {
            if (cancelled) {
                return;
            }

            await node.start();
            setNode(node);
        });

        return () => {
            cancelled = true;
        };
    }, [factory, options]);

    return node;
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
