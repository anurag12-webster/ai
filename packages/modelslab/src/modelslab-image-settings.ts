export type ModelsLabImageModelId = 
  | 'realtime/text2img'
  | (string & {});

export interface ModelsLabImageSize {
  width: number;
  height: number;
}