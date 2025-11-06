import { nanoid } from 'nanoid';
import { prizesStore } from '../stores/prizes.svelte';
import { StorageService } from './storage';
import type { Prize, AddPrizeRequest, UpdatePrizeRequest } from '../types';

/**
 * 景品管理サービス
 * 景品のCRUD操作とビジネスロジックを提供
 */
export class PrizeService {
  private storage: StorageService<Prize[]>;

  constructor() {
    this.storage = new StorageService<Prize[]>('prizes');
  }

  /**
   * 全景品を取得
   * @returns 景品リスト
   */
  getPrizes(): Prize[] {
    return prizesStore.prizes;
  }

  /**
   * 景品を追加
   * @param request 追加する景品の情報
   * @returns 追加された景品(IDとcreatedAtが設定済み)
   */
  addPrize(request: AddPrizeRequest): Prize {
    const newPrize: Prize = {
      id: nanoid(),
      name: request.name,
      imageUrl: request.imageUrl,
      stock: request.stock,
      createdAt: Date.now(),
    };

    const currentPrizes = prizesStore.prizes;
    const updatedPrizes = [...currentPrizes, newPrize];

    prizesStore.setPrizes(updatedPrizes);
    this.savePrizes(updatedPrizes);

    return newPrize;
  }

  /**
   * 景品を更新
   * @param request 更新する景品の情報(部分更新対応)
   * @throws {Error} 景品が見つからない場合
   */
  updatePrize(request: UpdatePrizeRequest): void {
    const currentPrizes = prizesStore.prizes;
    const targetIndex = currentPrizes.findIndex((p) => p.id === request.id);

    if (targetIndex === -1) {
      throw new Error('指定された景品が見つかりません');
    }

    const updatedPrize: Prize = {
      ...currentPrizes[targetIndex],
      ...(request.name !== undefined && { name: request.name }),
      ...(request.imageUrl !== undefined && { imageUrl: request.imageUrl }),
      ...(request.stock !== undefined && { stock: request.stock }),
    };

    const updatedPrizes = [...currentPrizes];
    updatedPrizes[targetIndex] = updatedPrize;

    prizesStore.setPrizes(updatedPrizes);
    this.savePrizes(updatedPrizes);
  }

  /**
   * 景品を削除
   * @param id 削除する景品のID
   * @throws {Error} 景品が見つからない場合
   */
  deletePrize(id: string): void {
    const currentPrizes = prizesStore.prizes;
    const targetIndex = currentPrizes.findIndex((p) => p.id === id);

    if (targetIndex === -1) {
      throw new Error('指定された景品が見つかりません');
    }

    const updatedPrizes = currentPrizes.filter((p) => p.id !== id);

    prizesStore.setPrizes(updatedPrizes);
    this.savePrizes(updatedPrizes);
  }

  /**
   * LocalStorageから景品データを読み込む
   */
  loadPrizes(): void {
    const storedPrizes = this.storage.get();
    if (storedPrizes) {
      prizesStore.setPrizes(storedPrizes);
    } else {
      prizesStore.setPrizes([]);
    }
  }

  /**
   * 在庫がある景品からランダムに1つ抽選
   * @returns 抽選された景品、在庫がない場合はnull
   */
  drawPrize(): Prize | null {
    const availablePrizes = prizesStore.availablePrizes;

    if (availablePrizes.length === 0) {
      return null;
    }

    // ランダムに1つ選択
    const randomIndex = Math.floor(Math.random() * availablePrizes.length);
    return availablePrizes[randomIndex];
  }

  /**
   * 景品の在庫を1つ減らす
   * @param id 景品のID
   * @throws {Error} 景品が見つからない場合
   */
  decrementStock(id: string): void {
    const currentPrizes = prizesStore.prizes;
    const targetIndex = currentPrizes.findIndex((p) => p.id === id);

    if (targetIndex === -1) {
      throw new Error('指定された景品が見つかりません');
    }

    const currentStock = currentPrizes[targetIndex].stock;
    const newStock = Math.max(0, currentStock - 1);

    const updatedPrize: Prize = {
      ...currentPrizes[targetIndex],
      stock: newStock,
    };

    const updatedPrizes = [...currentPrizes];
    updatedPrizes[targetIndex] = updatedPrize;

    prizesStore.setPrizes(updatedPrizes);
    this.savePrizes(updatedPrizes);
  }

  /**
   * LocalStorageに景品データを保存
   * @param prizes 保存する景品リスト
   * @private
   */
  private savePrizes(prizes: Prize[]): void {
    this.storage.set(prizes);
  }
}
