import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct } from "./product.js";
import { getDeliveryOption } from '../checkout2/deliveryOption.js';
import { cart } from './cart.js';

export let tracking = JSON.parse(localStorage.getItem('tracking')) || [];


let rendertrackingPage = '';

const href = new URL(window.location.href);
const searchParams = new URLSearchParams(href.search);
const productId = searchParams.get('productId');
const orderId = searchParams.get('orderId');

let trackItems = tracking.find(trackingItems=>{
    return trackingItems.productId === productId && trackingItems.orderId === orderId;
  })

if(!trackItems){
  if(document.querySelector('.tracking-container')){
    document.querySelector('.tracking-container').innerHTML = '';
  }
}else{

    let product = getProduct(trackItems.productId);
    let  dateString  = new Date(trackItems.calculatedDeliveryDate).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    rendertrackingPage = `
            <div class="track-container">
            <div class="tracking-contents">
              <h4>Arriving on ${dateString}</h4>
              <p>${product.name}</p>
              <p>Quantity: ${trackItems.quantity}</p>
            </div>
              <div class="order-product-image">
                <img src="${product.image}" alt="">
              </div>
          </div>

          <div class="progress-container">
              <div class="status-text">
                  <p class="progress1">Preparing</p>
                  <p class="progress2">Shipped</p>
                  <p class="progress3">Delivered</p>
              </div>

              <div class="status-container">
                  <div class="status-bar"></div>
              </div>

          </div>
    
      `;
     document.querySelector('.tracking-container').innerHTML = rendertrackingPage;

      let preparing = document.querySelector('.progress1');
      let shipped = document.querySelector('.progress2');
      let delivered = document.querySelector('.progress3');
      let statusBar = document.querySelector('.status-bar');

      let matchingTrack = tracking.find(tracks => {
       return tracks.productId === productId && tracks.orderId === orderId
      })

      let matchingTracks;
      if(matchingTrack){
        matchingTracks = matchingTrack
      }

      class CalculateTime {
        constructor(orderDetails){
          this.time = new Date(orderDetails);
        }
        getDateTime(){
          return this.time.getTime();
        }
      }
      let currentTime = new Date().getTime();

      let orderTimes = new CalculateTime(matchingTracks?.orderTime);

      let deliveryTimes = new CalculateTime(matchingTracks?.calculatedDeliveryDate);

      let orderTime = orderTimes.getDateTime();
      let deliveryTime = deliveryTimes.getDateTime();

      let timeTrack = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;

      if(statusBar){
        statusBar.style.width = Math.min(Math.max(timeTrack, 0), 100) + '%';
        
        if(timeTrack < 50){
          statusBar.style.backgroundColor = 'red';
          preparing.style.color = 'red';
        }else if(timeTrack >= 50 && timeTrack < 100){
          statusBar.style.backgroundColor = 'yellow';
          shipped.style.color = 'yellow';
        }else {
          if(timeTrack >= 100){  
            if(matchingTrack && !matchingTrack.endDate){
              matchingTrack.endDate = new Date();
              saveToTracking();
            }     
            statusBar.style.backgroundColor = 'green';
            delivered.style.color = 'green';
          }
          
        }
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
      reloadQuantity();

}

export function saveToTracking(){
 localStorage.setItem('tracking', JSON.stringify(tracking));
}

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
