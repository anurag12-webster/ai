# AI SDK - ModelsLab Provider

The **[@ai-sdk/modelslab](https://www.npmjs.com/package/@ai-sdk/modelslab)** provider contains language model support for the ModelsLab API.

## Setup

The ModelsLab provider is available in the `@ai-sdk/modelslab` module. You can install it with

```bash
npm i @ai-sdk/modelslab
```

## Provider Instance

You can import the default provider instance `modelslab` from `@ai-sdk/modelslab`:

```ts
import { modelslab } from '@ai-sdk/modelslab';
```

## Example

```ts
import { modelslab } from '@ai-sdk/modelslab';
import { generateImage } from 'ai';

const { image } = await generateImage({
  model: modelslab.image('realtime/text2img'),
  prompt: 'A beautiful landscape with mountains and a lake',
});
```

## Documentation

Please check out the **[ModelsLab provider documentation](https://modelslab.com/docs)** for more information.