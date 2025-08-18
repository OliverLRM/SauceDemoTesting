import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/loginPage";
import { HomePage } from "../../src/pages/homePage";
import { LoginPageLocators } from "../../src/locators/loginPageLocators";
import { HomePageLocators } from "../../src/locators/homePageLocators";

test.describe("login tests", () => {
  test("User can successfully login and lands on the home page", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");
    await loginPage.login("standard_user", "secret_sauce");
    await expect(page).toHaveURL("https://www.saucedemo.com/v1/inventory.html");
  });

  test("Invalid login credentials are rejected with valid errors", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("test", "test");
    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");

    const error = page.locator(LoginPageLocators.loginError);

    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      "Epic sadface: Username and password do not match any user in this service"
    );

    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");
  });

  test("Validate locked out users receive the correct error message", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("locked_out_user", "secret_sauce");
    const error = page.locator(LoginPageLocators.loginError);

    await expect(error).toBeVisible();
    await expect(error).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );

    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");
  });
});
