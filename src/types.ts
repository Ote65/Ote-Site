export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  tag?: string;
}

export type OVisionStage = 'intent' | 'write' | 'preview' | 'qc' | 'render';

export interface CameraPreset {
  id: string;
  name: string;
  duration: string;
  desc: string;
  iconName: string;
  pathType: 'orbit' | 'dolly' | 'spiral' | 'crane' | 'hero';
}

export interface MediaItem {
  id: string;
  title: string;
  product: 'Oltra' | 'O4D' | 'Suite';
  category: string;
  thumbnail: string;
  duration?: string;
  description: string;
}
