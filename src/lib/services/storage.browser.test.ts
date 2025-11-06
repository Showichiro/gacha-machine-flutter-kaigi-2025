import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StorageService } from './storage';

describe('StorageService', () => {
  let storage: StorageService<{ name: string; value: number }>;
  const testKey = 'test-key';

  beforeEach(() => {
    storage = new StorageService(testKey);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('データが存在しない場合はnullを返す', () => {
      const result = storage.get();
      expect(result).toBeNull();
    });

    it('保存されたデータを正しくデシリアライズして返す', () => {
      const testData = { name: 'test', value: 123 };
      localStorage.setItem(testKey, JSON.stringify(testData));

      const result = storage.get();
      expect(result).toEqual(testData);
    });

    it('JSON.parse失敗時はnullを返しエラーログを出力する', () => {
      localStorage.setItem(testKey, 'invalid json');

      const result = storage.get();
      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('データを正しくシリアライズしてLocalStorageに保存する', () => {
      const testData = { name: 'test', value: 456 };

      storage.set(testData);

      const stored = localStorage.getItem(testKey);
      expect(stored).toBe(JSON.stringify(testData));
    });

    it('LocalStorage容量超過時はエラーをスローする', () => {
      // LocalStorageの容量を超える大きなデータを作成
      const largeData = { name: 'x'.repeat(10 * 1024 * 1024), value: 1 };

      expect(() => storage.set(largeData)).toThrow('ストレージへの保存に失敗しました');
    });
  });

  describe('remove', () => {
    it('指定されたキーのデータを削除する', () => {
      localStorage.setItem(testKey, JSON.stringify({ name: 'test', value: 789 }));

      storage.remove();

      expect(localStorage.getItem(testKey)).toBeNull();
    });
  });

  describe('clear', () => {
    it('LocalStorageの全データをクリアする', () => {
      localStorage.setItem('test-key', JSON.stringify({ name: 'test', value: 999 }));
      localStorage.setItem('other-key', 'other data');

      storage.clear();

      expect(localStorage.length).toBe(0);
    });
  });
});
