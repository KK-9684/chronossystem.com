const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence-generator')(mongoose);

const videoSchema = new mongoose.Schema({
    vid: {
        type:Number,
        unique: true
    },
    problem: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true,
    },
    vno: {
        type: String,
        required: true,
    },
    vimeoID: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    }
});
videoSchema.plugin(AutoIncrement, {inc_field: 'vid'});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
