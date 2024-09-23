import {
  ThreadModelV1,
  LanguageModelV1CallWarning,
  LanguageModelV1FinishReason,
  LanguageModelV1StreamPart,
  UnsupportedFunctionalityError,
} from 'vercel-sdk-provider';
import {
  ParseResult,
  createEventSourceResponseHandler,
  postJsonToApi,
  createJsonResponseHandler,
} from 'vercel-sdk-provider-utils';
import { z } from 'zod';
import { mapEdgenFinishReason } from './map-edgen-finish-reason';
import {
  EdgenThreadSettings,
} from './edgen-thread-settings';
import { edgenFailedResponseHandler } from './edgen-error';


type EdgenThreadConfig = {
  provider: string;
  baseURL: string;
  headers: () => Record<string, string | undefined>;
  generateId: () => string;
  fetch?: typeof fetch;
};

export class EdgenThread implements ThreadModelV1 {
  readonly specificationVersion = 'v1';
  readonly defaultObjectGenerationMode = 'json';

  readonly threadId: string;
  readonly apiKey: string;

  readonly settings: EdgenThreadSettings;

  private readonly config: EdgenThreadConfig;

  constructor(
    threadId: string,
    settings: EdgenThreadSettings,
    config: EdgenThreadConfig,
    apiKey: string,
  ) {
    this.threadId = threadId;
    this.settings = settings;
    this.config = config;
    this.apiKey = apiKey;
  }

  get provider(): string {
    return this.config.provider;
  }

  private getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    frequencyPenalty,
    presencePenalty,
    seed,
  }: Parameters<ThreadModelV1['doGenerate']>[0]) {
    const type = mode.type;

    const warnings: LanguageModelV1CallWarning[] = [];

    if (frequencyPenalty != null) {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'frequencyPenalty',
      });
    }

    if (presencePenalty != null) {
      warnings.push({
        type: 'unsupported-setting',
        setting: 'presencePenalty',
      });
    }

    // TODO: add support for prompt object

    // TODO: For now, decipher prompt into the right format, but improve it later
    const newPrompt = (prompt[0] as unknown) as any

    /**
     * const message = {
      role: newPrompt.role,
      content: newPrompt.content[0].text
    }
     */

    const baseArgs = {
      message: newPrompt.content[0].text,
    };

    switch (type) {
      case 'regular': {
        return {
          args: { ...baseArgs, /**...prepareToolsAndToolChoice(mode) */ },
          warnings,
        };
      }

      case 'object-json': {
        return {
          args: {
            ...baseArgs,
            response_format: { type: 'json_object' },
          },
          warnings,
        };
      }

      /**
        case 'object-tool': {
          return {
            args: {
              ...baseArgs,
              tool_choice: 'any',
              tools: [{ type: 'function', function: mode.tool }],
            },
            warnings,
          };
        }
       */

      case 'object-grammar': {
        throw new UnsupportedFunctionalityError({
          functionality: 'object-grammar mode',
        });
      }

      default: {
        const _exhaustiveCheck: any = type; // Was never instead of any
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }

  async doGenerate(
    options: Parameters<ThreadModelV1['doGenerate']>[0],
  ): Promise<Awaited<ReturnType<ThreadModelV1['doGenerate']>>> {

    const { args, warnings } = this.getArgs(options);

    /**
     *  const { responseHeaders, value: response } = await postJsonToApi({
          url: `${this.config.baseURL}/chat/completions`,
          headers: this.config.headers(),
          body: args,
          failedResponseHandler: edgenFailedResponseHandler,
          successfulResponseHandler: createJsonResponseHandler(
            edgenChatResponseSchema,
          ),
          abortSignal: options.abortSignal,
          fetch: this.config.fetch,
        });
    */

    let message = {}
    let finalMessage = ""

    try{

      // TODO:

    }catch(e){
      console.log(e)
    }

    const { message: rawPrompt, ...rawSettings } = args;

    // Last message should be the final message, if everything went well

    return {
      text: finalMessage ?? undefined,
      toolCalls: [],
      finishReason: mapEdgenFinishReason("stop"),
      usage: {
        promptTokens: 0, //response.usage.prompt_tokens,
        completionTokens: 0, //response.usage.completion_tokens,
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: {}, body: message },
      warnings,
    };
  }

  async doStream(
    options: Parameters<ThreadModelV1['doStream']>[0],
  ): Promise<Awaited<ReturnType<ThreadModelV1['doStream']>>> {
    const { args, warnings } = this.getArgs(options);

    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/thread/${this.threadId}`,
      //headers: this.config.headers(),
      body: {
        ...args,
        stream: true,
      },
      failedResponseHandler: edgenFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        edgenChatChunkSchema,
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch,
    });

    const { message: rawPrompt, ...rawSettings } = args;

    let finishReason: LanguageModelV1FinishReason = 'other';
    let usage: { promptTokens: number; completionTokens: number } = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN,
    };

    //const generateId = this.config.generateId;

    return {
      stream: response.pipeThrough(
        new TransformStream<
          ParseResult<z.infer<typeof edgenChatChunkSchema>>,
          LanguageModelV1StreamPart
        >({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ type: 'error', error: chunk.error });
              return;
            }

            const value = chunk.value;

            /**
              if (value.usage != null) {
                usage = {
                  promptTokens: value.usage.prompt_tokens,
                  completionTokens: value.usage.completion_tokens,
                };
              }

              const choice = value.choices[0];

              if (choice?.finish_reason != null) {
                finishReason = mapEdgenFinishReason(choice.finish_reason);
              }

              if (choice?.delta == null) {
                return;
              }

              const delta = choice.delta;

              if (delta.tool_calls != null) {
                for (const toolCall of delta.tool_calls) {
                  // edgen tool calls come in one piece

                  const toolCallId = generateId(); // delta and tool call must have same id

                  controller.enqueue({
                    type: 'tool-call-delta',
                    toolCallType: 'function',
                    toolCallId,
                    toolName: toolCall.function.name,
                    argsTextDelta: toolCall.function.arguments,
                  });

                  controller.enqueue({
                    type: 'tool-call',
                    toolCallType: 'function',
                    toolCallId,
                    toolName: toolCall.function.name,
                    args: toolCall.function.arguments,
                  });
                }
              }
            */

            if (value.content != null) {
              controller.enqueue({
                type: 'backend-response',
                role: value.role ?? "",
                content: value.content
              });
            }
          },

          flush(controller) {
            controller.enqueue({ type: 'finish', finishReason, usage });
          },
        }),
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders, body: {} },
      warnings,
    };
  }
}

// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const edgenChatResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal('assistant'),
        content: z.string().nullable(),
        tool_calls: z
          .array(
            z.object({
              function: z.object({
                name: z.string(),
                arguments: z.string(),
              }),
            }),
          )
          .optional()
          .nullable(),
      }),
      index: z.number(),
      finish_reason: z.string().optional().nullable(),
    }),
  ),
  object: z.literal('chat.completion'),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
  }),
});

const edgenChatChunkSchema = z.object({
  role: z.enum(["assistant", "user", "system"]).optional(), // TODO: might need to fix this
  content: z.string().nullable().optional(),
});


/**
// limited version of the schema, focussed on what is needed for the implementation
// this approach limits breakages when the API changes and increases efficiency
const edgenChatChunkSchema = z.object({
  object: z.literal('chat.completion.chunk'),
  choices: z.array(
    z.object({
      delta: z.object({
        role: z.enum(Object.values(AgentType) as [string, ...string[]]).optional(), // TODO: might need to fix this
        content: z.string().nullable().optional(),
        tool_calls: z
          .array(
            z.object({
              function: z.object({ name: z.string(), arguments: z.string() }),
            }),
          )
          .optional()
          .nullable(),
      }),
      finish_reason: z.string().nullable().optional(),
      index: z.number(),
    }),
  ),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
    })
    .optional()
    .nullable(),
});


 * function prepareToolsAndToolChoice(
  mode: Parameters<LanguageModelV1['doGenerate']>[0]['mode'] & {
    type: 'regular';
  },
) {
  // when the tools array is empty, change it to undefined to prevent errors:
  const tools = mode.tools?.length ? mode.tools : undefined;

  if (tools == null) {
    return { tools: undefined, tool_choice: undefined };
  }

  const mappedTools = tools.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));

  const toolChoice = mode.toolChoice;

  if (toolChoice == null) {
    return { tools: mappedTools, tool_choice: undefined };
  }

  const type = toolChoice.type;

  switch (type) {
    case 'auto':
    case 'none':
      return { tools: mappedTools, tool_choice: type };
    case 'required':
      return { tools: mappedTools, tool_choice: 'any' };

    // edgen does not support tool mode directly,
    // so we filter the tools and force the tool choice through 'any'
    case 'tool':
      return {
        tools: mappedTools.filter(
          tool => tool.function.name === toolChoice.toolName,
        ),
        tool_choice: 'any',
      };
    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`);
    }
  }
}
 */
