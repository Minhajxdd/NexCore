//Cart Quantity increase
(function(){
    const buttons = document.querySelectorAll('.qty-up');
    buttons.forEach(button => {
        button.addEventListener('click', () => {

            let inputElement = Number(button.closest('div').querySelector('input').value);

            const data = {
                id: button.getAttribute('data-id'),
                inputValue: inputElement + 1
            }
            const priceSpan = button.closest('.quantity').nextElementSibling.querySelector('span');
            

            axios.post('/cart/product/quantity/increase',data)
            .then(res => {
                console.log(`Status: ${res.data.status}`);
                priceSpan.innerHTML = `₹ ${new Intl.NumberFormat('en-IN').format(res.data.updatedPrice)}`;
                updateTotalPrice(res.data.totalPrice);
            })
            .catch(err => {
                console.log(`Error while increasing cart value ${err.message}`);
            })
        })
    })
})();
//Cart Quantity increase

// Update Total Quantity
function updateTotalPrice(price){
    document.getElementById('final-price').innerHTML = `₹ ${new Intl.NumberFormat('en-IN').format(price)}`;
}

// Update Total Quantity



//Cart Quantity decrease
(function(){
    const buttons = document.querySelectorAll('.qty-down');
    buttons.forEach(button => {
        button.addEventListener('click', () => {

            let inputElement = button.closest('div').querySelector('input');

            if(inputElement.value == 1) return;

            const data = {
                id: button.getAttribute('data-id'),
                inputValue: inputElement.value-1
            }

            const priceSpan = button.closest('.quantity').nextElementSibling.querySelector('span');

            axios.post('/cart/product/quantity/decrease',data)
            .then(res => {
                console.log(`Status: ${res.data.status}`);
                priceSpan.innerHTML = `₹ ${new Intl.NumberFormat('en-IN').format(res.data.updatedPrice)}`; 
            
                updateTotalPrice(res.data.totalPrice);

            })
            .catch(err => {
                console.log(`Error while decreasing cart value ${err.message}`);
            })
        })
    })
})();
//Cart Quantity descrease

// Cart Items Delete
(function (){
    const buttons = document.querySelectorAll('.cart-delete');

    buttons.forEach(function(button){
        button.addEventListener(`click`, () => {

            const data = {
                productId: button.getAttribute('data-id') 
            }
    
            axios.post('/cart/product/delete', data)
            .then(res => {

                updateTotalPrice(res.data.totalPrice);

                console.log(res.data.status);
                
                button.closest('.disable-product-listing').style.display = 'none';

                if(res.data.emptyCart){
                    document.querySelector('.page').innerHTML = `
                    <div class="container" style="margin-bottom: 100px;">
                    <div class="empty-cart-container">
                        <div class="empty-cart-message">
                            <i class="glyphicon glyphicon-shopping-cart"></i>
                            <h2>Your Cart is Empty</h2>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <a href="/" class="btn btn-success">Start Shopping</a>
                            </div>
                        </div>
                    </div>
                    `
                }


            })
            .catch(err => {
                console.log(`Error which sending axios request for delete cart ${err.message}`);
            }) 

        })
    });

})();
// Cart Items Delete