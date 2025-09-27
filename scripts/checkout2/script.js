import {cartHeading, confirmProduct} from '../productspace/cart.js';
import {products} from '../productspace/product.js';
import { formatCurrency } from './formatCurrency.js';

function filterProduct(productToDisplay){
  let productItems = '';

  if (productToDisplay.length === 0) {
    productItems = `<div class="no-results-message">No products matched your search.</div>`;
    document.querySelector('.products-lists').innerHTML = productItems;
  }

  productToDisplay.forEach((product)=>{
  productItems += 
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

    document.querySelector('.products-lists').innerHTML = productItems;

    function checkNotify(button){
      let addCart = button.closest('.product-items').querySelector('.added-cart');
      addCart.style.opacity = '1';
      addCart.style.transition = '1s ease';
      setTimeout(()=>{
        addCart.style.opacity = '';
      }, 1000);
    }

    document.querySelectorAll('.js-product-button').forEach((button)=>{
      const selectOption = button.closest('.product-items').querySelector('.product-value');
      button.addEventListener('click', ()=>{    
        const productId = button.dataset.productId;
        checkNotify(button);
        confirmProduct(productId, selectOption);
        cartHeading();
        
    });   
    
  });

  window.onload = cartHeading();
}

filterProduct(products);



document.querySelector('.js-search-button').addEventListener('click', ()=>{
  let searchContent = document.getElementById('search').value.toLowerCase();
    
  let filterContents = products.filter(product=>{
    return (
      product.name.toLowerCase().includes(searchContent)
    )
  })
  filterProduct(filterContents);
})

document.getElementById('search').addEventListener('keyup', (event)=>{

    let searchContent = event.target.value.toLowerCase();
    let filterContents = products.filter(product=>{
     return (
      product.name.toLowerCase().includes(searchContent)
     )
    });
    localStorage.setItem('searchContent', JSON.stringify(searchContent));

    filterProduct(filterContents)
  
})

window.onload = function(){
 let searchContent = JSON.parse(localStorage.getItem('searchContent'));
  if(searchContent !== null){
    document.getElementById('search').value = searchContent;
    let filterContents = products.filter(product=>{
      return (
        product.name.toLowerCase().includes(searchContent)
      )
    });
    filterProduct(filterContents)
  }
}

const bars = document.querySelector('.js-bars')
const times = document.querySelector('.js-times')

bars.addEventListener('click', ()=> {
  const rightContent = document.querySelector('.js-right-content')
  rightContent.style.display = 'flex';
  bars.style.display = 'none'
  times.style.display = 'block'
})
times.addEventListener('click', ()=> {
   const rightContent = document.querySelector('.js-right-content')
  rightContent.style.display = 'none';
   bars.style.display = 'block'
   times.style.display = 'none'
})