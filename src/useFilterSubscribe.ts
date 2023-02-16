import { useCallback, useEffect, useState } from "react";
import type { IDecodedMessage, IDecoder, Waku } from "@waku/interfaces";

import type { HookState } from "./types";

type UseFilterSubscribeParams = {
  waku: Waku;
  decoder: IDecoder<IDecodedMessage>;
};

type UseFilterSubscribeResult = HookState & {
  messages: IDecodedMessage[];
};

export const useFilterSubscribe = (
  params: UseFilterSubscribeParams
): UseFilterSubscribeResult => {
  const { waku, decoder } = params;

  const [error, setError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [messages, setMessage] = useState<IDecodedMessage[]>([]);

  const pushMessage = useCallback(
    (message: IDecodedMessage): void => {
      setMessage((prev) => [...prev, message]);
    },
    [setMessage]
  );

  useEffect(() => {
    let unsubscribe: null | (() => Promise<void>) = null;
    setLoading(true);

    waku?.filter
      ?.subscribe([decoder], pushMessage)
      .then((unsubscribeFn) => {
        setLoading(false);
        unsubscribe = unsubscribeFn;
      })
      .catch((err) => {
        setLoading(false);
        setError(
          `Failed to subscribe to filer: ${err?.message || "no message"}`
        );
      });

    return () => {
      unsubscribe?.();
    };
  }, [waku, decoder, pushMessage, setError, setLoading]);

  return {
    error,
    messages,
    isLoading,
  };
};
