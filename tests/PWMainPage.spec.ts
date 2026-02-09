import { test, expect, Page, Locator } from '@playwright/test';
import { text } from 'node:stream/consumers';
interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const headerElements: Elements[] = [
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js menu button',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
    name: 'API link',
    text: 'API',
    attribute: {
      type: 'href',
      value: '/docs/api/class-playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Community' }),
    name: 'Community',
    text: 'Community',
    attribute: {
      type: 'href',
      value: '/community/welcome',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub icon',
    attribute: {
      type: 'href',
      value: 'https://github.com/microsoft/playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord icon',
    attribute: {
      type: 'href',
      value: 'https://aka.ms/playwright/discord',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
    name: 'Docs link',
    text: 'Docs',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('button', { name: 'Switch between dark and light' }),
    name: 'Lightmode switch',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Get started' }),
    name: 'Get started button',
    text: 'Get started',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('heading', { name: 'Playwright enables reliable' }),
    name: 'Main heading',
    text: 'Playwright enables reliable end-to-end testing for modern web apps.',
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Ctrl+K)' }),
    name: 'Search field',
    text: 'Search',
    attribute: {
      type: 'aria-label',
      value: 'Search (Ctrl+K)',
    },
  },
];

const lightModes = ['light', 'dark'];

test.describe('Playwright main page tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  test('Checking the display of header elements on the page', async ({ page }) => {
    headerElements.forEach(({ locator, name }) => {
      test.step(`Checking the display of ${name} element`, async () => {
        await expect.soft(locator(page)).toBeVisible();
      });
    });
  });

  test('Checking the names of header navigation elements', async ({ page }) => {
    headerElements.forEach(({ locator, name, text }) => {
      if (text) {
        test.step(`Checking the name of ${name} element`, async () => {
          await expect.soft(locator(page)).toContainText(text);
        });
      }
    });
  });

  test('Checking attributes of header navigation elements', async ({ page }) => {
    headerElements.forEach(({ locator, name, attribute }) => {
      if (attribute) {
        test.step(`Checking ${attribute.type} attribute of ${name} element`, async () => {
          await expect.soft(locator(page)).toHaveAttribute(attribute.type, attribute.value);
        });
      }
    });
  });

  test('Checking the switching of light-mode', async ({ page }) => {
    await expect.soft(page.getByLabel('Switch between dark and light')).toBeVisible();
    await expect.soft(page.getByLabel('Switch between dark and light')).toBeEnabled();
    await expect.soft(page.locator('html')).toHaveAttribute('data-theme-choice', 'system');
    await page.getByLabel('Switch between dark and light').click();
    await expect.soft(page.locator('html')).toHaveAttribute('data-theme-choice', 'light');
    await page.getByLabel('Switch between dark and light').click();
    await expect.soft(page.locator('html')).toHaveAttribute('data-theme-choice', 'dark');
  });

  lightModes.forEach((mode) => {
    test(`Checking active ${mode} mode styles`, async ({ page }) => {
      await page.evaluate((mode) => {
        document.querySelector('html')?.setAttribute('data-theme', mode);
      }, mode);
      await expect(page).toHaveScreenshot(`image-${mode}.png`);
    });
  });
});
