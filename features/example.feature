Feature: Backstage Software Template のサンプルテスト
  Backstage Software Template の基本的な動作を検証する

  @skip
  Scenario: Basic template operation check
    Given ブラウザが起動している
    When "http://localhost:3000" にアクセスする
    Then ページが表示されること

  @skip
  Scenario: ログ出力の確認
    Given テンプレートが実行されている
    When ログステップが実行される
    Then ログに結果が出力されること
