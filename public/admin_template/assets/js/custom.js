// Select all elements with the class 'btn-action'
const buttons = document.querySelectorAll('#btn-action');

buttons.forEach(button => {
    if(button.innerHTML === 'Block') {
        button.style.backgroundColor = 'red';
    } else if(button.innerHTML === 'Un Block') {
        button.style.backgroundColor = 'green';
    }
});


// Toggle for form 
    const btn = document.getElementById('new-user-btn');
    const cancel = document.getElementById('form-cancel');
    const form = document.querySelector('.form-table');

    btn.addEventListener('click', () => {
        form.style.display = 'block';
    })

    cancel.addEventListener('click', () => {
        form.style.display = 'none';
    })
