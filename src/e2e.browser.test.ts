import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import App from './App.svelte';
import { resetPrizes, prizesStore } from './lib/stores/prizes.svelte';

describe('エンドツーエンドシナリオテスト', () => {
  beforeEach(() => {
    resetPrizes();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  describe('来場者フロー', () => {
    it('should complete visitor flow: gacha → animation → prize → repeat', async () => {
      // 景品を事前準備（運営者が設定した想定）
      const { PrizeService } = await import('./lib/services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Flutter Kaigi Tシャツ',
        imageUrl: '/tshirt.png',
        stock: 10,
      });
      prizeService.addPrize({
        name: 'Flutter Kaigi ステッカー',
        imageUrl: '/sticker.png',
        stock: 20,
      });

      // アプリを起動
      render(App);

      // === 1回目のガチャ ===

      // ガチャ画面が表示される
      expect(screen.getByTestId('gacha-screen')).toBeDefined();

      // ガチャボタンをタップ
      const gachaButton1 = screen.getByTestId('gacha-button');
      await gachaButton1.click();

      // 抽選中のアニメーション表示
      expect(screen.getByText(/抽選中/)).toBeDefined();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 結果が表示される（どちらかの景品）
      const resultScreen = screen.getByTestId('gacha-screen');
      expect(resultScreen).toBeDefined();

      // 閉じるボタンをクリック
      const closeButton1 = screen.getByText('閉じる');
      await closeButton1.click();

      // === 2回目のガチャ ===

      // ガチャボタンが再度表示される
      const gachaButton2 = screen.getByTestId('gacha-button');
      expect(gachaButton2).toBeDefined();

      // 2回目のガチャを実行
      await gachaButton2.click();

      // 抽選中
      expect(screen.getByText(/抽選中/)).toBeDefined();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 結果表示
      const closeButton2 = screen.getByText('閉じる');
      expect(closeButton2).toBeDefined();

      // 2回実行したので在庫が2減っている
      const totalStock = prizesStore.prizes.reduce((sum, p) => sum + p.stock, 0);
      expect(totalStock).toBe(28); // 30 - 2
    });
  });

  describe('運営者フロー', () => {
    it('should complete organizer flow: settings → add → edit → delete → gacha', async () => {
      // アプリを起動
      render(App);

      // === 設定画面へ遷移 ===

      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(screen.getByTestId('settings-screen')).toBeDefined();

      // 初期状態は景品なし
      expect(screen.getByText(/景品が登録されていません/)).toBeDefined();

      // === 景品を追加 ===

      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      // フォームに入力
      const nameInput = screen.getByLabelText(/景品名/) as HTMLInputElement;
      const imageUrlInput = screen.getByLabelText(/画像URL/) as HTMLInputElement;
      const stockInput = screen.getByLabelText(/在庫数/) as HTMLInputElement;

      nameInput.value = 'オリジナルグッズ';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      imageUrlInput.value = '/goods.png';
      imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));

      stockInput.value = '15';
      stockInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 保存
      const saveButton = screen.getByText('保存');
      await saveButton.click();

      // 景品が追加される
      await waitFor(() => {
        expect(screen.getByText('オリジナルグッズ')).toBeDefined();
        expect(screen.getByText(/在庫: 15/)).toBeDefined();
      });

      // === 景品を編集 ===

      const editButton = screen.getByTestId('edit-prize-button-0');
      await editButton.click();

      // フォームが表示され、既存データが入力されている
      const editNameInput = screen.getByLabelText(/景品名/) as HTMLInputElement;
      expect(editNameInput.value).toBe('オリジナルグッズ');

      // 在庫数を変更
      const editStockInput = screen.getByLabelText(/在庫数/) as HTMLInputElement;
      editStockInput.value = '20';
      editStockInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 保存
      const editSaveButton = screen.getByText('保存');
      await editSaveButton.click();

      // 在庫が更新される
      await waitFor(() => {
        expect(screen.getByText(/在庫: 20/)).toBeDefined();
      });

      // === 2つ目の景品を追加 ===

      const addButton2 = screen.getByTestId('add-prize-button');
      await addButton2.click();

      const nameInput2 = screen.getByLabelText(/景品名/) as HTMLInputElement;
      const imageUrlInput2 = screen.getByLabelText(/画像URL/) as HTMLInputElement;
      const stockInput2 = screen.getByLabelText(/在庫数/) as HTMLInputElement;

      nameInput2.value = 'クリアファイル';
      nameInput2.dispatchEvent(new Event('input', { bubbles: true }));

      imageUrlInput2.value = '/file.png';
      imageUrlInput2.dispatchEvent(new Event('input', { bubbles: true }));

      stockInput2.value = '30';
      stockInput2.dispatchEvent(new Event('input', { bubbles: true }));

      const saveButton2 = screen.getByText('保存');
      await saveButton2.click();

      await waitFor(() => {
        expect(screen.getByText('クリアファイル')).toBeDefined();
      });

      // === 景品を削除 ===

      // 2つ目の景品を削除
      const deleteButton = screen.getByTestId('delete-prize-button-1');
      await deleteButton.click();

      // 確認ダイアログが表示されるまで待つ
      await waitFor(() => {
        expect(screen.getByText(/削除してもよろしいですか/)).toBeDefined();
      });

      // 少し待機してダイアログが完全に表示されるのを待つ
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 削除を確定（ダイアログの削除ボタンをクリック）
      const confirmButtons = screen.getAllByText('削除');
      // 最後のボタンがダイアログの削除ボタン
      await confirmButtons[confirmButtons.length - 1].click();

      // 景品が削除される
      await waitFor(() => {
        const clearFiles = screen.queryAllByText('クリアファイル');
        expect(clearFiles.length).toBe(0);
      });

      // === ガチャ画面に戻る ===

      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      expect(screen.getByTestId('gacha-screen')).toBeDefined();

      // ガチャボタンが有効（景品が登録されているため）
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);
    });
  });

  describe('在庫管理フロー', () => {
    it('should handle stock depletion: stock 1 → gacha → stock 0 → button disabled', async () => {
      // 在庫1の景品を準備
      const { PrizeService } = await import('./lib/services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: '最後の景品',
        imageUrl: '/last.png',
        stock: 1,
      });

      render(App);

      // 初期状態: ガチャボタンが有効
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);

      // 在庫を確認
      expect(prizesStore.prizes[0].stock).toBe(1);

      // ガチャを実行
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 結果が表示される
      expect(screen.getByText('最後の景品')).toBeDefined();

      // 在庫が0に
      expect(prizesStore.prizes[0].stock).toBe(0);

      // 閉じるボタンをクリック
      const closeButton = screen.getByText('閉じる');
      await closeButton.click();

      // ガチャボタンが非活性化
      const newGachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(newGachaButton.disabled).toBe(true);

      // 在庫なしメッセージが表示される
      expect(screen.getByText(/在庫がありません/)).toBeDefined();
    });
  });

  describe('データ永続化フロー', () => {
    it('should persist and restore data: add → reload → check data', async () => {
      // === 初回起動 ===

      render(App);

      // 設定画面で景品を追加
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      const nameInput = screen.getByLabelText(/景品名/) as HTMLInputElement;
      const imageUrlInput = screen.getByLabelText(/画像URL/) as HTMLInputElement;
      const stockInput = screen.getByLabelText(/在庫数/) as HTMLInputElement;

      nameInput.value = '永続化テスト景品';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      imageUrlInput.value = '/persistent-test.png';
      imageUrlInput.dispatchEvent(new Event('input', { bubbles: true }));

      stockInput.value = '25';
      stockInput.dispatchEvent(new Event('input', { bubbles: true }));

      const saveButton = screen.getByText('保存');
      await saveButton.click();

      await waitFor(() => {
        expect(screen.getByText('永続化テスト景品')).toBeDefined();
      });

      // LocalStorageに保存されている
      const savedData = localStorage.getItem('prizes');
      expect(savedData).not.toBeNull();
      const parsedData = JSON.parse(savedData!);
      expect(parsedData[0].name).toBe('永続化テスト景品');
      expect(parsedData[0].stock).toBe(25);

      // === アプリ再起動（ブラウザリロードをシミュレート） ===

      cleanup();
      render(App);

      // データ読み込みを待つ
      await new Promise((resolve) => setTimeout(resolve, 100));

      // データが復元されている
      expect(prizesStore.prizes.length).toBe(1);
      expect(prizesStore.prizes[0].name).toBe('永続化テスト景品');
      expect(prizesStore.prizes[0].stock).toBe(25);

      // 設定画面で確認
      const settingsButton2 = screen.getByTestId('settings-button');
      await settingsButton2.click();

      expect(screen.getByText('永続化テスト景品')).toBeDefined();
      expect(screen.getByText(/在庫: 25/)).toBeDefined();
    });
  });

  describe('エラーハンドリングフロー', () => {
    it('should show validation error: empty name → error message → no save', async () => {
      render(App);

      // 設定画面へ遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 景品追加フォームを開く
      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      // 景品名を空のまま保存を試みる
      const saveButton = screen.getByText('保存');
      await saveButton.click();

      // エラーメッセージが表示される
      expect(screen.getByText(/景品名は必須です/)).toBeDefined();

      // 景品は追加されていない
      expect(prizesStore.prizes.length).toBe(0);

      // キャンセルしてフォームを閉じる
      const cancelButton = screen.getByText('キャンセル');
      await cancelButton.click();

      // フォームが閉じる
      const forms = screen.queryAllByTestId('prize-form');
      expect(forms.length).toBe(0);

      // 空のメッセージが表示されたまま
      expect(screen.getByText(/景品が登録されていません/)).toBeDefined();
    });

    it('should show validation error for negative stock', async () => {
      render(App);

      // 設定画面へ遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 景品追加フォームを開く
      const addButton = screen.getByTestId('add-prize-button');
      await addButton.click();

      // 名前を入力、在庫を負の数にする
      const nameInput = screen.getByLabelText(/景品名/) as HTMLInputElement;
      nameInput.value = 'テスト景品';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));

      const stockInput = screen.getByLabelText(/在庫数/) as HTMLInputElement;
      stockInput.value = '-10';
      stockInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 保存を試みる
      const saveButton = screen.getByText('保存');
      await saveButton.click();

      // エラーメッセージが表示される
      expect(screen.getByText(/在庫数は0以上である必要があります/)).toBeDefined();

      // 景品は追加されていない
      expect(prizesStore.prizes.length).toBe(0);
    });
  });
});
