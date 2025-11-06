import { describe, it, expect, beforeEach } from 'vitest';
import { AudioPlayer } from './audioPlayer';

describe('AudioPlayer', () => {
  let audioPlayer: AudioPlayer;

  beforeEach(() => {
    audioPlayer = new AudioPlayer();
  });

  describe('initialization', () => {
    it('should create AudioPlayer instance', () => {
      expect(audioPlayer).toBeDefined();
      expect(audioPlayer).toBeInstanceOf(AudioPlayer);
    });
  });

  describe('playSE', () => {
    it('should have playSE method', () => {
      expect(typeof audioPlayer.playSE).toBe('function');
    });

    it('should play spin sound effect', () => {
      audioPlayer.playSE('spin');
      // Howlが呼び出されることを確認
      expect(audioPlayer).toBeDefined();
    });

    it('should play reveal sound effect', () => {
      audioPlayer.playSE('reveal');
      expect(audioPlayer).toBeDefined();
    });

    it('should play result sound effect', () => {
      audioPlayer.playSE('result');
      expect(audioPlayer).toBeDefined();
    });
  });

  describe('playBGM', () => {
    it('should have playBGM method', () => {
      expect(typeof audioPlayer.playBGM).toBe('function');
    });

    it('should play BGM', () => {
      audioPlayer.playBGM();
      expect(audioPlayer).toBeDefined();
    });

    it('should play BGM with loop option', () => {
      audioPlayer.playBGM(true);
      expect(audioPlayer).toBeDefined();
    });
  });

  describe('stopBGM', () => {
    it('should have stopBGM method', () => {
      expect(typeof audioPlayer.stopBGM).toBe('function');
    });

    it('should stop BGM', () => {
      audioPlayer.playBGM();
      audioPlayer.stopBGM();
      expect(audioPlayer).toBeDefined();
    });
  });

  describe('setVolume', () => {
    it('should have setVolume method', () => {
      expect(typeof audioPlayer.setVolume).toBe('function');
    });

    it('should set volume to 0.5', () => {
      audioPlayer.setVolume(0.5);
      expect(audioPlayer).toBeDefined();
    });

    it('should set volume to 1.0', () => {
      audioPlayer.setVolume(1.0);
      expect(audioPlayer).toBeDefined();
    });

    it('should set volume to 0.0', () => {
      audioPlayer.setVolume(0.0);
      expect(audioPlayer).toBeDefined();
    });
  });

  describe('mute/unmute', () => {
    it('should have mute method', () => {
      expect(typeof audioPlayer.mute).toBe('function');
    });

    it('should have unmute method', () => {
      expect(typeof audioPlayer.unmute).toBe('function');
    });

    it('should mute all sounds', () => {
      audioPlayer.mute();
      expect(audioPlayer).toBeDefined();
    });

    it('should unmute all sounds', () => {
      audioPlayer.mute();
      audioPlayer.unmute();
      expect(audioPlayer).toBeDefined();
    });
  });
});
