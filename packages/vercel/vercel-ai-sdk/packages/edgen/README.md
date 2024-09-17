# Vercel AI SDK - Edgen Provider

The **[Edgen provider](https://sdk.vercel.ai/providers/ai-sdk-providers/edgen)** for the [Vercel AI SDK](https://sdk.vercel.ai/docs) contains language model support for the Edgen chat API.

## Setup

The Edgen provider is available in the `@kit/vercel-edgen` module. You can install it with

```bash
npm i @kit/vercel-edgen
```

## Provider Instance

You can import the default provider instance `edgen` from `@kit/vercel-edgen`:

```ts
import { edgen } from '@kit/vercel-edgen';
```

## Example

```ts
import { edgen } from '@kit/vercel-edgen';
import { generateText } from 'ai';

const { text } = await generateText({
  model: edgen('edgen-large-latest'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

## Documentation

Please check out the **[Edgen provider](https://sdk.vercel.ai/providers/ai-sdk-providers/edgen)** for more information.
