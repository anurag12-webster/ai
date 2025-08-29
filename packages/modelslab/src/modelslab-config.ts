import { loadApiKey } from '@ai-sdk/provider-utils';

export function loadModelsLabApiKey({
  apiKey,
  description = 'ModelsLab',
}: {
  apiKey: string | undefined;
  description?: string;
}): string {
  return loadApiKey({
    apiKey,
    environmentVariableName: 'MODELSLAB_API_KEY',
    description,
  });
}