import React from "react";
import { createDecoder, createEncoder } from "@waku/core";
import type { Decoder, Encoder } from "@waku/core/dist/lib/message/version_0";

import type { ContentPair } from "./types";

/**
 * Creates Encoder / Decoder pair for a given contentTopic.
 * @param {string} contentTopic - topic to orient to
 * @param {boolean} ephemeral - makes messages ephemeral, default to false
 * @returns {Object} Encoder / Decoder pair
 */
export const useCreateContentPair = (
  contentTopic: string,
  ephemeral = false,
): ContentPair => {
  const [encoder, setEncoder] = React.useState<Encoder>(
    createEncoder(contentTopic, ephemeral),
  );
  const [decoder, setDecoder] = React.useState<Decoder>(
    createDecoder(contentTopic),
  );

  React.useEffect(() => {
    setEncoder(createEncoder(contentTopic, ephemeral));
    setDecoder(createDecoder(contentTopic));
  }, [contentTopic, ephemeral]);

  return {
    encoder,
    decoder,
  };
};
