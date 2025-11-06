import type { RarityLevel } from '../types';

/**
 * 景品のレアリティを分類するサービス
 */
export class RarityClassifier {
  // レアリティ閾値の定数
  private readonly NORMAL_THRESHOLD = 10; // 10%以上: Normal
  private readonly RARE_THRESHOLD = 3; // 3%以上10%未満: Rare, 3%未満: SuperRare

  // レアリティカラーマッピング
  private readonly RARITY_COLORS: Record<RarityLevel, string> = {
    Normal: '#8d9099', // text-middle
    Rare: '#ffb205', // accent-yellow
    SuperRare: '#d9b34c', // accent-gold
  };

  // レアリティアイコンマッピング
  private readonly RARITY_ICONS: Record<RarityLevel, string> = {
    Normal: '●',
    Rare: '★',
    SuperRare: '✦',
  };

  /**
   * 確率に基づいてレアリティを分類
   * @param probability 確率(0-100)
   * @returns レアリティレベル
   */
  classify(probability: number): RarityLevel {
    if (probability >= this.NORMAL_THRESHOLD) {
      return 'Normal';
    } else if (probability >= this.RARE_THRESHOLD) {
      return 'Rare';
    } else {
      return 'SuperRare';
    }
  }

  /**
   * レアリティに対応する色コードを取得
   * @param rarity レアリティレベル
   * @returns 色コード
   */
  getColor(rarity: RarityLevel): string {
    return this.RARITY_COLORS[rarity];
  }

  /**
   * レアリティに対応するアイコンを取得
   * @param rarity レアリティレベル
   * @returns アイコン文字列
   */
  getIcon(rarity: RarityLevel): string {
    return this.RARITY_ICONS[rarity];
  }
}
