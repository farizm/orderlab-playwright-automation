import { expect, test } from '../fixtures';
import { ApplicationSubmitPage } from '../pages/ApplicationSubmitPage';
import { CoveragesPage } from '../pages/CoveragesPage';
import { PoliciesPage } from '../pages/PoliciesPage';
import { UnderwritingDashboardPage } from '../pages/UnderwritingDashboardPage';
import {
  coverages,
  quoteStatuses,
} from '../support/testData';
import { createApplicationDetails } from '../support/testDataFactory';

test('underwriter can review submitted quote and validate status transition @smoke', async ({
  underwriterPage,
  brokerPage,
}) => {
  const coveragesPage = new CoveragesPage(brokerPage);
  const applicationSubmitPage = new ApplicationSubmitPage(brokerPage);
  const policiesPage = new PoliciesPage(brokerPage);

  await coveragesPage.addCoverageToQuoteBuilder(
    coverages.commercialProperty.name,
  );
  await applicationSubmitPage.open();
  const applicationDetails = createApplicationDetails(
    'underwritingReviewSubmission',
  );

  await applicationSubmitPage.submitApplication(
    applicationDetails.businessName,
    applicationDetails.businessAddress,
    applicationDetails.annualRevenue,
    applicationDetails.numberOfEmployees,
    applicationDetails.priorClaims,
  );

  const quoteId = (await policiesPage.quoteId.textContent())?.trim();

  if (!quoteId) {
    throw new Error('Application confirmation did not include a quote ID');
  }

  const underwritingDashboardPage = new UnderwritingDashboardPage(
    underwriterPage,
  );

  await underwriterPage.reload();
  await expect(underwritingDashboardPage.quoteRow(quoteId)).toBeVisible();

  await underwritingDashboardPage.updateStatus(
    quoteId,
    quoteStatuses.approvedForBind,
  );
  await expect(underwritingDashboardPage.statusSelect(quoteId)).toHaveValue(
    quoteStatuses.approvedForBind,
  );

  await underwriterPage.reload();

  await expect(underwritingDashboardPage.quoteRow(quoteId)).toBeVisible();
  await expect(underwritingDashboardPage.statusSelect(quoteId)).toHaveValue(
    quoteStatuses.approvedForBind,
  );
});
