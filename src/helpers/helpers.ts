import { expect, Locator, Page } from "@playwright/test";
import { HomePageLocators } from "../locators/homePageLocators";
import { productData, selectedProducts } from "../../productData";
import { BasketPageLocators } from "../locators/basketPage.locators";
import { Product } from "../../productData";

export async function collectProductList(
  itemLocator: Locator,
  count: number
): Promise<Product[]> {
  const products: Product[] = [];
  for (let i = 0; i < count; i++) {
    let name = await itemLocator
      .nth(i)
      .locator(BasketPageLocators.basketItemName)
      .textContent();
    let description = await itemLocator
      .nth(i)
      .locator(BasketPageLocators.basketItemDesc)
      .textContent();
    let priceText = await itemLocator
      .nth(i)
      .locator(BasketPageLocators.basketItemPrice)
      .textContent();
    let priceValue = parseFloat(priceText!.replace("$", ""));

    products.push({
      name: name!,
      description: description!,
      price: priceValue,
    });
  }
  return products;
}

export function calculateTotal(products: Product[]): string {
  return products.reduce((acc, p) => acc + p.price, 0).toFixed(2);
}
