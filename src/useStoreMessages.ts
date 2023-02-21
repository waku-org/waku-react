import React from "react";
import type {
  StoreQueryOptions,
  IStore,
  IDecoder,
  IDecodedMessage,
} from "@waku/interfaces";
import type { HookState } from "./types";

type AbstractStoreNode = {
  store: IStore;
};

type UseStoreMessagesParams = {
  node: AbstractStoreNode;
  decoder: IDecoder<IDecodedMessage>;
  options: StoreQueryOptions;
};

type UseStoreMessagesResult = HookState & {
  messages: IDecodedMessage[];
};

const useStoreMessages = (
  params: UseStoreMessagesParams,
): UseStoreMessagesResult => {
  const { node, decoder, options } = params;

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [messages, setMessage] = React.useState<IDecodedMessage[]>([]);

  const pushMessage = React.useCallback(
    (message: IDecodedMessage[]): void => {
      setMessage((prev) => [...prev, ...message]);
    },
    [setMessage],
  );

  React.useEffect(() => {
    let cancelled: boolean = false;
    setLoading(true);

    Promise
        .resolve()
        .then(async () => {
            for await (const promises of node.store.queryGenerator([decoder], options)) {
                if (cancelled) {
                    return;
                }

                const messagesRaw = await Promise.all(promises);
                const filteredMessages = messagesRaw.filter((v): v is IDecodedMessage => !!v);

                pushMessage(filteredMessages);
            }

            setLoading(false);
        })
      .catch((err) => {
        setLoading(false);
        setError(
          `Failed to query messages from store: ${err?.message || "no message"}`,
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
