// add to cart button
(function (){
    const cartBtns = document.querySelectorAll('.add-to-cart-btn');
    cartBtns.forEach((button) => {
        button.addEventListener('click', () => {
            
            const data = {};

            data.id = button.getAttribute('data-id');
            axios.post('/cart/product/add', data)
            .then((res) => {
              
                if(res.data.error_message){
                  return showPopup(res.data.error_message,"red");
                }
                if(res.data.status == 'success') {
                  return showPopup("Item added to Cart successfully!","#4CAF50");
                }

              })
              .catch((err) => {
                console.log(`axios add to cart error: ${err}`);
              });
        })
    })
})();
// add to cart button


// add to wishlist 
document.querySelectorAll('.add-to-wishlist-btn').forEach(function (button){
  button.addEventListener('click' , function(){
    const productId = this.getAttribute('data-id');

    axios.get(`/api/wishlist/add?productId=${productId}`)
    .then(function(res){
      if(res.data.status) {
        console.log(`Success`);
        return showPopup("Item added to wishlist successfully!","#4CAF50");
      }
      console.log('Failed');
    })
    .catch(function(err){
      console.log(`error while axios add to wishlist : ${err.message}`);
    })
  })
});
// add to wishlist 



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


// Notification Popup
function showPopup(msg, color) {
  const popup = document.getElementById("popup-notification");
  popup.innerHTML = msg;
  popup.classList.add("show");
  popup.style.backgroundColor = color;

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}
// Notification Popup