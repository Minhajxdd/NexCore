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

        axios.post('/cart/product/add', data)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(`Error while sending axios cart request ${err}`);
        })
    })
})();