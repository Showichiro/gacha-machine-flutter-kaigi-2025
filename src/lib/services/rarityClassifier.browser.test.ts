import { describe, it, expect } from 'vitest';
import { RarityClassifier } from './rarityClassifier';

describe('RarityClassifier', () => {
  const classifier = new RarityClassifier();

  describe('classify', () => {
    it('should classify as Normal when probability >= 10%', () => {
      expect(classifier.classify(10)).toBe('Normal');
      expect(classifier.classify(15)).toBe('Normal');
      expect(classifier.classify(50)).toBe('Normal');
      expect(classifier.classify(100)).toBe('Normal');
    });

    it('should classify as Rare when 3% <= probability < 10%', () => {
      expect(classifier.classify(3)).toBe('Rare');
      expect(classifier.classify(5)).toBe('Rare');
      expect(classifier.classify(9.99)).toBe('Rare');
    });

    it('should classify as SuperRare when probability < 3%', () => {
      expect(classifier.classify(0)).toBe('SuperRare');
      expect(classifier.classify(1)).toBe('SuperRare');
      expect(classifier.classify(2.99)).toBe('SuperRare');
    });

    it('should handle boundary values correctly', () => {
      // 10%: Normal
      expect(classifier.classify(10)).toBe('Normal');

      // 9.99%: Rare
      expect(classifier.classify(9.99)).toBe('Rare');

      // 3%: Rare
      expect(classifier.classify(3)).toBe('Rare');

      // 2.99%: SuperRare
      expect(classifier.classify(2.99)).toBe('SuperRare');
    });
  });

  describe('getColor', () => {
    it('should return correct color for Normal rarity', () => {
      const color = classifier.getColor('Normal');
      expect(color).toBe('#8d9099');
    });

    it('should return correct color for Rare rarity', () => {
      const color = classifier.getColor('Rare');
      expect(color).toBe('#ffb205');
    });

    it('should return correct color for SuperRare rarity', () => {
      const color = classifier.getColor('SuperRare');
      expect(color).toBe('#d9b34c');
    });
  });

  describe('getIcon', () => {
    it('should return correct icon for Normal rarity', () => {
      const icon = classifier.getIcon('Normal');
      expect(icon).toBe('●');
    });

    it('should return correct icon for Rare rarity', () => {
      const icon = classifier.getIcon('Rare');
      expect(icon).toBe('★');
    });

    it('should return correct icon for SuperRare rarity', () => {
      const icon = classifier.getIcon('SuperRare');
      expect(icon).toBe('✦');
    });
  });
});
