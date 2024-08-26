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
            })
            .catch(err => {
                console.log(`Error while increasing cart value ${err.message}`);
            })
        })
    })
})();
//Cart Quantity increase



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
            
            })
            .catch(err => {
                console.log(`Error while decreasing cart value ${err.message}`);
            })
        })
    })
})();
//Cart Quantity descrease
