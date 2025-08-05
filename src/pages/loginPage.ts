import { Page } from "@playwright/test";
import { LoginPageLocators } from "../locators/loginPageLocators";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/v1/");
  }

  //#login-button'         // by id
  //.btn_action'           // by class
  //'input[type="submit"]'  // by attribute

  async login(username: string, password: string) {
    await this.page.fill(LoginPageLocators.usernameField, username);
    await this.page.fill(LoginPageLocators.passwordField, password);
    await this.page.click(LoginPageLocators.submitButton);
    await this.page.waitForTimeout(2000); // 2 seconds
  }
}
