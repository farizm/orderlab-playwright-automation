import { expect, test } from '../fixtures';
import { CoveragesPage } from '../pages/CoveragesPage';
import { QuoteBuilderPage } from '../pages/QuoteBuilderPage';
import { coverages } from '../support/testData';

test('broker can create a Commercial Property quote @smoke', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);
  const quoteBuilderPage = new QuoteBuilderPage(brokerPage);

  await expect(coveragesPage.quoteBuilderCount).toContainText('0');

  await coveragesPage.addCoverageToQuoteBuilder(
    coverages.commercialProperty.name,
  );

  await expect(coveragesPage.quoteBuilderCount).toContainText('1');

  await quoteBuilderPage.open();

  await expect(quoteBuilderPage.emptyState).toBeHidden();
  await expect(
    quoteBuilderPage.coverageName(coverages.commercialProperty.name),
  ).toBeVisible();
});

test('broker can add General Liability coverage @regression', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);
  const quoteBuilderPage = new QuoteBuilderPage(brokerPage);

  await coveragesPage.addCoverageToQuoteBuilder(coverages.generalLiability.name);
  await quoteBuilderPage.open();

  await expect(
    quoteBuilderPage.coverageName(coverages.generalLiability.name),
  ).toBeVisible();
});
