import React from "react";
import type {
    Waku,
} from "@waku/interfaces";
import {
    FullNodeOptions,
    LightNodeOptions,
    RelayNodeOptions,
    useCreateLightNode,
    useCreateRelayNode,
    useCreateFullNode,
} from "./useCreateWaku";
import type { CrateWakuHook } from "./types";

type WakuContextType<T extends Waku> = CrateWakuHook<T>;

export const WakuContext = React.createContext<WakuContextType<Waku>>({
    node: null,
    isLoading: false,
    error: null,
});

/**
 * Hook to retrieve Waku node from Context. By default generic Waku type will be used.
 * @example
 * const { node, isLoading, error } = useWaku<LightNode>();
 * @example
 * const { node, isLoading, error } = useWaku<RelayNode>();
 * @example
 * const { node, isLoading, error } = useWaku<FullNode>();
 * @example
 * const { node, isLoading, error } = useWaku();
 * @returns WakuContext
 */
export const useWaku = <T extends Waku>(): WakuContextType<T> => React.useContext(WakuContext) as WakuContextType<T>;

type ReactChildrenProps = {
    children?: React.ReactNode;
};

type ProviderProps<T> = ReactChildrenProps & {
    options?: T,
};

/**
 * Provider for creating Light Node based on options passed.
 * @example
 * const App = (props) => (
 *  <LightNodeProvider options={{...}}>
 *      <Component />
 *  </LightNodeProvider>
 * );
 * const Component = (props) => {
 *  const { node, isLoading, error } = useWaku<LightNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {LightNodeOptions} props.options - optional options for creating Light Node
 * @returns React Light Node provider component
 */
export const LightNodeProvider: React.FunctionComponent<ProviderProps<LightNodeOptions>> = (props) => {
    const result = useCreateLightNode(props.options);

    return (
        <WakuContext.Provider value={result}>
            {props.children}
        </WakuContext.Provider>
    );
};

/**
 * Provider for creating Relay Node based on options passed.
 * @example
 * const App = (props) => (
 *  <RelayNodeProvider options={{...}}>
 *      <Component />
 *  </RelayNodeProvider>
 * );
 * const Component = (props) => {
 *  const { node, isLoading, error } = useWaku<RelayNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {RelayNodeOptions} props.options - optional options for creating Relay Node
 * @returns React Relay Node provider component
 */
export const RelayNodeProvider: React.FunctionComponent<ProviderProps<RelayNodeOptions>> = (props) => {
    const result = useCreateRelayNode(props.options);

    return (
        <WakuContext.Provider value={result}>
            {props.children}
        </WakuContext.Provider>
    );
};

/**
 * Provider for creating Full Node based on options passed.
 * @example
 * const App = (props) => (
 *  <FullNodeProvider options={{...}}>
 *      <Component />
 *  </FullNodeProvider>
 * );
 * const Component = (props) => {
 *  const { node, isLoading, error } = useWaku<FullNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {FullNodeOptions} props.options - optional options for creating Full Node
 * @returns React Full Node provider component
 */
export const FullNodeProvider: React.FunctionComponent<ProviderProps<FullNodeOptions>> = (props) => {
    const result = useCreateFullNode(props.options);

    return (
        <WakuContext.Provider value={result}>
            {props.children}
        </WakuContext.Provider>
    );
};
