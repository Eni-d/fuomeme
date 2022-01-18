const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    contestant: {
        type: String
    },
    user: {
        type: String
    }
})

const Like= mongoose.model('Like', likeSchema)

module.exports = Like