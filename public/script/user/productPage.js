// document.addEventListener('DOMContentLoaded', function() {
//     cartAddedPopup();
// });

function cartAddedPopup(){
        const popup = document.getElementById('cart-popup');
        popup.style.display = 'block';

        setTimeout(function() {
            popup.style.display = 'none';
        }, 2000);
}

// Add to cart axios
(function(){
    document.getElementById('cart-form').addEventListener('submit',(event)=> {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form); 



        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        data.quantity = document.getElementById('input-value').value;

        
        axios.post('/cart/product/add', data)
        .then(res => {
            if(res.data.error_message){
                console.log('failed');
                return popup(res.data.error_message);
            }
                cartAddedPopup();
                const stockCount = document.getElementById('product-stock-count');
                const newStock = Number(stockCount.innerHTML.match(/\d+/)[0]) - Number(data.quantity);
                stockCount.innerHTML = ` Stock : ${newStock}`;

                console.log(res.data.status);
        })
        .catch(err => {
            console.log(`Error while sending axios cart request ${err}`);
        })
    })
})();


function popup(error_message) {
    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    popup.innerHTML = error_message;
    popup.classList.add('show');
  
    setTimeout(() => {
        popup.classList.remove('show');
        popup.classList.add('hidden');
    }, 3000);
}


// add to cart button
(function (){
    const cartBtns = document.querySelectorAll('.add-to-cart-btn-btm');
    cartBtns.forEach((button) => {
        button.addEventListener('click', () => {
            
            const data = {};
            data.id = button.getAttribute('data-id');
            axios.post('/cart/product/add', data)
            .then((res) => {
                if(res.data.error_message){
                    console.log('failed');
                    return popup(res.data.error_message);
                };
                console.log(res.data.status);
              })
              .catch((err) => {
                console.log(err.message);
              });
        })
    })
})();
// add to cart button


