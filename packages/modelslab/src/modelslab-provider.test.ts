import { describe, it, expect } from 'vitest';
import { createModelsLab } from './modelslab-provider';

describe('ModelsLab Provider', () => {
  it('should create image model', () => {
    const provider = createModelsLab({
      apiKey: 'test-key',
    });

    const model = provider.image('realtime/text2img');
    expect(model.modelId).toBe('realtime/text2img');
    expect(model.provider).toBe('modelslab.image');
  });

  it('should create image model with imageModel method', () => {
    const provider = createModelsLab({
      apiKey: 'test-key',
    });

    const model = provider.imageModel('realtime/text2img');
    expect(model.modelId).toBe('realtime/text2img');
    expect(model.provider).toBe('modelslab.image');
  });

  it('should throw error for unsupported model types', () => {
    const provider = createModelsLab({
      apiKey: 'test-key',
    });

    expect(() => provider.languageModel()).toThrow('No such model');
    expect(() => provider.textEmbeddingModel()).toThrow('No such model');
  });

  it('should use default base URL', () => {
    const provider = createModelsLab();
    expect(provider).toBeDefined();
  });

  it('should use custom base URL', () => {
    const provider = createModelsLab({
      baseURL: 'https://custom.modelslab.com/api/v6',
    });
    expect(provider).toBeDefined();
  });
});