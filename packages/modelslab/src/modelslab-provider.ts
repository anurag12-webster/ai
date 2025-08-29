import {
  ImageModelV2,
  NoSuchModelError,
  ProviderV2,
} from '@ai-sdk/provider';
import type { FetchFunction } from '@ai-sdk/provider-utils';
import { withoutTrailingSlash } from '@ai-sdk/provider-utils';
import { ModelsLabImageModel } from './modelslab-image-model';
import { ModelsLabImageModelId } from './modelslab-image-settings';
import { loadModelsLabApiKey } from './modelslab-config';

export interface ModelsLabProviderSettings {
  /**
   * ModelsLab API key. Default value is taken from the `MODELSLAB_API_KEY` environment variable.
   */
  apiKey?: string;

  /**
   * Base URL for the API calls.
   * The default prefix is `https://modelslab.com/api/v6`.
   */
  baseURL?: string;

  /**
   * Custom headers to include in the requests.
   */
  headers?: Record<string, string>;

  /**
   * Custom fetch implementation. You can use it as a middleware to intercept
   * requests, or to provide a custom fetch implementation for e.g. testing.
   */
  fetch?: FetchFunction;
}

export interface ModelsLabProvider extends ProviderV2 {
  /**
   * Creates a model for image generation.
   */
  image(modelId: ModelsLabImageModelId): ImageModelV2;

  /**
   * Creates a model for image generation.
   */
  imageModel(modelId: ModelsLabImageModelId): ImageModelV2;
}

const defaultBaseURL = 'https://modelslab.com/api/v6';

/**
 * Create a ModelsLab provider instance.
 */
export function createModelsLab(options: ModelsLabProviderSettings = {}): ModelsLabProvider {
  const baseURL = withoutTrailingSlash(options.baseURL ?? defaultBaseURL);
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...options.headers,
  });

  const createImageModel = (modelId: ModelsLabImageModelId) =>
    new ModelsLabImageModel(modelId, {
      provider: 'modelslab.image',
      baseURL: baseURL ?? defaultBaseURL,
      headers: () => ({
        ...getHeaders(),
        // Store API key for later use in request body
        'X-API-Key': loadModelsLabApiKey({ apiKey: options.apiKey }),
      }),
      fetch: options.fetch,
    });

  return {
    imageModel: createImageModel,
    image: createImageModel,
    languageModel: () => {
      throw new NoSuchModelError({
        modelId: 'languageModel',
        modelType: 'languageModel',
      });
    },
    textEmbeddingModel: () => {
      throw new NoSuchModelError({
        modelId: 'textEmbeddingModel',
        modelType: 'textEmbeddingModel',
      });
    },
  };
}

/**
 * Default ModelsLab provider instance.
 */
export const modelslab = createModelsLab();