import type { Prize } from '../types';

/**
 * 景品のグローバル状態管理
 * Svelte 5 Runesを使用したリアクティブな状態管理
 */

// リアクティブな状態オブジェクト
const state = $state<{
  prizes: Prize[];
}>({
  prizes: [],
});

/**
 * 景品ストアのエクスポート
 */
export const prizesStore = {
  /**
   * 全景品リスト
   */
  get prizes(): Prize[] {
    return state.prizes;
  },

  /**
   * 在庫がある景品リスト（派生状態）
   */
  get availablePrizes(): Prize[] {
    return state.prizes.filter((p) => p.stock > 0);
  },

  /**
   * ガチャが実行可能かどうか（派生状態）
   */
  get isGachaAvailable(): boolean {
    return this.availablePrizes.length > 0;
  },

  /**
   * 景品リストを設定
   * @param prizes 新しい景品リスト
   */
  setPrizes(prizes: Prize[]): void {
    state.prizes = prizes;
  },
};

/**
 * 景品状態をリセット（テスト用）
 */
export function resetPrizes(): void {
  state.prizes = [];
}
