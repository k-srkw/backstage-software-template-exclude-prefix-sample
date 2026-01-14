/**
 * Cucumber 設定ファイル
 * Gherkin ファイルとステップ定義の場所を指定
 */
export default {
  default: {
    // import/require は package.json の --import フラグで指定するため、ここでは省略
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
