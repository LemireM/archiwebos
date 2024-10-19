import { getCategories, getWorks, deleteWork, addWork, getUser } from "./api.js"
import Category from "./components/category.js"
import Work from "./components/work.js"
import SelectCategories from "./components/select-categories.js"

let works = []
let categories = []

const addWorkToGallery = (work, gallery, isModal) => {
    const w = new Work(work, onDeleteWork)
    const li = document.createElement('li')
    const figure = isModal ? w.renderModal() : w.render()
    li.appendChild(figure)
    li.dataset['workId'] = work.id

    gallery.appendChild(li)
}

const displayWorks = (works, isModal) => {
    let gallery = document.querySelector('.gallery')
    if(isModal){
        gallery = document.querySelector('.gallery-modal')
    }
    gallery.innerHTML = ''
    works.forEach(work => {
        addWorkToGallery(work, gallery, isModal)
    })
}

const addWorkToGalleries = (work) => {
    const gallery = document.querySelector('.gallery')
    const galleryModal = document.querySelector('.gallery-modal')

    addWorkToGallery(work, gallery, false) // Gallerie de la page d'accueil
    addWorkToGallery(work, galleryModal, true) // Gallerie de la modal
}

const displayCategories = () => {
    const categoriesContainer = document.querySelector('.categories')
    const allCategories = [{id: -1, name: 'Tous'}].concat(categories)
    allCategories.forEach(category => {
        const c = new Category(category)
        const element = c.render()
        if(category.id === -1){
            element.classList.add("active")
        }

        element.addEventListener('click', (e) => {
            e.preventDefault()
            const categoryId = parseInt(e.currentTarget.dataset.id)
            const prevActiveCategory = document.querySelector('.categories li.active')
            if(prevActiveCategory){
                prevActiveCategory.classList.remove('active')
            }
            e.currentTarget.classList.add("active")
            let filteredWorks = works
            if(categoryId !== -1) {
                filteredWorks = works.filter(w => parseInt(w.categoryId) === categoryId)
            }
            displayWorks(filteredWorks, false)
        })

        categoriesContainer.appendChild(element)
    });
}

const displayAdminActions = () => {
    const editLink = document.querySelector('#edit-link')
    const modal = document.querySelector('.modal')
    const modalBg = document.querySelector('.modal-bg')

    displayWorks(works, true)
    const selectCategories = new SelectCategories(categories)
    selectCategories.render()
    onAddWork()

    const showGallery = document.querySelector('#show-gallery')
    const showForm = document.querySelector('#show-form')
    const modalContainer = document.querySelector('.modal-container')
    const closeModal = document.querySelectorAll('.fa-x')

    showGallery.addEventListener('click', () => {
        modalContainer.classList.remove('show-form')
    })

    showForm.addEventListener('click', () => {
        modalContainer.classList.add('show-form')
    })

    closeModal.forEach((e) => e.addEventListener('click', () => {
        modal.style.display = 'none'
    }))

    modalBg.addEventListener('click', () => {
        modal.style.display = 'none'
    })

    editLink.addEventListener('click', () => {
        modal.style.display = 'block'
    })


}

const init = async () => {
    categories = await getCategories()
    works = await getWorks()

    displayCategories()
    displayWorks(works, false)
    displayAdminActions()
    editionModeIfLoggedIn()

}

const onDeleteWork = async (idWork) => {
    const res = await deleteWork(idWork)
    if(res === 204){
        const workIds = document.querySelectorAll(`[data-work-id="${idWork}"]`)
        workIds.forEach(e => e.remove())
    }
}

document.getElementById('image').addEventListener('click', function() {
  document.getElementById('image-upload').click();
});

const onAddWork = () => {

    const form = document.getElementById('add-work-form');
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault()
            const formData = new FormData();
            formData.append('image', document.getElementById('image-upload').files[0])
            formData.append('title', event.target.title.value)
            formData.append('category', event.target['select-categories'].value)

            try {
                const work = await addWork(formData);
                alert('Photo ajoutée avec succès!');
                form.reset();
                addWorkToGalleries(work)
                closeModal();
              } catch (error) {
                alert('Erreur lors de l\'ajout de la photo');
              }
        });
    }
  };

  const logout = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }

  const editionModeIfLoggedIn = async () => {
    const editLink = document.querySelector('#edit-link')
    const authLink = document.querySelector('#auth-link')
    const body = document.querySelector('body')
    body.classList.remove('edition')
    const resp = await getUser()
    if(resp.status === 401){
        //window.location.href = '/login.html'
        return
    }
    // On sait qu'on est connecté avec un token valide
    const div = document.getElementById('edition-mode')
    if (div) {
        div.style.display = 'flex'
        body.classList.add('edition')

    }
    if(editLink){
        editLink.style.display = 'block'
    }

    if(authLink){
        authLink.innerText = 'logout'
        authLink.addEventListener('click', e => {
            e.preventDefault()
            logout()

        })
    }
  }

  // Fonction pour fermer la modale
  const closeModal = () => {
  const modal = document.getElementById('modal-id'); // Remplacez 'modal-id' par l'ID de votre modale
  if (modal) {
      modal.style.display = 'none';
    }
  };

  const fileInput = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');
  const addButton = document.getElementById('image');

  fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];

      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function(e) {
              imagePreview.src = e.target.result;
              imagePreview.style.display = 'block'; // Afficher l'image une fois chargée
          }

          reader.readAsDataURL(file);
      } else {
          // Cacher l'image si le fichier sélectionné n'est pas une image
          imagePreview.style.display = 'none';
      }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('add-work-form');
    const submitButton = document.getElementById('submit-button');
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const imageUploadInput = document.getElementById('image-upload');

    // Fonction pour vérifier si tous les champs sont remplis
    function checkFormValidity() {
        const isValid = titleInput.value.trim() !== '' &&
                        categorySelect.value !== '' &&
                        imageUploadInput.files.length > 0;

        // Met à jour l'état du bouton
        if (isValid) {
            submitButton.classList.remove('button-disabled');
            submitButton.disabled = false;
            submitButton.style.backgroundColor = '#1D6154';
            submitButton.style.cursor = 'pointer'; // Changer le curseur
        } else {
            submitButton.classList.add('button-disabled');
            submitButton.disabled = true;
            submitButton.style.backgroundColor = '#a7a7a7';
            submitButton.style.cursor = 'not-allowed'; // Changer le curseur
        }
    }

    // Ajout d'événements pour surveiller les changements dans les champs
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);
    imageUploadInput.addEventListener('change', checkFormValidity);

    // Vérification initiale lors du chargement de la page
    checkFormValidity();
  });



document.addEventListener('DOMContentLoaded', () => {
    init()
})
