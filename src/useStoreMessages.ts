import React from "react";
import type {
  IDecodedMessage,
  IDecoder,
  IStore,
  StoreQueryOptions,
  Waku,
} from "@waku/interfaces";

import type { HookState } from "./types";

type AbstractStoreNode = Waku & {
  store: IStore;
};

type UseStoreMessagesParams = {
  node: undefined | AbstractStoreNode;
  decoder: IDecoder<IDecodedMessage>;
  options: StoreQueryOptions;
};

type UseStoreMessagesResult = HookState & {
  messages: IDecodedMessage[];
};

export const useStoreMessages = (
  params: UseStoreMessagesParams,
): UseStoreMessagesResult => {
  const { node, decoder, options } = params;

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessage] = React.useState<IDecodedMessage[]>([]);

  const pushMessage = React.useCallback(
    (messages: IDecodedMessage[]): void => {
      if (!messages || !messages.length) {
        return;
      }

      setMessage((prev) => [...prev, ...messages]);
    },
    [setMessage],
  );

  React.useEffect(() => {
    if (!node) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.resolve()
      .then(async () => {
        for await (const promises of node.store.queryGenerator(
          [decoder],
          options,
        )) {
          if (cancelled) {
            return;
          }

          const messagesRaw = await Promise.all(promises);
          const filteredMessages = messagesRaw.filter(
            (v): v is IDecodedMessage => !!v,
          );

          pushMessage(filteredMessages);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          `Failed to query messages from store: ${
            err?.message || "no message"
          }`,
        );
      });

    return () => {
      cancelled = true;
    };
  }, [node, decoder, options, pushMessage, setError, setLoading]);

  return {
    error,
    isLoading,
    messages,
  };
};
