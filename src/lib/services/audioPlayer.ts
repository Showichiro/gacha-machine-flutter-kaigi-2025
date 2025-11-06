import { Howl } from 'howler';
import type { SoundEffect } from '../types';

/**
 * オーディオプレイヤー
 * Howler.jsを使用した効果音とBGMの再生管理
 */
export class AudioPlayer {
  private sounds: Record<SoundEffect, Howl>;
  private bgm: Howl | null = null;
  private currentVolume: number = 0.7; // 音量を70%に調整
  private isMuted: boolean = false;

  constructor() {
    // 効果音の初期化
    // 注: 実際の音声ファイルパスは後で設定する必要があります
    this.sounds = {
      spin: new Howl({
        src: ['/sounds/spin.mp3'],
        volume: this.currentVolume,
        onloaderror: (id, error) => {
          console.error('Failed to load spin sound:', error);
        },
      }),
      reveal: new Howl({
        src: ['/sounds/reveal.mp3'],
        volume: this.currentVolume,
        onloaderror: (id, error) => {
          console.error('Failed to load reveal sound:', error);
        },
      }),
      result: new Howl({
        src: ['/sounds/result.mp3'],
        volume: this.currentVolume,
        onloaderror: (id, error) => {
          console.error('Failed to load result sound:', error);
        },
      }),
    };
  }

  /**
   * 効果音を再生
   * @param effect 再生する効果音の種類
   */
  playSE(effect: SoundEffect): void {
    try {
      this.sounds[effect].play();
    } catch (error) {
      console.error(`Failed to play sound effect: ${effect}`, error);
    }
  }

  /**
   * BGMを再生
   * @param loop ループ再生するかどうか(デフォルト: true)
   */
  playBGM(loop: boolean = true): void {
    try {
      if (!this.bgm) {
        this.bgm = new Howl({
          src: ['/sounds/bgm.mp3'],
          loop,
          volume: this.currentVolume,
          onloaderror: (id, error) => {
            console.error('Failed to load BGM:', error);
          },
        });
      }
      this.bgm.play();
    } catch (error) {
      console.error('Failed to play BGM:', error);
    }
  }

  /**
   * BGMを停止
   */
  stopBGM(): void {
    if (this.bgm) {
      this.bgm.stop();
    }
  }

  /**
   * 音量を設定
   * @param volume 音量(0.0 - 1.0)
   */
  setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume));

    // 全ての効果音の音量を更新
    Object.values(this.sounds).forEach((sound) => {
      sound.volume(this.currentVolume);
    });

    // BGMの音量も更新
    if (this.bgm) {
      this.bgm.volume(this.currentVolume);
    }
  }

  /**
   * 全ての音声をミュート
   */
  mute(): void {
    this.isMuted = true;

    Object.values(this.sounds).forEach((sound) => {
      sound.mute(true);
    });

    if (this.bgm) {
      this.bgm.mute(true);
    }
  }

  /**
   * ミュートを解除
   */
  unmute(): void {
    this.isMuted = false;

    Object.values(this.sounds).forEach((sound) => {
      sound.mute(false);
    });

    if (this.bgm) {
      this.bgm.mute(false);
    }
  }
}
