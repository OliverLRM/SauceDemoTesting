export const BasketPageLocators = {
  basketItems: ".cart_item",
  basketItemName: ".cart_item_label .inventory_item_name",
  basketItemDesc: ".cart_item_label .inventory_item_desc",
  basketItemPrice: ".inventory_item_price",
  basketOptions: ".cart_footer",
  checkoutButton: ".btn_action.checkout_button",

  checkoutInfo: ".checkout_info",
  customerFirstName: '[data-test="firstName"]',
  customerLastName: '[data-test="lastName"]',
  postCodeField: '[data-test="postalCode"]',

  checkoutOverview: "#checkout_summary_container",

  continueBtn: ".btn_primary.cart_button",
  finishBtn: ".btn_action.cart_button",

  paymentSummary: {
    summaryInfo: ".summary_info",
    subTotal: ".summary_subtotal_label",
    tax: ".summary_tax_label",
    total: ".summary_total_label",
  },
};
