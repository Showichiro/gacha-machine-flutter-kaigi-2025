import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import { prizesStore, resetPrizes } from '../stores/prizes.svelte';
import PrizeDetailModal from './PrizeDetailModal.svelte';
import type { Prize } from '../types';

describe('PrizeDetailModal', () => {
  beforeEach(() => {
    resetPrizes();
  });

  afterEach(() => {
    cleanup();
  });

  describe('基本表示', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(PrizeDetailModal, {
        props: { isOpen: false, prizeId: null, onClose: () => {} },
      });

      expect(container.querySelector('.modal-overlay')).toBeNull();
    });

    it('should render when isOpen is true', () => {
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
      const { container } = render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(container.querySelector('.modal-overlay')).toBeTruthy();
    });

    it('should display prize name', () => {
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
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(screen.getByText('Prize A')).toBeTruthy();
    });

    it('should display prize probability', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 10,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(screen.getByText(/確率/)).toBeTruthy();
      expect(screen.getByText(/100%/)).toBeTruthy();
    });

    it('should display prize stock', () => {
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
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(screen.getByText(/在庫/)).toBeTruthy();
      expect(screen.getByText(/5個/)).toBeTruthy();
    });

    it('should display prize description when available', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
          description: 'This is a test prize',
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(screen.getByText('This is a test prize')).toBeTruthy();
    });

    it('should display rarity information', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 1,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 99,
          createdAt: Date.now(),
        },
      ];

      prizesStore.setPrizes(prizes);
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      // 1/100 = 1% => SuperRare
      expect(screen.getByText('✦')).toBeTruthy();
    });

    it('should show close button', () => {
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
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose: () => {} },
      });

      expect(screen.getByText(/閉じる|×/)).toBeTruthy();
    });

    it('should call onClose when close button is clicked', async () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      let closeCalled = false;
      const onClose = () => {
        closeCalled = true;
      };

      prizesStore.setPrizes(prizes);
      render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose },
      });

      const closeButton = screen.getByRole('button', { name: /閉じる|×/ });
      closeButton.click();

      expect(closeCalled).toBe(true);
    });

    it('should not render when prizeId is null', () => {
      const { container } = render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: null, onClose: () => {} },
      });

      expect(container.querySelector('.modal-content')).toBeNull();
    });

    it('should not render when prize not found', () => {
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
      const { container } = render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: 'non-existent', onClose: () => {} },
      });

      expect(container.querySelector('.modal-content')).toBeNull();
    });
  });

  describe('オーバーレイクリック', () => {
    it('should call onClose when overlay is clicked', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      let closeCalled = false;
      const onClose = () => {
        closeCalled = true;
      };

      prizesStore.setPrizes(prizes);
      const { container } = render(PrizeDetailModal, {
        props: { isOpen: true, prizeId: '1', onClose },
      });

      const overlay = container.querySelector('.modal-overlay');
      overlay?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      expect(closeCalled).toBe(true);
    });
  });
});
