import cartModel from './cartModel';
import cartDrawer from './cartDrawer';

import {
  poly
} from '../../utilities';

const cartButton = (() => {
  const SELECTOR = '.js-addToCart';
  const SELECTOR_QTY = '.js-pdpQty';
  const SELECTOR_SIZES = '.js-product__sizes [data-id]';

  function onClick(ev) {
    const el = ev.currentTarget;
    const id = el.getAttribute('data-id') || 0;
    // Add data-parent-id to cart button that's the same as the one on the inputs to tie them together
    const parentId = el.getAttribute('data-parent-id') || 0;
    const elQty = document.querySelector(SELECTOR_QTY);
    const quantity = elQty ? parseInt(elQty.value, 10) : 1;

    ev.preventDefault();
    if (!id) {
      console.warn('Product ID missing');
      return null;
    }

    if (parentId && id === parentId) {
      el.innerText = 'Select size';
      setTimeout(() => {
        el.innerText = 'Add to Bag';
      }, 3000);

      return null;
    }

    const data = {
      id,
      quantity,
      properties
    };

    // Add all the data
    cartModel.add(data, () => {
      setTimeout(cartDrawer.open, 100);
    });
  }

  // Add data-id with the variant id
  // Add data-parent-id to input to tie it to the cart button
  // When option is clicked, set the cart button id to the option's data-id
  // So that when the button is clicked it'll add the variant to cart
  // The question is how do you map the variant to the option? need a hybrid between this and the old jquery method
  function onSizeClick(ev) {
    const el = ev.currentTarget;
    const id = el.getAttribute('data-id') || 0;
    const parentId = el.getAttribute('data-parent-id') || 0;
    const buyButton = document.querySelector(`${SELECTOR}[data-parent-id="${parentId}"]`);
    const siblings = el.parentElement.parentElement.querySelectorAll('button');

    if (siblings && siblings.length) {
      Array.prototype.forEach.call(siblings, (sizeButton) => {
        poly.removeClass(sizeButton, 'is-active');
      });
    }
    poly.addClass(el, 'is-active');

    if (buyButton && id) {
      buyButton.setAttribute('data-id', id);
      buyButton.innerText = 'Add to Bag';
    }
  }

  // SHOULD ALSO ADD SOME CODE TO DEAL WITH SELECT BOXES  

  // Attach event listeners here
  function init() {
    const els = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(els, el => {
      el.removeEventListener('click', onClick);
      el.addEventListener('click', onClick);
    });

    const sizes = document.querySelectorAll(SELECTOR_SIZES);
    Array.prototype.forEach.call(sizes, el => {
      el.removeEventListener('click', onSizeClick);
      el.addEventListener('click', onSizeClick);
    });
  }

  return {
    init
  };
})();

export default cartButton;
