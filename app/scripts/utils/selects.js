const selects = (() => {
  // Constants
  const JS_SELECTOR = '.js-select';
  const JS_SELECTOR_TRIGGER = '.js-selecteOptions';
  const EL_SELECTOR = '.select';

  const template = (options, color = '') => `
   <ul class="${JS_SELECTOR_TRIGGER.replace('.', '')} ${EL_SELECTOR.replace('.', '')}__options">
     ${options.map(option => `
     <li
      ${color ? `style="background: ${color}"` : ''}
      class="${EL_SELECTOR.replace('.', '')}__option"
      data-value="${option.value}"${ option.disabled ? ' data-disabled="1"' : '' }
      >
       ${option.text}
       ${(option.info ? `<span class="${JS_SELECTOR.replace('.', '')}__option__info">${option.info}</span>` : '') }
     </li>`).join('')}
   </ul>
  `;

  const templateTrigger = (selectedOption, selectedOptionInfo) => `
    <div class="${EL_SELECTOR.substr(1)}__value">
      ${selectedOption}
      ${(selectedOptionInfo ? `<span class="${JS_SELECTOR.replace('.', '')}__option__info">${selectedOptionInfo}</span>` : '')}
    </div>
  `;

  // Cache
  let instances = [];

  function markActiveOption(options, val) {
    const _CLASS_NAME = EL_SELECTOR.substr(1);
    Array.prototype.forEach.call(options, (option) => {
      option.classList.remove(`${_CLASS_NAME}__option--active`);
      if (option.getAttribute('data-value') === val) {
        option.classList.add(`${_CLASS_NAME}__option--active`);
      }
    });
  }

  function onOptionClick(e) {
    const val = this.getAttribute('data-value');
    const el = this.parentNode.parentNode;
    const select = el.querySelector('select');
    const options = el.querySelectorAll(`${EL_SELECTOR}__option`);
    const selectVal = el.querySelector(`${EL_SELECTOR}__value`);
    let selectedOption = '';
    let selectedOptionInfo;

    if (this.getAttribute('data-disabled')) {
      return null;
    }

    Array.prototype.forEach.call(select.options, (option, index) => {
      if (option.value === val) {
        select.selectedIndex = index;
        selectedOption = option.innerHTML;
        selectedOptionInfo = option.getAttribute('data-option-info') || '';
      }
    });

    markActiveOption(options, val);

    const event = document.createEvent('Event');

    event.initEvent('change', true, true);
    select.dispatchEvent(event);
    e.preventDefault();

    if (selectVal) {
      // Update the overlay with the val
      selectVal.outerHTML = templateTrigger(selectedOption, selectedOptionInfo);
    }
  }

  function closeSelects() {
    instances.forEach((instance) => {
      const jsSelect = instance.querySelector(JS_SELECTOR_TRIGGER);
      if (jsSelect) {
        jsSelect.classList.remove('is-open');
        jsSelect.parentNode.classList.remove('is-open');
      }
    });

    document.body.removeEventListener('click', closeSelects);
  }

  function onSelectClick(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.classList.contains('is-open')) {
      this.classList.remove('is-open');
      this.parentNode.classList.remove('is-open');
    } else {
      closeSelects();
      this.classList.add('is-open');
      this.parentNode.classList.add('is-open');
      document.body.removeEventListener('click', closeSelects);
      document.body.addEventListener('click', closeSelects);
    }
  }

  function applyStyling(el) {
    const options = [];
    const color = el.hasAttribute('data-color') ? el.getAttribute('data-color') : '';
    const oldJsSelect = el.parentNode.querySelector(JS_SELECTOR_TRIGGER);
    // Find the name of the selected option (grab from the text in innerHTML)
    const selectedOption = (el && el.options) ? el.options[el.selectedIndex || 0].innerHTML : '';
    // Find the info associated with the selected option
    const selectedOptionInfo = (el && el.options) ? el.options[el.selectedIndex || 0].getAttribute('data-option-info') : '';
    // Find the value of the selected option
    const selectedOptionValue = (el && el.options) ? el.options[el.selectedIndex || 0].value : '';

    // Remove the old select tag
    if (oldJsSelect) {
      oldJsSelect.parentNode.removeChild(oldJsSelect);
    }

    // Push each option to the array of options 
    Array.prototype.forEach.call(el.options, (option) => {
      options.push({
        disabled: option.disabled || false,
        info: option.getAttribute('data-option-info') || '',
        text: option.innerHTML,
        value: option.value
      });
    });

    // Render the new options
    el.insertAdjacentHTML('afterend', template(options, color));
    el.insertAdjacentHTML('afterend', templateTrigger(selectedOption, selectedOptionInfo));

    // Add all the js to make the new options functional
    const optionEls = el.parentNode.querySelectorAll(`${EL_SELECTOR}__option`);
    Array.prototype.forEach.call(optionEls, (_el) => {
      _el.removeEventListener('click', onOptionClick);
      _el.addEventListener('click', onOptionClick);
    })

    // Add all the js to make the new select boxes functional
    const jsSelect = el.parentNode.querySelector(JS_SELECTOR_TRIGGER);
    if (jsSelect) {
      jsSelect.removeEventListener('click', onSelectClick);
      jsSelect.addEventListener('click', onSelectClick);
    }

    // Mark the new options as active depending on the which old option is selected
    markActiveOption(optionEls, selectedOptionValue);
  }

  function init(customSelector) {
    const els = document.querySelectorAll(customSelector || JS_SELECTOR);

    Array.prototype.forEach.call(els, (el) => {
      applyStyling(el.querySelector('select'));
      instances.push(el);
    });
  }

  function destroy() {
    if (instances.length) {
      instances.forEach(instance => {
        const elValue = instance.querySelector(`${EL_SELECTOR}__value`);

        if (elValue) {
          elValue.parentNode.removeChild(elValue);
        }
        const jsSelect = instance.querySelector(JS_SELECTOR_TRIGGER);
        if (!jsSelect) {
          return null;
        }
        jsSelect.removeEventListener('click', onSelectClick);
        const optionEls = jsSelect.querySelectorAll(`${EL_SELECTOR}__option`);
        if (optionEls) {
          Array.prototype.forEach.call(optionEls, (_el) => {
            _el.removeEventListener('click', onOptionClick);
          });
        }
        jsSelect.parentNode.removeChild(jsSelect);
      });
    }
    instances = [];
  }

  return {
    destroy,
    init
  };
})();
export default selects;
