document.getElementById("products-body").addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = e.target.getAttribute("data-id");
    
    const data = {
        id: productId
    };

    axios.post('/cart/product/add', data)
    .then((res) => {
        if(res.data){
            window.location.href = '/wishlist';
        }
      })
      .catch((err) => {
        console.log(`axios add to cart error: ${err}`);
      });

  } else if (e.target.classList.contains("remove-item-btn")) {
    const productId = e.target.getAttribute("data-id");

    axios.get(`/api/wishlist/remove?id=${productId}`)
    .then((res) => {
        if(res.data){
            window.location.href = '/wishlist';
        }
    })
    .catch((err) => {
        console.log(`error while removing axios request: ${err.message}`);
    })

  }
}); 
