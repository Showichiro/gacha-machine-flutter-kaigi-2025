import { spring, tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import type { AnimationConfig } from '../types';

/**
 * アニメーションエンジン
 * ガチャ演出のアニメーションを作成・管理
 */

/**
 * スピニング演出用のspringアニメーションを作成
 * 物理ベースの自然なアニメーション
 * @returns Spring store (0-360度の回転)
 */
export function createSpinAnimation() {
  return spring(0, {
    stiffness: 0.08, // より滑らかな動きに調整
    damping: 0.25,   // バウンス感を少し増やす
  });
}

/**
 * リビール演出用のtweenedアニメーションを作成
 * 時間ベースのイージングアニメーション
 * @param config アニメーション設定(duration, easing)
 * @returns Tweened store (0-1の進捗)
 */
export function createRevealAnimation(config?: AnimationConfig) {
  return tweened(0, {
    duration: config?.duration ?? 800, // より素早いリビールに変更(1500ms → 800ms)
    easing: config?.easing ?? cubicOut,
  });
}

/**
 * 結果表示用のspringアニメーションを作成
 * スケールと不透明度のアニメーション
 * @returns Spring store with scale and opacity
 */
export function createResultAnimation() {
  return spring(
    { scale: 0, opacity: 0 },
    {
      stiffness: 0.2,
      damping: 0.4,
    }
  );
}
