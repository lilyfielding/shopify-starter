import quantityPicker from "../../snippets/quantityPicker";

const cartItemTemplate = (props = {}) => {
  const {
    id = 0,
    price = 0,
    product_title = "",
    quantity = 1,
    selling_plan_allocation = {},
    line_number = 1,
  } = props;

  const hasSubscription = Object.keys(selling_plan_allocation).length !== 0;

  return `<li class="cart__item">
    <div class="cart__item-top">
      <h2 class="cart__item-heading">${product_title}</h2>
      ${quantityPicker.template(id, quantity, line_number)}
    </div>
    ${
      hasSubscription
        ? `<div class="cart__item-subscription">
        <p>${selling_plan_allocation.selling_plan.name}</p>
      </div>`
        : ""
    }
  </li>`;
};

const cartTotals = (total = 0, shippingRate) => `
  <form method="post" action="/cart">
    <input type="hidden" name="checkout" value="Checkout">
    <div class="cart__totals">
      <h2>Total</h2>
      <p>$${(total / 100).toFixed(2)}</p>
    </div>
    <div class="cart__shipping">
      ${shippingCalcTemplate(total, shippingRate)}
    </div>
    <button class="cart__button">Checkout</button>
  </form>
`;

const shippingCalcTemplate = (currentVal = 0, targetVal = 0) => {
  let newProgressNum = targetVal - currentVal;
  let thresholdMet = newProgressNum <= 0 ? true : false;

  return `
    <p style="display: ${thresholdMet ? "none" : "block"}">
      You're only $${(newProgressNum / 100).toFixed(2)} away from free shipping
    </p>
    <p style="display: ${thresholdMet ? "block" : "none"}">
      You've got free shipping
    </p>
  `;
};

const cartTemplate = (props = {}) => {
  const { item_count = 0, items = [], total_price = 0 } = props;
  let isEmpty = item_count === 0;

  const freeShippingRate = document
    .querySelector("body")
    .getAttribute("data-shipping");

  const output = `<div class="cart__drawer">
    <div class="cart__drawer-inner">
      <div class="cart__drawer-header">
        <h1>Cart (${item_count})</h1>
        <button class="cart__drawer-close js-cartClose" aria-label="Close Cart"></button>
      </div>
      <div class="cart__drawer-items">
        ${
          isEmpty
            ? '<div class="cart__drawer-empty">Your cart is empty</div>'
            : `<ul class="cart__items">${items
                .map(cartItemTemplate)
                .join("")}</ul>`
        }
      </div>
      <div class="cart__drawer-totals">
        ${!isEmpty ? cartTotals(total_price, freeShippingRate) : ""}
      </div>
    </div>
  </div>`;

  return output;
};

export default cartTemplate;
