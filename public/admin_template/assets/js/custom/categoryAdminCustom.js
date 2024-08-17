// Form add Category toggeler
(function (){
    const button = document.getElementById('add-button');
    const form = document.getElementById('add-category-form');
    const cancelButton = document.getElementById('add-form-cancel');
    const submitButton = document.getElementById('add-form-submit');
    const formFiled = document.getElementById('add-form-field');

    button.addEventListener('click', () => {
        form.style.display = 'block';
    });

    cancelButton.addEventListener('click', () => {
        form.style.display = 'none';
        formFiled.reset();
    });

    submitButton.addEventListener('click', () => {
        form.style.display = 'none';
    })

})();
// Form add Category toggeler

// Axios category added post
(function (){
    document.getElementById('add-form-field').addEventListener('submit' , (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form); 

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        axios.post('/admin/add/categories', data)
        .then((res) => {
            const data = res.data.data;



            // const data = JSON.stringify(response.data, null, 2)
            // console.log(data);
           document.getElementById('add-form-field').reset();
        })
        .catch(function (error) {
            console.log('Error message axios add category posting');
        });

    });
})();
// Axios category added post