import { LanguageModelV1FinishReason } from '@kit/vercel-sdk-provider'

export function mapEdgenFinishReason(
  finishReason: string | null | undefined,
): LanguageModelV1FinishReason {
  switch (finishReason) {
    case 'stop':
      return 'stop';
    case 'length':
    case 'model_length':
      return 'length';
    case 'tool_calls':
      return 'tool-calls';
    default:
      return 'other';
  }
}
