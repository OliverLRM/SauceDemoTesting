export const HomePageLocators = {
  productByName: (name: string) => `.inventory_item_name >> text=${name}`,
  addToBasketByName: (name: string) =>
    `.inventory_item:has(.inventory_item_name:has-text("${name}")) button.btn_primary`,
  Basket: '[data-icon="shopping-cart"]',
  Description: ".inventory_item_desc",
  itemCards: ".inventory_item",
  itemPrice: ".inventory_item_price",
  itemName: ".inventory_item_name",
  AddToCart: "Button.btn_primary.btn_inventory",

  ordering: {
    sortContainer: ".product_sort_container",
    hiLo: 'option[value="hilo"]',
    az: 'option[value="az"]',
    za: 'option[value="za"]',
  },
};
