document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {
        //on fait appel à une fonction qui va nous retourné nos produits de l'API
        let products = await GetProducts();
        console.log(products);
        for (let article of products) {
            // affichage des articles dans products.
            displayProducts(article);
        }

    }

    main();


    //-------------------Fonction d'intérrogation de notre api avec product-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProducts() {
        return fetch("http://localhost:3000/api/products/")
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //-------------------Fonction d'affichage du produit-------------------//
    //---------------------------------------------------------------------//
    function displayProducts(article) {

        // Récupére le parent ou on veux push
        const Dom = document.getElementById("items");

        Dom.insertAdjacentHTML(
            "beforeend",
            `<a href="./product.html?id=${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
                </article>
            </a>`
        );

    }

});