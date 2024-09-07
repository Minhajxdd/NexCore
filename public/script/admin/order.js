(function() {
    const parentElement = document.getElementById('table-body'); 

    parentElement.addEventListener('change', function(event) {
        // Check if the target is the dropdown
        if (event.target.classList.contains('order-status-dropdown')) {
            const dropDown = event.target;

            // Prepare data for the Axios request
            const data = {
                status: dropDown.value,
                id: dropDown.getAttribute('data-id')
            };

            // Send Axios POST request to update status
            axios.post(`/admin/api/orders/status-update`, data)
            .then(function(res) {
                // On successful status update, update the dropdown options
                updateOptions(dropDown, dropDown.value);
            })
            .catch(function(err) {
                console.log(`Error while sending axios request for status update: ${err.message}`);
            });
        }
    });

    function updateOptions(dropDown, selectedStatus) {
        dropDown.innerHTML = '';

        let optionList = [];

        if (selectedStatus === 'pending') {
            optionList = [
                {value: 'pending', text: 'pending', selected: true},
                {value: 'cancelled', text: 'cancelled'},
                {value: 'processed', text: 'processed'},
                {value: 'shipped', text: 'shipped'},
                {value: 'delivered', text: 'delivered'}
            ];
        } else if (selectedStatus === 'processed') {
            optionList = [
                {value: 'cancelled', text: 'cancelled'},
                {value: 'processed', text: 'processed', selected: true},
                {value: 'shipped', text: 'shipped'},
                {value: 'delivered', text: 'delivered'}
            ];
        } else if (selectedStatus === 'shipped') {
            optionList = [
                {value: 'cancelled', text: 'cancelled'},
                {value: 'shipped', text: 'shipped', selected: true},
                {value: 'delivered', text: 'delivered'}
            ];
        } else if (selectedStatus === 'delivered') {
            optionList = [
                {value: 'delivered', text: 'delivered', selected: true}
            ];
        } else if (selectedStatus === 'cancelled') {
            optionList = [
                {value: 'cancelled', text: 'cancelled', selected: true}
            ];
        }

        optionList.forEach(function(optionData) {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.text;
            if (optionData.selected) {
                option.selected = true;
            }
            dropDown.appendChild(option);
        });
    }
})();
