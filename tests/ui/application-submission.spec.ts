import { expect, test } from '../fixtures';
import { ApplicationSubmitPage } from '../pages/ApplicationSubmitPage';
import { CoveragesPage } from '../pages/CoveragesPage';
import { PoliciesPage } from '../pages/PoliciesPage';
import {
  coverages,
  quoteStatuses,
} from '../support/testData';
import { createApplicationDetails } from '../support/testDataFactory';

test('broker can submit application for underwriting @smoke', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);
  const applicationSubmitPage = new ApplicationSubmitPage(brokerPage);
  const policiesPage = new PoliciesPage(brokerPage);

  await coveragesPage.addCoverageToQuoteBuilder(
    coverages.commercialProperty.name,
  );

  await applicationSubmitPage.open();
  const applicationDetails = createApplicationDetails('demoBrokerSubmission');

  await applicationSubmitPage.submitApplication(
    applicationDetails.businessName,
    applicationDetails.businessAddress,
  );

  await expect(brokerPage).toHaveURL(/\/orders(\?.*)?$/);
  await expect(policiesPage.quoteId).toBeVisible();
  await expect(policiesPage.quoteStatus).toContainText(
    quoteStatuses.underwritingReview,
  );
});

test('required underwriting fields are validated @regression', async ({
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);
  const applicationSubmitPage = new ApplicationSubmitPage(brokerPage);

  await coveragesPage.addCoverageToQuoteBuilder(
    coverages.commercialProperty.name,
  );

  await applicationSubmitPage.open();
  await applicationSubmitPage.submitEmptyForm();

  await expect(brokerPage).toHaveURL(/\/checkout$/);
  await expect(applicationSubmitPage.businessNameError).toBeVisible();
  await expect(applicationSubmitPage.businessAddressError).toBeVisible();
});
