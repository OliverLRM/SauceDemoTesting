import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage";
import { HomePage } from "../src/pages/homePage";
import { BasketPage } from "../src/pages/basketPage";
import { calculateTotal } from "../src/helpers/helpers";

test("valid user can log in and check inventory", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Login
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await homePage.checkAllProducts();
});

test("User can add products to the basket and complete a purchase", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const basketPage = new BasketPage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  // Adds first 5 products to the basket
  const products = await homePage.addProducts(5);
  await homePage.goToCart();
  const basketProducts = await basketPage.collectBasketProducts();
  expect(products).toEqual(basketProducts);

  // starts checkout flow and verifies product consistency
  await basketPage.startCheckout();
  const { productDetails, subTotal, tax, total } =
    await basketPage.checkoutOverview();

  const expectedSubtotal = parseFloat(calculateTotal(products));
  const expectedTax = +(expectedSubtotal * 0.08).toFixed(2); // if 8% tax
  const expectedTotal = +(expectedSubtotal + expectedTax).toFixed(2);

  // assert price calculations
  expect(subTotal).toBeCloseTo(expectedSubtotal, 2);
  expect(tax).toBeCloseTo(expectedTax, 2);
  expect(total).toBeCloseTo(expectedTotal, 2);

  expect(productDetails).toEqual(basketProducts);
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/v1/checkout-complete.html"
  );
});
