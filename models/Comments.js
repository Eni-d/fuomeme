const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    contestant: {
        type: String
    },
    user: {
        type: String
    },
    comment: {
        type: String
    }
})

const Comment= mongoose.model('Comment', commentSchema)

module.exports = Comment