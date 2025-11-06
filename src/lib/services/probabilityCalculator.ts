import type { Prize } from '../types';

/**
 * 景品の当選確率を計算するサービス
 */
export class ProbabilityCalculator {
  /**
   * 全景品の確率を計算
   * @param prizes 景品リスト
   * @returns 各景品IDと確率のマップ
   */
  calculate(prizes: Prize[]): Map<string, number> {
    const result = new Map<string, number>();

    // 在庫がある景品の総在庫数を計算
    const totalStock = prizes.reduce((sum, prize) => sum + prize.stock, 0);

    // 総在庫が0の場合は、すべての景品の確率を0%とする
    if (totalStock === 0) {
      prizes.forEach((prize) => {
        result.set(prize.id, 0);
      });
      return result;
    }

    // 各景品の確率を計算
    prizes.forEach((prize) => {
      const probability = (prize.stock / totalStock) * 100;
      // 小数点以下2桁で四捨五入
      const roundedProbability = Math.round(probability * 100) / 100;
      result.set(prize.id, roundedProbability);
    });

    return result;
  }

  /**
   * 特定景品の確率を計算
   * @param prize 対象景品
   * @param allPrizes 全景品リスト
   * @returns 確率(0-100)
   */
  calculateForPrize(prize: Prize, allPrizes: Prize[]): number {
    // 全景品の確率マップを取得
    const probabilityMap = this.calculate(allPrizes);

    // 対象景品の確率を返す
    return probabilityMap.get(prize.id) ?? 0;
  }
}
