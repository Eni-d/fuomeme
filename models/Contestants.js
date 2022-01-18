const mongoose = require('mongoose')

const contestantSchema = new mongoose.Schema({
    pic: {
        type: String
    },
    username: {
        type: String
    }
})

const Contestant= mongoose.model('Contestant', contestantSchema)

module.exports = Contestant