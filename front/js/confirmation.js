document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------------------fonction d'affichage du numéro de commande -------------------------------//
    function displayOrderId() {
        //on récupère l'url de la page
        const url = new URL(window.location.href);
        //on récupère l'id dans l'url
        let NumeroCommande = url.searchParams.get("id");
        //on affiche le numéro de commande
        document.getElementById("orderId").innerText = NumeroCommande
    }
    // on vide le localstorage
    localStorage.clear();
    displayOrderId()

})