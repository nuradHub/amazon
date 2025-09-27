export let cart;

reloadFromCart();

export function reloadFromCart(){
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

export function confirmProduct(productId, selectOption){
  let confirmItem;
    
    cart.forEach(item =>{
      if(productId === item.productId){
        confirmItem = item;
      }
    });

    let selectedValue = Number(selectOption.value);

    if(confirmItem){
      confirmItem.quantity += selectedValue;
    }else{
      cart.push({
        productId: productId,
        quantity: selectedValue,
        deliveryOrderId: '1'
      });  
      
    }
    storeCart();
}

export function deleteItem(deleteProduct){
  let newCart = [];
  cart.forEach(cartItem =>{
    if(cartItem.productId !== deleteProduct){
      newCart.push(cartItem);
    }
  });
  cart = newCart;
  storeCart();
}


export function cartHeading(){
  let quantity = 0;
  cart.forEach(cartItem =>{
   quantity += cartItem.quantity;
  });
  document.querySelector('.cart-quantity').innerHTML = quantity; 
  storeCart();
}
export function storeCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem;
  cart.forEach(cartItem=>{
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  })
  matchingItem.deliveryOrderId = deliveryOptionId;
  storeCart(); 
 }