const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence-generator')(mongoose);

const pdfSchema = new mongoose.Schema({
    pid: {
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
    type: {
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
pdfSchema.plugin(AutoIncrement, {inc_field: 'pid'});

const Pdf = mongoose.model('Pdf', pdfSchema);

module.exports = Pdf;
