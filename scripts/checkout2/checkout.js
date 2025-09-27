import {cart, deleteItem, storeCart, updateDeliveryOption} from '.././productspace/cart.js';
import {getProduct} from '.././productspace/product.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from './deliveryOption.js';
import {OrderSummary} from './summary.js';
import { formatCurrency } from './formatCurrency.js';

renderDeliveryPage();
export function renderDeliveryPage(){

    let checkOutHTML = '';

    cart.forEach((cartItem)=>{

      let productId = cartItem.productId;
      let matchProduct = getProduct(productId);
      
      let cartItemId = cartItem.deliveryOrderId;
      let matchingItem = getDeliveryOption(cartItemId);

      let days = dayjs();
      let deliveryDays = days?.add(matchingItem.deliveryDate, 'days');
        if(deliveryDays?.day() === 0){
          deliveryDays = deliveryDays?.add(1, 'days')
        }else if(deliveryDays?.day() === 6){
          deliveryDays = deliveryDays?.add(2, 'days')
        }

      const dateString = deliveryDays?.format('dddd, MMMM D');
     
      checkOutHTML += `
        <div class="checkout-contents js-checkout-${matchProduct.id} js-checkout-content">
            <h4 class="deliver" >Delivery date: ${dateString}</h4>
            <div class="checkout-details">
              <div class="items-content">
                <div><img src="${matchProduct.image}" alt="t-shirt"></div>
                <div class="item-summary">
                  <h4>${matchProduct.name}</h4>
                  <div>$${formatCurrency(matchProduct.priceCents)}</div>
                  <div class="quanty-update-delete">Quantity:<span class = "changeQuantity">${cartItem.quantity}</span> <span><input type="text" name="num" class="input-field js-input"></span><span class="js-update" data-update-button ="${cartItem.productId}">Update</span> <span class="update js-save" data-save-item = "${cartItem.productId}">Save</span>
                  <span class="js-delete-button" data-delete-product = "${cartItem.productId}">Delete</span></div>
                </div>
              </div>
              <div class="delivery-items">
                <h5 class="choose">Choose a delivery option:</h5>
                ${deliveryOptionHTML(cartItem)}          
              </div>
            </div>
            
          </div>

      `;
    });

    function deliveryOptionHTML(cartItem){
      let html = '';
      deliveryOptions.forEach((deliveryOption)=>{

       let days = dayjs();

        let deliveryDays = days.add(deliveryOption.deliveryDate, 'days');

       
          if(deliveryDays.day() === 0){
            deliveryDays = deliveryDays.add(1, 'days')
          }else if(deliveryDays.day() === 6){
            deliveryDays = deliveryDays.add(2, 'days')
          }

        const dateString = deliveryDays.format('dddd, MMMM D');
         
      const deliveryPrice = deliveryOption.price === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;
      
      const isChecked = deliveryOption.id === cartItem.deliveryOrderId ? 'checked' : '';
        html += `
            <div class="delivery-info js-delivery-info" data-product-id= "${cartItem.productId}" data-delivery-option-id= "${deliveryOption.id}">
            <input type="radio" name="${cartItem.productId}" ${isChecked}>
              <div>
                <h5>${dateString}</h5>
                <H6>${deliveryPrice} - Shipping</H6>
              </div>
            </div>
            `;
        })
        return html;
      }

      document.querySelector('.all-checkout-content').innerHTML = checkOutHTML;
      

    function updateDelete(){
    let deletebutton = document.querySelectorAll('.js-delete-button');

    deletebutton.forEach(deletebutton =>{
      deletebutton.addEventListener('click', ()=>{
        let deleteProduct = deletebutton.dataset.deleteProduct;
        deleteItem(deleteProduct);

      let removeItem = document.querySelector(`.js-checkout-${deleteProduct}`);
      removeItem.remove();
      storeCart();
      updateHeadCart();
      OrderSummary();

      });
    });

    }
    updateDelete();

    function updateCart(){
        let updateItem = document.querySelectorAll('.js-update');
      updateItem.forEach(items=>{
        items.addEventListener('click', ()=>{
        let inputValue = items.closest('.checkout-contents').querySelector('.js-input');
        let saveValue = items.closest('.checkout-contents').querySelector('.js-save');
        let changeQuantity = items.closest('.checkout-contents').querySelector('.changeQuantity');

            inputValue.style.display = 'block';
            items.style.display = 'none';
            saveValue.style.display = 'block';

            saveValue.addEventListener('click', ()=>{
              let saveValues = saveValue.dataset.saveItem;
              let saveInputValue = Number(inputValue.value);
              if(saveInputValue > 0){
                cart.forEach(cartItem=>{
                  if(saveValues === cartItem.productId){
                    cartItem.quantity = saveInputValue;     
                          
                  }
                })
                if(changeQuantity){
                  changeQuantity.innerHTML = saveInputValue;
                }
                updateHeadCart();
                storeCart(); 
                OrderSummary();
      
                inputValue.style.display = 'none';
                saveValue.style.display = 'none';
                items.style.display = 'block';
              }else{
                alert('Error: order value cant be less than 0');
              }
              

            });
        });
      });
      }

    updateCart();

    function updateHeadCart(quantity){
      quantity = 0;
      cart.forEach((items)=>{
        quantity+= items.quantity;
      })
      document.querySelector('.js-items-header').innerHTML = quantity;
      
    }
    updateHeadCart();

    document.querySelectorAll('.js-delivery-info').forEach((option)=>{
      option.addEventListener('click', ()=>{
        let {productId, deliveryOptionId} = option.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderDeliveryPage();
        OrderSummary();
      })
    })
    
}