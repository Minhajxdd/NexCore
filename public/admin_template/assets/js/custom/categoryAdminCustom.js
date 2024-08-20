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


// Change the color's of delete button
(function (){
    const buttons = document.querySelectorAll('#btn-action');

    buttons.forEach(button => {
        if(button.innerHTML === 'Delete') {
            button.style.backgroundColor = 'red';
        } else if(button.innerHTML === 'Undo') {
            button.style.backgroundColor = 'green';
        }
    });
})();
// Change the color's of delete button




// Delete (soft delete)
(function (){
    const buttons = document.querySelectorAll('#btn-action');

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            sendDeleteRequest(button);
            if(button.style.backgroundColor === 'red'){
                button.style.backgroundColor = 'green';
                button.innerHTML = 'Undo';
            }
            else{
                button.style.backgroundColor = 'red';
                button.innerHTML = 'Delete';
            }
        });
    })

})();
async function sendDeleteRequest(element){
    let id = element.getAttribute('category-id');

    await axios.get(`/admin/categories/delete?id=${id}`)
            .then(response => {
                // console.log(response.data);
            })
            .catch(error => {
                console.error(`Axios delete request error ${error.message}`);
            });

}
// Delete (soft delete)

// Edit Form
(function (){
    const form = document.getElementById('edit-category-form');
    const buttons = document.querySelectorAll('#btn-edit');

    buttons.forEach((button) => {
        button.addEventListener('click',() =>{
        const row = button.closest('tr');
        const cells = row.getElementsByTagName('td');
        const name = cells[1].textContent.trim(); 
        const description = cells[2].textContent.trim();
        const id = row.querySelector('#btn-edit').getAttribute('category-id');

        const nameInput = document.getElementById('edit-category-name');
        const descriptionInput = document.getElementById('edit-category-description');
        const emptyInput = document.getElementById('edit-category-empty');

        nameInput.value = name;
        descriptionInput.value = description;
        emptyInput.value = id;
        form.style.display = 'block';
        })

    });
    
})();
// Edit Form

// Cancel Button
(function (){
    const cancel = document.getElementById('edit-form-cancel');
    const form = document.getElementById('edit-category-form');

    cancel.addEventListener('click', ()=> {
        form.style.display = 'none';
    })

})();
// Cancel Button


// Edit Form Submit
(function (){
document.getElementById('edit-form-field').addEventListener('submit' , (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form); 

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        axios.post('/admin/categories/add', data)
        .then((res) => {
            
        })
        .catch(function (error) {
            console.log(`Error message axios edit category post ${error.message}`);
        });

        document.getElementById('edit-category-form').style.display = 'none';

    });     

})();
// Edit Form Submit