import { cart, confirmProduct, reloadFromCart } from "../../../scripts/productspace/cart.js";

describe('Test Suite: cart', ()=>{

  it('Adding of new Product', ()=>{

    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(()=>{

      return JSON.stringify([{
        productId: '11-acf-32fr-5ty-12',
        quantity: 1,
        deliveryOrderId: '1'
      }]);
    });

    reloadFromCart();
    
    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual('11-acf-32fr-5ty-12');
    

  });
})