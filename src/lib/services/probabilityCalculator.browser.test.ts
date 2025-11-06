import { describe, it, expect } from 'vitest';
import { ProbabilityCalculator } from './probabilityCalculator';
import type { Prize } from '../types';

describe('ProbabilityCalculator', () => {
  const calculator = new ProbabilityCalculator();

  describe('calculate', () => {
    it('should calculate correct probabilities based on stock', () => {
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
          stock: 2,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculate(prizes);

      // 総在庫: 5 + 3 + 2 = 10
      // Prize A: 5/10 * 100 = 50%
      // Prize B: 3/10 * 100 = 30%
      // Prize C: 2/10 * 100 = 20%
      expect(result.get('1')).toBe(50);
      expect(result.get('2')).toBe(30);
      expect(result.get('3')).toBe(20);
    });

    it('should return 0% for all prizes when total stock is 0', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 0,
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

      const result = calculator.calculate(prizes);

      expect(result.get('1')).toBe(0);
      expect(result.get('2')).toBe(0);
    });

    it('should return 100% for single prize with stock', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 10,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculate(prizes);

      expect(result.get('1')).toBe(100);
    });

    it('should exclude prizes with 0 stock from calculation', () => {
      const prizes: Prize[] = [
        {
          id: '1',
          name: 'Prize A',
          imageUrl: '/a.png',
          stock: 8,
          createdAt: Date.now(),
        },
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
        {
          id: '3',
          name: 'Prize C',
          imageUrl: '/c.png',
          stock: 2,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculate(prizes);

      // 総在庫: 8 + 2 = 10 (Prize Bは除外)
      // Prize A: 8/10 * 100 = 80%
      // Prize B: 0%
      // Prize C: 2/10 * 100 = 20%
      expect(result.get('1')).toBe(80);
      expect(result.get('2')).toBe(0);
      expect(result.get('3')).toBe(20);
    });

    it('should round probabilities to 2 decimal places', () => {
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
          stock: 1,
          createdAt: Date.now(),
        },
        {
          id: '3',
          name: 'Prize C',
          imageUrl: '/c.png',
          stock: 1,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculate(prizes);

      // 各景品: 1/3 * 100 = 33.333...%
      expect(result.get('1')).toBe(33.33);
      expect(result.get('2')).toBe(33.33);
      expect(result.get('3')).toBe(33.33);
    });

    it('should handle empty prize array', () => {
      const prizes: Prize[] = [];

      const result = calculator.calculate(prizes);

      expect(result.size).toBe(0);
    });
  });

  describe('calculateForPrize', () => {
    it('should calculate correct probability for specific prize', () => {
      const targetPrize: Prize = {
        id: '1',
        name: 'Prize A',
        imageUrl: '/a.png',
        stock: 5,
        createdAt: Date.now(),
      };

      const allPrizes: Prize[] = [
        targetPrize,
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
          stock: 2,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculateForPrize(targetPrize, allPrizes);

      // 5/10 * 100 = 50%
      expect(result).toBe(50);
    });

    it('should return 0 for prize with 0 stock', () => {
      const targetPrize: Prize = {
        id: '1',
        name: 'Prize A',
        imageUrl: '/a.png',
        stock: 0,
        createdAt: Date.now(),
      };

      const allPrizes: Prize[] = [
        targetPrize,
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 5,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculateForPrize(targetPrize, allPrizes);

      expect(result).toBe(0);
    });

    it('should return 0 when all prizes have 0 stock', () => {
      const targetPrize: Prize = {
        id: '1',
        name: 'Prize A',
        imageUrl: '/a.png',
        stock: 0,
        createdAt: Date.now(),
      };

      const allPrizes: Prize[] = [
        targetPrize,
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculateForPrize(targetPrize, allPrizes);

      expect(result).toBe(0);
    });

    it('should return 100 when only target prize has stock', () => {
      const targetPrize: Prize = {
        id: '1',
        name: 'Prize A',
        imageUrl: '/a.png',
        stock: 10,
        createdAt: Date.now(),
      };

      const allPrizes: Prize[] = [
        targetPrize,
        {
          id: '2',
          name: 'Prize B',
          imageUrl: '/b.png',
          stock: 0,
          createdAt: Date.now(),
        },
      ];

      const result = calculator.calculateForPrize(targetPrize, allPrizes);

      expect(result).toBe(100);
    });
  });
});
