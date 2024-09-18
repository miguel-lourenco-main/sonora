import { EmbeddingModelV1, EmbeddingModelV1Embedding } from 'vercel-sdk-provider';

/**
Embedding model that is used by the AI SDK Core functions.
*/
export type EmbeddingModel<VALUE> = EmbeddingModelV1<VALUE>;

/**
Embedding.
 */
export type Embedding = EmbeddingModelV1Embedding;
