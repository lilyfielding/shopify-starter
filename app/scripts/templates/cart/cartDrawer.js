import cartModel from "./cartModel";
import cartTemplate from "./cartTemplate";
import quantityPicker from "../../snippets/quantityPicker";

const cartDrawer = (() => {
  const SELECTOR_CLOSE = ".js-cartClose";
  const SELECTOR_TOGGLE = ".js-cartToggle";
  const SELECTOR_DROP = ".js-cartItemDrop";
  const SELECTOR_UPDATE_QTY = ".js-cartItemQty";
  const SELECTOR_CHECKOUT = ".js-cartCheckout";

  const state = {
    open: false,
    view: null,
  };

  function onStateChange() {
    let action = "add";
    if (!state.open) {
      action = "remove";
    }

    document.documentElement.classList[action]("state--cart-drawer-open");
  }

  function open() {
    state.open = true;
    onStateChange();
  }

  function close() {
    state.open = false;
    onStateChange();
  }

  function onToggleClick(ev) {
    ev.preventDefault();
    state.open = !state.open;

    onStateChange();
  }

  function onCloseClick(ev) {
    ev.preventDefault();
    close();
  }

  function onItemDropClick(ev) {
    ev.preventDefault();
    const id = ev.currentTarget.getAttribute("data-id") || 0;
    const line = parseInt(ev.currentTarget.getAttribute("data-line") || 0, 10);

    if (!id) {
      return null;
    }
    ev.currentTarget.parentNode.style.opacity = 0; // eslint-disable-line no-param-reassign

    cartModel.remove(id, line);
  }

  function onItemQtyUpdate(ev) {
    ev.preventDefault();
    const id = ev.currentTarget.getAttribute("id") || 0;
    const qty = ev.currentTarget.value;

    if (!id) {
      return null;
    }

    cartModel.update(id, qty);
  }

  function onCheckoutClick(ev) {
    ev.preventDefault();
    const href = this.getAttribute("href") + tracking.getGALinker();
    const total = this.getAttribute("data-total");
    if (href) {
      tracking.track("initiateCheckout", {
        revenue: total * 0.01,
      });
      window.location.href = href;
    }
  }

  function bind() {
    Array.prototype.forEach.call(
      document.querySelectorAll(SELECTOR_TOGGLE),
      (el) => {
        el.removeEventListener("click", onToggleClick);
        el.addEventListener("click", onToggleClick);
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll(SELECTOR_CLOSE),
      (el) => {
        el.removeEventListener("click", onCloseClick);
        el.addEventListener("click", onCloseClick);
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll(SELECTOR_DROP),
      (el) => {
        el.removeEventListener("click", onItemDropClick);
        el.addEventListener("click", onItemDropClick);
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll(SELECTOR_UPDATE_QTY),
      (el) => {
        el.removeEventListener("change", onItemQtyUpdate);
        el.addEventListener("change", onItemQtyUpdate);
      }
    );
    Array.prototype.forEach.call(
      document.querySelectorAll(SELECTOR_CHECKOUT),
      (el) => {
        el.removeEventListener("click", onCheckoutClick);
        el.addEventListener("click", onCheckoutClick);
      }
    );
  }

  function render(data = {}) {
    state.view.innerHTML = cartTemplate(data);
    bind();
    quantityPicker.init();
  }

  function init() {
    state.view = document.createElement("div");
    document.body.appendChild(state.view);
    cartModel.addCallback(render);
  }

  return {
    close,
    init,
    open,
  };
})();

export default cartDrawer;
