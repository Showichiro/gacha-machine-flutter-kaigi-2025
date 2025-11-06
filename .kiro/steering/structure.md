# Project Structure

## ルートディレクトリ構成

```
.
├── .claude/              # Claude Code設定（スラッシュコマンド等）
├── .github/              # GitHub Actions設定
├── .kiro/                # Kiro仕様駆動開発の設定・仕様ファイル
│   ├── specs/           # 機能仕様ドキュメント
│   └── steering/        # プロジェクト全体のガイダンス
├── .vscode/              # VS Code設定
├── public/               # 静的アセット
├── src/                  # ソースコード
├── index.html            # エントリーポイントHTML
├── package.json          # 依存関係とスクリプト
├── svelte.config.js      # Svelte設定
├── tsconfig.*.json       # TypeScript設定
├── vite.config.ts        # Viteビルド設定
└── vitest.config.ts      # Vitestテスト設定
```

## ソースコード構成 (`src/`)

### トップレベル
- `main.ts`: アプリケーションのエントリーポイント
- `App.svelte`: ルートSvelteコンポーネント
- `app.css`: グローバルスタイル
- `*.browser.test.ts`: ブラウザ統合テスト・E2Eテスト

### コンポーネント (`src/lib/components/`)
UIコンポーネントを配置。画面単位やウィジェット単位でコンポーネント化。

**主要コンポーネント:**
- `GachaScreen.svelte`: ガチャ実行画面
- `SettingsScreen.svelte`: 景品設定画面

### サービス (`src/lib/services/`)
ビジネスロジックとインフラストラクチャ層を配置。

**サービス一覧:**
- `prizeService.ts`: 景品の抽選ロジック
- `storage.ts`: ローカルストレージへのデータ永続化
- `dataInitializer.ts`: 初期データの作成とセットアップ
- `audioPlayer.ts`: サウンド効果・BGM再生管理
- `animationEngine.ts`: ガチャ演出・アニメーション制御

### ストア (`src/lib/stores/`)
Svelte Runes APIを使用したリアクティブな状態管理。

**ストア一覧:**
- `prizes.svelte.ts`: 景品データとアプリケーション状態

### 型定義 (`src/lib/types/`)
TypeScript型定義とインターフェース。

**型ファイル:**
- `index.ts`: 共通型定義（Prize、AppState等）

### ユーティリティ (`src/lib/utils/`)
汎用ヘルパー関数を配置（必要に応じて追加）。

### アセット (`src/assets/`)
画像、アイコン等のアセットファイル。

## コード構成パターン

### Svelteコンポーネント構造
```svelte
<script lang="ts">
  // インポート
  // プロップス定義
  // 状態管理
  // イベントハンドラ
  // リアクティブステートメント
</script>

<!-- マークアップ -->

<style>
  /* コンポーネントスコープのスタイル */
</style>
```

### サービス層パターン
- 純粋関数として実装
- 依存注入を活用
- テスタビリティを重視
- 単一責任の原則

### ストアパターン (Svelte 5 Runes)
```typescript
// prizes.svelte.ts
export function createPrizesStore() {
  let state = $state({...});

  return {
    get data() { return state; },
    update(newData) { state = newData; }
  };
}
```

## ファイル命名規則

### コンポーネント
- PascalCase: `GachaScreen.svelte`, `SettingsScreen.svelte`
- 画面単位: `*Screen.svelte`
- ウィジェット: `*Widget.svelte` または `*Component.svelte`

### サービス・ユーティリティ
- camelCase: `prizeService.ts`, `audioPlayer.ts`
- 役割に応じた命名: `*Service.ts`, `*Manager.ts`, `*Helper.ts`

### ストア
- camelCase: `prizes.svelte.ts`
- `.svelte.ts` 拡張子: Svelte Runesを使用する場合

### テストファイル
- `*.browser.test.ts`: ブラウザで実行するテスト
- `*.test.ts`: ユニットテスト（将来的に追加予定）

### 型定義
- camelCase: `index.ts`（型定義ファイル）
- PascalCase: 型名・インターフェース名

## インポート構成

### インポート順序
1. 外部ライブラリ（Svelte、サードパーティ等）
2. 型定義
3. サービス層
4. ストア
5. コンポーネント
6. ユーティリティ
7. 相対パスのローカルファイル

### パスエイリアス
- `$lib/*`: `src/lib/*` へのエイリアス（Svelte標準）

例:
```typescript
import { createPrizesStore } from '$lib/stores/prizes.svelte';
import { prizeService } from '$lib/services/prizeService';
```

## 主要なアーキテクチャ原則

### レイヤー分離
- **表現層**: Svelteコンポーネント（UI・UX）
- **アプリケーション層**: ストア（状態管理）
- **ドメイン層**: サービス（ビジネスロジック）
- **インフラ層**: ストレージ、オーディオ等の外部連携

### 依存の方向
- コンポーネント → ストア → サービス → インフラ
- 上位層が下位層に依存、逆は禁止

### テスト戦略
- **ブラウザテスト**: 実際のブラウザ環境で実行
- **統合テスト**: 複数のレイヤーを組み合わせてテスト
- **E2Eテスト**: ユーザーシナリオ全体をテスト
- Vitestのブラウザモード + Playwrightを活用

### 状態管理
- **Svelte Runes API**: Svelte 5の新しいリアクティビティシステム
- `$state`, `$derived`, `$effect` を活用
- グローバル状態はストアで管理
- ローカル状態はコンポーネント内で管理

### データフロー
1. ユーザーアクション → コンポーネント
2. コンポーネント → ストア更新
3. ストア → サービス呼び出し
4. サービス → ストレージ永続化
5. ストレージ → 起動時にストア復元
