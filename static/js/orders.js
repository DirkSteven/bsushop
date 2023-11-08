const ordersIcon = document.querySelector("#ordersIcon");
const order = document.querySelector("#orderTab");
const closeOrder = document.querySelector("#closeOrder");

ordersIcon.addEventListener("click", () => {
    order.classList.add("active");
  });
  
  closeOrder.addEventListener("click", () => {
    order.classList.remove("active");
  });


  