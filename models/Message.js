const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title:{
        type: String,
        required: true,
        minLength: 5,
    },
    timeStamp: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        minLength: 5,
    }
})

module.exports = mongoose.model("Message", messageSchema);