import { cart } from "./cart.js";
import { storeCart } from "./cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { formatCurrency } from "../checkout2/formatCurrency.js";
import { getProduct } from "./product.js";
import { tracking, saveToTracking } from "./tracking.js";
import { getDeliveryOption } from "../checkout2/deliveryOption.js";

export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function getOrders(order, cart){
  let orderModifier = {
    id: order.id,
    orderTime: order.orderTime,
    totalCostCents: order.totalCostCents ,
    items: (order.products || []).map(product=>({
      productId: product.productId,
      quantity: product.quantity
    })),
    cart: cart.map(cartItem=>({
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      deliveryOrderId: cartItem.deliveryOrderId
    }))
  }
  orders.unshift(orderModifier);
  saveToStorage();
} 
function reloadOrderPage(){

let renderOrderPage = '';
orders.forEach((orderItems)=>{

    let stringTime = new Date(orderItems.orderTime).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })

   let html = `

  <div class="order-details">
        <div class="placed-order">
            <div class="placed-order-details">
                <div class="order-id">
                  <h5>Order Placed</h5>
                  <span>${stringTime}</span>
                </div>
                <div class="order-id">
                  <h5>Total</h5>
                  <span>$${formatCurrency(orderItems.totalCostCents)}</span>
                </div>
            </div>

              <div class="order-id">
                  <h5>Order ID:</h5>
                  <span>${orderItems.id}</span>
              </div>
        </div>

        <div class="order-items">
        `;

        orderItems.items.forEach((items)=>{
          let products = getProduct(items.productId);
          let matchingItem;
          orderItems.cart.forEach((cartitem)=>{
            if(items.productId === cartitem.productId){
              matchingItem = cartitem;
            }
          })
        let deliveryDay = getDeliveryOption(matchingItem.deliveryOrderId);

        let deliveryDays = dayjs(orderItems.orderTime).add(deliveryDay.deliveryDate, 'days');   
          if(deliveryDays.day() === 0){
            deliveryDays = deliveryDays.add(1, 'days')
          }else if(deliveryDays.day() === 6){
            deliveryDays = deliveryDays.add(2, 'days')
          }
        const dateString = deliveryDays.format('MMMM D');
        
        let matchingTrack;
        tracking.find(tracks=>{
          if(tracks.productId === items.productId && tracks.orderId === orderItems.id){
            matchingTrack = tracks;
          }
        })
        
        let textResult;
        if(matchingTrack?.endDate){
          let formatTrack = new Date(matchingTrack.endDate).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric'
          })
          textResult = `<p>Delivered On: ${formatTrack}</p>`
        }else{
          textResult = `<p>Arriving On: ${dateString}</p>`
        }
         
         html +=  `
         
         <div class="order-items-content">
              <div class="order-cart-details">
                <div>
                  <img src="${products.image}" alt="">
                </div>
                 <div class="order-data">
                    <h5>${products.name}</h5>
                    ${textResult}
                    <p>Quantity: ${matchingItem.quantity}</p>

                    <div class="buy-again-button">
                      <button data-product-id="${matchingItem.productId}">Buy it Again</button>
                    </div>
                  </div>
              </div>            
          
            <div class="track-package-button">
              <a href="tracking.html?orderId=${orderItems.id}&productId=${matchingItem.productId}" data-button-id ="${matchingItem.productId}" class="js-track-button">Track Package</a>
            </div>
        </div>      
      `;
  })
  html += `</div></div>`;
  renderOrderPage += html;
});

if(document.querySelector('.order-content-grid')){
  document.querySelector('.order-content-grid').innerHTML = renderOrderPage || '';

  const buttons = document.querySelectorAll('.buy-again-button button');
  buttons.forEach(button=>{
    button.addEventListener('click', ()=>{
      let productId = button.dataset.productId;
      let matchingItem;
      orders.forEach(orderItems=>{
        orderItems.cart.forEach(cartItem=>{
          if(cartItem.productId === productId){
            matchingItem = cartItem;
          }
        })
      })
    
    let confirmCart = cart.find(cartItem => {
      return cartItem.productId === matchingItem.productId && cartItem.deliveryOrderId === matchingItem.deliveryOrderId
    })
    
    if(confirmCart){
      confirmCart.quantity += 1;
     }else{
      cart.push(matchingItem);
     }
    storeCart();
    reloadQuantity();
    
      if(button.textContent === 'Buy it Again'){
        button.textContent = 'Added';
        setTimeout(()=>{
          button.textContent = 'Buy it Again';
        }, 1000);
      }
      
    });
  });
}
    reloadQuantity();     
}

function reloadQuantity(){
  let quantity = 0;
    cart.forEach(cartItem=>{
      quantity += cartItem.quantity;
    })

    if(document.querySelector('.js-cart-quantity')){
      document.querySelector('.js-cart-quantity').innerHTML = quantity;
    }
}

reloadOrderPage();
const track = document.querySelectorAll('.track-package-button a');
    track.forEach(trackButton=>{
      trackButton.addEventListener('click', (event)=>{
        //event.preventDefault();
        let href = trackButton.getAttribute('href');
        let url = new URL(href, window.location.origin);
        let params = new URLSearchParams(url.search);
        let orderId = params.get('orderId');
        let productId = params.get('productId');
        let buttonId = trackButton.dataset.buttonId;
       
        let matchingOrder = orders.find(order=>{
          return order.id === orderId
          })

        if(!matchingOrder) return;

        let matchingCart = matchingOrder.cart.find(item=>{
          return item.productId === productId
          })
        
        if(!matchingCart) return;

       let calculateDate = getDeliveryOption(matchingCart.deliveryOrderId)
        
         let calculatedDeliveryDate = dayjs(matchingOrder.orderTime).add(calculateDate.deliveryDate, 'days');
      
         if(calculatedDeliveryDate.day() === 0){
          calculatedDeliveryDate = calculatedDeliveryDate.add(1, 'days');
         }else if(calculatedDeliveryDate.day() === 6){
          calculatedDeliveryDate = calculatedDeliveryDate.add(2, 'days')
         }

        let matchingItem = tracking.find(match => {
          return match.productId === productId && match.orderId === orderId
          })
        
        if(!matchingItem){
          tracking.push({
          productId: matchingCart.productId,
          quantity: matchingCart.quantity,
          deliveryOrderId: matchingCart.deliveryOrderId,
          orderId: matchingOrder.id,
          orderTime: matchingOrder.orderTime,
          calculatedDeliveryDate: calculatedDeliveryDate
          })
          saveToTracking();
        }
        
    })
    
})

function saveToStorage(){
  localStorage.setItem('orders', JSON.stringify(orders));
}

let date = new Date().toLocaleString('en-US',{
  month: 'long',
  day: 'numeric'
});

const bars = document.querySelector('.js-bars');
const times = document.querySelector('.js-times');
bars?.addEventListener('click', ()=> {
  const rightContent = document.querySelector('.js-right-content')
  rightContent.style.display = 'flex'
  bars.style.display = 'none'
  times.style.display = 'block'
})

times?.addEventListener('click', ()=> {
  const rightContent = document.querySelector('.js-right-content')
  rightContent.style.display = 'none'
  bars.style.display = 'block'
  times.style.display = 'none'
})
