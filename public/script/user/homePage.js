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