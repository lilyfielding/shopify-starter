const quantityPicker = (() => {
  const EL_SELECTOR = ".js-quantityPicker";
  const FIELD_SELECTOR = ".js-quantityField";
  const BUTTON_SELECTOR = ".js-quantityButton";
  const LABEL_SELECTOR = ".js-quantityText";

  function onButtonClick(event) {
    const buttonEl = event.currentTarget;
    const pickerEl = buttonEl.closest(EL_SELECTOR);
    const quantityEl = pickerEl.querySelector(FIELD_SELECTOR);

    let quantity = parseInt(quantityEl.value);
    let max = quantityEl.getAttribute("max")
      ? quantityEl.getAttribute("max")
      : 50;

    if (buttonEl.classList.contains("plus") && quantity + 1 <= max) {
      quantityEl.value++;
      quantityEl.dispatchEvent(new Event("change"));
    } else if (buttonEl.classList.contains("minus")) {
      quantityEl.value--;
      quantityEl.dispatchEvent(new Event("change"));
    }
  }

  function onChange(event) {
    const fieldEl = event.currentTarget;
    const pickerEl = fieldEl.closest(EL_SELECTOR);
    const labelEl = pickerEl.querySelector(LABEL_SELECTOR);
    const minusEl = pickerEl.querySelector(BUTTON_SELECTOR + ".minus");
    const plusEl = pickerEl.querySelector(BUTTON_SELECTOR + ".plus");

    let shouldDisableMinus =
      parseInt(fieldEl.value) === parseInt(fieldEl.getAttribute("min"));
    let shouldDisablePlus =
      parseInt(fieldEl.value) === parseInt(fieldEl.getAttribute("max"));

    labelEl.innerHTML = fieldEl.value;

    if (shouldDisableMinus) {
      minusEl.disabled = true;
    } else if (minusEl.disabled === true) {
      minusEl.disabled = false;
    }

    if (shouldDisablePlus) {
      plusEl.disabled = true;
    } else if (plusEl.disabled === true) {
      plusEl.disabled = false;
    }
  }

  function template(id, quantity, line) {
    let isMax = quantity == 10;

    return `<div class="qtyPicker js-quantityPicker">
    <input 
      type="number" 
      class="qtyPicker__field js-quantityField js-cartItemQty" 
      id="${id}" 
      name="quantity" 
      value="${quantity}" 
      data-line="${line}"
      aria-label="Quantity" 
      min="1" max="10"
    >
    <button 
      class="qtyPicker__button js-quantityButton minus" 
      type="button" 
      aria-label="Decrease Quantity"
    >
      <span class="icon"></span>
    </button>
    <span class="qtyPicker__label js-quantityText">${quantity}</span>
    <button 
      class="qtyPicker__button js-quantityButton plus" 
      type="button" 
      aria-label="Increase Quantity"
      ${isMax ? "disabled" : ""}
    >
      <span class="icon"></span>
    </button>
  </div>`;
  }

  function init() {
    const buttons = document.querySelectorAll(BUTTON_SELECTOR);
    Array.prototype.forEach.call(buttons, (el) => {
      el.removeEventListener("click", onButtonClick);
      el.addEventListener("click", onButtonClick);
    });

    const fields = document.querySelectorAll(FIELD_SELECTOR);
    Array.prototype.forEach.call(fields, (el) => {
      el.removeEventListener("change", onChange);
      el.addEventListener("change", onChange);
    });
  }

  return {
    init,
    template,
  };
})();

export default quantityPicker;
