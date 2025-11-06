import { prizesStore } from '../stores/prizes.svelte';
import { StorageService } from './storage';
import type { Prize } from '../types';

/**
 * データ初期化サービス
 * アプリケーション起動時のデータロードと整合性チェックを担当
 */
export class DataInitializer {
  private storageService: StorageService<Prize[]>;

  constructor() {
    this.storageService = new StorageService<Prize[]>('prizes');
  }

  /**
   * アプリケーション起動時のデータ初期化
   * LocalStorageから景品データを読み込み、整合性をチェックする
   */
  initialize(): void {
    try {
      // LocalStorageからデータを読み込む
      const savedPrizes = this.storageService.get();

      if (!savedPrizes) {
        // データが存在しない場合、空配列で初期化
        prizesStore.setPrizes([]);
        return;
      }

      // データ整合性チェック
      if (!this.checkDataIntegrity(savedPrizes)) {
        console.error('Data integrity check failed. Initializing with empty data.');
        this.clearData();
        return;
      }

      // データを復元
      prizesStore.setPrizes(savedPrizes);
    } catch (error) {
      console.error('Failed to initialize data:', error);
      // エラーが発生した場合、空配列で初期化
      prizesStore.setPrizes([]);
    }
  }

  /**
   * データ整合性チェック
   * 読み込んだデータが正しい形式かどうかを検証する
   * @param prizes チェックする景品データ
   * @returns データが有効な場合true、無効な場合false
   */
  checkDataIntegrity(prizes: Prize[]): boolean {
    // 配列でない場合はfalse
    if (!Array.isArray(prizes)) {
      return false;
    }

    // 空配列の場合はtrue
    if (prizes.length === 0) {
      return true;
    }

    // 各景品のデータをチェック
    for (const prize of prizes) {
      // 必須フィールドの存在チェック
      if (!prize.id || typeof prize.id !== 'string') {
        return false;
      }

      if (!prize.name || typeof prize.name !== 'string') {
        return false;
      }

      if (typeof prize.imageUrl !== 'string') {
        return false;
      }

      if (typeof prize.stock !== 'number' || prize.stock < 0) {
        return false;
      }

      if (typeof prize.createdAt !== 'number') {
        return false;
      }
    }

    return true;
  }

  /**
   * データをクリア
   * LocalStorageとstoreの両方からデータを削除する
   */
  clearData(): void {
    try {
      localStorage.removeItem('prizes');
      prizesStore.setPrizes([]);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}
