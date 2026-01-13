import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

/**
 * Cucumber World オブジェクトを拡張して Playwright を統合
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  baseURL: string;
  headless: boolean;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseURL = options.parameters.baseURL || 'http://localhost:3000';
    this.headless = options.parameters.headless !== false;
  }

  /**
   * ブラウザを起動
   */
  async initBrowser(browserName: string = 'chromium'): Promise<void> {
    const browserType = browserName === 'firefox' ? firefox : browserName === 'webkit' ? webkit : chromium;
    
    this.browser = await browserType.launch({
      headless: this.headless,
    });

    this.context = await this.browser.newContext({
      baseURL: this.baseURL,
    });

    this.page = await this.context.newPage();
  }

  /**
   * ブラウザを閉じる
   */
  async closeBrowser(): Promise<void> {
    if (this.page) {
      await this.page.close();
    }
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * スクリーンショットを撮影
   */
  async takeScreenshot(name: string): Promise<void> {
    if (this.page) {
      const screenshotPath = `screenshots/${name}.png`;
      // 親ディレクトリが存在しない場合は作成
      await mkdir(dirname(screenshotPath), { recursive: true });
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
    }
  }
}

setWorldConstructor(CustomWorld);
