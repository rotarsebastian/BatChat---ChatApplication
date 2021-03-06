const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    users: {
        type: Array,
        required: true
    },
    messages: {
        type: Array,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;