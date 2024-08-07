const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
   senderDeleted:{type:Boolean,default:false},
   receiverDeleted:{type:Boolean,default:false},
    content: {
        type: String,
        required: true,
        maxlength: 1000
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('message', messageSchema);
