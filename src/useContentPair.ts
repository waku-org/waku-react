import React from "react";
import { createDecoder, createEncoder } from "@waku/core";
import type { Decoder, Encoder } from "@waku/core/dist/lib/message/version_0";

type ContentPair = {
  encoder: null | Encoder;
  decoder: null | Decoder;
};

/**
 * Creates Encoder / Decoder pair for a given contentTopic.
 * @param {string} contentTopic - topic to orient to
 * @param {boolean} ephemeral - optional, makes messages ephemeral
 * @returns {Object} Encoder / Decoder pair
 */
export const useContentPair = (
  contentTopic: string,
  ephemeral?: boolean,
): ContentPair => {
  const [encoder, setEncoder] = React.useState<null | Encoder>(null);
  const [decoder, setDecoder] = React.useState<null | Decoder>(null);

  React.useEffect(() => {
    setEncoder(createEncoder(contentTopic, ephemeral));
    setDecoder(createDecoder(contentTopic));
  }, [contentTopic, ephemeral]);

  return {
    encoder,
    decoder,
  };
};
