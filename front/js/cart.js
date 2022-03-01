document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        let ApiArray = [];

        // Stockage des informations de notre localstorage.
        let localStorageArray = getLocalStorageProduct();

        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        DisplayProduct(AllProducts);

        DisplayTotalPrice(AllProducts);

        Listen(AllProducts);
    }

    main();


    function getLocalStorageProduct() {

        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    function GetApi(localStorageArray) {

        return fetch("http://localhost:3000/api/products/" + localStorageArray.id)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }

            })
            .catch(function (error) {
                console.log(error);
            })

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

            AllProducts.push(ObjectProduct);

        }
        return AllProducts;
    }

    //-------------------Fonction Affichage de nos produits-------------------//
    //-----------------------------------------------------------------------//
    function DisplayProduct(products) {

        for (product of products) {

            // On stock notre balise Html.
            const domCreation = document.getElementById("cart__items");
            // On push nos nouvels informations dans notre Html.
            domCreation.insertAdjacentHTML(
                "beforeend",
                `<article class="cart__item" data-id="${product._id}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__titlePrice">
                            <h2>${product.name} ${product.colors}</h2>
                            <p>${product.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.qty}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </article>`
            );
        }
    }

    //-------------------Fonction d'affichage du calcul quantité + le prix-------------------//
    //--------------------------------------------------------------------------------------//
    function DisplayTotalPrice(AllProducts) {
        // de base 2 variable a 0
        let totalPrice = 0;
        let totalQty = 0;

        for (product of AllProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        const DtotalQty = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");

        DtotalQty.innerText = totalQty;
        DtotalPrice.innerText = totalPrice;
    }


    function Listen(AllProducts) {
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct(AllProducts);
        ecoutechangeqty(AllProducts);

    }

    function ecoutedeleteProduct(AllProducts) {
        let deleteLink = document.querySelectorAll(".deleteItem");

        deleteLink.forEach(function (input) {
            input.addEventListener("click", function () {
                const productName = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__titlePrice > h2").innerText;

                let localstorageKey = JSON.parse(localStorage.getItem(productName));

                localStorage.removeItem(productName);

                input.closest("div.cart__item__content").parentNode.remove();

                const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                AllProducts = AllProducts.filter(e => e !== result);

                DisplayTotalPrice(AllProducts);
            })
        })

    }



    function ecoutechangeqty(AllProducts) {

        let changeselector = document.querySelectorAll(".itemQuantity");

        changeselector.forEach(input => {
            input.addEventListener("change", function (e) {

                let quantity = e.target.value;

                if (quantity >= 1 && quantity <= 100) {

                    const productName = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__titlePrice > h2").innerText;

                    let localstorageKey = JSON.parse(localStorage.getItem(productName));

                    localstorageKey.qty = quantity;

                    localStorage.setItem(productName, JSON.stringify(localstorageKey));

                    const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                    result.qty = quantity;

                    DisplayTotalPrice(AllProducts);

                } else {
                    alert("tu t'est tromper ma caille")
                }

            })

        });

    }


    function validationRegex(form) {

        const stringRegex = /^[a-zA-Z-]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const adresseRegex = /^[a-zA-Z-0-9\s,.'-_]{3,}$/;
    }

});
