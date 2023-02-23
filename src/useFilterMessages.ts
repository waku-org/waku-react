import React from "react";
import type {
  IDecodedMessage,
  IDecoder,
  IFilter,
  Waku,
} from "@waku/interfaces";

import type { HookState } from "./types";

type AbstractFilterNode = Waku & {
  filter: IFilter;
};

type UseFilterMessagesParams = {
  node: undefined | AbstractFilterNode;
  decoder: undefined | IDecoder<IDecodedMessage>;
};

type UseFilterMessagesResult = HookState & {
  messages: IDecodedMessage[];
};

export const useFilterMessages = (
  params: UseFilterMessagesParams,
): UseFilterMessagesResult => {
  const { node, decoder } = params;

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessage] = React.useState<IDecodedMessage[]>([]);

  const pushMessage = React.useCallback(
    (message: IDecodedMessage): void => {
      if (!message) {
        return;
      }

      setMessage((prev) => [...prev, message]);
    },
    [setMessage],
  );

  React.useEffect(() => {
    if (!node || !decoder) {
      return;
    }

    let unsubscribe: null | (() => Promise<void>) = null;
    setLoading(true);

    node.filter
      .subscribe([decoder], pushMessage)
      .then((unsubscribeFn) => {
        setLoading(false);
        unsubscribe = unsubscribeFn;
      })
      .catch((err) => {
        setLoading(false);
        setError(
          `Failed to subscribe to filer: ${err?.message || "no message"}`,
        );
      });

    return () => {
      unsubscribe?.();
    };
  }, [node, decoder, pushMessage, setError, setLoading]);

  return {
    error,
    messages,
    isLoading,
  };
};
