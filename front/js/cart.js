document.addEventListener("DOMContentLoaded", function (even) {

    async function main() {

        let ApiArray = [];

        // Stockage des informations de notre localstorage.
        let localStorageArray = getLocalStorageProduct();

        // Appel de nos fonctions.

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        ConcatArray(localStorageArray, ApiArray);

        listen();

    }
    main()





    function getLocalStorageProduct() {

        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    async function GetApi(localStorageArray) {

        return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    function ConcatArray(localStorageArray, ApiArray) {

        let AllProducts = [];

        for (let i = 0; i < localStorageArray.length; i++) {

            let ObjectProduct = {
                altTxt: ApiArray[i].altTxt,
                colors: localStorageArray[i].color,
                description: ApiArray[i].description,
                imageUrl: ApiArray[i].imageUrl,
                name: ApiArray[i].name,
                price: ApiArray[i].price,
                _id: localStorageArray[i].id,
                qty: localStorageArray[i].qty
            }

            displayCart(ObjectProduct);

            AllProducts.push(ObjectProduct);

        }


        displayTotalPrice(AllProducts);


    }

    //-------------------Fonction Affichage de nos produits-------------------//
    //-----------------------------------------------------------------------//
    function displayCart(ObjectProduct) {

        // On stock notre balise Html.
        const domCreation = document.getElementById("cart__items");
        // On push nos nouvels informations dans notre Html.
        domCreation.insertAdjacentHTML(
            "beforeend",
            `<article class="cart__item" data-id="${ObjectProduct._id}">
                            <div class="cart__item__img">
                                <img src="${ObjectProduct.imageUrl}" alt="${ObjectProduct.altTxt}">
                            </div>
                            <div class="cart__item__content">
                                <div class="cart__item__content__titlePrice">
                                    <h2>${ObjectProduct.name} ${ObjectProduct.colors}</h2>
                                    <p>${ObjectProduct.price}€</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${ObjectProduct.qty}">
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`
        );

    }

    //-------------------Fonction d'affichage du calcul quantité + le prix-------------------//
    //--------------------------------------------------------------------------------------//
    function displayTotalPrice(AllProducts) {

        // de base 2 variable a 0
        let totalPrice = 0;
        let totalQty = 0;

        // Boucle for of pour pouvoir récupérer nos information dans 1 product.
        for (product of AllProducts) {

            // On multiplie la quantité du produit fois le prix de notre produit.
            totalPrice += parseInt(product.qty * product.price, 10);

            // On ajoute la quantité de notre produit à 0.
            totalQty += parseInt(product.qty, 10);
        }

        // On récupére nos parents ou on va injecter nos nouvels valeurs.
        const DTotalQty = document.getElementById("totalQuantity");
        const DTotalPrice = document.getElementById("totalPrice");

        DTotalPrice.innerText = totalPrice;
        DTotalQty.innerText = totalQty;

    }


    function listen() {

        //fonction d'écoute si on veux supprimer un élément
        ecoutedeleteProduct();
    }

    //-----------------------------------------   bouton supprimer   -----------------------------------//


    function ecoutedeleteProduct() {
        let deleteButton = document.querySelectorAll(".deleteItem");

        deleteButton.forEach(function (input) {
            input.addEventListener("click", function () {
                const productname = input;
                console.log(productname);
                storage.removeItem(product.name + " " + colorChoosen, JSON.stringify(productChoosen))

            })
        })
    }


});
