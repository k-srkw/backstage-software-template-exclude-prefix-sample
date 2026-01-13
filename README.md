# Backstage Software Template - ATDD 環境

このプロジェクトは、Playwright、Gherkin、Cucumber を使用した Acceptance Test Driven Development (ATDD) 環境を備えた Backstage Software Template です。

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### Playwright ブラウザのインストール

```bash
npx playwright install
```

## テストの実行

### 基本的なテスト実行

```bash
npm test
```

### ウォッチモード（ファイル変更を監視）

```bash
npm run test:watch
```

### デバッグモード（Playwright Inspector を使用）

```bash
npm run test:debug
```

### ヘッドモード（ブラウザを表示）

```bash
npm run test:headed
```

## プロジェクト構造

```
.
├── features/              # Gherkin ファイル（.feature）
│   └── example.feature
├── step_definitions/      # ステップ定義（TypeScript）
│   └── example.steps.ts
├── support/               # ヘルパー関数、フック、ページオブジェクト
│   ├── hooks.ts          # Before/After フック
│   ├── world.ts          # Cucumber World オブジェクトの拡張
│   └── pages/            # ページオブジェクト（必要に応じて）
├── reports/               # テストレポート出力先
├── screenshots/           # 失敗時のスクリーンショット保存先
├── package.json
├── tsconfig.json
├── playwright.config.ts
└── cucumber.config.js
```

## Gherkin ファイルの書き方

`features/` ディレクトリに `.feature` ファイルを作成し、Gherkin 記法でテストシナリオを記述します。

例：

```gherkin
# language: ja
機能: テンプレートの動作確認
  シナリオ: 基本的な動作
    前提 ブラウザが起動している
    もし "http://localhost:3000" にアクセスする
    ならば ページが表示されること
```

## ステップ定義の書き方

`step_definitions/` ディレクトリに TypeScript ファイルを作成し、Gherkin のステップに対応する実装を記述します。

例：

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('ブラウザが起動している', async function (this: CustomWorld) {
  // 実装
});
```

## 環境変数

- `BASE_URL`: テスト対象のベース URL（デフォルト: `http://localhost:3000`）
- `HEADED`: `1` に設定するとブラウザを表示（デフォルト: ヘッドレス）
- `CI`: CI 環境で実行する場合は設定

## テストレポート

テスト実行後、以下の場所にレポートが生成されます：

- `reports/cucumber-report.html` - HTML レポート
- `reports/cucumber-report.json` - JSON レポート
- `reports/cucumber-messages.ndjson` - メッセージ形式のレポート

## トラブルシューティング

### 型定義エラーが表示される場合

依存関係をインストールしてください：

```bash
npm install
```

### ブラウザが見つからない場合

Playwright ブラウザをインストールしてください：

```bash
npx playwright install
```

## 参考資料

- [Cucumber.js ドキュメント](https://github.com/cucumber/cucumber-js)
- [Playwright ドキュメント](https://playwright.dev/)
- [Gherkin 構文リファレンス](https://cucumber.io/docs/gherkin/)
