import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/svelte';
import { prizesStore, resetPrizes } from '../stores/prizes.svelte';
import PrizeStatsWidget from './PrizeStatsWidget.svelte';
import type { Prize } from '../types';

describe('PrizeStatsWidget', () => {
  beforeEach(() => {
    resetPrizes();
  });

  afterEach(() => {
    cleanup();
  });

  describe('統計情報表示', () => {
    it('should render component', () => {
      render(PrizeStatsWidget);
      expect(document.body).toBeTruthy();
    });

    it('should display total count', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 3,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      const { container } = render(PrizeStatsWidget);

      expect(screen.getByText(/登録景品/)).toBeTruthy();
      const statCards = container.querySelectorAll('.stat-card');
      expect(statCards.length).toBe(4);
    });

    it('should display available count', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 3,
          createdAt: Date.now(),
        },
        {
          id: '3',
          name: 'Prize C',
          imageUrl: '/c.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeStatsWidget);

      expect(screen.getByText(/在庫あり/)).toBeTruthy();
      // 2個の景品に在庫がある
      expect(screen.getByText('2')).toBeTruthy();
    });

    it('should display out of stock count', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      const { container } = render(PrizeStatsWidget);

      const statCards = container.querySelectorAll('.stat-card');
      const outOfStockCard = statCards[2]; // 在庫切れは3番目のカード
      expect(outOfStockCard?.textContent).toContain('在庫切れ');
      expect(outOfStockCard?.textContent).toContain('1');
    });

    it('should display total stock', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 3,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeStatsWidget);

      expect(screen.getByText(/総在庫/)).toBeTruthy();
      // 総在庫は8個
      expect(screen.getByText('8')).toBeTruthy();
    });

    it('should show warning when prizes are out of stock', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeStatsWidget);

      expect(screen.getByText(/在庫切れの景品があります/)).toBeTruthy();
    });

    it('should not show warning when all prizes have stock', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeStatsWidget);

      expect(screen.queryByText(/在庫切れの景品があります/)).toBeNull();
    });

    it('should display empty state when no prizes', () => {
      const { container } = render(PrizeStatsWidget);

      expect(screen.getByText(/登録景品/)).toBeTruthy();
      // すべてのstat-cardが0を表示
      const statCards = container.querySelectorAll('.stat-card');
      expect(statCards.length).toBe(4);
      statCards.forEach((card) => {
        expect(card.textContent).toContain('0');
      });
    });

    it('should reactively update when prizes change', async () => {
      const { container } = render(PrizeStatsWidget);

      // 初期状態: すべて0
      let statCards = container.querySelectorAll('.stat-card');
      expect(statCards.length).toBe(4);
      statCards.forEach((card) => {
        expect(card.textContent).toContain('0');
      });

      // 景品を追加
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];
      prizesStore.setPrizes(prizes);

      // リアクティブに更新されることを確認
      // Note: Svelte 5のリアクティビティにより自動更新される
      await waitFor(() => {
        statCards = container.querySelectorAll('.stat-card');
        expect(statCards.length).toBe(4);

        // 登録景品は1個になっている
        const totalCountCard = statCards[0];
        expect(totalCountCard?.textContent).toContain('1');
      });
    });
  });

  describe('表示スタイル', () => {
    it('should display stats in card layout', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      const { container } = render(PrizeStatsWidget);

      expect(container.querySelector('.stats-widget')).toBeTruthy();
    });
  });
});
