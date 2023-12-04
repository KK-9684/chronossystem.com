const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence-generator')(mongoose);

const userSchema = new mongoose.Schema({
    uid: {
        type:Number,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    school: {
        type: String,
    },
    grade: {
        type: String,
    },
    level: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
});
userSchema.plugin(AutoIncrement, {inc_field: 'uid'});

const User = mongoose.model('User', userSchema);

module.exports = User;
