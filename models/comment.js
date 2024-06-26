const mongoose = require('mongoose');

const comment_schema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikesCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', comment_schema);
module.exports = Comment;