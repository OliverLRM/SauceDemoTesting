import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage";
import { HomePage } from "../src/pages/homePage";

test("valid user can log in and check inventory", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await homePage.checkAllProducts();
});

test("User can add products to the basket and purchase", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await homePage.addRandomProduct();
  await homePage.goToCart();
});
