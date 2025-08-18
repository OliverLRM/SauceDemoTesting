import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/loginPage";
import { HomePage } from "../../src/pages/homePage";
import { LoginPageLocators } from "../../src/locators/loginPageLocators";
import { HomePageLocators } from "../../src/locators/homePageLocators";

test.describe("Validate product ordering", () => {
  test(" validate that users can order products by price", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");

    const { actualHilo, expectedHilo, actualLohi, expectedLohi } =
      await homePage.orderByPrice();

    expect(actualHilo).toEqual(expectedHilo);
    expect(actualLohi).toEqual(expectedLohi);
  });
});

test.only("Validate users can order by name", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");

  const { actualAz, expectedAz } = await homePage.orderByName();
  expect(actualAz).toEqual(expectedAz);

  console.log(actualAz);
  console.log(expectedAz);
});
