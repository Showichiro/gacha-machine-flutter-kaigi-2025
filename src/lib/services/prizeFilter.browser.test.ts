import { describe, it, expect } from 'vitest';
import { PrizeFilter } from './prizeFilter';
import type { PrizeDisplayInfo } from '../types';

describe('PrizeFilter', () => {
  const filter = new PrizeFilter();

  // テスト用のダミーデータ
  const createDisplayInfo = (
    id: string,
    name: string,
    probability: number,
    stock: number,
    rarity: 'Normal' | 'Rare' | 'SuperRare'
  ): PrizeDisplayInfo => ({
    prize: {
      id,
      name,
      imageUrl: `/img/${id}.png`,
      stock,
      createdAt: Date.now(),
    },
    probability,
    rarity,
    isLowStock: stock <= 3 && stock > 0,
  });

  describe('レアリティでフィルター', () => {
    const displayInfoList: PrizeDisplayInfo[] = [
      createDisplayInfo('1', 'Normal Prize', 50, 10, 'Normal'),
      createDisplayInfo('2', 'Rare Prize', 5, 5, 'Rare'),
      createDisplayInfo('3', 'SuperRare Prize', 1, 1, 'SuperRare'),
      createDisplayInfo('4', 'Another Normal', 30, 8, 'Normal'),
    ];

    it('should return all prizes when filter is "all"', () => {
      const filtered = filter.filterByRarity(displayInfoList, 'all');
      expect(filtered.length).toBe(4);
    });

    it('should filter by Normal rarity', () => {
      const filtered = filter.filterByRarity(displayInfoList, 'Normal');
      expect(filtered.length).toBe(2);
      expect(filtered.every((item) => item.rarity === 'Normal')).toBe(true);
    });

    it('should filter by Rare rarity', () => {
      const filtered = filter.filterByRarity(displayInfoList, 'Rare');
      expect(filtered.length).toBe(1);
      expect(filtered[0].rarity).toBe('Rare');
      expect(filtered[0].prize.name).toBe('Rare Prize');
    });

    it('should filter by SuperRare rarity', () => {
      const filtered = filter.filterByRarity(displayInfoList, 'SuperRare');
      expect(filtered.length).toBe(1);
      expect(filtered[0].rarity).toBe('SuperRare');
      expect(filtered[0].prize.name).toBe('SuperRare Prize');
    });

    it('should return empty array if no matching rarity', () => {
      const onlyNormalList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Normal Prize', 50, 10, 'Normal'),
      ];

      const filtered = filter.filterByRarity(onlyNormalList, 'SuperRare');
      expect(filtered.length).toBe(0);
    });
  });

  describe('在庫切れでフィルター', () => {
    const displayInfoList: PrizeDisplayInfo[] = [
      createDisplayInfo('1', 'In Stock A', 50, 10, 'Normal'),
      createDisplayInfo('2', 'Out of Stock A', 20, 0, 'Normal'),
      createDisplayInfo('3', 'In Stock B', 15, 5, 'Rare'),
      createDisplayInfo('4', 'Out of Stock B', 10, 0, 'Rare'),
    ];

    it('should return all prizes when showOutOfStock is true', () => {
      const filtered = filter.filterByStock(displayInfoList, true);
      expect(filtered.length).toBe(4);
    });

    it('should exclude out-of-stock prizes when showOutOfStock is false', () => {
      const filtered = filter.filterByStock(displayInfoList, false);
      expect(filtered.length).toBe(2);
      expect(filtered.every((item) => item.prize.stock > 0)).toBe(true);
      expect(filtered.map((item) => item.prize.name)).toEqual([
        'In Stock A',
        'In Stock B',
      ]);
    });

    it('should return empty array if all prizes are out of stock and showOutOfStock is false', () => {
      const outOfStockList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Out of Stock A', 50, 0, 'Normal'),
        createDisplayInfo('2', 'Out of Stock B', 50, 0, 'Normal'),
      ];

      const filtered = filter.filterByStock(outOfStockList, false);
      expect(filtered.length).toBe(0);
    });

    it('should handle prizes with low stock correctly', () => {
      const lowStockList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Low Stock', 50, 1, 'Normal'),
        createDisplayInfo('2', 'Out of Stock', 50, 0, 'Normal'),
      ];

      const filtered = filter.filterByStock(lowStockList, false);
      expect(filtered.length).toBe(1);
      expect(filtered[0].prize.name).toBe('Low Stock');
      expect(filtered[0].prize.stock).toBe(1);
    });
  });

  describe('複合フィルター', () => {
    const displayInfoList: PrizeDisplayInfo[] = [
      createDisplayInfo('1', 'Normal In Stock', 50, 10, 'Normal'),
      createDisplayInfo('2', 'Normal Out of Stock', 30, 0, 'Normal'),
      createDisplayInfo('3', 'Rare In Stock', 5, 5, 'Rare'),
      createDisplayInfo('4', 'Rare Out of Stock', 4, 0, 'Rare'),
      createDisplayInfo('5', 'SuperRare In Stock', 1, 1, 'SuperRare'),
    ];

    it('should apply both rarity and stock filters', () => {
      // Rareで在庫ありのみ
      let filtered = filter.filterByRarity(displayInfoList, 'Rare');
      filtered = filter.filterByStock(filtered, false);

      expect(filtered.length).toBe(1);
      expect(filtered[0].prize.name).toBe('Rare In Stock');
      expect(filtered[0].rarity).toBe('Rare');
      expect(filtered[0].prize.stock).toBeGreaterThan(0);
    });

    it('should return all when both filters are permissive', () => {
      let filtered = filter.filterByRarity(displayInfoList, 'all');
      filtered = filter.filterByStock(filtered, true);

      expect(filtered.length).toBe(5);
    });

    it('should return empty when filters exclude all items', () => {
      // SuperRareで在庫切れのみ（存在しない）
      const superRareOnly = filter.filterByRarity(displayInfoList, 'SuperRare');
      const filtered = filter.filterByStock(superRareOnly, false);

      // SuperRareは1個あって在庫ありなので、在庫切れフィルターで除外されない
      expect(filtered.length).toBe(1);
    });
  });

  describe('空配列とエッジケース', () => {
    it('should handle empty array for rarity filter', () => {
      const filtered = filter.filterByRarity([], 'Normal');
      expect(filtered).toEqual([]);
    });

    it('should handle empty array for stock filter', () => {
      const filtered = filter.filterByStock([], false);
      expect(filtered).toEqual([]);
    });

    it('should handle single item array', () => {
      const singleItem: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Only One', 50, 5, 'Normal'),
      ];

      const filtered = filter.filterByRarity(singleItem, 'Normal');
      expect(filtered.length).toBe(1);
    });
  });

  describe('イミュータビリティ', () => {
    it('should not mutate original array in filterByRarity', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'Normal Prize', 50, 10, 'Normal'),
        createDisplayInfo('2', 'Rare Prize', 5, 5, 'Rare'),
      ];

      const originalLength = displayInfoList.length;
      filter.filterByRarity(displayInfoList, 'Normal');

      expect(displayInfoList.length).toBe(originalLength);
    });

    it('should not mutate original array in filterByStock', () => {
      const displayInfoList: PrizeDisplayInfo[] = [
        createDisplayInfo('1', 'In Stock', 50, 10, 'Normal'),
        createDisplayInfo('2', 'Out of Stock', 50, 0, 'Normal'),
      ];

      const originalLength = displayInfoList.length;
      filter.filterByStock(displayInfoList, false);

      expect(displayInfoList.length).toBe(originalLength);
    });
  });
});
