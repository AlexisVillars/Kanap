document.addEventListener("DOMContentLoaded", function (event) {


    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        //tableau des produits à partir de l'API
        let ApiArray = [];

        // Stockage des informations de notre localstorage.
        let localStorageArray = getLocalStorageProduct();

        //on push les produits dans API array
        for (let i = 0; i < localStorageArray.length; i++) {
            ApiArray.push(await GetApi(localStorageArray[i]));
        }

        //concaténation de toutes les infos des produits
        let AllProducts = ConcatArray(localStorageArray, ApiArray);

        //affichage des produits
        DisplayProduct(AllProducts);

        //affichage du prix des produits
        DisplayTotalPrice(AllProducts);

        //écoute pour la modification du panier
        Listen(AllProducts);

        //validation du formulaire et envoi sur la page de confirmation de la commande 
        Confirmation();

    }

    main();


    //récupéraation des produits du localStorage
    function getLocalStorageProduct() {

        let getLocalStorage = [];
        for (let i = 0; i < localStorage.length; i++) {
            getLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

        }
        return getLocalStorage;

    }

    //reécupération des infos du produit depuis l'API
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

    //création d'un nouvel objet à partir du tableau localstorage et API
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
                `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.colors}</p>
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

        //calcul qty et prix
        for (product of AllProducts) {
            totalPrice += parseInt(product.qty * product.price);
            totalQty += parseInt(product.qty);
        }

        //récupération des parents
        const DtotalQty = document.getElementById("totalQuantity");
        const DtotalPrice = document.getElementById("totalPrice");

        //affichage du prix
        DtotalQty.innerText = totalQty;
        DtotalPrice.innerText = totalPrice;
    }


    function Listen(AllProducts) {
        // Fonction si on veux supprimer un éléments de la liste.
        ecoutedeleteProduct(AllProducts);
        ecoutechangeqty(AllProducts);

    }

    //
    function ecoutedeleteProduct(AllProducts) {
        //définition du btn supression
        let deleteLink = document.querySelectorAll(".deleteItem");

        deleteLink.forEach(function (input) {
            input.addEventListener("click", function () {
                const Name = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > h2").innerText;

                const color = input
                    .closest("div.cart__item__content")
                    .querySelector("div.cart__item__content__description > p").innerText;

                const productName = Name + " " + color;

                let localstorageKey = JSON.parse(localStorage.getItem(productName));

                localStorage.removeItem(productName);

                input.closest("div.cart__item__content").parentNode.remove();

                const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                AllProducts = AllProducts.filter(e => e !== result);

                ecoutechangeqty(AllProducts);

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

                    const Name = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > h2").innerText;

                    const color = input
                        .closest("div.cart__item__content")
                        .querySelector("div.cart__item__content__description > p").innerText;

                    const productName = Name + " " + color;

                    let localstorageKey = JSON.parse(localStorage.getItem(productName));

                    localstorageKey.qty = quantity;

                    localStorage.setItem(productName, JSON.stringify(localstorageKey));

                    const result = AllProducts.find(AllProduct => AllProduct.name === localstorageKey.name && AllProduct.colors === localstorageKey.color);

                    result.qty = quantity;

                    DisplayTotalPrice(AllProducts);

                } else {
                    alert("choisir un produit entre 1 et 100")
                }

            })

        });

    }


    // ------------------------------Validation du formulaire de commande ---------------------------------------//

    // conditions regex et verification
    function validationRegex(form) {
        // conditions regex string email et adresse
        const stringRegex = /^[a-zA-Z-]+$/;
        const emailRegex = /^\w+([.-]?\w+)@\w+([.-]?\w+).(.\w{2,3})+$/;
        const addressRegex = /^[a-zA-Z0-9\s,.'-]{3,}$/;
        let control = true;
        // si la valeur du form n'est pas identique : message d'erreur
        if (!form.firstName.value.match(stringRegex)) {
            document.getElementById("firstNameErrorMsg").innerText = "Mauvais prénom";
            control = false;
            // sinon aucun message
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "";
        }
        if (!form.lastName.value.match(stringRegex)) {
            document.getElementById("lastNameErrorMsg").innerText = "Mauvais nom";
            control = false;
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "";
        }
        if (!form.address.value.match(addressRegex)) {
            document.getElementById("addressErrorMsg").innerText = "Mauvaise adresse";
            control = false;
        } else {
            document.getElementById("addressErrorMsg").innerText = "";
        }
        if (!form.city.value.match(stringRegex)) {
            document.getElementById("cityErrorMsg").innerText = "Mauvaise ville";
            control = false;
        } else {
            document.getElementById("cityErrorMsg").innerText = "";
        }
        if (!form.email.value.match(emailRegex)) {
            document.getElementById("emailErrorMsg").innerText = "Mauvais email";
            control = false;
        } else {
            document.getElementById("emailErrorMsg").innerText = "";
        }
        if (control) {
            return true;
        } else {
            return false;
        }
    }


    function Confirmation() {
        let orderButton = document.getElementById("order");
        orderButton.addEventListener("click", function (event) {
            let form = document.querySelector(".cart__order__form");
            event.preventDefault();
            console.log(form)
            if (localStorage.length !== 0) {
                if (validationRegex(form)) {

                    let formInfo = {
                        firstName: form.firstName.value,
                        lastName: form.lastName.value,
                        address: form.address.value,
                        city: form.city.value,
                        email: form.email.value
                    }

                    let products = [];

                    for (let i = 0; i < localStorage.length; i++) {
                        products[i] = JSON.parse(localStorage.getItem(localStorage.key(i))).id;
                    }



                    const order = {
                        contact: formInfo,
                        products: products,

                    };

                    const options = fetch("http://localhost:3000/api/products/order", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(order)
                    })

                    options.then(async function (response) {
                        let infoCommande = await response.json();
                        window.location.href = "confirmation.html?id=" + infoCommande.orderId;
                    })


                } else {
                    event.preventDefault();
                    alert("Les champs remplis ne sont pas bons.");
                }


            } else {
                event.preventDefault();
                alert("votre panier est vide.");
            }
        })

    }

});
