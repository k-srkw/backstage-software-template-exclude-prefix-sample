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

```text
.
├── features/                        # Gherkin ファイル（.feature）
│   ├── example.feature             # サンプルテスト
│   └── template-execution.feature  # テンプレート実行テスト
├── step_definitions/                # ステップ定義（TypeScript）
│   ├── example.steps.ts            # サンプルステップ定義
│   └── template.steps.ts           # テンプレート実行ステップ定義
├── support/                         # ヘルパー関数、フック、ページオブジェクト
│   ├── hooks.ts                    # Before/After フック
│   ├── world.ts                    # Cucumber World オブジェクトの拡張
│   ├── auth.ts                     # 認証ヘルパー関数
│   └── pages/                      # ページオブジェクト
│       └── backstage-template-page.ts
├── reports/                         # テストレポート出力先
├── screenshots/                     # 失敗時のスクリーンショット保存先
├── template.yaml                    # Backstage テンプレート定義
├── package.json
├── tsconfig.json
├── playwright.config.ts
└── cucumber.config.js
```

## テストシナリオ

### テンプレート実行テスト

`features/template-execution.feature` には、Backstage Software Template の実行テストが定義されています：

```gherkin
Feature: Backstage Software Template Log Output Verification
  Verify that logs are correctly output when executing Backstage Software Template

  Background:
    Given I am logged in to Backstage

  Scenario: Execute template with group:default/admins as Owner parameter
    Given I am on the template parameter input page
    When I enter "group:default/admins" in the Owner field
    And I execute the template
    Then the log should contain "グループ名 \"admins\" を使ってリソースを作成します..."
```

## Gherkin ファイルの書き方

`features/` ディレクトリに `.feature` ファイルを作成し、Gherkin 記法でテストシナリオを記述します。

例：

```gherkin
Feature: テンプレートの動作確認
  Scenario: 基本的な動作
    Given ブラウザが起動している
    When "http://localhost:3000" にアクセスする
    Then ページが表示されること
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

### 必須の環境変数

| 変数名 | 説明 | デフォルト値 |
| -------- | ------ | ------------- |
| `BASE_URL` | Backstage のベース URL | `http://localhost:3000` |
| `BACKSTAGE_USERNAME` | Backstage ログイン用ユーザー名 | `user` |
| `BACKSTAGE_PASSWORD` | Backstage ログイン用パスワード | `password` |

### オプションの環境変数

| 変数名 | 説明 | デフォルト値 |
| -------- | ------ | ------------- |
| `HEADED` | `1` に設定するとブラウザを表示 | `0`（ヘッドレス） |
| `CI` | CI 環境で実行する場合に設定 | - |

### 環境変数の設定例

```bash
# 環境変数を設定してテスト実行
BASE_URL=https://your-backstage-instance.com \
BACKSTAGE_USERNAME=your-username \
BACKSTAGE_PASSWORD=your-password \
npm test
```

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
