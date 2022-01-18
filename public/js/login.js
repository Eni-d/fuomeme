let login = document.getElementById('login')
let loginForm = document.getElementById('loginForm')
let alertMessage = document.getElementById('alert')
let alertSuccess = document.getElementById('alertSuccess')

login.addEventListener('click', (e) => {
    e.preventDefault()
    var bodyData = {}
    let form = new FormData(loginForm)
    for (let key of form.keys()) {
        bodyData[key] = form.get(key)
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify(bodyData)
    })
    .then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data)
        if (data.message == 'User does not exist!') {
            alertMessage.style.display = 'block'
            alertMessage.innerHTML = data.message
            setTimeout(() => {
                alertMessage.style.display = 'none'
            }, 3000)
        } else {
            alertSuccess.style.display = 'block'
            setTimeout(() => {
                alertSuccess.style.display = 'none'
            }, 3000)
            window.location.href = '/dashboard'
        }
    })
    .catch((err) => {
        console.log(err)
    })
})