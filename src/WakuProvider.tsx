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

type WakuContextType<T = Waku> = {
    node: null | T;
};

export const WakuContext = React.createContext<WakuContextType<Waku>>({
    node: null,
});

/**
 * Hook to retrieve Waku node from Context. By default generic Waku type will be used.
 * @example
 * const { node } = useWaku<LightNode>();
 * @example
 * const { node } = useWaku<RelayNode>();
 * @example
 * const { node } = useWaku<FullNode>();
 * @example
 * const { node } = useWaku();
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
 *  const { node } = useWaku<LightNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {LightNodeOptions} props.options - optional options for creating Light Node
 * @returns React Light Node provider component
 */
export const LightNodeProvider: React.FunctionComponent<ProviderProps<LightNodeOptions>> = (props) => {
    const node = useCreateLightNode(props.options);

    return (
        <WakuContext.Provider value={{ node }}>
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
 *  const { node } = useWaku<RelayNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {RelayNodeOptions} props.options - optional options for creating Relay Node
 * @returns React Relay Node provider component
 */
export const RelayNodeProvider: React.FunctionComponent<ProviderProps<RelayNodeOptions>> = (props) => {
    const node = useCreateRelayNode(props.options);

    return (
        <WakuContext.Provider value={{ node }}>
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
 *  const { node } = useWaku<FullNode>();
 *  ...
 * };
 * @param {Object} props - options to create a node and other React props
 * @param {FullNodeOptions} props.options - optional options for creating Full Node
 * @returns React Full Node provider component
 */
export const FullNodeProvider: React.FunctionComponent<ProviderProps<FullNodeOptions>> = (props) => {
    const node = useCreateFullNode(props.options);

    return (
        <WakuContext.Provider value={{ node }}>
            {props.children}
        </WakuContext.Provider>
    );
};
