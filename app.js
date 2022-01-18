const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./Routes/routes')
const path = require('path')
const session = require('express-session')
const app = express()

// mongoose.connect('mongodb://localhost/fuomeme', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

mongoose.connect('mongodb+srv://dbDaniel:dbDaniel@cluster0.rcsbe.mongodb.net/fuomeme?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({
    secret: 'fuoMemeSession',
    resave: false,
    saveUninitialized: false,
}))
app.use('/', router)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

