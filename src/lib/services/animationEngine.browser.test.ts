import { describe, it, expect } from 'vitest';
import {
  createSpinAnimation,
  createRevealAnimation,
  createResultAnimation,
} from './animationEngine';

describe('AnimationEngine', () => {
  describe('createSpinAnimation', () => {
    it('should return a spring store', () => {
      const animation = createSpinAnimation();

      expect(animation).toBeDefined();
      expect(typeof animation.set).toBe('function');
      expect(typeof animation.update).toBe('function');
      expect(typeof animation.subscribe).toBe('function');
    });

    it('should have initial value of 0', () => {
      const animation = createSpinAnimation();
      let currentValue: number | undefined;

      animation.subscribe((value) => {
        currentValue = value;
      });

      expect(currentValue).toBe(0);
    });

    it('should update value when set is called', async () => {
      const animation = createSpinAnimation();
      let currentValue = 0;

      animation.subscribe((value) => {
        currentValue = value;
      });

      animation.set(360);

      // springアニメーションは徐々に値が変化する
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 値が変化していることを確認（完全に360にはまだ到達していない可能性がある）
      expect(currentValue).toBeGreaterThan(0);
    });
  });

  describe('createRevealAnimation', () => {
    it('should return a tweened store', () => {
      const animation = createRevealAnimation();

      expect(animation).toBeDefined();
      expect(typeof animation.set).toBe('function');
      expect(typeof animation.update).toBe('function');
      expect(typeof animation.subscribe).toBe('function');
    });

    it('should have initial value of 0', () => {
      const animation = createRevealAnimation();
      let currentValue: number | undefined;

      animation.subscribe((value) => {
        currentValue = value;
      });

      expect(currentValue).toBe(0);
    });

    it('should accept custom duration', () => {
      const animation = createRevealAnimation({ duration: 1000 });

      expect(animation).toBeDefined();
    });

    it('should update value when set is called', async () => {
      const animation = createRevealAnimation({ duration: 100 });
      let currentValue = 0;

      animation.subscribe((value) => {
        currentValue = value;
      });

      animation.set(1);

      // tweenedアニメーションは徐々に値が変化する
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 値が変化していることを確認
      expect(currentValue).toBeGreaterThan(0);
      expect(currentValue).toBeLessThan(1);
    });
  });

  describe('createResultAnimation', () => {
    it('should return a spring store with scale and opacity', () => {
      const animation = createResultAnimation();

      expect(animation).toBeDefined();
      expect(typeof animation.set).toBe('function');
      expect(typeof animation.update).toBe('function');
      expect(typeof animation.subscribe).toBe('function');
    });

    it('should have initial values of scale=0 and opacity=0', () => {
      const animation = createResultAnimation();
      let currentValue: { scale: number; opacity: number } | undefined;

      animation.subscribe((value) => {
        currentValue = value;
      });

      expect(currentValue).toEqual({ scale: 0, opacity: 0 });
    });

    it('should update scale and opacity when set is called', async () => {
      const animation = createResultAnimation();
      let currentValue = { scale: 0, opacity: 0 };

      animation.subscribe((value) => {
        currentValue = value;
      });

      animation.set({ scale: 1, opacity: 1 });

      // springアニメーションは徐々に値が変化する
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 値が変化していることを確認
      expect(currentValue.scale).toBeGreaterThan(0);
      expect(currentValue.opacity).toBeGreaterThan(0);
    });
  });
});
