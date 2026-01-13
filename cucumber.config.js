/**
 * Cucumber 設定ファイル
 * Gherkin ファイルとステップ定義の場所を指定
 */
export default {
  default: {
    require: [
      'step_definitions/**/*.ts',
      'support/**/*.ts'
    ],
    format: [
      'progress-bar',
      'json:reports/cucumber-report.json',
      'html:reports/cucumber-report.html',
      'message:reports/cucumber-messages.ndjson'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
    worldParameters: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000',
      headless: process.env.HEADED !== '1'
    }
  }
};
