import React from "react";
import type { IDecodedMessage, IDecoder, Waku } from "@waku/interfaces";

import type { HookState } from "./types";

type UseFilterSubscribeParams = {
  node: Waku;
  decoder: IDecoder<IDecodedMessage>;
};

type UseFilterSubscribeResult = HookState & {
  messages: IDecodedMessage[];
};

export const useFilterSubscribe = (
  params: UseFilterSubscribeParams,
): UseFilterSubscribeResult => {
  const { node, decoder } = params;

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessage] = React.useState<IDecodedMessage[]>([]);

  const pushMessage = React.useCallback(
    (message: IDecodedMessage): void => {
      setMessage((prev) => [...prev, message]);
    },
    [setMessage],
  );

  React.useEffect(() => {
    let unsubscribe: null | (() => Promise<void>) = null;
    setLoading(true);

    node?.filter
      ?.subscribe([decoder], pushMessage)
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
