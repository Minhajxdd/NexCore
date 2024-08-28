// add to cart button
(function (){
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach((button) => {
        button.addEventListener('click', () => {
            
            const data = {};
            data.id = button.getAttribute('data-id');
            axios.post('/cart/product/add', data)
            .then((res) => {
                console.log(res.data);
              })
              .catch((err) => {
                console.log(err.message);
              });
        })
    })
})();
// add to cart button
(function(){
    document.querySelectorAll('.pagenation-btns').forEach((button) => {
        button.addEventListener('click', ()=> {

            

            const limit = 3;
            const page = button.textContent;

            const pathName = window.location.pathname;
            const apiPath = `/api${pathName}`;

            axios.get(`${apiPath}?page=${page}&limit=${limit}`)
            .then((res) => {
            
                changeProductDetails(res.data.results);
            })
            .catch((err) => {
                console.log(err.message);
            })
        })
    })
})();


function changeProductDetails(data){
    document.querySelectorAll('.product-divs').forEach((div, ind) => {
            console.log(data[ind])
            div.innerHTML = `
                                    <div class="product">
									<div class="product-img">
										<img src="/uploads/products/${data[ind].images[0]}" alt="Product Image!!">
									</div>
									<div class="product-body">
										<p class="product-category">${data[ind].category_name}</p>
										<h3 class="product-name"><a href="/product?id=${data[ind]._id}">${data[ind].name.substring(0,40)}...</a></h3>
										<h4 class="product-price">₹ ${new Intl.NumberFormat('en-IN').format(data[ind].discounted_price)}<del class="product-old-price">${new Intl.NumberFormat('en-IN').format(data[ind].original_price)}</del></h4>
									
										<div class="product-btns">
											<button class="add-to-wishlist"><i class="fa-regular fa-heart"></i><span class="tooltipp">add to wishlist</span></button>
                                            <button class="quick-view">
                                                <a href="/product?id=${data[ind]._id}" target="_blank">
                                                    <i class="fa fa-eye"></i>
                                                </a>
                                                <span class="tooltipp">quick view</span>
                                            </button>
                                        </div>
									</div>
									<div class="add-to-cart">
                                        <button  class="add-to-cart-btn" data-id="${data[ind]._id}"><i class="fa fa-shopping-cart"></i> add to cart</button>
                                    </div>
								</div>
        `
    })
}



document.querySelectorAll('.pagenation-btns').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.pagenation-btns').forEach(btn => btn.style.backgroundColor = 'white');
        button.style.backgroundColor = '#D10024';
    })
})
