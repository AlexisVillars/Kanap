document.addEventListener("DOMContentLoaded", function (event) {

    function displayOrderId() {
        const url = new URL(window.location.href);
        let NumeroCommande = url.searchParams.get("id");
        document.getElementById("orderId").innerText = NumeroCommande
    }

    localStorage.clear();
    displayOrderId()

})