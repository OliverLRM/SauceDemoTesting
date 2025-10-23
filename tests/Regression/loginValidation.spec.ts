import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/loginPage";
import { HomePage } from "../../src/pages/homePage";
import { LoginPageLocators } from "../../src/locators/loginPageLocators";
import { HomePageLocators } from "../../src/locators/homePageLocators";
import { users } from "../../testData";

test.describe("login tests", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goto();
    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");
  });

  test("User can successfully login and lands on the home page", async ({
    page,
  }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL("https://www.saucedemo.com/v1/inventory.html");
  });

  test("Invalid login credentials are rejected with valid errors", async ({
    page,
  }) => {
    await loginPage.login("test", "test");

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
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    const error = page.locator(LoginPageLocators.loginError);

    //await expect(error).toBeVisible();
    await expect(error).toHaveText(
      "Epic sadface: Sorry, this user has been locked out."
    );

    await expect(page).toHaveURL("https://www.saucedemo.com/v1/");
  });
});
