/**
 * 型安全なLocalStorageアクセスサービス
 */
export class StorageService<T> {
  constructor(private key: string) {}

  /**
   * LocalStorageからデータを取得
   * @returns デシリアライズされたデータ、存在しない場合やエラー時はnull
   */
  get(): T | null {
    try {
      const item = localStorage.getItem(this.key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get from storage:', error);
      return null;
    }
  }

  /**
   * LocalStorageにデータを保存
   * @param value 保存するデータ
   * @throws {Error} 保存に失敗した場合
   */
  set(value: T): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to set to storage:', error);
      throw new Error('ストレージへの保存に失敗しました');
    }
  }

  /**
   * LocalStorageから指定キーのデータを削除
   */
  remove(): void {
    localStorage.removeItem(this.key);
  }

  /**
   * LocalStorageの全データをクリア
   */
  clear(): void {
    localStorage.clear();
  }
}
