/*
  A simple model + API integration module to handle the order
*/
require('es6-promise').polyfill();
const axios = require('axios');

const cartModel = (() => {
  const endPoint = '/cart.json';
  const addEndPoint = '/cart/add.js';
  const updateEndPoint = '/cart/change.js';

  const callbacks = [];

  const state = {
    cart: {}
  };

  function track() {
    // hook tracking functions here
    if (window.fbq) {
      window.fbq('track', 'AddToCart');
    }
  }

  function triggerCallbacks(data) {
    callbacks.forEach((callback) => {
      callback(data);
    });
  }

  function onDataFetch(response) {
    if (response.data && response.data.items) {
      /* eslint-disable no-param-reassign */
      response.data.items = response.data.items.map((item, index) => {
        item.line_number = index + 1;
        // console.log(item)
        return item;
      });
      /* eslint-enable no-param-reassign */
    }
    state.cart = response.data;

    // console.log(state.cart)
    triggerCallbacks(response.data);
  }

  function stylePrice(_price) {
    const price = _price || 0;
    const dollars = Math.floor(price / 100);
    const cents = price - 100 * dollars;

    if (cents === 0) {
      return `$${dollars}`;
    } else if (cents < 10) {
      return `$${dollars}.0${cents}`;
    } else if (dollars || cents) {
      return `$${dollars}.${cents}`;
    }
    return 0;
  }

  function addCallback(callback) {
    callbacks.push(callback);
  }

  function getStateCart() {
    return state.cart;
  }

  function fetch(callback) {
    axios.get(endPoint, {
      headers: {
        'Cache-Control': 'no-store',
        Pragma: 'no-cache',
      }
    })
    .then((data) => {
      onDataFetch(data); // eslint-disable-line no-use-before-define
      if (callback) {
        callback();
      }
    }).catch((response) => {
      console.warn(response);
    });
  }

  function update(variantId = 0, quantity = 1, shouldDoCallback = true, line = false) {
    const requestData = { quantity: parseInt(quantity, 10) };
    if (line === false) {
      requestData.id = variantId;
    } else {
      requestData.line = line;
    }

    return axios.post(updateEndPoint, requestData)
    .then((response) => {
      if (shouldDoCallback) {
        onDataFetch(response); // eslint-disable-line no-use-before-define
      }
    })
    .catch((response) => {
      console.log(response);
    });
  }

  function remove(variantId, line) {
    return update(variantId, 0, true, line);
  }

  function add(data = {}, callback, fetchAfterAdding = true) {
    const id = data.id || 0;
    const quantity = data.quantity || 0;

    return axios.post(addEndPoint, data)
    .then(() => {
      track(id, quantity);
      if (fetchAfterAdding) {
        fetch(callback);
      }
    })
    .catch((response) => {
      console.warn(response);
      console.log(response.message)
    });
  }

  fetch();

  return {
    add,
    addCallback,
    fetch,
    getStateCart,
    remove,
    stylePrice,
    update
  };
})();

export default cartModel;
