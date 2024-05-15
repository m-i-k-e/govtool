import { Page, expect } from "@playwright/test";
import environments from "lib/constants/environments";
import { withTxConfirmation } from "lib/transaction.decorator";

export default class DelegationPage {
  readonly otherOptionsBtn = this.page.getByText("Other options");
  readonly nextStepBtn = this.page.getByTestId("next-step-button");
  readonly dRepInput = this.page.getByRole("textbox");
  readonly searchInput = this.page.getByTestId("search-input");

  readonly delegationOptionsDropdown = this.page.getByRole("button", {
    name: "Automated Voting Options arrow",
  }); // BUG: testId -> delegation-options-dropdown

  readonly delegateToDRepCard = this.page.getByTestId("delegate-to-drep-card");
  readonly signalNoConfidenceCard = this.page
    .getByRole("region")
    .locator("div")
    .filter({ hasText: "Signal No Confidence on Every" })
    .nth(2); // BUG: testId -> signal-no-confidence-card
  readonly abstainDelegationCard = this.page.getByText(
    "Abstain from Every VoteSelect this to vote ABSTAIN to every vote.Voting Power₳"
  );// BUG: testId -> abstain-delegation-card

  readonly delegationErrorModal = this.page.getByTestId(
    "delegation-transaction-error-modal"
  );

  readonly delegateBtns = this.page.locator(
    '[data-testid$="-delegate-button"]'
  ); 

  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto(
      `${environments.frontendUrl}/connected/dRep_directory`
    );
  }

  @withTxConfirmation
  async delegateToDRep(dRepId: string) {
    await this.searchInput.fill(dRepId);
    const delegateBtn = this.page.getByTestId(`${dRepId}-delegate-button`);
    await expect(delegateBtn).toBeVisible();
    await this.page.getByTestId(`${dRepId}-delegate-button`).click();
  }

  async resetDRepForm() {
    if (await this.delegationErrorModal.isVisible()) {
      await this.page.getByTestId("confirm-modal-button").click();
    }
    await this.dRepInput.clear();
  }
}
