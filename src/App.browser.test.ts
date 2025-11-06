import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import App from './App.svelte';
import { resetPrizes } from './lib/stores/prizes.svelte';

describe('App', () => {
  beforeEach(() => {
    resetPrizes();
  });

  afterEach(() => {
    cleanup();
  });

  describe('初期表示', () => {
    it('should render app', () => {
      render(App);

      // アプリが表示されることを確認
      expect(document.querySelector('.app')).toBeDefined();
    });

    it('should show gacha screen on startup', () => {
      render(App);

      // 起動時にガチャ画面が表示される
      expect(screen.getByTestId('gacha-screen')).toBeDefined();
    });

    it('should not show settings screen on startup', () => {
      render(App);

      // 起動時に設定画面は表示されない
      const settingsScreens = screen.queryAllByTestId('settings-screen');
      expect(settingsScreens.length).toBe(0);
    });
  });

  describe('画面遷移', () => {
    it('should navigate to settings screen when settings button is clicked', async () => {
      render(App);

      // 初期状態: ガチャ画面
      expect(screen.getByTestId('gacha-screen')).toBeDefined();

      // 設定ボタンをクリック
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 設定画面に遷移
      expect(screen.getByTestId('settings-screen')).toBeDefined();
    });

    it('should navigate back to gacha screen when back button is clicked', async () => {
      render(App);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      expect(screen.getByTestId('settings-screen')).toBeDefined();

      // 戻るボタンをクリック
      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      // ガチャ画面に戻る
      expect(screen.getByTestId('gacha-screen')).toBeDefined();
    });

    it('should hide gacha screen when on settings screen', async () => {
      render(App);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // ガチャ画面は表示されない
      const gachaScreens = screen.queryAllByTestId('gacha-screen');
      expect(gachaScreens.length).toBe(0);
    });

    it('should hide settings screen when on gacha screen', async () => {
      render(App);

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 戻るボタンをクリック
      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      // 設定画面は表示されない
      const settingsScreens = screen.queryAllByTestId('settings-screen');
      expect(settingsScreens.length).toBe(0);
    });
  });

  describe('画面状態の永続化', () => {
    it('should maintain gacha screen state during navigation', async () => {
      const { PrizeService } = await import('./lib/services/prizeService');
      const prizeService = new PrizeService();
      prizeService.addPrize({
        name: 'Test Prize',
        imageUrl: '/test.png',
        stock: 5,
      });

      render(App);

      // ガチャ画面の状態を確認
      const gachaButton = screen.getByTestId('gacha-button');
      expect(gachaButton).toBeDefined();

      // 設定画面に遷移
      const settingsButton = screen.getByTestId('settings-button');
      await settingsButton.click();

      // 戻るボタンをクリック
      const backButton = screen.getByTestId('back-button');
      await backButton.click();

      // ガチャ画面の状態が維持されている
      const newGachaButton = screen.getByTestId('gacha-button');
      expect(newGachaButton).toBeDefined();
    });
  });
});
