import { describe, it, expect } from 'vitest';
import { PrizeSorter } from './prizeSorter';
import type { PrizeDisplayInfo } from '../types';

describe('PrizeSorter', () => {
  const sorter = new PrizeSorter();

  // テスト用のダミーデータ
  const createDisplayInfo = (
    id: string,
    name: string,
    probability: number,
    stock: number,
    createdAt: number
  ): PrizeDisplayInfo => ({
    prize: {
      id,
      name,
      imageUrl: `/img/${id}.png`,
      stock,
      createdAt,
    },
    probability,
    rarity: probability >= 10 ? 'Normal' : probability >= 3 ? 'Rare' : 'SuperRare',
    isLowStock: stock <= 3 && stock > 0,
  });

  describe('確率でソート', () => {
    it('should sort by probability in descending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 3, 2000),
        createDisplayInfo('3', 'Prize C', 5, 10, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'probability', 'desc');

      expect(sorted[0].prize.id).toBe('2'); // 50%
      expect(sorted[1].prize.id).toBe('1'); // 10%
      expect(sorted[2].prize.id).toBe('3'); // 5%
    });

    it('should sort by probability in ascending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 3, 2000),
        createDisplayInfo('3', 'Prize C', 5, 10, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'probability', 'asc');

      expect(sorted[0].prize.id).toBe('3'); // 5%
      expect(sorted[1].prize.id).toBe('1'); // 10%
      expect(sorted[2].prize.id).toBe('2'); // 50%
    });
  });

  describe('在庫数でソート', () => {
    it('should sort by stock in descending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 10, 2000),
        createDisplayInfo('3', 'Prize C', 5, 1, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'stock', 'desc');

      expect(sorted[0].prize.stock).toBe(10);
      expect(sorted[1].prize.stock).toBe(5);
      expect(sorted[2].prize.stock).toBe(1);
    });

    it('should sort by stock in ascending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 10, 2000),
        createDisplayInfo('3', 'Prize C', 5, 1, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'stock', 'asc');

      expect(sorted[0].prize.stock).toBe(1);
      expect(sorted[1].prize.stock).toBe(5);
      expect(sorted[2].prize.stock).toBe(10);
    });
  });

  describe('名前でソート', () => {
    it('should sort by name in ascending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Charlie', 10, 5, 1000),
        createDisplayInfo('2', 'Alice', 50, 3, 2000),
        createDisplayInfo('3', 'Bob', 5, 10, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'name', 'asc');

      expect(sorted[0].prize.name).toBe('Alice');
      expect(sorted[1].prize.name).toBe('Bob');
      expect(sorted[2].prize.name).toBe('Charlie');
    });

    it('should sort by name in descending order', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Charlie', 10, 5, 1000),
        createDisplayInfo('2', 'Alice', 50, 3, 2000),
        createDisplayInfo('3', 'Bob', 5, 10, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'name', 'desc');

      expect(sorted[0].prize.name).toBe('Charlie');
      expect(sorted[1].prize.name).toBe('Bob');
      expect(sorted[2].prize.name).toBe('Alice');
    });

    it('should handle Japanese names', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'う景品', 10, 5, 1000),
        createDisplayInfo('2', 'あ景品', 50, 3, 2000),
        createDisplayInfo('3', 'い景品', 5, 10, 3000),
      ];

      const sorted = sorter.sort(displayInfoList, 'name', 'asc');

      expect(sorted[0].prize.name).toBe('あ景品');
      expect(sorted[1].prize.name).toBe('い景品');
      expect(sorted[2].prize.name).toBe('う景品');
    });
  });

  describe('登録日時でソート', () => {
    it('should sort by createdAt in descending order (newest first)', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 3, 3000),
        createDisplayInfo('3', 'Prize C', 5, 10, 2000),
      ];

      const sorted = sorter.sort(displayInfoList, 'createdAt', 'desc');

      expect(sorted[0].prize.createdAt).toBe(3000);
      expect(sorted[1].prize.createdAt).toBe(2000);
      expect(sorted[2].prize.createdAt).toBe(1000);
    });

    it('should sort by createdAt in ascending order (oldest first)', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 3, 3000),
        createDisplayInfo('3', 'Prize C', 5, 10, 2000),
      ];

      const sorted = sorter.sort(displayInfoList, 'createdAt', 'asc');

      expect(sorted[0].prize.createdAt).toBe(1000);
      expect(sorted[1].prize.createdAt).toBe(2000);
      expect(sorted[2].prize.createdAt).toBe(3000);
    });
  });

  describe('空配列とエッジケース', () => {
    it('should handle empty array', () => {
      const sorted = sorter.sort([], 'probability', 'desc');
      expect(sorted).toEqual([]);
    });

    it('should handle single item', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
      ];

      const sorted = sorter.sort(displayInfoList, 'probability', 'desc');

      expect(sorted.length).toBe(1);
      expect(sorted[0].prize.id).toBe('1');
    });

    it('should handle items with same values', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 10, 5, 1000),
        createDisplayInfo('3', 'Prize C', 10, 5, 1000),
      ];

      const sorted = sorter.sort(displayInfoList, 'probability', 'desc');

      expect(sorted.length).toBe(3);
      // 順序は安定していることを確認（元の順序が保たれる）
      expect(sorted.map((item) => item.prize.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('イミュータビリティ', () => {
    it('should not mutate original array', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Prize A', 10, 5, 1000),
        createDisplayInfo('2', 'Prize B', 50, 3, 2000),
        createDisplayInfo('3', 'Prize C', 5, 10, 3000),
      ];

      const originalOrder = displayInfoList.map((item) => item.prize.id);
      sorter.sort(displayInfoList, 'probability', 'desc');

      // 元の配列は変更されていない
      expect(displayInfoList.map((item) => item.prize.id)).toEqual(originalOrder);
    });
  });
});
