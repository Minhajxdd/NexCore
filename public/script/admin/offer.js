// Form add btn
document.getElementById(`add-form-btn`).addEventListener('click', () => {
    document.getElementById('add-offer-div').style.display = 'block';
})
// Form add btn
// Form cancel btn
document.getElementById('add-offer-cancel').addEventListener('click' , function(){
    document.getElementById('add-offer-div').style.display = 'none';
})
// Form cancel btn
// Add form type
document.getElementById('add-off-type-input').addEventListener('change', function(){
    if(this.value);

    axios.get(`/admin/api/offers/type?type=${this.value}`)
    .then(function(res){
        console.log(res.data);
    })
    .catch(function(err){
        console.log(`error while fetching data: ${err.message}`);
    })
})
// Add form type


window.onload = function(){
    document.getElementById(`add-off-type-input`).value = '';
}