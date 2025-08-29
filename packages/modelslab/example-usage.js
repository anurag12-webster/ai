// Example usage of ModelsLab AI SDK provider
// This is a usage example (not part of the package)

import { modelslab } from '@ai-sdk/modelslab';
import { generateImage } from 'ai';

async function generateImageExample() {
  try {
    const { image } = await generateImage({
      model: modelslab.image('realtime/text2img'),
      prompt: 'ultra realistic close up portrait beautiful pale cyberpunk female with heavy black eyeliner',
      n: 1,
      size: '512x512',
      providerOptions: {
        modelslab: {
          negative_prompt: 'bad quality, blurry, distorted',
          safety_checker: false,
          enhance_prompt: true,
        },
      },
    });

    console.log('Generated image successfully!');
    // image is a Uint8Array containing the image data
    return image;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

// Example with different model options
async function generateImageWithOptions() {
  const provider = modelslab.image('realtime/text2img');
  
  const { image } = await generateImage({
    model: provider,
    prompt: 'a beautiful landscape with mountains and lake',
    n: 2, // Generate 2 images
    size: '1024x1024',
    seed: 42, // For reproducible results
    providerOptions: {
      modelslab: {
        negative_prompt: 'bad quality, watermark, signature',
        safety_checker: true,
        enhance_prompt: false,
        instant_response: false,
        base64: false,
      },
    },
  });

  return image;
}

export { generateImageExample, generateImageWithOptions };