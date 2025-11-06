import type { PrizeDisplayInfo } from '../types';
import type { RarityFilter } from '../stores/filter.svelte';

/**
 * 景品のフィルター機能を提供するサービス
 */
export class PrizeFilter {
  /**
   * レアリティでフィルター
   * @param displayInfoList フィルター対象の景品表示情報リスト
   * @param rarityFilter レアリティフィルター（'all' はすべて表示）
   * @returns フィルター済みの景品表示情報リスト（新しい配列）
   */
  filterByRarity(
    displayInfoList: PrizeDisplayInfo[],
    rarityFilter: RarityFilter
  ): PrizeDisplayInfo[] {
    // 'all' の場合はフィルターせずにすべて返す
    if (rarityFilter === 'all') {
      return displayInfoList;
    }

    // 指定されたレアリティのみを返す
    return displayInfoList.filter((info) => info.rarity === rarityFilter);
  }

  /**
   * 在庫切れの表示/非表示でフィルター
   * @param displayInfoList フィルター対象の景品表示情報リスト
   * @param showOutOfStock 在庫切れを表示するか
   * @returns フィルター済みの景品表示情報リスト（新しい配列）
   */
  filterByStock(
    displayInfoList: PrizeDisplayInfo[],
    showOutOfStock: boolean
  ): PrizeDisplayInfo[] {
    // showOutOfStockがtrueの場合はフィルターせずにすべて返す
    if (showOutOfStock) {
      return displayInfoList;
    }

    // 在庫が0より大きいもののみを返す
    return displayInfoList.filter((info) => info.prize.stock > 0);
  }
}
