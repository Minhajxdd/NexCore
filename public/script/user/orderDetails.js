
(function(){
    const cancel = document.getElementById('order-cancel');
    cancel.addEventListener('click', function(){

        const popupContainer = document.getElementById('popupContainer');
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const statusBar = document.getElementById('progress-bar-div');

        popupContainer.classList.remove('hidden');


        yesBtn.addEventListener('click', () => {
            
            const id = cancel.value;

            if(!id) return console.log('Something went wrong');
            
            axios.get(`/api/orders/cancel?id=${id}`)
            .then((res) => {
                console.log(res.data);
                if(res.data.orderStatus === 'cancelled'){
                    updateStatusCancel();
                }
            })
            .catch((err) => {
                console.log(`error while axios order cancel request : ${err.message}`);
            })

            statusBar.style.width = '0%';
            popupContainer.classList.add('hidden');
            cancel.style.display = 'none';
          });
        

          noBtn.addEventListener('click', () => {
            popupContainer.classList.add('hidden');
          });
        
    });

})();

function updateStatusCancel(){
    document.getElementById('status-bar').innerHTML = 'cancelled';
}