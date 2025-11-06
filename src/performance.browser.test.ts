import { describe, it, expect, beforeEach } from 'vitest';
import { PrizeService } from './lib/services/prizeService';
import { StorageService } from './lib/services/storage';
import { resetPrizes, prizesStore } from './lib/stores/prizes.svelte';
import type { Prize } from './lib/types';

describe('パフォーマンステスト', () => {
  beforeEach(() => {
    resetPrizes();
    localStorage.clear();
  });

  describe('LocalStorage読み書き速度', () => {
    it('should write 100 prizes to localStorage in under 10ms', () => {
      const storageService = new StorageService<Prize[]>('prizes');

      // 100件の景品データを生成
      const prizes: Prize[] = Array.from({ length: 100 }, (_, i) => ({
        id: `prize-${i}`,
        name: `Prize ${i}`,
        imageUrl: `/prize-${i}.png`,
        stock: Math.floor(Math.random() * 20) + 1,
        createdAt: Date.now(),
      }));

      // 書き込み速度を測定
      const startTime = performance.now();
      storageService.set(prizes);
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 10ms以内に完了すること
      expect(duration).toBeLessThan(10);
    });

    it('should read 100 prizes from localStorage in under 10ms', () => {
      const storageService = new StorageService<Prize[]>('prizes');

      // 100件の景品データを準備
      const prizes: Prize[] = Array.from({ length: 100 }, (_, i) => ({
        id: `prize-${i}`,
        name: `Prize ${i}`,
        imageUrl: `/prize-${i}.png`,
        stock: Math.floor(Math.random() * 20) + 1,
        createdAt: Date.now(),
      }));

      storageService.set(prizes);

      // 読み込み速度を測定
      const startTime = performance.now();
      const loadedPrizes = storageService.get();
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 10ms以内に完了すること
      expect(duration).toBeLessThan(10);
      expect(loadedPrizes).toHaveLength(100);
    });
  });

  describe('ガチャ抽選アルゴリズムの速度', () => {
    it('should draw from 1000 prizes in under 100ms', () => {
      const prizeService = new PrizeService();

      // 1000件の景品データを追加
      for (let i = 0; i < 1000; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: 1,
        });
      }

      // 抽選速度を測定
      const startTime = performance.now();
      const drawnPrize = prizeService.drawPrize();
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 100ms以内に完了すること
      expect(duration).toBeLessThan(100);
      expect(drawnPrize).not.toBeNull();
    });

    it('should handle multiple draws efficiently', () => {
      const prizeService = new PrizeService();

      // 100件の景品データを追加（各10在庫）
      for (let i = 0; i < 100; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: 10,
        });
      }

      // 100回抽選を実行
      const startTime = performance.now();
      for (let i = 0; i < 100; i++) {
        const drawnPrize = prizeService.drawPrize();
        expect(drawnPrize).not.toBeNull();
      }
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 1回あたり平均1ms以内（合計100ms以内）
      expect(duration).toBeLessThan(100);
    });
  });

  describe('データ処理のパフォーマンス', () => {
    it('should filter available prizes efficiently', () => {
      const prizeService = new PrizeService();

      // 大量の景品データを追加（半分は在庫0）
      for (let i = 0; i < 500; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: i % 2 === 0 ? 5 : 0,
        });
      }

      // フィルタリング速度を測定（prizesStoreから直接取得）
      const startTime = performance.now();
      const availablePrizes = prizesStore.availablePrizes;
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 10ms以内に完了すること
      expect(duration).toBeLessThan(10);
      expect(availablePrizes).toHaveLength(250);
    });

    it('should update prize efficiently', () => {
      const prizeService = new PrizeService();

      // 100件の景品データを追加
      for (let i = 0; i < 100; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: 10,
        });
      }

      const prizeToUpdate = prizeService.getPrizes()[50];

      // 更新速度を測定
      const startTime = performance.now();
      prizeService.updatePrize({
        id: prizeToUpdate.id,
        stock: 20,
      });
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 10ms以内に完了すること
      expect(duration).toBeLessThan(10);
    });

    it('should delete prize efficiently', () => {
      const prizeService = new PrizeService();

      // 100件の景品データを追加
      for (let i = 0; i < 100; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: 10,
        });
      }

      const prizeToDelete = prizeService.getPrizes()[50];

      // 削除速度を測定
      const startTime = performance.now();
      prizeService.deletePrize(prizeToDelete.id);
      const endTime = performance.now();

      const duration = endTime - startTime;

      // 10ms以内に完了すること
      expect(duration).toBeLessThan(10);
      expect(prizeService.getPrizes()).toHaveLength(99);
    });
  });

  describe('メモリ使用量', () => {
    it('should handle large datasets without memory issues', () => {
      const prizeService = new PrizeService();

      // 1000件の景品データを追加
      for (let i = 0; i < 1000; i++) {
        prizeService.addPrize({
          name: `Prize ${i}`,
          imageUrl: `/prize-${i}.png`,
          stock: 10,
        });
      }

      // データが正しく格納されている
      expect(prizeService.getPrizes()).toHaveLength(1000);

      // LocalStorageに保存できる
      const storageService = new StorageService<Prize[]>('prizes');
      storageService.set(prizeService.getPrizes());

      const loaded = storageService.get();
      expect(loaded).toHaveLength(1000);
    });
  });

  describe('アニメーションパフォーマンス（概念的確認）', () => {
    it('should use spring animation for smooth transitions', async () => {
      // springアニメーションはsvelte/motionで提供され、
      // 60fpsを目標としたスムーズなアニメーションを実現する
      const { createSpinAnimation, createRevealAnimation } = await import('./lib/services/animationEngine');

      const spinAnimation = createSpinAnimation();
      const revealAnimation = createRevealAnimation({ duration: 1000 });

      // アニメーションストアが作成される
      expect(spinAnimation).toBeDefined();
      expect(revealAnimation).toBeDefined();
    });
  });
});
