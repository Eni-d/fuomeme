let submit = document.getElementById('submit')
let signupForm = document.getElementById('signupForm')
let alertMessage = document.getElementById('alert')
let alertSuccess = document.getElementById('alertSuccess')

submit.addEventListener('click', (e) => {
    e.preventDefault()
    var bodyData = {}
    var errors = ''
    let form = new FormData(signupForm)
    for (let key of form.keys()) {
        bodyData[key] = form.get(key)
        if (form.get(key) == '') {
            errors = 'Please fill all fields!'
        }
    }
    console.log(bodyData)
    if (errors !== '') {
        alertMessage.style.display = 'block'
        alertMessage.innerHTML = errors
        setTimeout(() => {
            alertMessage.style.display = 'none'
        }, 3000)
    } else {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(bodyData)
        })
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)
            if (data.message == 'Username already exists!') {
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
                window.location.href = '/login'
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }
})