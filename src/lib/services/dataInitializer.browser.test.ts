import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataInitializer } from './dataInitializer';
import { prizesStore, resetPrizes } from '../stores/prizes.svelte';

describe('DataInitializer', () => {
  let dataInitializer: DataInitializer;

  beforeEach(() => {
    resetPrizes();
    localStorage.clear();
    dataInitializer = new DataInitializer();
  });

  describe('initialize', () => {
    it('should load prizes from localStorage on initialize', () => {
      // LocalStorageにデータを保存
      const prizes = [
        {
          id: '1',
          name: 'Test Prize 1',
          imageUrl: '/test1.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Test Prize 2',
          imageUrl: '/test2.png',
          stock: 3,
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem('prizes', JSON.stringify(prizes));

      // 初期化
      dataInitializer.initialize();

      // prizesStoreにデータが読み込まれている
      expect(prizesStore.prizes.length).toBe(2);
      expect(prizesStore.prizes[0].name).toBe('Test Prize 1');
      expect(prizesStore.prizes[1].name).toBe('Test Prize 2');
    });

    it('should initialize with empty array when no data in localStorage', () => {
      // LocalStorageにデータがない状態で初期化
      dataInitializer.initialize();

      // prizesStoreは空
      expect(prizesStore.prizes.length).toBe(0);
    });

    it('should handle corrupted data in localStorage', () => {
      // 破損したデータをLocalStorageに保存
      localStorage.setItem('prizes', 'invalid json data');

      // 初期化（エラーが発生せず、空配列で初期化される）
      dataInitializer.initialize();

      // prizesStoreは空
      expect(prizesStore.prizes.length).toBe(0);
    });

    it('should handle localStorage not available', () => {
      // LocalStorageを無効化
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('localStorage is not available');
      });

      // 初期化（エラーが発生せず、空配列で初期化される）
      dataInitializer.initialize();

      // prizesStoreは空
      expect(prizesStore.prizes.length).toBe(0);

      getItemSpy.mockRestore();
    });

    it('should restore data with correct types', () => {
      // LocalStorageにデータを保存
      const prizes = [
        {
          id: 'test-id',
          name: 'Awesome Prize',
          imageUrl: '/awesome.png',
          stock: 10,
          createdAt: 1234567890,
        },
      ];
      localStorage.setItem('prizes', JSON.stringify(prizes));

      // 初期化
      dataInitializer.initialize();

      // データの型が正しい
      const restoredPrize = prizesStore.prizes[0];
      expect(typeof restoredPrize.id).toBe('string');
      expect(typeof restoredPrize.name).toBe('string');
      expect(typeof restoredPrize.imageUrl).toBe('string');
      expect(typeof restoredPrize.stock).toBe('number');
      expect(typeof restoredPrize.createdAt).toBe('number');
    });
  });

  describe('checkDataIntegrity', () => {
    it('should return true for valid prize data', () => {
      const validPrize = {
        id: 'test-id',
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
        createdAt: Date.now(),
      };

      const result = dataInitializer.checkDataIntegrity([validPrize]);

      expect(result).toBe(true);
    });

    it('should return false when prize is missing id', () => {
      const invalidPrize = {
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
        createdAt: Date.now(),
      } as any;

      const result = dataInitializer.checkDataIntegrity([invalidPrize]);

      expect(result).toBe(false);
    });

    it('should return false when prize is missing name', () => {
      const invalidPrize = {
        id: 'test-id',
        imageUrl: '/test.png',
        stock: 5,
        createdAt: Date.now(),
      } as any;

      const result = dataInitializer.checkDataIntegrity([invalidPrize]);

      expect(result).toBe(false);
    });

    it('should return false when stock is negative', () => {
      const invalidPrize = {
        id: 'test-id',
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: -1,
        createdAt: Date.now(),
      };

      const result = dataInitializer.checkDataIntegrity([invalidPrize]);

      expect(result).toBe(false);
    });

    it('should return true for empty array', () => {
      const result = dataInitializer.checkDataIntegrity([]);

      expect(result).toBe(true);
    });
  });

  describe('clearData', () => {
    it('should clear all prizes from localStorage and store', () => {
      // データを準備
      const prizes = [
        {
          id: '1',
          name: 'Test Prize',
          imageUrl: '/test.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];
      localStorage.setItem('prizes', JSON.stringify(prizes));
      prizesStore.setPrizes(prizes);

      // データをクリア
      dataInitializer.clearData();

      // LocalStorageとstoreが空
      expect(localStorage.getItem('prizes')).toBeNull();
      expect(prizesStore.prizes.length).toBe(0);
    });
  });
});
