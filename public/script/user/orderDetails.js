const cancel = document.getElementById("order-cancel");
if (cancel) {
  cancel.addEventListener("click", function () {
    const popupContainer = document.getElementById("popupContainer");
    const yesBtn = document.getElementById("yesBtn-cancel");
    const noBtn = document.getElementById("noBtn-cancel");
    const statusBar = document.getElementById("progress-bar-div");

    popupContainer.classList.remove("hidden");

    yesBtn.addEventListener("click", () => {
      const id = cancel.value;

      if (!id) return console.log("Something went wrong");

      axios
        .get(`/api/orders/cancel?id=${id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.orderStatus === "cancelled") {
            updateStatusBar("cancelled");
          }
        })
        .catch((err) => {
          console.log(
            `error while axios order cancel request : ${err.message}`
          );
        });

      statusBar.style.width = "0%";
      popupContainer.classList.add("hidden");
      cancel.style.display = "none";
    });

    noBtn.addEventListener("click", () => {
      popupContainer.classList.add("hidden");
    });
  });
}

const returnBtn = document.getElementById("order-return");
if (returnBtn) {
  returnBtn.addEventListener("click", function () {
    const popupContainer = document.getElementById("popupReturnContainer");
    const yesBtn = document.getElementById("yesBtn-return");
    const noBtn = document.getElementById("noBtn-return");
    const statusBar = document.getElementById("progress-bar-div");
    
    popupContainer.classList.remove("hidden");
    
    yesBtn.addEventListener("click", () => {
      
      const reasonSelect = document.getElementById('reasonSelect').value;
      const noteInput = document.getElementById('noteInput').value;

      const id = returnBtn.value;

      if (!id) return console.log("Something went wrong");
      
      if (!reasonSelect) return alert('Provide any reason');

      const data = {
        id: id,
        reason: reasonSelect,
      }

      if(noteInput.trim()){
        data.note = noteInput.trim()
      }

      axios
        .post(`/api/orders/return`, data)
        .then((res) => {
          
          if (!res.data.status){
            return console.log('failed');
          };
          console.log('success');
          const msg = 'Return Requested';
          updateStatusBar(msg);
          statusBar.style.width = "50%";
          popupContainer.classList.add("hidden");
          returnBtn.style.display = "none";
        })
        .catch((err) => {
          console.log(
            `error while axios order return request : ${err.message}`
          );
        });

    });

    noBtn.addEventListener("click", () => {
      popupContainer.classList.add("hidden");
    });
  });
}


function updateStatusBar(status) {
  document.getElementById("status-bar").innerHTML = status;
}
