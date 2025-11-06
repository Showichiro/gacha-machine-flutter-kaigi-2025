import { describe, it, expect, beforeEach } from 'vitest';
import { prizesStore, resetPrizes } from './prizes.svelte';
import type { Prize } from '../types';

describe('prizesStore', () => {
  beforeEach(() => {
    // 各テスト前に状態をリセット
    resetPrizes();
  });

  describe('prizes state', () => {
    it('should initialize with empty array', () => {
      expect(prizesStore.prizes).toEqual([]);
    });
  });

  describe('availablePrizes derived state', () => {
    it('should return empty array when no prizes exist', () => {
      expect(prizesStore.availablePrizes).toEqual([]);
    });

    it('should return only prizes with stock > 0', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
        {
          id: '3',
          name: 'Prize C',
          imageUrl: '/c.png',
          stock: 3,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);

      expect(prizesStore.availablePrizes.length).toBe(2);
      expect(prizesStore.availablePrizes[0].id).toBe('1');
      expect(prizesStore.availablePrizes[1].id).toBe('3');
    });

    it('should update when prize stock changes', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 1,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);
      expect(prizesStore.availablePrizes.length).toBe(1);

      // 在庫を0に更新
      testPrizes[0].stock = 0;
      prizesStore.setPrizes([...testPrizes]);

      expect(prizesStore.availablePrizes.length).toBe(0);
    });
  });

  describe('isGachaAvailable derived state', () => {
    it('should return false when no prizes exist', () => {
      expect(prizesStore.isGachaAvailable).toBe(false);
    });

    it('should return false when all prizes have 0 stock', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 0,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);

      expect(prizesStore.isGachaAvailable).toBe(false);
    });

    it('should return true when at least one prize has stock > 0', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 0,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 1,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);

      expect(prizesStore.isGachaAvailable).toBe(true);
    });

    it('should update when availablePrizes changes', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 1,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);
      expect(prizesStore.isGachaAvailable).toBe(true);

      // 在庫を0に更新
      testPrizes[0].stock = 0;
      prizesStore.setPrizes([...testPrizes]);

      expect(prizesStore.isGachaAvailable).toBe(false);
    });
  });

  describe('setPrizes', () => {
    it('should update prizes state', () => {
      const testPrizes: Prize[] = [
        {
          id: '1',
          name: 'Test Prize',
          imageUrl: '/test.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(testPrizes);

      expect(prizesStore.prizes).toEqual(testPrizes);
    });
  });
});
