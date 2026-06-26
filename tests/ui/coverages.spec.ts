import { expect, test } from '../fixtures';
import { CoveragesPage } from '../pages/CoveragesPage';
import { coverageFilters, coverages } from '../support/testData';

test('broker can search and filter commercial coverages @regression', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);

  await coveragesPage.searchFor('classic');
  await expect(
    coveragesPage.coverageCard(coverages.commercialProperty.name),
  ).toBeVisible();
  await expect(
    coveragesPage.coverageCard(coverages.generalLiability.name),
  ).toBeHidden();

  await coveragesPage.searchFor('');
  await coveragesPage.filterByCategory(coverageFilters.pizza);

  await expect(
    coveragesPage.coverageCard(coverages.generalLiability.name),
  ).toBeVisible();
  await expect(
    coveragesPage.coverageCard(coverages.businessOwnersPackage.name),
  ).toBeVisible();
  await expect(
    coveragesPage.coverageCard(coverages.commercialProperty.name),
  ).toBeHidden();
});
