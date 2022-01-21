fetch('/comments')
.then((response) => {
    return response.json()
})
.then((data) => {
    let commentsDom = document.querySelectorAll('#comments')
    for (let i = 0; i < commentsDom.length; i++) {
        for (let j = 0; j < data.comments.length; j++) {
            if (data.comments[j].contestant == commentsDom[i].previousElementSibling.innerText) {
                let content = `<div class='d-flex mb-2 dropdown-item'>
                                <div>
                                    <i class='la la-user-circle text-info'></i>
                                    <p class='d-inline mr-1 text-info'>${data.comments[j].user}:</p>
                                </div>
                                <div>
                                    <p class='d-inline'>${data.comments[j].comment}</p>
                                </div>
                            </div>`
                commentsDom[i].innerHTML += content
            }
        }
    }
})
.catch((err) => {
    console.log(err)
})

let alertMessage = document.getElementById('alert')
let alertUpload = document.getElementById('alertUpload')
setTimeout(() => {
    alertMessage.style.display = 'none'
}, 3000)
setTimeout(() => {
    alertUpload.style.display = 'none'
}, 3000)

let postBtn = document.querySelectorAll('#postBtn')
for (let i = 0; i < postBtn.length; i++) {
    postBtn[i].addEventListener('click', (e) => {
        e.preventDefault()
        let user = alertMessage.innerHTML.split(' ')[1]
        let contestant = e.target.parentElement.parentElement.previousElementSibling.previousElementSibling.lastElementChild.innerText
        let bodyData = {
            comment: e.target.previousElementSibling.value,
            user,
            contestant
        }
        e.target.previousElementSibling.value = ''
        fetch('/comment', {
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
            fetch('/comments')
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                let commentsDom = document.querySelectorAll('#comments')
                for (let i = 0; i < commentsDom.length; i++) {
                    commentsDom[i].innerHTML = ''
                }
                for (let i = 0; i < commentsDom.length; i++) {
                    for (let j = 0; j < data.comments.length; j++) {
                        if (data.comments[j].contestant == commentsDom[i].previousElementSibling.innerText) {
                            let content = `<div class='d-flex mb-2 dropdown-item'>
                                <div>
                                    <i class='la la-user-circle text-info'></i>
                                    <p class='d-inline mr-1 text-info'>${data.comments[j].user}:</p>
                                </div>
                                <div>
                                    <p class='d-inline'>${data.comments[j].comment}</p>
                                </div>
                            </div>`
                            commentsDom[i].innerHTML += content
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    })   
}

let viewComments = document.querySelectorAll('#viewComments')
for (let i = 0; i < viewComments.length; i++) {
    viewComments[i].addEventListener('click', (e) => {
        e.preventDefault()
        if (viewComments[i].nextElementSibling.nextElementSibling.style.display == 'none') {
            viewComments[i].nextElementSibling.nextElementSibling.style.display = 'block'
        } else {
            viewComments[i].nextElementSibling.nextElementSibling.style.display = 'none'
        }
    })
}

//Lets the user know which contestant he/she liked
const likesFunction = () => {
    fetch('/likes')
    .then((res) => {
        return res.json()
    })
    .then((data) => {
        console.log(data)
        //Array for contestants with like
        let likesArray = []
        //Array for users that liked
        let likesArray2 = []
        let like = document.querySelectorAll('#like')
        for (let i = 0; i < data.likes.length; i++) {
            likesArray.push(data.likes[i].contestant)
            likesArray2.push(data.likes[i].user)
        }
        for (let i = 0; i < likesArray.length; i++) {
            for (let j = 0; j < like.length; j++) {
                //Check if the contestant is same with that from the database
                if (like[j].parentElement.parentElement.parentElement.previousElementSibling.lastElementChild.innerText == likesArray[i]) {
                    let count = parseInt(like[j].nextElementSibling.innerText)
                    like[j].nextElementSibling.innerText = count+1
                }
                //Check if the contestant and user is same with that from the database
                if (like[j].nextElementSibling.nextElementSibling.innerText == likesArray2[i] && like[j].parentElement.parentElement.parentElement.previousElementSibling.lastElementChild.innerText == likesArray[i]) {
                    like[j].style.color = 'red'
                }
            }
        }
    })
    .catch((err) => {
        console.log(err)
    })
}
likesFunction()

let like = document.querySelectorAll('#like')
for (let i = 0; i < like.length; i++) {
    like[i].addEventListener('click', (e) => {
        let user = alertMessage.innerHTML.split(' ')[1]
        let contestant = e.target.parentElement.parentElement.parentElement.previousElementSibling.lastElementChild.innerText
        let bodyData = {
            user,
            contestant
        }
        fetch('/like', {
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
            let likeAlert = document.getElementById('likeAlert')
            //Warn the user if post is liked already
            if (data.message == 'Like Deleted') {
                likeAlert.style.display = 'block'
                setTimeout(() => {
                    likeAlert.style.display = 'none'
                }, 3000)
                let like = document.querySelectorAll('#like')
                for (let i = 0; i < like.length; i++) {
                    like[i].nextElementSibling.innerText = 0
                    like[i].style.color = ''
                }
                //Call the likesFunction to keep all the user likes persistent
                likesFunction()
            } else {
                let like = document.querySelectorAll('#like')
                for (let i = 0; i < like.length; i++) {
                    like[i].nextElementSibling.innerText = 0
                    
                }
                //Call the likesFunction to keep all the user likes persistent
                likesFunction()
            }
        })
        .catch((err) => {
            console.log(err)
        })
    })
}


//For file upload
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileValidateSize,
    FilePondPluginFileEncode
)

// FilePond.setOptions({
//     stylePanelAspectRatio: 50 / 50,
//     imageResizeTargetWidth: 50,
//     imageResizeTargetHeight: 50
// })

// FilePond.setOptions({
//     maxFileSize: '8MB'
// })


FilePond.parse(document.body);