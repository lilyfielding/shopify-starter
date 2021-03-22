import header from './components/header'
import nav from './components/nav'

import cartDrawer from './components/cart/cartDrawer'

import selects from './components/selects'
import currencyPicker from './components/currencyPicker'
import quantityPicker from './components/quantityPicker'

import scrolling from './utils/scrolling'

import pdp from './modules/pdp'
import collection from './modules/collection'

header.init()
nav.init()

cartDrawer.init()

currencyPicker.init()
quantityPicker.init()
selects.init()
scrolling.init()

switch(document.body.getAttribute('data-template')) {
  case 'product': pdp.init()
  break
  case 'collection': collection.init()
}
