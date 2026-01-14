import { Page, expect } from '@playwright/test';
import { login, isLoggedIn } from '../auth';

/**
 * Backstage テンプレートページのページオブジェクト
 */
export class BackstageTemplatePage {
  private page: Page;
  private baseURL: string;
  private templatePath: string;

  constructor(page: Page, baseURL: string, templatePath: string = '/create/templates/default/group-prefix-exclude-sample') {
    this.page = page;
    this.baseURL = baseURL;
    this.templatePath = templatePath;
  }

  /**
   * テンプレートページに移動
   */
  async navigate(): Promise<void> {
    const url = `${this.baseURL}${this.templatePath}`;
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * ログインが必要な場合はログインを実行
   */
  async ensureLoggedIn(): Promise<void> {
    if (!(await isLoggedIn(this.page))) {
      await login(this.page);
    }
  }

  /**
   * Owner フィールドに値を入力
   */
  async setOwner(value: string): Promise<void> {
    const ownerField = await this.findOwnerField();
    
    await ownerField.click();
    await ownerField.fill(value);
    
    // オートコンプリートの処理
    await this.page.waitForTimeout(500);
    
    const dropdownOption = this.page.locator(`[role="option"]:has-text("${value}"), li:has-text("${value}")`).first();
    const isDropdownVisible = await dropdownOption.isVisible({ timeout: 1000 }).catch(() => false);
    
    if (isDropdownVisible) {
      await dropdownOption.click();
    }
  }

  /**
   * Owner フィールドを探す
   */
  private async findOwnerField() {
    const selectors = [
      'input[name="owner"]',
      'input[id="owner"]',
      '[data-testid="owner-picker"] input',
      '[aria-label="Owner"] input',
      'input[placeholder*="owner" i]',
      '.MuiAutocomplete-root input'
    ];
    
    for (const selector of selectors) {
      const field = this.page.locator(selector).first();
      const isVisible = await field.isVisible({ timeout: 1000 }).catch(() => false);
      if (isVisible) {
        return field;
      }
    }
    
    // フォールバック: ラベルで探す
    return this.page.getByLabel(/owner/i).first();
  }

  /**
   * 次のステップに進む（Next ボタンをクリック）
   */
  async clickNext(): Promise<void> {
    const nextButtonSelectors = [
      'button:has-text("Next")',
      'button:has-text("次へ")',
      'button:has-text("Review")'
    ];
    
    for (const selector of nextButtonSelectors) {
      const button = this.page.locator(selector).first();
      const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        await button.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }
  }

  /**
   * テンプレートを実行（Create ボタンをクリック）
   */
  async clickCreate(): Promise<void> {
    const createButtonSelectors = [
      'button:has-text("Create")',
      'button:has-text("作成")',
      'button:has-text("実行")',
      'button:has-text("Run")'
    ];
    
    for (const selector of createButtonSelectors) {
      const button = this.page.locator(selector).first();
      const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        await button.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    }
  }

  /**
   * テンプレート実行の全フローを実行
   */
  async executeTemplate(): Promise<void> {
    // Next ボタンがあればクリック
    await this.clickNext();
    
    // Create ボタンをクリック
    await this.clickCreate();
    
    // 実行完了を待機
    await this.page.waitForTimeout(2000);
  }

  /**
   * ログエリアを展開
   */
  async expandLogs(): Promise<void> {
    const expandButtons = this.page.locator('[aria-expanded="false"], button:has-text("Show"), button:has-text("詳細")');
    const count = await expandButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = expandButtons.nth(i);
      const isVisible = await button.isVisible().catch(() => false);
      if (isVisible) {
        await button.click().catch(() => {});
        await this.page.waitForTimeout(500);
      }
    }
  }

  /**
   * ログ内容を取得
   */
  async getLogContent(): Promise<string> {
    await this.expandLogs();
    
    const logSelectors = [
      '[data-testid="log-viewer"]',
      '.MuiAccordion-root',
      '[class*="log"]',
      '[class*="output"]',
      'pre',
      'code',
      '[class*="TaskLog"]',
      '[class*="StepOutput"]',
      '[role="region"]'
    ];
    
    let logContent = '';
    
    for (const selector of logSelectors) {
      const elements = this.page.locator(selector);
      const count = await elements.count();
      
      for (let i = 0; i < count; i++) {
        const text = await elements.nth(i).textContent().catch(() => '');
        if (text) {
          logContent += text + '\n';
        }
      }
    }
    
    // ページ全体のテキストも追加
    const pageContent = await this.page.textContent('body') || '';
    logContent += pageContent;
    
    return logContent;
  }

  /**
   * ログに特定のメッセージが含まれることを確認
   */
  async expectLogContains(expectedMessage: string): Promise<void> {
    const logContent = await this.getLogContent();
    expect(logContent).toContain(expectedMessage);
  }
}
