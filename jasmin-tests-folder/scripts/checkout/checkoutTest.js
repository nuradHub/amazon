import { reloadFromCart} from "../../../scripts/productspace/cart.js";
import { renderDeliveryPage } from "../../../scripts/checkout2/checkout.js";

describe('Test Suite: renderOrderSummary', ()=>{

  it('Adding of new Product', ()=>{

    document.querySelector('.js-checkout-content').innerHTML = `
        <div class="all-checkout-content"></div>    
           
    `
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(()=>{
      return JSON.stringify([{
        productId: '11-acf-32fr-5ty-12',
        quantity: 2,
        deliveryOrderId: '1'
      },{
        productId: '25-scf-32fr-5ty-12',
        quantity: 1,
        deliveryOrderId: '2'
      }]);
    })
    reloadFromCart();
    renderDeliveryPage();

  });
});