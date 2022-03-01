document.addEventListener("DOMContentLoaded", function (event) {

    //-------------------fonction principale-------------------//
    //--------------------------------------------------------//
    async function main() {

        // On Récupére l'Url.
        const url = new URL(window.location.href);
        // productId = à Id récupérer en paramètre de notre Url
        let productId = url.searchParams.get("id");

        // On Appel notre fonction qui va nous retourné notre produit de l'API
        let product = await GetProduct(productId);

        // Fonction d'affichage du produit.
        DisplayProduct(product);

        // Fonction d'ecoute du btn ajouter au panier.
        BtnClick(product);
    }

    main();



    //-------------------Fonction d'intérrogation de notre api avec productId-------------------//
    //-----------------------------------------------------------------------------------------//
    async function GetProduct(productId) {
        return fetch("http://localhost:3000/api/products/" + productId)
            .then(function (response) {
                //console.log(response);
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

    function DisplayProduct(product) {

        // Récupération des parents.
        const title = document.getElementsByTagName("title")[0];
        const parentImg = document.getElementsByClassName("item__img");
        const parentName = document.getElementById("title");
        const parentPrice = document.getElementById("price");
        const parentDescription = document.getElementById("description");
        const parentQuantity = document.getElementById("quantity");

        // Création de notre balise image avec les attributs.
        const productImg = document.createElement("img");
        productImg.setAttribute("src", product.imageUrl);
        productImg.setAttribute("alt", product.altTxt);
        // Push après notre balise à la fin de la liste.
        parentImg[0].appendChild(productImg);

        // On change les différentes valeurs à la volée.
        title.innerHTML = product.name;
        parentName.innerText = product.name;
        parentPrice.innerText = product.price;
        parentDescription.innerText = product.description;
        parentQuantity.setAttribute("min", 0);

        //* Création des choix d'objectifs-------------------------------------------------
        let SelecteurCouleur = document.getElementById("colors")
        let options = product.colors
        options.forEach(element => {
            SelecteurCouleur.appendChild(new Option(element, element));
        });

    }

    //-------------------Initialisation Class Produit-------------------//
    //---------------------------------------------------------------------//
    class ProductClass {
        constructor(id, color, qty, name) {
            this.id = id;
            this.color = color;
            this.qty = qty;
            this.name = name
        }
    }


    // --------------------  ajout au panier --------------------------//

    async function BtnClick(product) {
        // Initialisation des variables.
        let colorChoosen = "";
        let qty = "";
        let qtyChoosen = "";
        let BtnPanier = document.getElementById("addToCart");



        // Sélection des couleurs avec sont comportement au change.
        let colorSelection = document.getElementById("colors");
        colorSelection.addEventListener("change", function (e) {
            colorChoosen = e.target.value;
        });

        let qtySelection = document.getElementById("quantity");
        qtySelection.addEventListener("change", function (e) {
            qty = e.target.value;
        });

        BtnPanier.addEventListener("click", function () {

            // Initialisation variable
            let ProductLocalStorage = [];
            let oldQty = 0;


            for (let i = 0; i < localStorage.length; i++) {
                ProductLocalStorage[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));

                if (product._id === ProductLocalStorage[i].id && ProductLocalStorage[i].color === colorChoosen) {
                    oldQty = ProductLocalStorage[i].qty;
                }

            }


            qtyChoosen = parseInt(oldQty) + parseInt(qty);

            let productChoosen = new ProductClass(
                product._id,
                colorChoosen,
                qtyChoosen,
                product.name
            );


            // On envoie notre nouveau product au localstorage.
            //Conditionnel si la couleur choisie et différente que rien et que la quantité choisie est supérieure ou = à 1, 
            //et que la quantité sélectionnée est inférieure ou égale à 100. 

            if (colorChoosen != "" && qtyChoosen >= 1 && qtyChoosen <= 100) {

                localStorage.setItem(
                    product.name + " " + colorChoosen,
                    JSON.stringify(productChoosen)
                );
            } else {
                alert("Veuillez renseigner une couleur et une quantité entre 1 et 100.")
            }


        })
    }
});


