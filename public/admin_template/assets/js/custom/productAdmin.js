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

        // document.getElementById('imageUploadForm').addEventListener('submit', function(e) {
        //     e.preventDefault();

        //     const formData = new FormData();
        //     document.querySelectorAll('.imageInput').forEach((input, index) => {
        //         if (input.files[0]) {
        //             formData.append(`image${index + 1}`, input.files[0]);
        //         }
        //     });

        //     axios.post('/upload', formData)
        //         .then(response => {
        //             console.log(response.data);
        //         })
        //         .catch(error => {
        //             console.error('Error:', error);
        //         });
        // });
})();
// Cropperjs

// Create Product
(function(){
    // document.getElementById('product-add-form').addEventListener('submit' ,(event) => {
    //     // event.preventDefault();
    //     alert('hello')
    //     const form = event.target;
    //     const formData = new FormData(form); 

    //     const data = {};
    //     formData.forEach((value, key) => {
    //         data[key] = value;
    //     });

    //     axios.post('/admin/products/add', data)
    //     .then((res) => {
            
    //     })
    //     .catch(function (error) {
    //         console.log(`Error message axios edit category post ${error.message}`);
    //     });

    //     document.getElementById('edit-category-form').style.display = 'none';

    // });    
    
    document.getElementById('product-add-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        let formData = new FormData(this);

        // Append images as an array
        let imageInputs = document.querySelectorAll('input[type="file"]');
        imageInputs.forEach((input, index) => {
            if (input.files[0]) {
                formData.append('images[]', input.files[0]);
            }
        });


        
        // Send the POST request using Axios
        axios.post('/admin/products/add', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(function(response) {
            console.log('Product added successfully:', response.data);
        })
        .catch(function(error) {
            console.error('Error adding product:', error);
        });
    });
    

})();
