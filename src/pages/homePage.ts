import { expect, Page } from "@playwright/test";
import { HomePageLocators } from "../locators/homePageLocators";
import { productData } from "../../productData";
import { selectedProducts } from "../../productData";

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

  async addProductByName(name: string) {
    await this.page.click(HomePageLocators.addToBasketByName(name));
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

  async basketItems() {
    const actual = {
      name: String,
      description: String,
      price: Number,
    };

    //expect(actual).toBe(expectedProduct);
  }

  async addMultipleProdcts(randomCount?: number) {
    const items = await this.page.locator(HomePageLocators.itemCards);
    const total = await items.count();
    const indices: number[] = [];

    for (let i = 0; i < total; i++) {
      indices.push(i);
    }

    for (const idx of indices) {
      const priceText = await items
        .nth(idx)
        .locator(HomePageLocators.itemPrice)
        .textContent();
      const nameText = await items
        .nth(idx)
        .locator(HomePageLocators.itemName)
        .textContent();
      const descriptionText = await items
        .nth(idx)
        .locator(HomePageLocators.Description)
        .textContent();

      const priceValue = parseFloat(priceText!.replace("$", ""));
      const test = "test";

      selectedProducts.push({
        name: nameText!,
        description: descriptionText!,
        price: priceValue,
      });

      await items.nth(idx).locator(HomePageLocators.AddToCart).click();
    }
    //console.log("selected products" + selectedProducts);
    //console.log(selectedProducts.map((product) => product.price));
  }

  async goToCart() {
    await this.page.click(HomePageLocators.Basket);
    //await this.page.waitForTimeout(5000);
  }

  async addProducts(numberofItems: number) {
    const items = await this.page.locator(HomePageLocators.itemCards);
    let productSelection: {
      name: string;
      description: string;
      price: number;
    }[] = [];
    for (let i = 0; i < numberofItems; i++) {
      const productName = await items
        .nth(i)
        .locator(HomePageLocators.itemName)
        .textContent();
      const productDescription = await items
        .nth(i)
        .locator(HomePageLocators.Description)
        .textContent();
      const productPrice = await items
        .nth(i)
        .locator(HomePageLocators.itemPrice)
        .textContent();
      const priceValue = parseFloat(productPrice!.replace("$", ""));

      productSelection.push({
        name: productName!,
        description: productDescription!,
        price: priceValue,
      });

      await items.nth(i).locator(HomePageLocators.AddToCart).click();
    }
    return productSelection;
  }

  async orderByPrice() {
    const items = this.page.locator(HomePageLocators.itemCards); //grab the item cards
    const count = await items.count(); // get the total to be used in the for loop
    const actualHilo: number[] = []; // set up array to store product prices we get from the for loop
    const actualLohi: number[] = [];

    await this.page
      .locator(HomePageLocators.ordering.sortContainer)
      .selectOption("hilo");

    let itemsAfterSort = this.page.locator(HomePageLocators.itemCards);

    for (let i = 0; i < count; i++) {
      const itemPrice = await itemsAfterSort
        .nth(i)
        .locator(HomePageLocators.itemPrice)
        .textContent();

      const priceValue = parseFloat(itemPrice!.replace("$", ""));
      actualHilo.push(priceValue);
    }

    const expectedHilo = [...actualHilo].sort((a, b) => b - a);

    await this.page
      .locator(HomePageLocators.ordering.sortContainer)
      .selectOption("lohi");

    itemsAfterSort = this.page.locator(HomePageLocators.itemCards);

    for (let i = 0; i < count; i++) {
      const itemPrice = await itemsAfterSort
        .nth(i)
        .locator(HomePageLocators.itemPrice)
        .textContent();

      const priceValue = parseFloat(itemPrice!.replace("$", ""));
      actualLohi.push(priceValue);
    }

    const expectedLohi = [...actualLohi].sort((a, b) => a - b);

    return { actualHilo, expectedHilo, actualLohi, expectedLohi };
  }

  async orderByName() {
    const items = this.page.locator(HomePageLocators.itemCards);
    const count = await items.count();
    const actualAz: string[] = [];
    const actualZa: string[] = [];

    await this.page
      .locator(HomePageLocators.ordering.sortContainer)
      .selectOption("az");

    let itemsAfterSort = this.page.locator(HomePageLocators.itemCards);

    for (let i = 0; i < count; i++) {
      const itemname = await itemsAfterSort
        .nth(i)
        .locator(HomePageLocators.itemName)
        .textContent();

      actualAz.push(itemname!);
    }

    const expectedAz = [...actualAz].sort();
    return { actualAz, expectedAz };
  }
}
