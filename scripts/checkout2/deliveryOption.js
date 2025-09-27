export function getDeliveryOption(cartItemId){
  let matchingItem;
   deliveryOptions.forEach((deliveryOption)=>{
    if(deliveryOption.id === cartItemId){
      matchingItem = deliveryOption;
    }
  })
  return matchingItem;
}
export const deliveryOptions = [{
  id: '1',
  deliveryDate: 7,
  priceCents: 0
},{
  id: '2',
  deliveryDate: 3,
  priceCents: 499
},{
  id: '3',
  deliveryDate: 1,
  priceCents: 999
}]


