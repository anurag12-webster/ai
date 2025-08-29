import type {
  ImageModelV2,
  ImageModelV2CallWarning,
} from '@ai-sdk/provider';
import type { Resolvable } from '@ai-sdk/provider-utils';
import {
  FetchFunction,
  combineHeaders,
  createBinaryResponseHandler,
  createJsonResponseHandler,
  createStatusCodeErrorResponseHandler,
  getFromApi,
  postJsonToApi,
  resolve,
} from '@ai-sdk/provider-utils';
import { modelsLabImageResponseSchema } from './modelslab-api-types';
import { modelsLabFailedResponseHandler } from './modelslab-error';
import { ModelsLabImageModelId, ModelsLabImageSize } from './modelslab-image-settings';

interface ModelsLabImageModelConfig {
  provider: string;
  baseURL: string;
  headers?: Resolvable<Record<string, string | undefined>>;
  fetch?: FetchFunction;
  _internal?: {
    currentDate?: () => Date;
  };
}

export class ModelsLabImageModel implements ImageModelV2 {
  readonly specificationVersion = 'v2';
  readonly maxImagesPerCall = 4;

  get provider(): string {
    return this.config.provider;
  }

  constructor(
    readonly modelId: ModelsLabImageModelId,
    private readonly config: ModelsLabImageModelConfig,
  ) {}

  async doGenerate({
    prompt,
    n = 1,
    size,
    seed,
    providerOptions,
    headers,
    abortSignal,
  }: Parameters<ImageModelV2['doGenerate']>[0]): Promise<
    Awaited<ReturnType<ImageModelV2['doGenerate']>>
  > {
    const warnings: Array<ImageModelV2CallWarning> = [];

    let imageSize: ModelsLabImageSize | undefined;
    if (size) {
      const [width, height] = size.split('x').map(Number);
      imageSize = { width, height };
    }

    const currentDate = this.config._internal?.currentDate?.() ?? new Date();
    
    // Extract API key from headers (ModelsLab expects it in the request body)
    const resolvedHeaders = await resolve(this.config.headers);
    const apiKey = resolvedHeaders?.['X-API-Key'] || '';

    const requestBody = {
      key: apiKey,
      prompt,
      negative_prompt: providerOptions.modelslab?.negative_prompt ?? 'bad quality',
      width: imageSize?.width?.toString() ?? '512',
      height: imageSize?.height?.toString() ?? '512',
      safety_checker: providerOptions.modelslab?.safety_checker ?? false,
      seed: seed ?? null,
      samples: n,
      base64: providerOptions.modelslab?.base64 ?? false,
      webhook: providerOptions.modelslab?.webhook ?? null,
      track_id: providerOptions.modelslab?.track_id ?? null,
      enhance_prompt: providerOptions.modelslab?.enhance_prompt ?? false,
      instant_response: providerOptions.modelslab?.instant_response ?? false,
      ...(providerOptions.modelslab ?? {}),
    };

    const { value, responseHeaders } = await postJsonToApi({
      url: `${this.config.baseURL}/${this.modelId}`,
      headers: combineHeaders(await resolve(this.config.headers), headers),
      body: requestBody,
      failedResponseHandler: modelsLabFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        modelsLabImageResponseSchema,
      ),
      abortSignal,
      fetch: this.config.fetch,
    });

    if (value.status !== 'success') {
      throw new Error(`ModelsLab API call failed: ${value.status}`);
    }

    // Download the images from URLs
    const imageUrls = value.output;
    const downloadedImages = await Promise.all(
      imageUrls.map(url => this.downloadImage(url, abortSignal)),
    );

    return {
      images: downloadedImages,
      warnings,
      response: {
        modelId: this.modelId,
        timestamp: currentDate,
        headers: responseHeaders,
      },
      providerMetadata: {
        modelslab: {
          generationTime: value.generationTime,
          id: value.id,
          output: value.output,
          proxy_links: value.proxy_links,
          meta: value.meta,
        },
      },
    };
  }

  private async downloadImage(
    url: string,
    abortSignal: AbortSignal | undefined,
  ): Promise<Uint8Array> {
    const { value: response } = await getFromApi({
      url,
      abortSignal,
      failedResponseHandler: createStatusCodeErrorResponseHandler(),
      successfulResponseHandler: createBinaryResponseHandler(),
      fetch: this.config.fetch,
    });
    return response;
  }
}