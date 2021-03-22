import cartModel from "./cartModel";
import cartDrawer from "./cartDrawer";
import serializeArray from "../../utils/serialize";

const cartForm = (() => {
  const SELECTOR_FORM = ".js-atc-form";
  const SELECTOR_PRICE = ".js-atc-price";
  const SELECTOR_ID = ".js-atc-variant";
  const SELECTOR_OPTION = '[name*="option"]';
  const SELECTOR_DATA = "[data-product-json]";
  const SELECTOR_BUTTON = ".js-atc-button";

  function onOptionChanged(ev) {
    const optionEl = ev.currentTarget;
    const formEl = optionEl.closest(SELECTOR_FORM);
    let selectedVariant = getActiveVariant(formEl);

    validate(formEl, selectedVariant);
    window.history.replaceState(null, null, "?variant=" + selectedVariant.id);
  }

  function getActiveVariant(form) {
    const variants = JSON.parse(
      decodeURIComponent(form.querySelector(SELECTOR_DATA).innerHTML)
    );
    const formData = serializeArray(form);

    let formOptions = {
      option1: null,
      option2: null,
      option3: null,
    };

    let id = form.querySelector(SELECTOR_ID);
    let selectedVariant = id.value;

    formData.forEach((item) => {
      if (item.name.includes("option")) {
        formOptions[item.name] = item.value;
      }
    });

    variants.forEach((variant) => {
      if (
        variant.option1 === formOptions.option1 &&
        variant.option2 === formOptions.option2 &&
        variant.option3 === formOptions.option3
      ) {
        selectedVariant = variant;
        return false;
      }
    });

    return selectedVariant;
  }

  function validate(form, selectedVariant) {
    const idEl = form.querySelector(SELECTOR_ID);
    const buttonEl = form.querySelector(SELECTOR_BUTTON);
    const priceEl = document.querySelector(SELECTOR_PRICE);

    let hasVariant = selectedVariant !== null;
    let canAddToCart = selectedVariant.inventory_quantity > 0;
    let formattedVariantPrice = hasVariant
      ? `£${(selectedVariant.price / 100).toFixed(2)}`
      : "";
    let priceHtml = hasVariant
      ? `<span class="money">${formattedVariantPrice}</span>`
      : priceEl.getAttribute("data-default-price");

    if (canAddToCart) {
      idEl.value = selectedVariant.id;
      buttonEl.disabled = false;
      buttonEl.classList.remove("disabled");
      buttonEl.innerHTML = "Add to Cart";
    } else {
      idEl.value = null;
      buttonEl.disabled = true;
      buttonEl.classList.add("disabled");
      buttonEl.innerHTML = "Sold Out";
    }

    priceEl.innerHTML = priceHtml;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    let quantity = ev.currentTarget.querySelector('[name="quantity"]').value;
    let id = ev.currentTarget.querySelector('[name="id"]').value;

    let data = {
      id,
      quantity,
    };

    cartModel.add(data, () => {
      setTimeout(cartDrawer.open, 100);
    });
  }

  function init() {
    const els = document.querySelectorAll(SELECTOR_FORM);
    Array.prototype.forEach.call(els, (el) => {
      el.removeEventListener("submit", onSubmit);
      el.addEventListener("submit", onSubmit);
    });

    const options = document.querySelectorAll(SELECTOR_OPTION);
    Array.prototype.forEach.call(options, (option) => {
      option.removeEventListener("change", onOptionChanged);
      option.addEventListener("change", onOptionChanged);
    });

    // quantityPicker.init()
  }

  return {
    init,
    getActiveVariant,
  };
})();

export default cartForm;
