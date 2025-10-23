import { expect, Locator, Page } from "@playwright/test";
import { HomePageLocators } from "../locators/homePageLocators";
import { productData, selectedProducts } from "../../productData";
import { BasketPageLocators } from "../locators/basketPage.locators";
import { Product } from "../../productData";
import { collectProductList } from "../helpers/helpers";

export class BasketPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async collectBasketProducts(): Promise<Product[]> {
    const items = this.page.locator(BasketPageLocators.basketItems);
    const count = await items.count();
    const basketProducts: Product[] = [];

    for (let i = 0; i < count; i++) {
      let name = await items
        .nth(i)
        .locator(BasketPageLocators.basketItemName)
        .textContent();
      let description = await items
        .nth(i)
        .locator(BasketPageLocators.basketItemDesc)
        .textContent();
      let priceText = await items
        .nth(i)
        .locator(BasketPageLocators.basketItemPrice)
        .textContent();
      let priceValue = parseFloat(priceText!.replace("$", ""));
      basketProducts.push({
        name: name!,
        description: description!,
        price: priceValue,
      });
    }

    return basketProducts;
  }

  // starts the checkout flow and fills in customer details

  async startCheckout() {
    await this.page.locator(BasketPageLocators.checkoutButton).click();

    const checkoutDetails = this.page.locator(BasketPageLocators.checkoutInfo);
    await this.fillDetails(checkoutDetails, "test", "test", "1234");

    await this.page.locator(BasketPageLocators.continueBtn).click();
  }
  //helper function to popular customer details
  async fillDetails(
    checkoutDetails: Locator,
    fName: string,
    lName: string,
    postCode: string
  ) {
    await checkoutDetails
      .locator(BasketPageLocators.customerFirstName)
      .fill(fName);

    await checkoutDetails
      .locator(BasketPageLocators.customerLastName)
      .fill(lName);

    await checkoutDetails
      .locator(BasketPageLocators.postCodeField)
      .fill(postCode);
  }
  //
  async checkoutOverview() {
    const overviewDetails = this.page.locator(
      BasketPageLocators.checkoutOverview
    );

    const item = overviewDetails.locator(BasketPageLocators.basketItems);
    const count = await item.count();

    const productsOverview = await collectProductList(item, count);

    const subTotalText = await this.page
      .locator(BasketPageLocators.paymentSummary.subTotal)
      .textContent();
    const taxText = await this.page
      .locator(BasketPageLocators.paymentSummary.tax)
      .textContent();
    const totalText = await this.page
      .locator(BasketPageLocators.paymentSummary.total)
      .textContent();

    const subTotal = parseFloat(subTotalText!.replace(/[^\d.]/g, ""));
    const tax = parseFloat(taxText!.replace(/[^\d.]/g, ""));
    const total = parseFloat(totalText!.replace(/[^\d.]/g, ""));

    await this.page.locator(BasketPageLocators.finishBtn).click();
    //await this.page.waitForTimeout(5000);

    return { productDetails: productsOverview, subTotal, tax, total };
  }
}
