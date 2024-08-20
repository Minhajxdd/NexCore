// Add user toggle 
(function (){
    const button = document.getElementById('add-usr-btn');
    const form = document.getElementById('add-products-table');
    const cancel = document.getElementById('add-prd-cancel');

    button.addEventListener('click', () => {
        form.style.display = 'block';
    })

    cancel.addEventListener('click', () => {
        form.style.display = 'none';
    })
    
})();
// Add user toggle


// Cropperjs
(function (){
    let cropper;
    let currentImageInput;

        document.getElementById('product-add-form').addEventListener('click', function(event) {
            if (event.target.classList.contains('cropButton')) {
                currentImageInput = event.target.previousElementSibling; // Get the related input element
                const file = currentImageInput.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const image = document.getElementById('imagePreview');
                        image.src = e.target.result;

                        // Destroy previous cropper instance if any
                        if (cropper) {
                            cropper.destroy();
                        }

                        // Initialize Cropper.js
                        cropper = new Cropper(image, {
                            aspectRatio: 1, // Example: square crop
                            viewMode: 1,
                            scalable: true,
                            zoomable: true,
                            movable: true,
                        });

                        // Show the cropper pop-up
                        document.getElementById('cropContainer').style.display = 'block';
                        document.getElementById('overlay').style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select an image first.');
                }
            }
        });

        document.getElementById('cropAndSaveButton').addEventListener('click', function() {
            cropper.getCroppedCanvas().toBlob(function(blob) {
                const file = new File([blob], currentImageInput.files[0].name, { type: 'image/png' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                currentImageInput.files = dataTransfer.files;

                // Hide the cropper pop-up
                document.getElementById('cropContainer').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
            });
        });

        document.getElementById('cancelCropButton').addEventListener('click', function() {
            // Hide the cropper pop-up without saving
            document.getElementById('cropContainer').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        });

        let count = 4;
        document.getElementById('addImageButton').addEventListener('click', function() {
            const parentDiv = document.getElementById('add-image-form-new-content-div');
            parentDiv.style.display = 'block';
            const container = document.createElement('div');
            container.classList.add('form-group');
            container.innerHTML = `
                <label for="imageInput${count}">Image ${count}</label>
                <input name="image" type="file" class="form-control" id="imageInput${count}" accept="image/*" required>
                <button type="button" class="btn btn-primary mt-2 cropButton">Crop</button>
            `;
            count++;
            parentDiv.appendChild(container);
        });
})();
// Cropperjs

// Create Product
(function(){
    
    document.getElementById('product-add-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        let formData = new FormData(this);
        
        const dropDown = document.getElementById('add-usr-category');
        const selectedDropDown = dropDown.options[dropDown.selectedIndex];
        const id = selectedDropDown.getAttribute('data-id');

        // Send the POST request using Axios
        axios.post(`/admin/products/add?cat_id=${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'   
            }
        })
        .then(function(response) {
            document.getElementById('add-products-table').style.display = 'none';
        })
        .catch(function(error) {
            console.error('Error adding product:', error);
        });
    });
    

})();
// Create Product

// Button Color Change
(function (){
    const buttons = document.querySelectorAll('#btn-action');

    buttons.forEach(button => {
        if(button.innerHTML === 'Delete'){
            button.style.backgroundColor = 'red';
        }else{
            button.style.backgroundColor = 'green';
        }
    });

})();
// Button Color Change


(function (){
    const buttons = document.querySelectorAll('#btn-action');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if(button.innerHTML === 'Delete'){
                button.innerHTML = 'Undo';
                button.style.backgroundColor = 'green';
            }else{
                button.innerHTML = 'Delete';
                button.style.backgroundColor = 'red';
            }
            const result = button.getAttribute('data-id');

            axios.get(`/admin/product/delete?id=${result}`)
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) =>{
                console.log(`error while axios delete get request ${err.message}`);
            });

        });
    });


})();





// async function sendDeleteRequest(element){
//     let id = element.getAttribute('category-id');

//     await axios.get(`/admin/categories/delete?id=${id}`)
//             .then(response => {
//                 // console.log(response.data);
//             })
//             .catch(error => {
//                 console.error(`Axios delete request error ${error.message}`);
//             });

// }