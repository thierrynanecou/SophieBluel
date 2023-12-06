
// URL de l'API
const apiUrl = "http://localhost:5678/api/";
// Sélection de l'élément HTML avec la classe "gallery"
const gallery = document.querySelector(".gallery");
// Récupération du jeton d'authentification depuis le stockage local
const token = localStorage.getItem("token");

/* Fonction asynchrone pour créer la galerie */
async function createGallery() {
  const req = await fetch(apiUrl + "works");
  const data = await req.json();

  // Parcours des données pour créer les éléments de la galerie
  for (let work of data) {
    const figureBox = document.createElement("figure");
    const image = document.createElement("img");
    const descriptionFigure = document.createElement("figcaption");

    // Attribution de classes et d'attributs
    figureBox.className = "galleryFigure";
    figureBox.dataset.id = work.id;

    image.src = work.imageUrl;
    image.alt = work.title;

    descriptionFigure.textContent = work.title;

    figureBox.setAttribute("data-category", work.category.name);
    figureBox.appendChild(image);
    figureBox.appendChild(descriptionFigure);

    // Ajout de la figure à la galerie
    gallery.appendChild(figureBox);
  }
}

/* Fonction asynchrone pour afficher les catégories */
async function showCategories() {
  // Sélection de l'élément HTML avec la classe "buttonFiltre"
  const categories = document.querySelector(".buttonFiltre");
  // Sélection de l'élément HTML avec l'id "categoriesModal2"
  const select = document.getElementById("categoriesModal2");

  // Création d'un élément pour afficher toutes les catégories
  const div = document.createElement("div");
  div.textContent = "Tous";
  div.className = "buttonItem";
  div.addEventListener("click", () => {
    // Afficher tous les éléments
    const figures = document.getElementsByClassName("galleryFigure");
    for (let figure of figures) {
      figure.style.display = "block";
    }
  });
  categories.appendChild(div);

  // Requête pour obtenir les catégories depuis l'API
  const req = await fetch(apiUrl + "categories");
  const response = await req.json();

  // Parcours des catégories
  response.forEach((categorie) => {
    // Création d'éléments pour chaque catégorie
    const div = document.createElement("div");
    div.textContent = categorie.name;
    div.className = "buttonItem";
    div.addEventListener("click", () => {
      // Filtrer et afficher les éléments en fonction de la catégorie sélectionnée
      const figures = document.getElementsByClassName("galleryFigure");
      for (let figure of figures) {
        const category = figure.getAttribute("data-category");
        if (category == categorie.name) {
          figure.style.display = "block";
        } else {
          figure.style.display = "none";
        }
      }
    });
    categories.appendChild(div);

    // Ajouter les catégories comme options pour le modal2
    const option = document.createElement("option");
    option.value = categorie.id;
    option.textContent = categorie.name;
    select.appendChild(option);
  });
}
async function deleteWork (id) {
   await fetch ("http://localhost:5678/api/works/"+id,{
    method : "DELETE", 
    headers : { 
      "Content-Type" : "application/json",
      Authorization : "Bearer " + token ,}
  })
  .then ((response) => {
     if (response.ok) {
      console.log("image bien supprimée");
      figureToDelete.style.display = "none";
     }
     })
     .catch((error)=>console.log(error));
}

/* Fonction pour activer le mode édition */
function modeEdition() {
  // Sélection des éléments nécessaires pour le mode édition
  const categories = document.querySelector(".buttonFiltre");
  const barreEdition = document.querySelector(".ligne-noire");
  const btnModifier = document.querySelector(".modification");
  const btnLogin = document.querySelector(".login");

  // Vérification de la présence du jeton d'authentification
  if (token != null) {
    categories.style.display = "none";
    barreEdition.style.display = "flex";
    btnModifier.style.display = "inline-block";
    btnLogin.textContent = "logout";
    

    if (btnLogin.textContent = "logout"){
      btnLogin.addEventListener("click", function (){
        localStorage.removeItem("token");
        barreEdition.style.display = "none";
        
        btnLogin.textContent = "login";
        window.location.href = 'index.html';
      })
    }
  }
}



// Sélection des éléments nécessaires pour la modification
const btnModifier = document.querySelector(".modification");
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
const arrowLeft = document.querySelector(".fa-arrow-left");
const monModal = document.getElementById("monModal");
const btnFermer = document.querySelectorAll(".fermer");
const addImgInput = document.getElementById("add-img");

// Écouteur d'événement pour le bouton "Modifier"
btnModifier.addEventListener("click", function () {
  // Afficher le modal1 et le modal
  document.querySelector(".modal1").style.display = "block";
  monModal.style.display = "block";
  const images = gallery.querySelectorAll("figure");
  const modalContent = monModal.querySelector(".modal-contenu");
  modalContent.innerHTML = "";

  // Copie des figures dans le modal avec un bouton de suppression
  images.forEach((figure) => {
    const figureCopy = figure.cloneNode(true);
    const deleteItem = document.createElement("i");
    deleteItem.className = "fa-regular fa-trash-can deleteIcon";
    figureCopy.appendChild(deleteItem);
    // Ajoutez un écouteur d'événements pour la suppression
    deleteItem.addEventListener("click", function (e) {
     e.preventDefault();
     idWork = figureCopy.dataset.id;
    deleteWork(idWork);  
      //figureCopy.remove();
    });

    // Ajoutez la figure copiée au modal
    modalContent.appendChild(figureCopy);
  });
});

// Écouteur d'événement pour le bouton "Ajouter une image"
addImgInput.addEventListener("click", function () {
  modal1.style.display = "none";
  modal2.style.display = "block";
});

// Écouteurs d'événement pour les boutons de fermeture des modaux
btnFermer[0].addEventListener("click", function () {
  document.querySelector(".modal1").style.display = "none";
});

btnFermer[1].addEventListener("click", function () {
  document.querySelector(".modal2").style.display = "none";
});

// Écouteur d'événement pour le bouton de retour (flèche gauche)
arrowLeft.addEventListener("click", function () {
  modal2.style.display = "none";
  modal1.style.display = "block";
});

// Écouteur d'événement pour fermer le modal en cliquant en dehors de celui-ci
window.addEventListener("click", function (event) {
  if (event.target === monModal) {
    monModal.classList.remove("modal-avec-background");
    monModal.style.display = "none";
  }
});

// Fonction pour ajouter une image
function addImage(file, imageTitle, category) {
  // Sélection des éléments nécessaires
  const title = document.getElementById("nouveau-titre");
  const inputAjouterPhoto = document.getElementById("inputAjouterPhoto");
  const validImgButton = document.getElementById("valid-img");
  const selectCategories = document.getElementById("categoriesModal2");
  const ajouterPhotoLabel = document.querySelector(".ajouter-photo");

  ajouterPhotoLabel.addEventListener("click", function () {
    inputAjouterPhoto.click();
  });

  const formData = new FormData();

  let selectedFile = "";

  formData.append("image", "");
  formData.append("title", "");
  formData.append("category", "");

  // Écouteur d'événement pour le changement de fichier
  inputAjouterPhoto.addEventListener("change", function () {
    selectedFile = inputAjouterPhoto.files[0];

    if (selectedFile) {
      // Affichage de l'aperçu de l'image
      const imagePreview = document.createElement("img");
      imagePreview.src = URL.createObjectURL(selectedFile);
      imagePreview.alt = "Aperçu de l'image";
      const modalContenu = document.querySelector(".modal2 .modal-contenu");
      const rectangle = document.querySelector(
        ".modal2 .modal-contenu .rectangle"
      );
      rectangle.style.display = "none";
      modalContenu.appendChild(imagePreview);
    }
    formData.set("image", selectedFile);

    // Activation du bouton de validation si tous les champs sont remplis
    if (selectedFile && title.value !== "") {
      validImgButton.style.backgroundColor = "#1d6154";
      validImgButton.removeAttribute("disabled");
    }
  });

  // Écouteur d'événement pour la saisie du titre
  title.addEventListener("input", function (e) {
    formData.set("title", e.target.value);
    console.log(formData);
    // Activation du bouton de validation si tous les champs sont remplis
    if (selectedFile && title.value !== "") {
      validImgButton.style.backgroundColor = "#1d6154";
      validImgButton.removeAttribute("disabled");
    }
  });

  // Écouteur d'événement pour la sélection de la catégorie
  selectCategories.addEventListener("change", function (e) {
    formData.set("category", e.target.value);
    // Activation du bouton de validation si tous les champs sont remplis
    if (selectedFile && title.value !== "" && selectCategories.value !== "") {
      validImgButton.style.backgroundColor = "#1d6154";
      validImgButton.removeAttribute("disabled");
    }
  });

  

  // Écouteur d'événement pour le bouton de validation
  validImgButton.addEventListener("click", function (e) {
   e.preventDefault();
    if (selectedFile) {
      // Envoi de la requête POST pour ajouter une nouvelle image

      fetch(apiUrl + "works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        
        .catch((error) => {
          console.error("Erreur lors de l'envoi de la requête fetch :" + error);
        });
    } else {
      console.error("Aucun fichier sélectionné.");
    }
  });
}

// Fonction d'initialisation
function init() {
  createGallery();
  showCategories();
  modeEdition();
  addImage();
}

// Appel de la fonction d'initialisation
init();
