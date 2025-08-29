import { z } from 'zod/v4';
import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';

const modelsLabErrorSchema = z.object({
  status: z.string(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export const modelsLabFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: modelsLabErrorSchema,
  errorToMessage: error => error.message ?? error.error ?? 'Unknown ModelsLab error',
});

export type ModelsLabError = z.infer<typeof modelsLabErrorSchema>;