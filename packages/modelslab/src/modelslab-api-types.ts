import { z } from 'zod/v4';

export const modelsLabImageResponseSchema = z.object({
  status: z.string(),
  generationTime: z.number().optional(),
  id: z.number().optional(),
  output: z.array(z.string()),
  proxy_links: z.array(z.string()).optional(),
  meta: z.object({
    base64: z.string().optional(),
    enhance_prompt: z.string().optional(),
    file_prefix: z.string().optional(),
    guidance_scale: z.number().optional(),
    height: z.number().optional(),
    instant_response: z.string().optional(),
    n_samples: z.number().optional(),
    negative_prompt: z.string().optional(),
    outdir: z.string().optional(),
    prompt: z.string().optional(),
    safety_checker: z.string().optional(),
    safety_checker_type: z.string().optional(),
    seed: z.number().optional(),
    temp: z.string().optional(),
    width: z.number().optional(),
  }).optional(),
});

export type ModelsLabImageResponse = z.infer<typeof modelsLabImageResponseSchema>;