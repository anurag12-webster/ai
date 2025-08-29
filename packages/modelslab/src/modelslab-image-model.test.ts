import { describe, it, expect, vi } from 'vitest';
import { ModelsLabImageModel } from './modelslab-image-model';

const mockFetch = vi.fn();

describe('ModelsLabImageModel', () => {
  const model = new ModelsLabImageModel('realtime/text2img', {
    provider: 'modelslab.image',
    baseURL: 'https://modelslab.com/api/v6',
    headers: () => ({ 'X-API-Key': 'test-key' }),
    fetch: mockFetch,
    _internal: {
      currentDate: () => new Date('2024-01-01T00:00:00Z'),
    },
  });

  it('should have correct properties', () => {
    expect(model.specificationVersion).toBe('v2');
    expect(model.maxImagesPerCall).toBe(4);
    expect(model.provider).toBe('modelslab.image');
    expect(model.modelId).toBe('realtime/text2img');
  });

  it('should generate image with basic prompt', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'success',
          generationTime: 1.06,
          id: 91753437,
          output: ['https://example.com/image1.png'],
          meta: {
            prompt: 'test prompt',
            width: 512,
            height: 512,
            seed: 12345,
          },
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    // Mock image download
    mockFetch.mockResolvedValueOnce(
      new Response(new Uint8Array([255, 216, 255]), {
        status: 200,
        headers: { 'content-type': 'image/jpeg' },
      })
    );

    const result = await model.doGenerate({
      prompt: 'test prompt',
      n: 1,
      providerOptions: {},
    });

    expect(result.images).toHaveLength(1);
    expect(result.images[0]).toEqual(new Uint8Array([255, 216, 255]));
    expect(result.response.modelId).toBe('realtime/text2img');
    expect(result.providerMetadata.modelslab).toBeDefined();
  });

  it('should handle custom size', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'success',
          output: ['https://example.com/image1.png'],
        }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    mockFetch.mockResolvedValueOnce(
      new Response(new Uint8Array([255, 216, 255]), {
        status: 200,
        headers: { 'content-type': 'image/jpeg' },
      })
    );

    await model.doGenerate({
      prompt: 'test prompt',
      size: '1024x768',
      providerOptions: {},
    });

    const lastCall = mockFetch.mock.calls[0];
    const requestBody = JSON.parse(lastCall[1].body);
    expect(requestBody.width).toBe('1024');
    expect(requestBody.height).toBe('768');
  });

  it('should handle API error', async () => {
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          status: 'error',
          message: 'API key is required',
        }),
        {
          status: 400,
          headers: { 'content-type': 'application/json' },
        }
      )
    );

    await expect(
      model.doGenerate({
        prompt: 'test prompt',
        providerOptions: {},
      })
    ).rejects.toThrow();
  });
});