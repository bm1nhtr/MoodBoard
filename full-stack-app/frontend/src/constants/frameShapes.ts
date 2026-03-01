/**
 * Formes de khung (frame) : user tự chọn — tròn, trái tim, vuông chữ nhật
 */

import type { FrameShape } from '../types/posts';

export interface FrameShapeOption {
  id: FrameShape;
  label: string;
}

export const FRAME_SHAPES: FrameShapeOption[] = [
  { id: 'circle', label: 'Tròn' },
  { id: 'heart', label: 'Trái tim' },
  { id: 'rectangle', label: 'Chữ nhật' },
];

export const FRAME_SHAPE_IDS: FrameShape[] = ['circle', 'heart', 'rectangle'];

export const DEFAULT_FRAME_SIZE = { width: 200, height: 180 };

/** Taille par défaut khung ảnh */
export const DEFAULT_IMAGE_FRAME_SIZE = { width: 200, height: 180 };

/** Taille par défaut khung texte */
export const DEFAULT_TEXT_FRAME_SIZE = { width: 220, height: 120 };

/** Bảng trắng : rộng hơn màn hình (px) */
export const CANVAS_WIDTH = 3000;
export const CANVAS_HEIGHT = 2000;
