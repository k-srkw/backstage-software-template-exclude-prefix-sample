# language: ja
機能: Backstage Software Template のサンプルテスト
  Backstage Software Template の基本的な動作を検証する

  シナリオ: テンプレートの基本動作確認
    前提 ブラウザが起動している
    もし "http://localhost:3000" にアクセスする
    ならば ページが表示されること

  シナリオ: ログ出力の確認
    前提 テンプレートが実行されている
    もし ログステップが実行される
    ならば ログに結果が出力されること
