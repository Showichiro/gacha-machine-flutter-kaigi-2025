# Claude Code Spec-Driven Development

Kiro-style Spec Driven Development implementation using claude code slash commands, hooks and agents.

## Project Context

### Paths
- Steering: `.kiro/steering/`
- Specs: `.kiro/specs/`
- Commands: `.claude/commands/`

### Steering vs Specification

**Steering** (`.kiro/steering/`) - Guide AI with project-wide rules and context
**Specs** (`.kiro/specs/`) - Formalize development process for individual features

### Active Specifications
- **gacha-machine-app**: Flutter Kaigi 2025のASSIGNブース用ガチャアプリケーション (初期化済み)
- Use `/kiro:spec-status [feature-name]` to check progress

## Development Guidelines
- Think in English, but generate responses in Japanese (思考は英語、回答の生成は日本語で行うように)

## Workflow

### Phase 0: Steering (Optional)
`/kiro:steering` - Create/update steering documents
`/kiro:steering-custom` - Create custom steering for specialized contexts

Note: Optional for new features or small additions. You can proceed directly to spec-init.

### Phase 1: Specification Creation
1. `/kiro:spec-init [detailed description]` - Initialize spec with detailed project description
2. `/kiro:spec-requirements [feature]` - Generate requirements document
3. `/kiro:spec-design [feature]` - Interactive: "Have you reviewed requirements.md? [y/N]"
4. `/kiro:spec-tasks [feature]` - Interactive: Confirms both requirements and design review

### Phase 2: Progress Tracking
`/kiro:spec-status [feature]` - Check current progress and phases

## Development Rules
1. **Consider steering**: Run `/kiro:steering` before major development (optional for new features)
2. **Follow 3-phase approval workflow**: Requirements → Design → Tasks → Implementation
3. **Approval required**: Each phase requires human review (interactive prompt or manual)
4. **No skipping phases**: Design requires approved requirements; Tasks require approved design
5. **Update task status**: Mark tasks as completed when working on them
6. **Keep steering current**: Run `/kiro:steering` after significant changes
7. **Check spec compliance**: Use `/kiro:spec-status` to verify alignment

## Steering Configuration

### Current Steering Files
Managed by `/kiro:steering` command. Updates here reflect command changes.

### Active Steering Files
- `product.md`: Always included - Product context and business objectives
- `tech.md`: Always included - Technology stack and architectural decisions
- `structure.md`: Always included - File organization and code patterns

### Custom Steering Files
<!-- Added by /kiro:steering-custom command -->
<!-- Format:
- `filename.md`: Mode - Pattern(s) - Description
  Mode: Always|Conditional|Manual
  Pattern: File patterns for Conditional mode
-->

### Inclusion Modes
- **Always**: Loaded in every interaction (default)
- **Conditional**: Loaded for specific file patterns (e.g., "*.test.js")
- **Manual**: Reference with `@filename.md` syntax

## Design GuidLine

---

### カラートークン

デザインシステムで使用するカラートークンの一覧です。CSSカスタムプロパティとして定義されています。

#### Primitive

Primitiveカラーは、デザインシステムの基礎となる色の定義です。これらの色は直接使用せず、Semanticカラーを通じて使用します。

#### Chromatic

彩度のある色の基本パレットです。ブランドカラーやアクセントカラーの基礎となります。

#### Gray

グレースケールの基本パレットです。0（白）から90（ほぼ黒）まで、10段階で定義されています。

#### Semantic

Semanticカラーは、用途に応じて名前付けされたカラートークンです。これらを使用することで、一貫性のあるデザインを実現できます。

### Text & Icon

テキストとアイコンに使用するカラートークンです。視認性と情報の優先度に応じて使い分けます。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`text-high\` | \`#15151a\` | デフォルトのテキスト（本文、見出し等） |
| \`text-middle\` | \`#8d9099\` | 優先度の低いテキスト・アイコン |
| \`text-low\` | \`#c4c4cc\` | 読む必要のないテキスト（フッターの著作権表示） |
| \`text-placeholder\` | \`#a8a9b2\` | プレースホルダー |
| \`text-disabled\` | \`#c4c4cc\` | ボタン非活性時のテキスト |
| \`text-white\` | \`#ffffff\` | 白抜きテキスト（塗りつぶしボタンのテキスト） |

### Border

枠線に使用するカラートークンです。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`border-low\` | \`#e1e1e5\` | コンポーネントの基本的な枠線 |
| \`border-middle\` | \`#a8a9b2\` | シナリオ相性・給与のセパレート線、診断結果チャート図の線等 |
| \`border-back-btn\` | \`#8d9099\` | 戻るボタンの枠線 |
| \`border-disabled\` | \`#c4c4cc\` | ボタン非活性時の枠線 |
| \`border-white\` | \`#ffffff\` | 白枠 |

### Background

背景色に使用するカラートークンです。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`bg-contents-area\` | \`#f5f5f5\` | コンテンツエリアの最下層背景 |
| \`bg-white\` | \`#ffffff\` | 基本のコンテンツ背景（ヘッダー等） |
| \`bg-high\` | \`#c4c4cc\` | 白テキスト用のグレー背景（「興味なし」ボタン等） |
| \`bg-middle\` | \`#e1e1e5\` | 見出しテキストの背景 |
| \`bg-low\` | \`#f5f5f5\` | 入力フォーム、モーダルの背景等 |
| \`bg-disabled\` | \`#c4c4cc\` | ボタン非活性時の背景 |
| \`bg-dark-tag\` | \`#42434d\` | 黒系のタグ（記事のカテゴリ等） |
| \`bg-senior-card\` | \`#f4f2f0\` | シナリオカード、おすすめエージェントカードの背景等 |
| \`bg-registration\` | \`#f9f9f9\` | 戻る・進むボタンの背景 |
| \`bg-registration-pagination\` | \`#f5f5f5\` (50%透明) | 登録動線のコンテンツ背景 |

### Tool

スクロールバーやプログレスバーなど、UI要素に使用するカラートークンです。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`scrollbar-bar\` | \`#c4c4cc\` | スクロールバー本体 |
| \`scrollbar-area\` | \`#f5f5f5\` | スクロールバートラック領域 |
| \`progress-bar\` | \`#e1e1e5\` | プログレスバー |

### Option

オーバーレイやハイライトなど、特殊な用途に使用するカラートークンです。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`overlay\` | \`#000000\` (50%透明) | モーダルのオーバーレイ |
| \`learning-selected\` | \`#d70c18\` (10%透明) | ラーニング動画（選択状態） |
| \`highlight\` | \`#f0f0f2\` | ホバー時のハイライト |

### Accent

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`accent-red\` | \`#d70c18\` | バリデーションテキスト、パスワード強度表示等 |
| \`accent-orange\` | \`#ff7831\` | オレンジアクセント |
| \`accent-yellow\` | \`#ffb205\` | パスワード強度表示：普通 |
| \`accent-gold\` | \`#d9b34c\` | プレミアムスカウトタグ |
| \`accent-light-orange\` | \`#ff7250\` | 診断レポート4象限の左下 |
| \`accent-green-light\` | \`#00b200\` | パスワード強度表示：強い・非常に強い |
| \`accent-ranking-frame\` | \`#fbd951\` | シナリオランキングの月桂冠 |

### Brand

ブランドカラーとして使用するカラートークンです。

| トークン名 | 色コード | 用途 |
|-----------|---------|------|
| \`brand-assign-red\` | \`#d70c18\` | ブランドロゴ |
| \`brand-white\` | \`#ffffff\` | ブランドロゴ白抜き |
