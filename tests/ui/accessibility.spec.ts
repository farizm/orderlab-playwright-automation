import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';

async function expectNoSeriousAccessibilityViolations(
  pageName: string,
  violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
): Promise<void> {
  const seriousViolations = violations.filter((violation) =>
    ['critical', 'serious'].includes(violation.impact ?? ''),
  );

  expect(
    seriousViolations,
    `${pageName} should not have critical or serious accessibility violations`,
  ).toEqual([]);
}

test.describe('accessibility smoke checks @regression', () => {
  test('login page has no serious accessibility violations', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[data-testid="toast"]')
      .analyze();

    await expectNoSeriousAccessibilityViolations(
      'Login page',
      results.violations,
    );
  });

  test('coverages page has no serious accessibility violations', async ({
    brokerPage,
  }) => {
    const results = await new AxeBuilder({ page: brokerPage })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[data-testid="toast"]')
      .analyze();

    await expectNoSeriousAccessibilityViolations(
      'Coverages page',
      results.violations,
    );
  });
});
