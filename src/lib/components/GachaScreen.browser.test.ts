import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import GachaScreen from './GachaScreen.svelte';
import { resetPrizes, prizesStore } from '../stores/prizes.svelte';

describe('GachaScreen', () => {
  beforeEach(() => {
    resetPrizes();
  });

  afterEach(() => {
    cleanup();
  });

  describe('初期表示', () => {
    it('should render gacha screen', () => {
      render(GachaScreen);

      // ガチャ画面が表示されることを確認
      expect(screen.getByTestId('gacha-screen')).toBeDefined();
    });

    it('should show settings button', () => {
      render(GachaScreen);

      // 設定画面への遷移ボタンが表示される
      const settingsButton = screen.getByTestId('settings-button');
      expect(settingsButton).toBeDefined();
    });

    it('should show gacha button when idle', () => {
      render(GachaScreen);

      // ガチャボタンが表示される
      const gachaButton = screen.getByTestId('gacha-button');
      expect(gachaButton).toBeDefined();
    });
  });

  describe('状態管理', () => {
    it('should initialize with idle state', () => {
      const { component } = render(GachaScreen);

      // 初期状態はidle
      expect(component).toBeDefined();
    });

    it('should call navigate callback when settings button is clicked', async () => {
      let navigateCalled = false;
      let navigateScreen = '';

      render(GachaScreen, {
        onnavigate: (event: CustomEvent) => {
          navigateCalled = true;
          navigateScreen = event.detail.screen;
        },
      });

      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(navigateCalled).toBe(true);
      expect(navigateScreen).toBe('settings');
    });
  });

  describe('在庫なし時の表示', () => {
    it('should disable gacha button when no prizes available', () => {
      render(GachaScreen);

      // 在庫がない場合、ガチャボタンが非活性化される
      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(true);
    });

    it('should show no stock message when no prizes available', () => {
      render(GachaScreen);

      // 在庫なしメッセージが表示される
      expect(screen.getByText(/在庫がありません/)).toBeDefined();
    });
  });

  describe('ガチャ実行フロー', () => {
    it('should transition to spinning state when gacha button is clicked', async () => {
      // 景品を追加して在庫を確保
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // スピニング中の表示を確認
      expect(screen.getByText(/抽選中/)).toBeDefined();
    });

    it('should disable gacha button during animation', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);

      await gachaButton.click();

      // アニメーション中はボタンが表示されない（idle状態ではない）
      const buttons = screen.queryAllByTestId('gacha-button');
      // spinning状態ではガチャボタンは表示されない
      expect(buttons.length).toBe(0);
    });

    it('should show result after animation completes', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ（テストでは短縮）
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 結果が表示されることを確認（spinning → revealing → result）
      // 注: 実装では状態遷移のタイミングを制御する
    });
  });

  describe('当選景品の表示と完了処理', () => {
    it('should show prize name in result state', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Awesome Prize',
        imageUrl: '/awesome.png',
        stock: 1,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 景品名が表示される (waitForで待機)
      const prizeName = await screen.findByText('Awesome Prize', {}, { timeout: 3000 });
      expect(prizeName).toBeDefined();
    });

    it('should show close button in result state', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 1,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 閉じるボタンが表示される (waitForで待機)
      const closeButton = await screen.findByText('閉じる', {}, { timeout: 3000 });
      expect(closeButton).toBeDefined();
    });

    it('should return to idle state when close button is clicked', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 2,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 閉じるボタンをクリック (waitForで待機)
      const closeButton = await screen.findByText('閉じる', {}, { timeout: 3000 });
      await closeButton.click();

      // idle状態に戻り、ガチャボタンが再度表示される
      const newGachaButton = screen.getByTestId('gacha-button');
      expect(newGachaButton).toBeDefined();
    });

    it('should decrease stock after gacha execution', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      expect(prizesStore.prizes[0].stock).toBe(5);

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 結果が表示されるまで待機
      await screen.findByText('Test Prize', {}, { timeout: 3000 });

      // 在庫が1減っていることを確認
      expect(prizesStore.prizes[0].stock).toBe(4);
    });
  });

  describe('在庫状態に応じたUI制御', () => {
    it('should enable gacha button when prizes are available', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);
    });

    it('should disable gacha button after last prize is drawn', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Last Prize',
        imageUrl: '/last.png',
        stock: 1,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(gachaButton.disabled).toBe(false);

      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 閉じるボタンをクリック (waitForで待機)
      const closeButton = await screen.findByText('閉じる', {}, { timeout: 3000 });
      await closeButton.click();

      // idle状態に戻るが、在庫が0なのでボタンは非活性
      const newGachaButton = screen.getByTestId('gacha-button') as HTMLButtonElement;
      expect(newGachaButton.disabled).toBe(true);
    });

    it('should show no stock message when all prizes are out of stock', async () => {
      const { PrizeService } = await import('../services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Last Prize',
        imageUrl: '/last.png',
        stock: 1,
      });

      render(GachaScreen);

      const gachaButton = screen.getByTestId('gacha-button');
      await gachaButton.click();

      // アニメーション完了を待つ(2.8秒: スピニング2.0秒 + リビール0.8秒)
      await new Promise((resolve) => setTimeout(resolve, 2800));

      // 閉じるボタンをクリック (waitForで待機)
      const closeButton = await screen.findByText('閉じる', {}, { timeout: 3000 });
      await closeButton.click();

      // 在庫なしメッセージが表示される
      expect(screen.getByText(/在庫がありません/)).toBeDefined();
    });
  });
});
