

// add to cart button
(function () {
    const cartContainer = document.querySelector('#product-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.add-to-cart-btn');
            if (button) {
                const data = {};
                data.id = button.getAttribute('data-id');
                axios.post('/cart/product/add', data)
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }
        });
    }
})();

// add to cart button


// Api request Handler's

let limit = 6;
let page = 1;
let LtH = null;
let minPrice = null;
let maxPrice = null;
let categories = [];


PagenationReqSent(page, limit);

// Pagenation Buttons
document.querySelectorAll('.pagenation-btns').forEach((button) => {
    button.addEventListener('click', ()=> {

        page = button.textContent;
        
        PagenationReqSent(page, limit, LtH, minPrice, maxPrice);
        
    });
});
// Pagenation Buttons

// Show items limit
document.getElementById('itemsPerPageSelect').addEventListener('change', function(){

    document.querySelectorAll('.pagenation-btns').forEach(btn => {
        if(btn.style.backgroundColor === '#D10024'){
            page = btn.textContent;
        }
    });

    // Get the toggle value
    limit = parseInt(itemsPerPageSelect.value);

    // Sent Axios request
    PagenationReqSent(page, limit, LtH, minPrice, maxPrice);

});
// Show items limit

// Assign toggle values
export default function assignPrice(min, max){
    minPrice = min;
    maxPrice = max;
    PagenationReqSent(page, limit, LtH, minPrice, maxPrice);
}



document.getElementById('itemSortingSelect').addEventListener('change', () => {

    const value = Number(itemSortingSelect.value); 
    switch(value){
        case 1:
            LtH = 1;
            break;
        case 2:
            LtH = 2;
            break;
        default:
            LtH = null;
    }

    PagenationReqSent(page, limit, LtH, minPrice, maxPrice);

}) 

document.querySelectorAll('.category-check-boxes').forEach((checkbox) => {
    checkbox.addEventListener('change', ()=>{

        if (categories.includes(checkbox.value)) {
            categories = categories.filter(item => item !== checkbox.value);
        }else{
            categories.push(checkbox.value);
        }
        
        PagenationReqSent(page, limit, LtH, minPrice, maxPrice);
    });
});



// Pagenation api request
function PagenationReqSent(page, limit, LtH = null, minPrice = null, maxPrice = null){
    
    const apiPath = `/api/search`;
    
    const params = new URLSearchParams(window.location.search);

    // const category = params.get("category"); 
    const search = params.get("search").replace(/ /g, '+');

    const data = {
        categories: categories
    }


    axios.post(`${apiPath}?search=${search}&page=${page}&limit=${limit}&LtH=${LtH}&minp=${minPrice}&maxp=${maxPrice}`, data)
    .then((res) => {
        // console.log(res.data.result.status);

        if(res.data.result.results.length === 0){
            return noItems();
        }

        changeProductDetails(res.data.result.results);
        
    })
    .catch((err) => {
    console.log("error axios request fetching : "+err.message);
    })
}
// Pagenation api request





// Product details injection
function changeProductDetails(data) {
    const container = document.querySelector('#product-container');
    container.innerHTML = '';

    data.forEach((product, index) => {
        
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-divs', 'col-md-4', 'col-xs-6');

        productDiv.innerHTML = `
            <div class="product">
                <div class="product-img">
                    <img class="prd-img-align" src="/uploads/products/${product.images[0]}" alt="Product Image!!">
                </div>
                <div class="product-body">
                    <p class="product-category">${product.category_name}</p>
                    <h3 class="product-name"><a href="/product?id=${product._id}">${product.name.substring(0, 40)}...</a></h3>
                    <h4 class="product-price">₹ ${new Intl.NumberFormat('en-IN').format(product.discounted_price)}
                        <del class="product-old-price">${new Intl.NumberFormat('en-IN').format(product.original_price)}</del>
                    </h4>
                    <div class="product-btns">
                        <button class="add-to-wishlist"><i class="fa-regular fa-heart"></i><span class="tooltipp">add to wishlist</span></button>
                        <button class="quick-view">
                            <a href="/product?id=${product._id}" target="_blank">
                                <i class="fa fa-eye"></i>
                            </a>
                            <span class="tooltipp">quick view</span>
                        </button>
                    </div>
                </div>
                <div class="add-to-cart">
                    <button class="add-to-cart-btn" data-id="${product._id}"><i class="fa fa-shopping-cart"></i> add to cart</button>
                </div>
            </div>
        `;

        container.appendChild(productDiv);
    });
}
// Product details injection



// Item Not Found
function noItems(){
   
    const container = document.querySelector('#product-container');
    container.innerHTML = '';

    const notFoundDiv = document.createElement('div');

    notFoundDiv.innerHTML = `
    <div class="container">
        <div class="item-not-found">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            <h2>Item Not Found</h2>
            <p>Sorry, we couldn't find the item you're looking for.</p>
        </div>
    </div>
    `
    container.appendChild(notFoundDiv);
}

// Item Not Found



// Pagenation button color change
document.querySelectorAll('.pagenation-btns').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.pagenation-btns').forEach(btn => btn.style.backgroundColor = 'white');
        button.style.backgroundColor = '#D10024';
    });
});
// Pagenation button color change