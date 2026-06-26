import { expect, test } from '../fixtures';
import { CoveragesPage } from '../pages/CoveragesPage';
import { coverageFilters, coverages } from '../support/testData';

test('broker can search and filter commercial coverages @regression', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);

  await coveragesPage.searchFor('commercial');
  await expect(
    coveragesPage.coverageCard(coverages.commercialProperty.name),
  ).toBeVisible();
  await expect(
    coveragesPage.coverageCard(coverages.generalLiability.name),
  ).toBeHidden();

  await coveragesPage.searchFor('');
  await coveragesPage.filterByCategory(coverageFilters.liability);

  await expect(
    coveragesPage.coverageCard(coverages.generalLiability.name),
  ).toBeVisible();
  await expect(
    coveragesPage.coverageCard(coverages.businessOwnersPackage.name),
  ).toBeHidden();
  await expect(
    coveragesPage.coverageCard(coverages.commercialProperty.name),
  ).toBeHidden();
});
