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
        console.log(data)
        axios.post('/cart/product/add', data)
        .then(res => {
            console.log(res.data);
            cartAddedPopup();
        })
        .catch(err => {
            console.log(`Error while sending axios cart request ${err}`);
        })
    })
})();

function cartAddedPopup(){
    document.getElementById('add-to-cart-btn-id').addEventListener('click', function() {
        var popup = document.getElementById('cart-popup');
        popup.style.display = 'block';

        // Hide the popup after 2 seconds
        setTimeout(function() {
            popup.style.display = 'none';
        }, 2000);
    });
}