import { formatCurrency } from "../checkout2/formatCurrency.js";

let filterProduct = [];

let productItems2 = '';

export function renderfilterProduct(filterProduct){
  filterProduct.forEach((product)=>{
  productItems2 += 
  `<div class="product-items">

    <div class="product-image">
      <img src="${product.image}" alt="">
    </div>
    <div class="product-id">
      <h4>${product.name}</h4>
      <div class="product-rating">
        <img src="images/ratings/rating-${(product.rating.star) * 10}.png" alt="">
        <span>${product.rating.count}</span>
      </div>
      <p class="product-price">${formatCurrency(product.priceCents)}</p>
    </div>
    <select name="value" class="product-value">
      <option selected value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
      <option value="7">7</option>
      <option value="8">8</option>
      <option value="9">9</option>
      <option value="10">10</option>
    </select>
    <div class="added-cart">
      <img src="images/icons/checkmark.png" alt="">
    Added</div>
    <button class="product-button js-product-button" data-product-id = "${product.id}">Add to Cart</button>

    </div>`;
  });

document.querySelector('.products-lists').innerHTML = productItems2;
}

window.onload = productItems2;