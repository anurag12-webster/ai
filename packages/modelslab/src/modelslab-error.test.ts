import { describe, it, expect } from 'vitest';
import { modelsLabFailedResponseHandler } from './modelslab-error';

describe('modelsLabFailedResponseHandler', () => {
  it('should handle error with message', async () => {
    const response = new Response(
      JSON.stringify({
        status: 'error',
        message: 'Invalid API key',
      }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );

    const handleError = modelsLabFailedResponseHandler({
      response,
      url: 'https://modelslab.com/api/v6/realtime/text2img',
      requestBodyValues: {},
    });

    await expect(handleError).rejects.toThrow('Invalid API key');
  });

  it('should handle error without message', async () => {
    const response = new Response(
      JSON.stringify({
        status: 'error',
        error: 'Request failed',
      }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );

    const handleError = modelsLabFailedResponseHandler({
      response,
      url: 'https://modelslab.com/api/v6/realtime/text2img',
      requestBodyValues: {},
    });

    await expect(handleError).rejects.toThrow('Request failed');
  });

  it('should handle error with unknown format', async () => {
    const response = new Response(
      JSON.stringify({
        status: 'error',
      }),
      { status: 400, headers: { 'content-type': 'application/json' } }
    );

    const handleError = modelsLabFailedResponseHandler({
      response,
      url: 'https://modelslab.com/api/v6/realtime/text2img',
      requestBodyValues: {},
    });

    await expect(handleError).rejects.toThrow('Unknown ModelsLab error');
  });
});