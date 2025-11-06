import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import App from './App.svelte';
import { resetPrizes, prizesStore } from './lib/stores/prizes.svelte';
import { PrizeService } from './lib/services/prizeService';

describe('統合テスト', () => {
  let prizeService: PrizeService;

  beforeEach(() => {
    resetPrizes();
    localStorage.clear();
    prizeService = new PrizeService();
  });

  afterEach(() => {
    cleanup();
  });

  describe('ガチャ実行フロー', () => {
    it('should execute gacha flow from start to finish with storage', async () => {
      // 景品を追加
      prizeService.addPrize({
        name: 'Integration Test Prize',
        imageUrl: '/integration.png',
        stock: 3,
      });

      render(App);

      // ガチャ画面が表示される
      expect(screen.getByTestId('gacha-screen')).toBeDefined();

      // ガチャボタンが有効
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);

      // 初期在庫を確認
      expect(prizesStore.prizes[0].stock).toBe(3);

      // ガチャを実行
      await gachaButton.click();

      // スピニング状態を確認
      expect(screen.getByText(/抽選中/)).toBeDefined();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 結果が表示される
      expect(screen.getByText('Integration Test Prize')).toBeDefined();

      // 在庫が減少
      expect(prizesStore.prizes[0].stock).toBe(2);

      // LocalStorageに保存されている
      const savedData = localStorage.getItem('prizes');
      expect(savedData).not.toBeNull();
      const parsedData = JSON.parse(savedData!);
      expect(parsedData[0].stock).toBe(2);

      // 閉じるボタンをクリック
      const closeButton = screen.getByText('閉じる');
      await closeButton.click();

      // idle状態に戻る
      const newGachaButton = screen.getByTestId('gacha-button');
      expect(newGachaButton).toBeDefined();
    });

    it('should disable gacha button when all prizes are out of stock', async () => {
      // 在庫1の景品を追加
      prizeService.addPrize({
        name: 'Last Prize',
        imageUrl: '/last.png',
        stock: 1,
      });

      render(App);

      // ガチャボタンが有効
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);

      // ガチャを実行
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 閉じるボタンをクリック
      const closeButton = screen.getByText('閉じる');
      await closeButton.click();

      // ガチャボタンが非活性
      const newGachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(newGachaButton.disabled).toBe(true);

      // 在庫なしメッセージが表示される
      expect(screen.getByText(/在庫がありません/)).toBeDefined();
    });
  });

  describe('景品管理フロー', () => {
    it('should manage prizes through settings and persist data', async () => {
      render(App);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(screen.getByTestId('settings-screen')).toBeDefined();

      // 景品追加ボタンをクリック
      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      // フォームに入力
      const nameInput = screen.getByLabelText(/景品名/) as HTMLInputElement;
      const imageUrlInput = screen.getByLabelText(/画像URL/) as HTMLInputElement;
      const stockInput = screen.getByLabelText(/在庫数/) as HTMLInputElement;

      nameInput.value = 'New Prize from Settings';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      imageUrlInput.value = '/new-settings.png';
      imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));

      stockInput.value = '10';
      stockInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 保存
      const saveButton = screen.getByText('保存');
      await saveButton.click();

      // 景品が追加される
      await waitFor(() => {
        expect(screen.getByText('New Prize from Settings')).toBeDefined();
      });

      // LocalStorageに保存されている
      const savedData = localStorage.getItem('prizes');
      expect(savedData).not.toBeNull();
      const parsedData = JSON.parse(savedData!);
      expect(parsedData.length).toBe(1);
      expect(parsedData[0].name).toBe('New Prize from Settings');
      expect(parsedData[0].stock).toBe(10);

      // ガチャ画面に戻る
      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      // ガチャボタンが有効（景品が追加されたため）
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);
    });

    it('should reload persisted data after app restart', async () => {
      // 景品を追加してLocalStorageに保存
      const prize = prizeService.addPrize({
        name: 'Persistent Prize',
        imageUrl: '/persistent.png',
        stock: 5,
      });

      // アプリを再レンダリング（再起動をシミュレート）
      cleanup();
      render(App);

      // 少し待ってデータが読み込まれるのを待つ
      await new Promise((resolve) => setTimeout(resolve, 100));

      // データが復元されている
      expect(prizesStore.prizes.length).toBe(1);
      expect(prizesStore.prizes[0].name).toBe('Persistent Prize');
      expect(prizesStore.prizes[0].stock).toBe(5);

      // 設定画面でも確認
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(screen.getByText('Persistent Prize')).toBeDefined();
      expect(screen.getByText(/在庫: 5/)).toBeDefined();
    });
  });

  describe('画面遷移と状態保持', () => {
    it('should maintain state during screen transitions', async () => {
      // 景品を追加
      prizeService.addPrize({
        name: 'Transition Test Prize',
        imageUrl: '/transition.png',
        stock: 5,
      });

      render(App);

      // ガチャ画面の初期状態を確認
      expect(screen.getByTestId('gacha-screen')).toBeDefined();
      expect(prizesStore.prizes[0].stock).toBe(5);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(screen.getByTestId('settings-screen')).toBeDefined();

      // 在庫が表示される
      expect(screen.getByText(/在庫: 5/)).toBeDefined();

      // ガチャ画面に戻る
      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      // 状態が保持されている
      expect(screen.getByTestId('gacha-screen')).toBeDefined();
      expect(prizesStore.prizes[0].stock).toBe(5);
    });
  });

  describe('エラーハンドリング', () => {
    it('should handle validation errors in settings', async () => {
      render(App);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 景品追加ボタンをクリック
      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      // 空の名前で保存を試みる
      const saveButton = screen.getByText('保存');
      await saveButton.click();

      // エラーメッセージが表示される
      expect(screen.getByText(/景品名は必須です/)).toBeDefined();

      // 景品は追加されない
      expect(prizesStore.prizes.length).toBe(0);
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      // 破損したデータをLocalStorageに保存
      localStorage.setItem('prizes', 'corrupted data');

      // アプリを起動
      render(App);

      // エラーなく起動し、空の状態で初期化される
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(prizesStore.prizes.length).toBe(0);

      // ガチャボタンは非活性
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(true);
    });
  });

  describe('複数回のガチャ実行', () => {
    it('should handle multiple gacha executions correctly', async () => {
      // 景品を追加
      prizeService.addPrize({
        name: 'Multiple Test Prize',
        imageUrl: '/multiple.png',
        stock: 5,
      });

      render(App);

      // 初期在庫
      expect(prizesStore.prizes[0].stock).toBe(5);

      // 1回目のガチャ
      const gachaButton1 = screen.getByTestId('gacha-button');
      await gachaButton1.click();
      await new Promise((resolve) => setTimeout(resolve, 3500));
      const closeButton1 = screen.getByText('閉じる');
      await closeButton1.click();

      // 在庫が4に
      expect(prizesStore.prizes[0].stock).toBe(4);

      // 2回目のガチャ
      const gachaButton2 = screen.getByTestId('gacha-button');
      await gachaButton2.click();
      await new Promise((resolve) => setTimeout(resolve, 3500));
      const closeButton2 = screen.getByText('閉じる');
      await closeButton2.click();

      // 在庫が3に
      expect(prizesStore.prizes[0].stock).toBe(3);

      // LocalStorageも更新されている
      const savedData = localStorage.getItem('prizes');
      const parsedData = JSON.parse(savedData!);
      expect(parsedData[0].stock).toBe(3);
    });
  });
});
