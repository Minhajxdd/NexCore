// Sort by date
document.getElementById('sort-date').addEventListener('change', function(){
    console.log(this.value);
    // Custom Drop Toggle Date
    if(this.value === 'Custom'){
        document.getElementById('custom-date-div').style.display = 'flex';
    }else{
        document.getElementById('custom-date-div').style.display = 'none';
    }

    const data = {
        by: this.value,
    }

    axios.post(`/admin/api/sales-report`, data)
    .then(function(res){
        
        if(!res.data.status){
            return console.log('failed');
        }

        injectData(res.data.data);
    })
    .catch(function(err){
        console.log(`error while fetching api data : ${err.message}`);
    })

});

// Sort by date


// Reset Form
window.onload = function() {
    document.getElementById('sort-date').value = 'All';
}
// Reset Form


// Function to inject data in to body
function injectData(value){
    
        console.log(value[0]);
    // const body = document.getElementById('table-body');
    // value.forEach(value => {
    //     const tr = document.createElement('tr');

    //     tr.innerHTML = `
    //     <td>1</td>
    //     <td>
    //     ${value.orderid}
    //     </td>
    //     <td> ${value.name} </td>
    //     <td> ${value.date} </td>
    //     <td> ${value.coupon} </td>
    //     <td> ${value.offer} </td>
    //     <td> ${value.total} </td>
    //     <td> ${value.payment_method} </td>
    //     `
    //     body.appendChild(tr);

    // });
}
// Function to inject data in to body














const value = [
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    },
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    },
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    },
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    },
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    },
    {
        orderid:  "#666c35623113bbe4d7956ee4",
        name: 'Randome Name',
        date: '14/ 6/ 2024',
        coupon: "0.00",
        offer: "0.00",
        total: "9,999",
        payment_method: 'Razor Pay'
    }
]

injectData(value);