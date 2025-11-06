import { describe, it, expect, beforeEach } from 'vitest';
import { FilterStore, resetFilter } from './filter.svelte';
import type { RarityLevel } from '../types';

describe('FilterStore', () => {
  beforeEach(() => {
    resetFilter();
  });

  describe('初期状態', () => {
    it('should initialize with default filter state', () => {
      expect(FilterStore.sortBy).toBe('probability');
      expect(FilterStore.sortOrder).toBe('desc');
      expect(FilterStore.rarityFilter).toBe('all');
      expect(FilterStore.showOutOfStock).toBe(true);
    });
  });

  describe('ソート設定', () => {
    it('should update sortBy', () => {
      FilterStore.setSortBy('name');
      expect(FilterStore.sortBy).toBe('name');
    });

    it('should update sortOrder', () => {
      FilterStore.setSortOrder('asc');
      expect(FilterStore.sortOrder).toBe('asc');
    });

    it('should accept valid sort fields', () => {
      FilterStore.setSortBy('probability');
      expect(FilterStore.sortBy).toBe('probability');

      FilterStore.setSortBy('stock');
      expect(FilterStore.sortBy).toBe('stock');

      FilterStore.setSortBy('name');
      expect(FilterStore.sortBy).toBe('name');

      FilterStore.setSortBy('createdAt');
      expect(FilterStore.sortBy).toBe('createdAt');
    });

    it('should accept valid sort orders', () => {
      FilterStore.setSortOrder('asc');
      expect(FilterStore.sortOrder).toBe('asc');

      FilterStore.setSortOrder('desc');
      expect(FilterStore.sortOrder).toBe('desc');
    });
  });

  describe('レアリティフィルター', () => {
    it('should update rarity filter', () => {
      FilterStore.setRarityFilter('Rare');
      expect(FilterStore.rarityFilter).toBe('Rare');
    });

    it('should accept all rarity levels', () => {
      FilterStore.setRarityFilter('all');
      expect(FilterStore.rarityFilter).toBe('all');

      FilterStore.setRarityFilter('Normal');
      expect(FilterStore.rarityFilter).toBe('Normal');

      FilterStore.setRarityFilter('Rare');
      expect(FilterStore.rarityFilter).toBe('Rare');

      FilterStore.setRarityFilter('SuperRare');
      expect(FilterStore.rarityFilter).toBe('SuperRare');
    });
  });

  describe('在庫切れ表示', () => {
    it('should update showOutOfStock', () => {
      FilterStore.setShowOutOfStock(false);
      expect(FilterStore.showOutOfStock).toBe(false);
    });

    it('should toggle showOutOfStock', () => {
      const initialValue = FilterStore.showOutOfStock;
      FilterStore.setShowOutOfStock(!initialValue);
      expect(FilterStore.showOutOfStock).toBe(!initialValue);
    });
  });

  describe('リセット機能', () => {
    it('should reset filter to default state', () => {
      // フィルターを変更
      FilterStore.setSortBy('name');
      FilterStore.setSortOrder('asc');
      FilterStore.setRarityFilter('SuperRare');
      FilterStore.setShowOutOfStock(false);

      // リセット
      resetFilter();

      // デフォルト状態に戻ることを確認
      expect(FilterStore.sortBy).toBe('probability');
      expect(FilterStore.sortOrder).toBe('desc');
      expect(FilterStore.rarityFilter).toBe('all');
      expect(FilterStore.showOutOfStock).toBe(true);
    });
  });

  describe('複数設定の変更', () => {
    it('should handle multiple filter changes', () => {
      FilterStore.setSortBy('stock');
      FilterStore.setSortOrder('asc');
      FilterStore.setRarityFilter('Rare');
      FilterStore.setShowOutOfStock(false);

      expect(FilterStore.sortBy).toBe('stock');
      expect(FilterStore.sortOrder).toBe('asc');
      expect(FilterStore.rarityFilter).toBe('Rare');
      expect(FilterStore.showOutOfStock).toBe(false);
    });

    it('should maintain independent state for each filter', () => {
      FilterStore.setRarityFilter('Normal');
      expect(FilterStore.sortBy).toBe('probability'); // 他の設定は変わらない
      expect(FilterStore.sortOrder).toBe('desc');
      expect(FilterStore.showOutOfStock).toBe(true);
    });
  });
});
