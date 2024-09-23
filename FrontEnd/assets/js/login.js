import {getToken} from './api.js'

const form = document.querySelector('form')

const displayError = (msg) => {
    const error = document.querySelector('#login .error')
    if(error){
        error.innerText = msg
    }
}

form.addEventListener('submit', async (e) => {

    e.preventDefault()

    const email = e.target.email.value
    const password = e.target.password.value

    try {
        const data = await getToken(email, password)
        if(data.token){
            localStorage.setItem('token', data.token)
            window.location.href = 'index.html';
            return
        }
        displayError('Veuillez vérifier vos identifiants')
    } catch(e){
        displayError('Connexion API impossible')
    }

})

