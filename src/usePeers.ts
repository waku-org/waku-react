import React from "react";
import type {
  Peer,
  PeerProtocolsChangeData,
} from "@libp2p/interface-peer-store";
import type { Waku } from "@waku/interfaces";

type UsePeersParams = {
  node: undefined | Waku;
};

type UsePeersResults = {
  storePeers?: undefined | Peer[];
  filterPeers?: undefined | Peer[];
  lightPushPeers?: undefined | Peer[];
  peerExchangePeers?: undefined | Peer[];
};

/**
 * Hook returns map of peers for different protocols.
 * If protocol is not implemented on the node peers are undefined.
 * @example
 * const { storePeers } = usePeers({ node });
 * @param {Waku} params.node - Waku node, if not set then no peers will be returned
 * @returns {Object} map of peers, if some of the protocols is not implemented then undefined
 */
export const usePeers = (params: UsePeersParams): UsePeersResults => {
  const { node } = params;
  const [peers, setPeers] = React.useState<UsePeersResults>({});

  React.useEffect(() => {
    if (!node) {
      return;
    }

    const listener = async (_event: CustomEvent<PeerProtocolsChangeData>) => {
      const peers = await Promise.all([
        handleCatch(node?.store?.peers()),
        handleCatch(node?.filter?.peers()),
        handleCatch(node?.lightPush?.peers()),
        handleCatch(node?.peerExchange?.peers()),
      ]);

      setPeers({
        storePeers: peers[0],
        filterPeers: peers[1],
        lightPushPeers: peers[2],
        peerExchangePeers: peers[3],
      });
    };

    node.libp2p.peerStore.addEventListener("change:protocols", listener);

    return () => {
      node.libp2p.peerStore.removeEventListener("change:protocols", listener);
    };
  }, [node, setPeers]);

  return peers;
};

// TODO: handle error in case fetching of peers failed
function handleCatch(promise?: Promise<Peer[]>): Promise<Peer[] | undefined> {
  if (!promise) {
    return Promise.resolve(undefined);
  }

  return promise.catch((_) => {
    return undefined;
  });
}
