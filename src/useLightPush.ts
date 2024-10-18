import React from "react";
import type {
  IEncoder,
  ILightPush,
  IMessage,
  IWaku,
  SDKProtocolResult,
} from "@waku/interfaces";

type AbstractLightPushNode = IWaku & {
  lightPush: ILightPush;
};

type UseLightPushParams = {
  encoder: undefined | IEncoder;
  node: undefined | AbstractLightPushNode;
};

type PushFn = (message: IMessage) => Promise<SDKProtocolResult>;

type UseLightPushResult = {
  push?: undefined | PushFn;
};

/**
 * Returns light push methods bound to node and encoder
 * @param {Object} params.node - node that implements ILightPush, hook does nothing if empty
 * @param {Object} params.encoder - encoder for processing messages, hook does nothing if empty
 * @returns {Object} methods of ILightPush such as push
 */
export const useLightPush = (
  params: UseLightPushParams,
): UseLightPushResult => {
  const { node, encoder } = params;

  const push = React.useCallback<PushFn>(
    (message) => {
      return node!.lightPush.send(encoder as IEncoder, message);
    },
    [node, encoder],
  );

  if (!node && !encoder) {
    return {};
  }

  return {
    push,
  };
};
