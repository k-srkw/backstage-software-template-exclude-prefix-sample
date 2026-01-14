import { Page } from '@playwright/test';

/**
 * 認証情報の設定
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * 環境変数から認証情報を取得
 */
export function getCredentials(): AuthCredentials {
  return {
    username: process.env.BACKSTAGE_USERNAME || 'rhdh-admin',
    password: process.env.BACKSTAGE_PASSWORD || 'jaldxPFE@2025',
  };
}

/**
 * Backstage にログインする
 * @param page Playwright Page オブジェクト
 * @param credentials 認証情報（省略時は環境変数から取得）
 */
export async function login(page: Page, credentials?: AuthCredentials): Promise<boolean> {
  const creds = credentials || getCredentials();
  
  // ログインフォームが表示されているか確認
  const usernameSelectors = [
    'input[name="username"]',
    'input[id="username"]',
    'input[type="text"][name*="user"]',
    'input[type="text"]'
  ];
  
  let usernameField = null;
  
  for (const selector of usernameSelectors) {
    const field = page.locator(selector).first();
    const isVisible = await field.isVisible({ timeout: 2000 }).catch(() => false);
    if (isVisible) {
      usernameField = field;
      break;
    }
  }
  
  if (!usernameField) {
    // ログインフォームが見つからない = 既にログイン済み
    return false;
  }
  
  // ユーザー名入力
  await usernameField.fill(creds.username);
  
  // パスワード入力
  const passwordSelectors = [
    'input[name="password"]',
    'input[id="password"]',
    'input[type="password"]'
  ];
  
  let passwordField = null;
  
  for (const selector of passwordSelectors) {
    const field = page.locator(selector).first();
    const isVisible = await field.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVisible) {
      passwordField = field;
      break;
    }
  }
  
  if (passwordField) {
    await passwordField.fill(creds.password);
  }
  
  // ログインボタンをクリック
  const loginButtonSelectors = [
    'button[type="submit"]',
    'button:has-text("Log in")',
    'button:has-text("Sign in")',
    'button:has-text("ログイン")',
    'input[type="submit"]'
  ];
  
  for (const selector of loginButtonSelectors) {
    const button = page.locator(selector).first();
    const isVisible = await button.isVisible({ timeout: 1000 }).catch(() => false);
    if (isVisible) {
      await button.click();
      break;
    }
  }
  
  // ログイン完了を待機
  await page.waitForLoadState('networkidle');
  
  return true;
}

/**
 * ログイン状態を確認する
 * @param page Playwright Page オブジェクト
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // ログインフォームが表示されていなければログイン済み
  const loginForm = page.locator('input[type="password"]').first();
  const isLoginFormVisible = await loginForm.isVisible({ timeout: 1000 }).catch(() => false);
  
  return !isLoginFormVisible;
}
