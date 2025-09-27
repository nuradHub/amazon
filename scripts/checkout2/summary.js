import {cart, storeCart} from '../productspace/cart.js';
import {getProduct} from '../productspace/product.js';
import {getDeliveryOption} from './deliveryOption.js';
import { formatCurrency } from './formatCurrency.js';
import { getOrders } from '../productspace/orders.js';
import { renderDeliveryPage } from './checkout.js';

export function OrderSummary(){
  let OrderSummaryHTML = '';

  let productPriceCents = 0;
  let deliveryPriceCents = 0;
  
  cart.forEach(cartItem=>{
    const productPrice = getProduct(cartItem.productId);
    productPriceCents += productPrice.priceCents * cartItem.quantity;
    const deliveryPrice = getDeliveryOption(cartItem.deliveryOrderId);
    deliveryPriceCents += deliveryPrice.priceCents;
  })
  const totalBeforeTax = productPriceCents + deliveryPriceCents;
  
  const totalTax = totalBeforeTax * 0.1;

  const grandTotal = totalBeforeTax + totalTax;

  let quantity = 0;
  cart.forEach(cartItem=>{
    const productPrice = getProduct(cartItem.productId);
    quantity += cartItem.quantity;
  })
  OrderSummaryHTML = `
    <h4>Order Summary</h4>
    <div class="order-details">
      <div class="item1">
        <p>Items (${quantity}):</p>
        <p>${formatCurrency(productPriceCents)}</p>
      </div>
      <div class="item1">
        <p>Shipping & handling:</p>
        <p>$${formatCurrency(deliveryPriceCents)}</p>
      </div>
      <div class="item1">
        <p>Total before tax:</p>
        <p>$${formatCurrency(totalBeforeTax)}</p>
      </div>
      <div class="item1">
        <p>Extimated Tax (10%):</p>
        <p>$${formatCurrency(totalTax)}</p>
      </div>
      <hr>
      <div class="order-total">
        <h5>Order total: </h5>
        <h5>$${formatCurrency(grandTotal)}</h5>
      </div>
      <div class="js-error-message"></div>
      <button class="js-place-order">Place your order</button>
      
  </div>
  `
  document.querySelector('.order-summary-details').innerHTML = OrderSummaryHTML;

  document.querySelector('.js-place-order').addEventListener('click', async ()=>{
    try{
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      })
  
      const order = await response.json();
      getOrders(order, cart);
      window.location.href = 'orders.html'
      cart.length = 0;
      storeCart();
      renderDeliveryPage();
      if(document.querySelector('.all-checkout-content')){
        OrderSummary();
      }

    }catch (error){
      document.querySelector('.js-error-message').innerHTML = `Response ${error.message}`;
      setTimeout(()=>{
        document.querySelector('.js-error-message').innerHTML = '';
      }, 2000)
    }
  })
}
OrderSummary();
