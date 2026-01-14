import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// デフォルトタイムアウトを30秒に設定
setDefaultTimeout(30 * 1000);

/**
 * テストスイート全体の前処理
 */
BeforeAll(async function () {
  console.log('Starting test suite...');
});

/**
 * 各シナリオの前処理
 */
Before(async function (this: CustomWorld) {
  // ブラウザを起動
  await this.initBrowser();
  console.log('Browser initialized');
});

/**
 * 各シナリオの後処理
 */
After(async function (this: CustomWorld, scenario) {
  try {
    // 失敗時にスクリーンショットを撮影
    if (scenario.result?.status === 'FAILED') {
      const scenarioName = scenario.pickle.name.replace(/\s+/g, '_').toLowerCase();
      await this.takeScreenshot(`failed_${scenarioName}`).catch((error) => {
        console.error('Failed to take screenshot:', error);
      });
    }
  } finally {
    // ブラウザを閉じる（スクリーンショットの成否に関わらず必ず実行）
    try {
      await this.closeBrowser();
      console.log('Browser closed');
    } catch (error) {
      console.error('Failed to close browser:', error);
    }
  }
});

/**
 * テストスイート全体の後処理
 */
AfterAll(async function () {
  console.log('Test suite completed');
});
