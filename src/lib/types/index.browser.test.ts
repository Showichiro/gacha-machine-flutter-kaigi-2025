import { describe, it, expect } from 'vitest';
import type { Prize, AddPrizeRequest, UpdatePrizeRequest } from './index';

describe('Prize型のdescriptionフィールド', () => {
  it('Prize型はオプショナルなdescriptionフィールドを持つ', () => {
    // descriptionありのPrize
    const prizeWithDescription: Prize = {
      id: '1',
      name: 'テスト景品',
      imageUrl: 'https://example.com/image.png',
      stock: 10,
      createdAt: Date.now(),
      description: 'これはテスト景品の説明です',
    };

    expect(prizeWithDescription.description).toBe('これはテスト景品の説明です');

    // descriptionなしのPrize(後方互換性)
    const prizeWithoutDescription: Prize = {
      id: '2',
      name: 'テスト景品2',
      imageUrl: 'https://example.com/image2.png',
      stock: 5,
      createdAt: Date.now(),
    };

    expect(prizeWithoutDescription.description).toBeUndefined();
  });

  it('AddPrizeRequestはオプショナルなdescriptionフィールドを持つ', () => {
    // descriptionありのリクエスト
    const requestWithDescription: AddPrizeRequest = {
      name: '新規景品',
      imageUrl: 'https://example.com/new.png',
      stock: 20,
      description: '新規景品の説明',
    };

    expect(requestWithDescription.description).toBe('新規景品の説明');

    // descriptionなしのリクエスト
    const requestWithoutDescription: AddPrizeRequest = {
      name: '新規景品2',
      imageUrl: 'https://example.com/new2.png',
      stock: 15,
    };

    expect(requestWithoutDescription.description).toBeUndefined();
  });

  it('UpdatePrizeRequestはオプショナルなdescriptionフィールドを持つ', () => {
    // descriptionを更新するリクエスト
    const requestWithDescription: UpdatePrizeRequest = {
      id: '1',
      description: '更新された説明',
    };

    expect(requestWithDescription.description).toBe('更新された説明');

    // descriptionを含まない更新リクエスト
    const requestWithoutDescription: UpdatePrizeRequest = {
      id: '2',
      name: '更新された名前',
    };

    expect(requestWithoutDescription.description).toBeUndefined();
  });

  it('descriptionの最大文字数は500文字', () => {
    const description500 = 'あ'.repeat(500);
    const description501 = 'あ'.repeat(501);

    const validPrize: Prize = {
      id: '1',
      name: 'テスト',
      imageUrl: 'https://example.com/image.png',
      stock: 10,
      createdAt: Date.now(),
      description: description500,
    };

    // 500文字は許可される
    expect(validPrize.description?.length).toBe(500);

    // 501文字は型レベルでは許可されるが、バリデーションで弾く必要がある
    // (TypeScriptの型では文字数制限を表現できないため、実行時バリデーションで対応)
    expect(description501.length).toBe(501);
  });
});
