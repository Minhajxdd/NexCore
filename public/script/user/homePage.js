// add to cart button
(function (){
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach((button) => {
        button.addEventListener('click', () => {
            
            const data = {};

            data.id = button.getAttribute('data-id');
            axios.post('/cart/product/add', data)
            .then((res) => {
                if(res.data.error_message === 'no stock'){
                  popup(res.data.error_message);
                }
              })
              .catch((err) => {
                console.log(`axios add to cart error: ${err}`);
              });
        })
    })
})();
// add to cart button

document.querySelectorAll('.add-to-wishlist-btn').forEach(function (button){
  button.addEventListener('click' , function(){
    const productId = this.getAttribute('data-id');

    axios.get(`/api/wishlist/add?productId=${productId}`)
    .then(function(res){
      console.log(res.data);
    })
    .catch(function(err){
      console.log(`error while axios add to wishlist : ${err.message}`);
    })
  })
});



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
