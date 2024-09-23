const getWorks = () => {
    return fetch('http://localhost:5678/api/works')
    .then(response => response.json())
}

const getCategories = () => {
    return fetch('http://localhost:5678/api/categories')
    .then(response => response.json())
}

const getToken = (email, password) => {
    return fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then(response => response.json())
}

const deleteWork = (id) => {
    return fetch('http://localhost:5678/api/works/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.status)
}

const addWork = (formData) => {
  return fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: formData
  })
  .then(response => response.json())
}

const getUser = () => {
    return fetch('http://localhost:5678/api/users/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    })
  }


export {getCategories, getWorks, getToken, deleteWork, addWork, getUser}
