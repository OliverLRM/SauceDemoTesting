import { expect, Page } from "@playwright/test";
import { HomePageLocators } from "../locators/homePageLocators";
import { productData } from "../../productData";

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async checkProducts(name: string) {
    await this.page.waitForSelector(HomePageLocators.productByName(name));
  }
  // Checks all products on the first page have a name, desctiption and price
  async checkAllProducts() {
    const items = await this.page.locator(HomePageLocators.itemCards);
    const total = await items.count();

    for (let i = 0; i < total; i++) {
      let item = items.nth(i);
      let description = item.locator(HomePageLocators.Description);
      let name = item.locator(HomePageLocators.itemName);
      let price = item.locator(HomePageLocators.itemPrice);
      //let nameText = await name.textContent();
      //let descriptionText = await description.textContent();
      await expect(name).toHaveText(/.+/);
      await expect(description).toHaveText(/.+/);
      await expect(price).toHaveText(/.+/);
    }
  }

  async addProductToCart(name: string) {
    await this.page.click(HomePageLocators.addToCartButtonByProductName(name));
    await expect(this.page.locator(".shopping_cart_badge")).toHaveText("1");
    let item = await this.page.locator(HomePageLocators.itemName);
    let itemText = await item.textContent();
  }

  // selects a random prodct from the homepage and adds it to the basket. Returns product info
  async addRandomProduct() {
    const items = await this.page.locator(HomePageLocators.itemCards);
    const total = await items.count();
    const randomIndex = Math.floor(Math.random() * total);
    const randomItem = items.nth(randomIndex);

    const nameLocator = randomItem.locator(HomePageLocators.itemName);
    const descriptionLocator = randomItem.locator(HomePageLocators.Description);
    const priceLocator = randomItem.locator(HomePageLocators.itemPrice);

    const nameText = (await nameLocator.textContent()) ?? "";
    const descriptionText = (await descriptionLocator.textContent()) ?? "";
    const priceText = await priceLocator.textContent();
    const priceValue = parseFloat(priceText?.replace("$", "") || "0");

    productData.selectedProduct = {
      name: nameText,
      description: descriptionText,
      price: priceValue,
    };

    const addToCartButton = randomItem.locator(HomePageLocators.AddToCart);
    await addToCartButton.click();

    return productData;
  }

  async basketItems(expectedProduct) {
    const actual = {
      name: String,
      description: String,
      price: Number,
    };
    //const expected = expectedProduct; //gets product data if we return it in the function
    //gets product data from the shared objectconst expectedFromSharedObject = productData.selectedProduct;

    expect(actual).toBe(expectedProduct);
  }

  async goToCart() {
    await this.page.click(HomePageLocators.Basket);
    await this.page.waitForTimeout(5000);
  }
}
